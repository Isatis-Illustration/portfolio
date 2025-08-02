import { Component, computed, inject, Signal } from '@angular/core';
import { CustomButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageButtonComponent } from "../language-button/language-button.component";

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    LanguageButtonComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  router: Router = inject(Router);

  instagram = environment.user.contacts.instagram;
  hasLoaded = false;

  // interval: number = 5*1000;
  // logoIndex: number = 0;


  
  user: User = environment.user;
  year: number = new Date().getFullYear()

  buttons: CustomButton[] = this.buttonService.buttons();
  logo: string = environment.icons.logo;


  // ngOnInit(): void {
    // interval(this.interval).subscribe(() => {
    //   this.logoIndex++
    //   this.logoIndex = this.logoIndex > 3 ? 0 : this.logoIndex
    //   this.logo = `assets/logo/logo${this.logoIndex}.png`;
    // })
  // }
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
