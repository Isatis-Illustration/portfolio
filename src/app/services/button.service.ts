import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {
  translateService: TranslationService = inject(TranslationService);
  lang: Signal<string> = computed(() => this.translateService.currentLanguage());
  isNavbarMenuOpen: WritableSignal<boolean> = signal(false);

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
      label: 'PERSONAL_PROJECTS',
      path: 'personal-projects',
      imageUrl: '',
      imageSVG: 'projects'
    },
    {
      id: 2,
      label: 'GALLERY',
      path: 'gallery',
      imageUrl: `assets/home/illustration_${this.lang()}.png`,
      imageSVG: 'illustration'
    },
    {
      id: 3,
      label: 'PROFILE',
      path: 'profile',
      imageUrl: `assets/home/profile_${this.lang()}.png`,
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