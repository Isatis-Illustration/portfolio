import { Component, computed, ElementRef, HostListener, inject, Signal, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CustomButton, User } from '../../services/models/models';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environment/environment';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  router: Router = inject(Router);

  @ViewChild('navMenu') navMenu!: ElementRef;

  instaram = environment.user.contacts.instagram;
  buttons: CustomButton[] = this.buttonService.buttons();
  logo: string = environment.icons.logo;
  isMenuOpen: Signal<boolean> = computed(() => this.buttonService.isNavbarMenuOpen());
  user: User = environment.user

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.navMenu || !this.navMenu.nativeElement) {
      return;
    }
    if (!this.navMenu.nativeElement.contains(event.target)) {
      this.buttonService.isNavbarMenuOpen.set(false);
    }
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleMenu(): void{
    this.buttonService.isNavbarMenuOpen.set(!this.isMenuOpen())
  }

  navigateToHome(): void{
    this.router.navigate(['home']);
  }


  translate(): void{
    this.translateService.toggleLanguage();
  }
}
