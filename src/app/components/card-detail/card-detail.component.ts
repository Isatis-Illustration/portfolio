import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';

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

  content!: Content;
  showInfo: boolean = false;

  constructor(){
    effect(() => {
      const list = this.contentService.contents();
      this.route.paramMap.subscribe(params => {
        let id: string = params.get('id')!;
        this.content = this.contentService.contents().find(c => c.id === id)!;
        console.log(this.content);
      })
    });
  }

  goToNext(): void{
    let nextIndex: number = this.contentService.contents().indexOf(this.content)+1;
    nextIndex = nextIndex > this.getMaxContentsIndex() ? 0 : nextIndex;
    const nextContent: Content = this.contentService.contents().at(nextIndex)!;
    this.router.navigate([`detail/${nextContent.id}`])
  }

  goToPrevious(): void{
    let prevIndex: number = this.contentService.contents().indexOf(this.content)-1;
    prevIndex = prevIndex < 0 ? this.getMaxContentsIndex() : prevIndex;
    const prevContent: Content = this.contentService.contents().at(prevIndex)!;
    this.router.navigate([`detail/${prevContent.id}`])
  }

  getMaxContentsIndex(): number{
    return this.contentService.contents().length - 1;
  }
}
