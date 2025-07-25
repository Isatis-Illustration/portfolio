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
  private cloudinaryEndpoint: string = `https://cloudinary-backend-iota.vercel.app/api/images`;

  contents: WritableSignal<Content[]> = signal([])
  hasRefresh: boolean = environment.hasRefresh;
  refreshTime: number = environment.refreshTime*1000 //in millisecondi


  constructor(){
    // this.getDriveImages()
    this.getCloudinaryImages()
    console.log("services")
    if(this.hasRefresh)
      interval(this.refreshTime).subscribe(() => {
      // this.getDriveImages()
      this.getCloudinaryImages()
    });
  }

  getCloudinaryImages(): void {
    this.http.get<any>(this.cloudinaryEndpoint).subscribe((res) => {
      let cloudContents: Content[] = [];

      for (let i = 0; i < res.images.length; i++) {
        let cont: Content = {
          id: i + "",
          name: this.getNameByUrl(res.images[i]),
          imageUrl: res.images[i]
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


  getNameByUrl(url: string): string {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];  
    const name = filenameWithExt.split(".")[0];       
    return name;
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
