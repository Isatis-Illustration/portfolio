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

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {

    const currentUrl = this.router.url
    if(currentUrl === '/contacts')
      return;

    event.preventDefault();

    // Rotazione casuale tra -20° e +20°
    const min = -40;
    const max = 40;
    const rotation = Math.floor(Math.random() * (max - min + 1)) + min;

    const sticker: Sticker = { 
      imageUrl: 'assets/stickers/sticker_flower.png',
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
