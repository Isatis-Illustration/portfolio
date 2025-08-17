import { Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-button',
  imports: [
    TranslatePipe,
    CommonModule
  ],
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.css'
})
export class LanguageButtonComponent {

  translateService: TranslationService = inject(TranslationService);


  @Input() showText: boolean = false;
  @Output() onSwitch: EventEmitter<void> = new EventEmitter<void>();

  basePath: string = 'assets/lang/'
  extens: string = '.png';
  lang: Signal<string> = computed(() => {
    this.translateService.currentLanguage;
    return this.translateService.getOtherLang()
  });

  
  toggleLanguage(): void {
    this.translateService.toggleLanguage();
    this.onSwitch.emit();
  }
}
