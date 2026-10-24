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
import { CollabPouchColors } from '../../services/models/project.models';
import { fanLayout, MAX_FAN_IMAGES } from '../../services/pouch-fan';

export interface ProjectFolder {
  key: string;
  title: string;
  shortText: string;
  colors: CollabPouchColors;
  images: Content[];
  /** Variabili CSS di posizione per ogni foto del ventaglio (vedi pouch-fan.ts) */
  fan: Record<string, string>[];
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

  /** Card illustrate in fondo alla Home: le voci del menu che hanno un disegno (Galleria, Profilo, Contatti) */
  exploreButtons: Signal<CustomButton[]> = computed(() =>
    this.buttonService.buttons().filter(b => !!b.imageUrl)
  );

  /** Cartella attiva per interazione touch/mobile */
  toggledFolder = signal<string | null>(null);

  /** Feedback visivo per clic su cartella in sospeso */
  toastMessage = signal<string | null>(null);

  subTitle: Signal<string> = computed(() => {
    this.translateService.currentLanguage();
    const fileName = this.translateService.translate('SUBTITLE');
    return `assets/home/${fileName}.gif`;
  });

  /** true finché GET /portfolio non ha risposto: mostra il loader al posto delle bustine */
  isLoading: Signal<boolean> = computed(() => !this.contentService.loaded());

  /** Bustine delle collaborazioni dal BE (GET /portfolio) */
  projects: Signal<ProjectFolder[]> = computed(() => {
    const collaborations = this.contentService.collaborations()
      .filter(p => this.contentService.isPublishable(p))
      .sort((a, b) => a.order - b.order);

    return collaborations.map(p => {
      const images = [...p.previewImages]
        .sort((a, b) => a.order - b.order)
        .slice(0, MAX_FAN_IMAGES)
        .map((img, i): Content => ({
          id: i,
          title: this.contentService.resolveText(img.caption),
          imageUrl: img.url,
          type: p.id,
          isGif: /\.gif$/i.test(img.url),
          position: img.order,
          prev: img.order,
          hasBg: img.hasBg,
        }));

      return {
        key: p.id,
        title: this.contentService.resolveText(p.title),
        shortText: this.contentService.resolveText(p.shortText),
        colors: p.colors,
        images,
        fan: fanLayout(images.length),
      };
    });
  });

  gridClass: Signal<string> = computed(() => {
    const count = this.projects().length;
    if (count === 1) {
      return 'flex justify-center items-start pt-8 pb-6';
    }
    if (count === 2) {
      return 'flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16 lg:gap-20 pt-8 pb-6';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start justify-items-center pt-8 pb-6';
  });

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