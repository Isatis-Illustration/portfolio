import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CustomButton, User } from '../../services/models/models';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  router: Router = inject(Router);
  instaram = environment.user.instagram;
  buttons: CustomButton[] = this.buttonService.buttons

  @ViewChild('navMenu') navMenu!: ElementRef;
  isMenuOpen: boolean = false;
  user: User = environment.user

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.navMenu.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleMenu(): void{
    this.isMenuOpen = !this.isMenuOpen
  }

  navigateToHome(): void{
    this.router.navigate(['home']);
  }
}
