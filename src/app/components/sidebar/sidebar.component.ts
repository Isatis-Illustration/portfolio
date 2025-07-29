import { Component, computed, inject, Signal } from '@angular/core';
import { CustomButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);

  instagram = environment.user.contacts.instagram;

  // interval: number = 5*1000;
  // logoIndex: number = 0;

  basePath: string = 'assets/lang/'
  lang: Signal<string> = this.translateService.getCurrentLanguage();
  extens: string = '.png';
  
  user: User = environment.user;
  year: number = new Date().getFullYear()

  buttons: CustomButton[] = this.buttonService.buttons;


  // ngOnInit(): void {
    // interval(this.interval).subscribe(() => {
    //   this.logoIndex++
    //   this.logoIndex = this.logoIndex > 3 ? 0 : this.logoIndex
    //   this.logo = `assets/logo/logo${this.logoIndex}.png`;
    // })
  // }


  trackById(item: any): number {
    return item.id;
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleLanguage(): void {
    console.log(`${this.basePath}${this.lang()}${this.extens}`)
    this.translateService.toggleLanguage()
  }

}
