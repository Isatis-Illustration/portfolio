import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentService } from './services/content.service';
import { IconService } from './services/icon.service';
import { Sticker } from './services/models/models';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'portfolio';

  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);

  stickers: Sticker[] = [];
  readonly stickerImages: string[] = [
    'assets/stickers/topo_cappuccino.png',
    'assets/stickers/topo_cornetto.png',
    'assets/stickers/topo_pizza.png',
  ];
  private currentStickerIndex = 0;

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {

    const currentUrl = this.router.url
    if(currentUrl === '/contacts')
      return;

    event.preventDefault();

    // Rotazione casuale tra -40° e +40°
    const min = -40;
    const max = 40;
    const rotation = Math.floor(Math.random() * (max - min + 1)) + min;

    const imageUrl = this.stickerImages[this.currentStickerIndex];
    this.currentStickerIndex = (this.currentStickerIndex + 1) % this.stickerImages.length;

    const sticker: Sticker = { 
      imageUrl,
      x: event.clientX, 
      y: event.clientY,
      fade: false, 
      rotation 
    };
    this.stickers.push(sticker);

    setTimeout(() => sticker.fade = true, 1000);
    setTimeout(() => {
      this.stickers = this.stickers.filter(s => s !== sticker);
    }, 1500);
  }
}
