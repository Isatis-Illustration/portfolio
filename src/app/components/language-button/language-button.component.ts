import { Component, inject, Signal } from '@angular/core';
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
  lang: Signal<string> = this.translateService.currentLanguage;
  extens: string = '.png';

  
  toggleLanguage(): void {
    this.translateService.toggleLanguage()
  }


}
