import { Component, computed, effect, inject, Signal, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';
import { environment } from '../../environment/environment';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  route: Router = inject(Router);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  contentService: ContentService = inject(ContentService);

  /** Switch: true = GIF animate, false = testo Fredoka */
  useGifName: boolean = true;

  nameGif: string = environment.icons.nameGif;
  lNameGif: string = environment.icons.lNameGif;

  buttons: CustomButton[] = [];

  /** Cartella attiva per interazione touch/mobile */
  toggledFolder = signal<string | null>(null);

  /** Feedback visivo per clic su cartella in sospeso */
  toastMessage = signal<string | null>(null);

  subTitle: Signal<string> = computed(() => {
    this.translateService.currentLanguage();
    const fileName = this.translateService.translate('SUBTITLE');
    return `assets/home/${fileName}.gif`;
  });

  /** Fallback per Slap-It durante caricamento API */
  private fallbackSlapIt: Content[] = [
    { id: 101, title: 'Slap-It Preview 1', imageUrl: 'assets/home/illustration_it.png', type: 'illustration', isGif: false, position: 1 },
    { id: 102, title: 'Slap-It Preview 2', imageUrl: 'assets/home/character.png', type: 'character', isGif: false, position: 2 },
    { id: 103, title: 'Slap-It Preview 3', imageUrl: 'assets/home/profile_it.png', type: 'illustration', isGif: false, position: 3 },
    { id: 104, title: 'Slap-It Preview 4', imageUrl: 'assets/home/contacts_it.png', type: 'illustration', isGif: false, position: 4 },
  ];

  /** Fallback per Navarra Editore durante caricamento API */
  private fallbackNavarra: Content[] = [
    { id: 201, title: 'Navarra Preview 1', imageUrl: 'assets/home/illustration_en.png', type: 'illustration', isGif: false, position: 1 },
    { id: 202, title: 'Navarra Preview 2', imageUrl: 'assets/home/contacts_en.png', type: 'illustration', isGif: false, position: 2 },
    { id: 203, title: 'Navarra Preview 3', imageUrl: 'assets/home/profile_en.png', type: 'illustration', isGif: false, position: 3 },
    { id: 204, title: 'Navarra Preview 4', imageUrl: 'assets/home/character.png', type: 'character', isGif: false, position: 4 },
  ];

  /** Immagini per Slap-It (prime 4 immagini dall'API) */
  slapItImages: Signal<Content[]> = computed(() => {
    const all = this.contentService.contents();
    if (all && all.length > 0) {
      return all.slice(0, 4);
    }
    return this.fallbackSlapIt;
  });

  /** Immagini per Navarra Editore (successive 4 immagini dall'API) */
  navarraImages: Signal<Content[]> = computed(() => {
    const all = this.contentService.contents();
    if (all && all.length > 4) {
      return all.slice(4, 8);
    } else if (all && all.length > 0) {
      return all.slice(0, 4);
    }
    return this.fallbackNavarra;
  });

  /** Progetti per layout blob */
  projects = computed(() => [
    {
      key: 'slap-it',
      title: 'Slap-It',
      theme: 'theme-lavender',
      badgeKey: 'FOLDER_SLAP_IT_BADGE',
      descKey: 'FOLDER_SLAP_IT_DESC',
      images: this.slapItImages(),
    },
    {
      key: 'navarra',
      title: 'Navarra Editore',
      theme: 'theme-mint',
      badgeKey: 'FOLDER_NAVARRA_BADGE',
      descKey: 'FOLDER_NAVARRA_DESC',
      images: this.navarraImages(),
    },
  ]);

  constructor() {
    effect(() => {
      this.buttons = this.buttonService.buttons().filter(b => b.id !== 0);
    });
  }

  navigate(path: string): void {
    this.route.navigate([path]);
  }

  toggleFolder(folderName: string): void {
    if (this.toggledFolder() === folderName) {
      this.toggledFolder.set(null);
    } else {
      this.toggledFolder.set(folderName);
    }
  }

  onFolderClick(folderName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const title = folderName === 'slap-it' ? 'Slap-It' : 'Navarra Editore';
    this.toastMessage.set(title);
    setTimeout(() => {
      if (this.toastMessage() === title) {
        this.toastMessage.set(null);
      }
    }, 2800);
  }

  trackById(_index: number, item: any) {
    return item.id;
  }
}