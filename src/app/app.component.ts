import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    NavbarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';

  router: Router = inject(Router);

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
}
