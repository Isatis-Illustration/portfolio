import { Component, computed, HostListener, inject, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ContentService } from './services/content.service';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from './services/icon.service';
import { ViewerComponent } from "./components/viewer/viewer.component";
import { Content } from './services/models/models';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    NavbarComponent,
    ViewerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  title = 'portfolio';

  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);

  contentToView: Signal<Content | null> = computed(() => this.contentService.contentToView());

  currentUrl: string = '';
  screenWidth: number = window.screen.width;
  isScreenSm: boolean = window.screen.width <= 640;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const target = event.target as Window;
    this.screenWidth = target.innerWidth;
    this.isScreenSmall();
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
