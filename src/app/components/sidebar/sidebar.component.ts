import { Component, computed, inject, Signal } from '@angular/core';
import { CustomButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageButtonComponent } from "../language-button/language-button.component";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    LanguageButtonComponent,
    RouterLinkActive
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  userService: UserService = inject(UserService);
  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  router: Router = inject(Router);

  user: Signal<User> = computed(() => this.userService.user());
  
  hasLoaded: boolean = false;
  year: number = 2025;

  buttons: CustomButton[] = this.buttonService.buttons();
  logo: string = environment.icons.logo;

  
  redirectToHome(): void{
    this.router.navigate(['home'])
  }


  trackById(item: any): number {
    return item.id;
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

}
