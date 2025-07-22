import { Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconService: IconService = inject(IconService);
  isMenuOpen: boolean = false;

  buttons = [
      'home',
      'illustration',
      'character',
      'profile',
      'contacts',
  ];

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleMenu(): void{
    this.isMenuOpen = !this.isMenuOpen
  }
}
