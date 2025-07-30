import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import mediumZoom from 'medium-zoom';
import { CardDetailSetupComponent } from "../card-detail-setup/card-detail-setup.component";

@Component({
  selector: 'app-card-detail',
  imports: [
    CommonModule,
    CardDetailSetupComponent
],
  templateUrl: './card-detail-refactory.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);

  content!: Content;
  showInfo: boolean = false;

  //per zoom
  zoomInstance: any;
  lastImageUrl: string | undefined;

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
    this.initZoom()
  }

  ngAfterViewChecked(): void {
    if (this.content?.imageUrl && this.content.imageUrl !== this.lastImageUrl) {
      this.lastImageUrl = this.content.imageUrl;
      this.initZoom();
    }
  }

  initZoom() {
    if (this.zoomInstance)
      this.zoomInstance.detach();
    
    setTimeout(() => {
      this.zoomInstance = mediumZoom('[data-zoomable]');
    }, 10);
  }


  goToNext(): void{
    let nextIndex: number = this.contentService.getFilteredContent().indexOf(this.content)+1;
    nextIndex = nextIndex > this.getMaxContentsIndex() ? 0 : nextIndex;
    let nextContent: Content = this.contentService.getFilteredContent().at(nextIndex)!;
    nextContent = nextContent ? nextContent : this.content;
    this.router.navigate([`detail/${nextContent.id}`])
  }

  goToPrevious(): void{
    let prevIndex: number = this.contentService.getFilteredContent().indexOf(this.content)-1;
    prevIndex = prevIndex < 0 ? this.getMaxContentsIndex() : prevIndex;
    let prevContent: Content = this.contentService.getFilteredContent().at(prevIndex)!;
    prevContent = prevContent ? prevContent : this.content;
    this.router.navigate([`detail/${prevContent.id}`])
  }

  getMaxContentsIndex(): number{
    return this.contentService.getFilteredContent().length - 1;
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
