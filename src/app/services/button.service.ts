import { computed, inject, Injectable, Signal } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {
  translateService: TranslationService = inject(TranslationService);
  lang: Signal<string> = computed(() => this.translateService.currentLanguage());

  buttons = computed(() => [
    {
      id: 0,
      label: 'HOME',
      path: 'home',
      imageUrl: '',
      imageSVG: 'home'
    },
    {
      id: 1,
      label: 'ILLUSTRATIONS',
      path: 'gallery/illustrations',
      imageUrl: `assets/home/illustration_${this.lang()}.png`,
      imageSVG: 'illustration'
    },
    {
      id: 2,
      label: 'CHARACTER',
      path: 'gallery/character-design', 
      imageUrl: 'assets/home/character.png',
      imageSVG: 'character'
    },
    {
      id: 3,
      label: 'PROFILE',
      path: 'profile',
      imageUrl: 'assets/home/profile.png',
      imageSVG: 'profile',
    },
    {
      id: 4,
      label: 'CONTACTS',
      path: 'contacts',
      imageUrl: `assets/home/contacts_${this.lang()}.png`,
      imageSVG: 'contacts'
    }
  ]);
}