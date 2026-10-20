import { Component, computed, inject, Signal, signal, HostListener } from '@angular/core';
import { Content } from '../../services/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Type } from '../../services/models/enums';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TranslatePipe
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

  columns: Signal<Content[][]> = computed(() => {
    const count = this.columnsCount();
    const list = this.contents();
    const result: Content[][] = Array.from({ length: count }, () => []);
    list.forEach((item, index) => {
      result[index % count].push(item);
    });
    return result;
  });

  constructor() {
    this.contentService.setFilter('all');
  }

  isCharacterItem(c: Content): boolean {
    return c.type === Type.CHARACTER;
  }

  openImageViewer(content: Content) {
    this.router.navigate([`detail/${content.id}`]);
  }

  trackById(_index: number, item: any) {
    return item.id;
  }
}