import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-viewer',
  imports: [
    CommonModule
  ],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css'
})
export class ViewerComponent {

  contentService: ContentService = inject(ContentService);
  iconService: IconService = inject(IconService);


  @Input() content!: Content | null;


  zoom = 1;
  zoomMin = 1;
  zoomMax = 3;
  zoomStep = 0.1;
  zoomTransition = 'transform 0.2s ease';
  lastTouchDistance: number | null = null;

  @ViewChild('zoomImage') zoomImageRef!: ElementRef;

  
  closeViewer(): void{
    this.resetZoom();
    this.contentService.clearContentToView();
  }

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }


  onWheel(event: WheelEvent): void {
    event.preventDefault();

    const direction = event.deltaY < 0 ? 1 : -1;
    this.zoom += direction * this.zoomStep;
    this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, this.zoom));
  }

  resetZoom(): void {
    this.zoom = 1;
  }

  // Touch pinch-to-zoom support
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.lastTouchDistance = this.getTouchDistance(event.touches);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.lastTouchDistance != null) {
      const currentDistance = this.getTouchDistance(event.touches);
      const scaleChange = currentDistance / this.lastTouchDistance;

      this.zoom *= scaleChange;
      this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, this.zoom));

      this.lastTouchDistance = currentDistance;

      event.preventDefault(); // Prevent scrolling
    }
  }

  getTouchDistance(touches: TouchList): number {
    const [touch1, touch2] = [touches[0], touches[1]];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
