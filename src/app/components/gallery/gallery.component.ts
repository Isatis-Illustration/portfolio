import { Component, computed, effect, HostListener, inject, Signal } from '@angular/core';
import { Content } from '../../services/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { StorageKey, Type } from '../../services/models/enums';

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
  userService: UserService = inject(UserService);
  contentService: ContentService = inject(ContentService);

  // Writable signal for the current filter
  contents: Signal<Content[]> = computed(() => this.contentService.filteredContent());
  filter: string = '';

  screenWidth!: number;
  colsAmmount!: number;

  column1: Content[] = [];
  column2: Content[] = [];
  column3: Content[] = [];

  constructor() {
    // Subscribe to route changes and update the filter signal
    this.route.paramMap.subscribe(params => {
      const f = params.get('filter')?.toLowerCase()!;
      this.filter = f;
      this.contentService.filter.set(f);
    });

    // Re-distribute columns whenever filteredContents or screenWidth changes
    effect(() => {
      // Clear and redistribute
      this.clearColumns();
      this.distributeContent();
    });
  }


  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const target = event.target as Window;
    this.screenWidth = target.innerWidth;
    this.clearColumns();
    this.distributeContent();
  }


  checkColsAmmount(i: number): boolean {
    return this.colsAmmount == i;
  }


  clearColumns(): void{
    this.column1 = [];
    this.column2 = [];
    this.column3 = [];
  }

  
  distributeContent(){
    if(this.checkScreenSize('xl'))
      this.distribute3ColsContent();
    else if(this.checkScreenSize('md', 'xl'))
      this.distribute2ColsContent();
    else
      this.distribute1ColsContent();
  }


  distribute3ColsContent() {
    this.colsAmmount = 3;

    this.contents().forEach((item, index) => {
      if (index % 3 === 0) this.column1.push(item);
      else if (index % 3 === 1) this.column2.push(item);
      else this.column3.push(item);
    });
  }

  distribute2ColsContent() {
    this.colsAmmount = 2;

    this.contents().forEach((item, index) => {
      if (index % 2 === 0) this.column1.push(item);
      else this.column2.push(item);
    });
  }

  distribute1ColsContent() {
    this.colsAmmount  = 1;
    this.column1 = this.contents()
  }

  checkScreenSize(bp1: string, bp2?: string):boolean {
    if(bp2)
      return this.screenWidth >= this.getBreakPoint(bp1) && this.screenWidth < this.getBreakPoint(bp2);

    return this.screenWidth >= this.getBreakPoint(bp1);
  }

  
  isCharactersGallery(): boolean{
    return this.filter.charAt(0) === Type.CHARACTER;
  }

  
  getBreakPoint(bp: string): number{
    switch(bp){
      case 'sm':
        return 640;
      case 'md':
        return 768;
      case 'xl':
        return 1280;
      default:
        return 1280;
    }
  }


  openImageViewer(content: Content){
    this.router.navigate([`detail/${content.id}`]);
  }

  trackById(item: any){
    return item.id;
  }
}