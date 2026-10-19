import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ClaudinaryImage, Content } from './models/models';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { environment } from '../environment/environment';
import { StorageKey, Type, normalizeContentType } from './models/enums';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  http: HttpClient = inject(HttpClient);
  userService: UserService = inject(UserService);
    
                                                                                                              
  private cloudinaryEndpoint: string = environment.baseUrl+environment.imagesUrl;
  
  contents: WritableSignal<Content[]> = signal([])
  contentToView: WritableSignal<Content | null> = signal(null);
  
  filter: WritableSignal<string> = signal('');

  setFilter(f: string): void{
    localStorage.setItem(StorageKey.FILTER, f)
    this.filter.set(f);
  }

  filteredContent: Signal<Content[]> = computed(() => {
    const f = this.filter()?.toLowerCase().trim();
    const all = this.contents();
    if (!f || f === 'all') return all;
    const targetType = normalizeContentType(f);
    return all
      .filter(c => c.type === targetType || f.includes(c.type))
      .sort((a, b) => a.position - b.position);
  });

  /**
   * Recupera contenuti filtrati per tipologia specifica, ordinati per posizione.
   */
  getContentsByType(type: Type | string): Content[] {
    const targetType = normalizeContentType(type);
    return this.contents()
      .filter(c => c.type === targetType)
      .sort((a, b) => a.position - b.position);
  }

  /**
   * Recupera contenuti preview per il sacchetto:
   * devono avere context.prev definito, ordinati per prev crescente.
   */
  getPouchPreviewsByType(type: Type | string): Content[] {
    const targetType = normalizeContentType(type);
    return this.contents()
      .filter(c => c.type === targetType && c.prev !== undefined && c.prev !== null)
      .sort((a, b) => (a.prev ?? 0) - (b.prev ?? 0));
  }
  

  private hasRefresh: boolean = environment.hasRefresh;
  private refreshTime: number = environment.refreshTime*1000 //in millisecondi


  constructor(){
    // this.getDriveImages()
    this.getCloudinaryImages()
    if(this.hasRefresh)
      interval(this.refreshTime).subscribe(() => {
      // this.getDriveImages()
      this.getCloudinaryImages()
    });
  }


  setContentToView(content: Content): void{
    this.contentToView.set(content);
  }


  clearContentToView(): void{
    this.contentToView.set(null);
  }


  getNextContent(actualCont: Content): Content{
    let nextIndex = this.filteredContent().indexOf(actualCont)+1;
    nextIndex = nextIndex > this.getMaxContentsIndex() ? 0 : nextIndex;

    let nextContent: Content = this.filteredContent().at(nextIndex)!;
    nextContent = nextContent ? nextContent : this.contentToView()!;

    return nextContent;
  }


  getPrevContent(actualCont: Content): Content{
    let prevIndex: number = this.filteredContent().indexOf(actualCont)-1;
    prevIndex = prevIndex < 0 ? this.getMaxContentsIndex() : prevIndex;

    let prevContent: Content = this.filteredContent().at(prevIndex)!;
    prevContent = prevContent ? prevContent : this.contentToView()!;

    return prevContent;
  }


  getCloudinaryImages(): void {
    
    this.http.get<{images: any}>(this.cloudinaryEndpoint).subscribe((res) => {
      
      let cloudContents: Content[] = [];

      filler: for (let i = 0; i < res.images.length; i++) {
        
        //get user
        if(this.isUserImage(res.images[i])){
          this.userService.setUserByClaudinary(res.images[i]);
          continue filler;
        }

        let img: ClaudinaryImage = res.images[i];
        let cont: Content = this.createContent(img, i);
        
        cloudContents.push(cont);
      }


      const currentIds = this.contents().map(f => f.id).sort();
      const newIds = cloudContents.map(f => f.id).sort();

      const isSame = currentIds.length === newIds.length &&
                    currentIds.every((id, i) => id === newIds[i]);

      if (!isSame) {
        this.contents.set(cloudContents);
      }
    });
  }


  private createContent(img: any, id: number): Content{
    const resolvedType = this.resolveType(img.context?.type, img.url);

    // Parsing context.prev (ordine all'interno del sacchetto)
    let prevNumber: number | undefined = undefined;
    if (img.context?.prev !== undefined && img.context?.prev !== null && img.context?.prev !== '') {
      const parsed = Number(img.context.prev);
      if (!isNaN(parsed)) {
        prevNumber = parsed;
      }
    }

    // Parsing context.bg (1 = con card, 0 = no card / solo img)
    // Default a true (con card) se non specificato
    let hasBg = true;
    if (img.context?.bg !== undefined && img.context?.bg !== null && img.context?.bg !== '') {
      const rawBg = String(img.context.bg).trim().toLowerCase();
      hasBg = rawBg === '1' || rawBg === 'true';
    }

    let cont: Content = {
      id: id,
      imageUrl: img.url,
      title: img.context?.caption || this.getTitleByUrl(img.url),
      description: img.context?.alt || '',
      type: resolvedType,
      position: Number(img.context?.position) || this.getPosition(img.url),
      isGif: this.checkIfGif(img.url),
      prev: prevNumber,
      hasBg: hasBg,
    };

    return cont;
  }

  private resolveType(contextType?: string, url?: string): string {
    if (contextType) {
      return normalizeContentType(contextType);
    }
    if (url) {
      const typeFromUrl = this.getTypeFromUrl(url);
      if (typeFromUrl) {
        return normalizeContentType(typeFromUrl);
      }
    }
    return Type.ILLUSTRATION;
  }

  private getTypeFromUrl(url: string): string {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];  
    const segments = filenameWithExt.split(".");
    if (segments.length > 2) {
      return segments[1];
    }
    return '';
  }

  private checkIfGif(url: string): boolean {
    const parts: string[] = url.split('.');
    if (!parts.length) return false;
    return parts[parts.length - 1] === 'gif';
  }

  isUserImage(img: any): boolean {
    return img.context?.caption && img.context.caption === 'user';
  }

  getPosition(url: string): number {
    const parts: string[] = url.split('.');
    if (!parts.length) return 0;
    return Number(parts[parts.length - 2]) || 0;
  }


  private getTitleByUrl(url: string): string {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];  
    const name = filenameWithExt.split(".")[0];       
    return name;
  }


  private getMaxContentsIndex(): number{
    return this.filteredContent().length - 1;
  }

  //(id,name,webContentLink,description)  -> indica la forma del json che mi invierà il drive  

  // getDriveImages(): void {
  //   this.http.get<any>(this.DB_URL).subscribe((googleFiles) => 
  //     {
  //       let files: Content[] = googleFiles.files as Content[];
  //       // files.forEach(file => file.webContentLink = file.webContentLink.split('&')[0])
  //       files.forEach(file => {
  //         // file.imageUrl = this.googleUrl+file.id;
  //         file.imageUrl = file.imageUrl
  //         file.name = file.name.split('.')[0];
  //       })

  //       const currentIds = this.contents().map(f => f.id).sort();
  //       const newIds = files.map(f => f.id).sort();

  //       const isSame = currentIds.length === newIds.length &&
  //                     currentIds.every((id, i) => id === newIds[i]);

  //       if (!isSame){
  //         this.contents.set(files);
  //       }
  //     });
  // }

}
