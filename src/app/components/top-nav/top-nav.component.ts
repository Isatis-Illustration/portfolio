import { Component, computed, HostListener, inject, signal, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { TranslationService } from '../../services/translation.service';
import { UserService } from '../../services/user.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageButtonComponent } from '../language-button/language-button.component';
import { CustomButton, User } from '../../services/models/models';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageButtonComponent,
  ],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {

  router: Router = inject(Router);
  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  userService: UserService = inject(UserService);

  user: Signal<User> = computed(() => this.userService.user());
  buttons: CustomButton[] = this.buttonService.buttons();
  logo: string = environment.icons.logo;
  instagram = environment.user.instagram;

  isScrolled: WritableSignal<boolean> = signal(false);
  isMobileMenuOpen: WritableSignal<boolean> = signal(false);
  hasBeenOpened: boolean = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 60);
  }

  toggleMobileMenu(): void {
    this.hasBeenOpened = true;
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  translate(): void {
    this.translateService.toggleLanguage();
  }

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }

  trackById(_index: number, item: any): number {
    return item.id;
  }
}
