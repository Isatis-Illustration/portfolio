import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifSyncService {
  
  private gifElements: HTMLImageElement[] = [];
  private totalGifs = 0;
  private loadedGifs = 0;

  registerGif(img: HTMLImageElement) {
    this.totalGifs++;
    this.gifElements.push(img);

    img.addEventListener('load', () => {
      this.loadedGifs++;
      if (this.loadedGifs === this.totalGifs) {
        this.startAllGifs();
      }
    });
  }

  private startAllGifs() {
    this.gifElements.forEach(img => {
      const src = img.src;
      img.src = ''; // reset
      setTimeout(() => img.src = src, 0);
    });
  }

  reset() {
    this.gifElements = [];
    this.totalGifs = 0;
    this.loadedGifs = 0;
  }
}
