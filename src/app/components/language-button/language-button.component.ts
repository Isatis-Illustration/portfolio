import { Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-button',
  imports: [
    CommonModule
  ],
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.css'
})
export class LanguageButtonComponent {

  translateService: TranslationService = inject(TranslationService);

  @Input() showText: boolean = false;
  @Output() onSwitch: EventEmitter<void> = new EventEmitter<void>();

  currentLang: Signal<string> = computed(() => this.translateService.currentLanguage());

  toggleLanguage(): void {
    this.translateService.toggleLanguage();
    this.onSwitch.emit();
  }
}
