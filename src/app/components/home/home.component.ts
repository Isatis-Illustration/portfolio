import { Component, computed, effect, inject, Signal } from '@angular/core';
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
}