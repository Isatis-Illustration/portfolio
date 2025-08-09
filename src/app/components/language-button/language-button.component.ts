import { Component, computed, inject, Signal } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-button',
  imports: [],
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.css'
})
export class LanguageButtonComponent {

  translateService: TranslationService = inject(TranslationService);


  basePath: string = 'assets/lang/'
  extens: string = '.png';
  lang: Signal<string> = computed(() => {
    this.translateService.currentLanguage;
    return this.translateService.getOtherLang()
  });

  
  toggleLanguage(): void {
    this.translateService.toggleLanguage();
  }
}
