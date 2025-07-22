import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Content } from './models/models';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  http: HttpClient = inject(HttpClient);
    
  //(id,name,webContentLink,description)  -> indica la forma del json che mi invierà il drive                                                                                                                
  private DB_URL: string = `https://www.googleapis.com/drive/v3/files?q=%27${environment.folderId}%27+in+parents&key=${environment.apiKey}&fields=files(id,name,webContentLink,description)`;
  private cloudinaryUrl: string = `CLOUDINARY_URL=cloudinary://${environment.cApiKey}:${environment.cApiSecret}@djyhltusj`;

  contents: WritableSignal<Content[]> = signal([])
  hasRefresh: boolean = environment.hasRefresh;
  refreshTime: number = environment.refreshTime*1000 //in millisecondi


  constructor(){
    // this.populateSite(20);
    this.getDriveImages()
    if(this.hasRefresh)
      interval(this.refreshTime).subscribe(() => this.getDriveImages());
  }



  getDriveImages(): void {
    this.http.get<any>(this.DB_URL).subscribe((googleFiles) => 
      {
        let files: Content[] = googleFiles.files as Content[];
        // files.forEach(file => file.webContentLink = file.webContentLink.split('&')[0])
        files.forEach(file => {
          // file.imageUrl = this.googleUrl+file.id;
          file.imageUrl = 'https://res.cloudinary.com/djyhltusj/image/upload/v1753126632/IMG_2001_f6biyc.png'
          file.name = file.name.split('.')[0];
        })

        const currentIds = this.contents().map(f => f.id).sort();
        const newIds = files.map(f => f.id).sort();

        const isSame = currentIds.length === newIds.length &&
                      currentIds.every((id, i) => id === newIds[i]);

        if (!isSame){
          this.contents.set(files);
        }
      });
  }

}
