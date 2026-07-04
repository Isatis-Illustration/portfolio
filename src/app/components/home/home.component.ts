import { Component, computed, effect, inject, Signal, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';
import { environment } from '../../environment/environment';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageButtonComponent } from '../language-button/language-button.component';
import { TranslationService } from '../../services/translation.service';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslatePipe,
    CardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  route: Router = inject(Router);
  buttonService: ButtonService = inject(ButtonService);
  translateService: TranslationService = inject(TranslationService);
  contentService: ContentService = inject(ContentService);

  windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
    }
  }

  columnsCount: Signal<number> = computed(() => {
    const width = this.windowWidth();
    if (width >= 768) return 3;
    return 1;
  });

  /** Switch: true = GIF animate, false = testo Fredoka */
  useGifName: boolean = true;

  nameGif: string = environment.icons.nameGif;
  lNameGif: string = environment.icons.lNameGif;

  buttons: CustomButton[] = [];

  subTitle: Signal<string> = computed(() => {
    this.translateService.currentLanguage();
    const fileName = this.translateService.translate('SUBTITLE');
    return `assets/home/${fileName}.gif`;
  });

  /** Preview illustrazioni per homepage */
  previewIllustrations: Signal<Content[]> = computed(() => {
    const all = this.contentService.contents();
    return all.filter(c => c.type === 'illustration').slice(0, 6);
  });

  columns: Signal<Content[][]> = computed(() => {
    const count = this.columnsCount();
    const list = this.previewIllustrations();
    const result: Content[][] = Array.from({ length: count }, () => []);
    list.forEach((item, index) => {
      result[index % count].push(item);
    });
    return result;
  });

  constructor() {
    effect(() => {
      this.buttons = this.buttonService.buttons().filter(b => b.id !== 0);
    });
  }

  navigate(path: string): void {
    this.route.navigate([path]);
  }

  openDetail(content: Content): void {
    this.contentService.setFilter('illustrations');
    this.route.navigate([`detail/${content.id}`]);
  }

  trackById(_index: number, item: any) {
    return item.id;
  }
}