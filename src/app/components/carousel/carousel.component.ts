import { Component, computed, inject, Signal } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [
    CommonModule
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

  contentService: ContentService = inject(ContentService);

  contents: Signal<Content[]> = computed(() => this.contentService.contents());
  hoveredImage: any = null;
  
}
