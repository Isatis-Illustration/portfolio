import { Component, effect, inject, viewChild, ElementRef, HostListener, Signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ViewerComponent } from "../viewer/viewer.component";

@Component({
  selector: 'app-card-detail',
  imports: [
    CommonModule,
    TranslatePipe,
    ViewerComponent
  ],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);

  imageElement = viewChild<ElementRef<HTMLImageElement>>('imageElement');

  contentToView: Signal<Content | null> = computed(() => this.contentService.contentToView());

  content!: Content;
  showInfo: boolean = false;
  hasLoaded: boolean = false;

  constructor() {
    effect(() => {
      const filterStorage = localStorage.getItem(StorageKey.FILTER);

      if (filterStorage)
        this.contentService.filter.set(filterStorage);
      
      const list = this.contentService.contents();

      this.route.paramMap.subscribe(params => {
        let id: number = Number(params.get('id')!);

        if(Number.isNaN(id))
          id = Number(localStorage.getItem(StorageKey.DETAIL_ID)) || 0!

        localStorage.setItem(StorageKey.DETAIL_ID, JSON.stringify(id))
        this.content = list.find(c => c.id === id)!;
      });
    });
  }

  showViewer(): void {
    this.contentService.setContentToView(this.content);
  }

  loaded(): void {
    this.hasLoaded = true;
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  goToNext(): void {
    const nextContent: Content = this.contentService.getNextContent(this.content);
    this.hasLoaded = false;
    this.showInfo = false;
    this.router.navigate([`detail/${nextContent.id}`]);
  }

  goToPrevious(): void {
    const prevContent: Content = this.contentService.getPrevContent(this.content);
    this.hasLoaded = false;
    this.showInfo = false;
    this.router.navigate([`detail/${prevContent.id}`]);
  }

  goBack(): void {
    this.router.navigate([`gallery/${this.contentService.filter()}`]);
  }
}