import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-card-detail',
  imports: [
    CommonModule,
],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);

  content!: Content;
  showInfo: boolean = false;
  zoomed: boolean = false;

  constructor(){
    effect(() => {
      const filterStorage = localStorage.getItem(StorageKey.FILTER);
      this.contentService.filter.set(filterStorage!)
      const list = this.contentService.contents();
      this.route.paramMap.subscribe(params => {
        let id: string = params.get('id')!;
        this.content = this.contentService.contents().find(c => c.id === id)!;
      })
    });
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



  // DRAGGABLE ZOOMED IMAGE

  isDragging = false;
  lastX = 0;
  lastY = 0;
  translateX = 0;
  translateY = 0;

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.translateX += dx;
    this.translateY += dy;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseLeave() {
    this.isDragging = false;
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
