import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';
import { IconService } from '../../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environment/environment';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageButtonComponent } from "../language-button/language-button.component";
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslatePipe,
    LanguageButtonComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

  route: Router = inject(Router);
  buttonService: ButtonService = inject(ButtonService);
  iconService: IconService = inject(IconService);
  translateService: TranslationService = inject(TranslationService);

  nameGif: string = environment.icons.nameGif;
  lNameGif: string = environment.icons.lNameGif;
  buttons: CustomButton[] = [];
  first2Buttons: CustomButton[] = [];
  last2Buttons: CustomButton[] = [];
  subTitle: Signal<string> = computed(() => {
    this.translateService.currentLanguage();
    const fileName = this.translateService.translate('SUBTITLE');
    const res = `assets/home/${fileName}.gif`;
    return res;
  });

  constructor(){
    effect(() => {
      this.buttons = this.buttonService.buttons().filter(b => b.id !== 0);
      
      // Scomponi subito l’array in due:
      this.first2Buttons = this.buttons.slice(0, 2);
      this.last2Buttons  = this.buttons.slice(2, 4);

      // Poi resettali TUTTI
      [...this.first2Buttons, ...this.last2Buttons]
        .forEach(b => b.imageLoaded = false);
    })
  }

  navigate(path: string): void{
    this.route.navigate([path]);
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  areImagesLoaded(): boolean{
    return this.buttons.slice(0, 4).every(b => b.imageLoaded);
  }

}