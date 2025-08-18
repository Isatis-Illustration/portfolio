import { Component, effect, inject, viewChild, ElementRef, HostListener, Signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CardDetailFooterComponent } from '../card-detail-footer/card-detail-footer.component';
import { ViewerComponent } from "../viewer/viewer.component";

@Component({
  selector: 'app-card-detail',
  imports: [
    CommonModule,
    CardDetailFooterComponent,
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
  iconService: IconService = inject(IconService);

  // ViewChild signals per Angular 19
  imageElement = viewChild<ElementRef<HTMLImageElement>>('imageElement');
  backElement = viewChild<ElementRef<HTMLDivElement>>('backElement');

  contentToView: Signal<Content | null> = computed(() => this.contentService.contentToView());

  content!: Content;
  showInfo: boolean = false;
  hasLoaded: boolean = false;
  isFlipped: boolean = false;

  constructor() {
    effect(() => {
      const filterStorage = localStorage.getItem(StorageKey.FILTER);

      if (filterStorage)
        this.contentService.filter.set(filterStorage);
      
      const list = this.contentService.contents();

      this.route.paramMap.subscribe(params => {
        let id: string = params.get('id')!;

        if(!id)
          id = localStorage.getItem(StorageKey.DETAIL_ID) || '0'!

        localStorage.setItem(StorageKey.DETAIL_ID, id)
        this.content = list.find(c => c.id === id)!;
      });
    });
  }

  showViewer(): void{
    this.contentService.setContentToView(this.content)
  }

  loaded(): void{
    this.hasLoaded = true;
    // Sincronizza le dimensioni del back dopo che l'immagine è caricata
    setTimeout(() => this.syncBackDimensions(), 50);
  }

  toggleFlip(): void{
    this.isFlipped = !this.isFlipped;
  }

  goToNext(): void{
    const nextContent: Content = this.contentService.getNextContent(this.content)
    this.router.navigate([`detail/${nextContent.id}`])
  }

  goToPrevious(): void{
    const prevContent: Content = this.contentService.getPrevContent(this.content)
    this.router.navigate([`detail/${prevContent.id}`])
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.hasLoaded) {
      setTimeout(() => this.syncBackDimensions(), 50);
    }
  }

  private syncBackDimensions() {
    const imageEl = this.imageElement();
    const backEl = this.backElement();
    
    if (imageEl && backEl) {
      const img = imageEl.nativeElement;
      const back = backEl.nativeElement;
      
      // Ottieni le dimensioni renderizzate dell'immagine
      const imgRect = img.getBoundingClientRect();
      const containerRect = img.parentElement!.getBoundingClientRect();
      
      // Calcola la posizione relativa al container
      const leftOffset = imgRect.left - containerRect.left;
      const topOffset = imgRect.top - containerRect.top;
      
      // Applica le stesse dimensioni al back
      back.style.left = `${leftOffset}px`;
      back.style.top = `${topOffset}px`;
      back.style.width = `${imgRect.width}px`;
      back.style.height = `${imgRect.height}px`;
      back.style.right = 'auto';
      back.style.bottom = 'auto';
    }
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}