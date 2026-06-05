import { Component, computed, inject, Signal } from '@angular/core';
import { Content } from '../../services/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Type } from '../../services/models/enums';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-gallery',
  imports: [
    CommonModule,
    CardComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  contentService: ContentService = inject(ContentService);
  translateService: TranslationService = inject(TranslationService);

  contents: Signal<Content[]> = computed(() => this.contentService.filteredContent());
  filter: string = '';

  /** Immagine titolo che cambia con la lingua */
  titleImage: Signal<string> = computed(() => {
    const lang = this.translateService.currentLanguage();
    const filter = this.contentService.filter();
    if (filter.includes(Type.CHARACTER)) {
      return 'assets/home/character.png';
    }
    return `assets/home/illustration_${lang}.png`;
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const f = params.get('filter')?.toLowerCase()!;
      this.filter = f;
      this.contentService.setFilter(f);
    });
  }

  isCharactersGallery(): boolean {
    return this.filter.includes(Type.CHARACTER);
  }

  getTitle(): string {
    return this.isCharactersGallery() ? 'Character Design' : 'Illustrazioni';
  }

  openImageViewer(content: Content) {
    this.router.navigate([`detail/${content.id}`]);
  }

  trackById(_index: number, item: any) {
    return item.id;
  }
}