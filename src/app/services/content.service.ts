import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Content } from './models/models';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { environment } from '../environment/environment';
import { StorageKey, Type } from './models/enums';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  http: HttpClient = inject(HttpClient);
    
  //(id,name,webContentLink,description)  -> indica la forma del json che mi invierà il drive                                                                                                                
  private cloudinaryEndpoint: string = environment.imagesUrl;
  
  contents: WritableSignal<Content[]> = signal([])
  contentToView: WritableSignal<Content | null> = signal(null);
  
  
  filter: WritableSignal<string> = signal('');

  setFilter(f: string): void{
    localStorage.setItem(StorageKey.FILTER, f)
    this.filter.set(f);
  }

  filteredContent: Signal<Content[]> = computed(() => {
    const f = this.filter();
    const all = this.contents();
    if (!f) return all;
    return all.filter(c => c.type === f.charAt(0)).sort((a, b) => a.position - b.position);
  })
  

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
    this.http.get<any>(this.cloudinaryEndpoint).subscribe((res) => {
      let cloudContents: Content[] = [];

      for (let i = 0; i < res.images.length; i++) {

        let img = res.images[i];

        let cont: Content = {
          id: i + "",
          name: this.getNameByUrl(img),
          imageUrl: img,
          type: this.getType(img),
          isGif: this.checkIfGif(img),
          position: this.getPosition(img),
        };
        
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


  private checkIfGif(url: string): boolean{
    const parts: string[] = url.split('.');

    if(!parts.length)
      return false;

    return parts[parts.length-1] === 'gif';
  }


  getPosition(url: string): number {
    const parts: string[] = url.split('.');

    if(!parts.length)
      return 0;

    return Number(parts[parts.length-2]) || 0;
  }

  private getType(url: string): string {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];  
    const type = filenameWithExt.split(".")[1] === Type.CHARACTER ? Type.CHARACTER : Type.ILLUSTRATION;
    return type;
  }


  private getNameByUrl(url: string): string {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];  
    const name = filenameWithExt.split(".")[0];       
    return name;
  }


  private getMaxContentsIndex(): number{
    return this.filteredContent().length - 1;
  }



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
