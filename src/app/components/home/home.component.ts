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
import { Type } from '../../services/models/enums';

export interface ProjectFolder {
  key: string;
  type: Type | string;
  title: string;
  theme: string;
  badgeKey: string;
  descKey: string;
  images: Content[];
}

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
    { id: 101, title: 'Slap-It Preview 1', imageUrl: 'assets/home/illustration_it.png', type: Type.SLAP_IT, isGif: false, position: 1, prev: 1, hasBg: true },
    { id: 102, title: 'Slap-It Preview 2', imageUrl: 'assets/home/character.png', type: Type.SLAP_IT, isGif: false, position: 2, prev: 2, hasBg: false },
    { id: 103, title: 'Slap-It Preview 3', imageUrl: 'assets/home/profile_it.png', type: Type.SLAP_IT, isGif: false, position: 3, prev: 3, hasBg: true },
    { id: 104, title: 'Slap-It Preview 4', imageUrl: 'assets/home/contacts_it.png', type: Type.SLAP_IT, isGif: false, position: 4, prev: 4, hasBg: false },
  ];

  /** Fallback per Navarra Editore durante caricamento API */
  private fallbackNavarra: Content[] = [
    { id: 201, title: 'Navarra Preview 1', imageUrl: 'assets/home/illustration_en.png', type: Type.NAVARRA, isGif: false, position: 1, prev: 1, hasBg: true },
    { id: 202, title: 'Navarra Preview 2', imageUrl: 'assets/home/contacts_en.png', type: Type.NAVARRA, isGif: false, position: 2, prev: 2, hasBg: false },
    { id: 203, title: 'Navarra Preview 3', imageUrl: 'assets/home/profile_en.png', type: Type.NAVARRA, isGif: false, position: 3, prev: 3, hasBg: true },
    { id: 204, title: 'Navarra Preview 4', imageUrl: 'assets/home/character.png', type: Type.NAVARRA, isGif: false, position: 4, prev: 4, hasBg: true },
  ];

  /** Immagini per Slap-It dal BE (filtrate per prev e ordinate) */
  slapItImages: Signal<Content[]> = computed(() => {
    const previewItems = this.contentService.getPouchPreviewsByType(Type.SLAP_IT);
    if (previewItems.length > 0) {
      return previewItems.slice(0, 4);
    }
    return this.fallbackSlapIt;
  });

  /** Immagini per Navarra Editore dal BE (filtrate per prev e ordinate) */
  navarraImages: Signal<Content[]> = computed(() => {
    const previewItems = this.contentService.getPouchPreviewsByType(Type.NAVARRA);
    if (previewItems.length > 0) {
      return previewItems.slice(0, 4);
    }
    return this.fallbackNavarra;
  });

  /** Progetti per layout blob */
  projects: Signal<ProjectFolder[]> = computed(() => [
    {
      key: 'slap-it',
      type: Type.SLAP_IT,
      title: 'Slap-It',
      theme: 'theme-lavender',
      badgeKey: 'FOLDER_SLAP_IT_BADGE',
      descKey: 'FOLDER_SLAP_IT_DESC',
      images: this.slapItImages(),
    },
    {
      key: 'navarra',
      type: Type.NAVARRA,
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

  handleBlobClick(folderKey: string): void {
    const isDesktopHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
    if (isDesktopHover || this.toggledFolder() === folderKey) {
      this.navigate(`project/${folderKey}`);
    } else {
      this.toggleFolder(folderKey);
    }
  }

  onFolderClick(folderKey: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.navigate(`project/${folderKey}`);
  }

  trackById(_index: number, item: any) {
    return item.id;
  }
}