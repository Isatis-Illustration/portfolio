import { Component, ElementRef, AfterViewInit, ViewChild, inject, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { PanzoomObject } from '@panzoom/panzoom';
import panzoom from '@panzoom/panzoom';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements AfterViewInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);

  content!: Content;
  showInfo: boolean = false;

  // Panzoom instance
  private zoomInitialized: boolean = false;
  private zoomInstance!: PanzoomObject;

  @ViewChild('imgEl', { static: false }) imgRef!: ElementRef;
  @ViewChild('container', { static: false }) container!: ElementRef;

  constructor() {
    // Recupera filtro da storage e carica contenuti
    effect(() => {
      const filterStorage = localStorage.getItem(StorageKey.FILTER);
      if (filterStorage)
        this.contentService.filter.set(filterStorage);
      
      const list = this.contentService.contents();

      this.route.paramMap.subscribe(params => {
        let id: string = params.get('id')!;

        if(!id)
          id = localStorage.getItem(StorageKey.DETAIL_ID) || '0'!

        console.log(id)
        localStorage.setItem(StorageKey.DETAIL_ID, id)
        this.content = list.find(c => c.id === id)!;
        console.log(this.content)
      });
    });
  }

  ngAfterViewInit(): void {
    if (!this.zoomInitialized && this.imgRef?.nativeElement && this.container?.nativeElement) {
      this.zoomInstance = panzoom(this.imgRef.nativeElement, {
        maxScale: 5,
        minScale: 0.5,
        contain: 'outside'
      });

      // Abilita zoom con la rotella
      this.container.nativeElement.addEventListener(
        'wheel',
        this.zoomInstance.zoomWithWheel,
        { passive: false }
      );
      console.log(this.zoomInstance);
      this.zoomInitialized = true;
    }
  }


  // Navigazione conteniuti
  goToNext(): void {
    this.resetZoom();
    let idx = this.contentService.getFilteredContent().indexOf(this.content) + 1;
    idx = idx > this.getMaxContentsIndex() ? 0 : idx;
    const next = this.contentService.getFilteredContent().at(idx) || this.content;
    this.router.navigate([`detail/${next.id}`]);
  }

  goToPrevious(): void {
    this.resetZoom();
    let idx = this.contentService.getFilteredContent().indexOf(this.content) - 1;
    idx = idx < 0 ? this.getMaxContentsIndex() : idx;
    const prev = this.contentService.getFilteredContent().at(idx) || this.content;
    this.router.navigate([`detail/${prev.id}`]);
  }

  getMaxContentsIndex(): number {
    return this.contentService.getFilteredContent().length - 1;
  }

  // Controlli zoom esterni
  zoomIn(): void {
    this.zoomInstance.zoomIn();
  }
  zoomOut(): void {
    this.zoomInstance.zoomOut();
  }
  reset(): void {
    if (this.zoomInstance) {
      this.zoomInstance.zoom(1);   // Scala 1x (default)
      this.zoomInstance.pan(0, 0); // Posizione centrale (0,0)
    }
  }

  private resetZoom(): void {
    if (this.zoomInstance) {
      this.zoomInstance.reset();
    }
  }

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }
}