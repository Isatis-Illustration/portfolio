import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ContentService } from './services/content.service';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from './services/icon.service';
import { Sticker } from './services/models/models';
import { ButtonService } from './services/button.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    NavbarComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  title = 'portfolio';

  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  stickers: Sticker[] = [];

  currentUrl: string = '';
  screenWidth: number = window.screen.width;
  isScreenSm: boolean = window.screen.width <= 640;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const target = event.target as Window;
    this.screenWidth = target.innerWidth;
    this.isScreenSmall();

    if(!this.isScreenSm)
      this.buttonService.isNavbarMenuOpen.set(false)
  }

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


  isHome(): boolean{
    this.currentUrl = this.router.url;
    return this.currentUrl === '/home';
  }

  isScreenSmall(): void{
    this.isScreenSm = this.screenWidth <= 640;
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
