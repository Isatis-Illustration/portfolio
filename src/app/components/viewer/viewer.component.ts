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

  //ZOOM
  zoom = 1;
  zoomMin = 1;
  zoomMax = 3;
  zoomStep = 0.1;
  zoomTransition = 'transform 0.2s ease';
  
  // TOUCH pinch + pan
  lastTouchDistance: number | null = null;
  touchStartOffsetX = 0;
  touchStartOffsetY = 0;

  //PAN
  offsetX = 0;
  offsetY = 0;
  private isPanning = false;
  private startX = 0;
  private startY = 0;

  @ViewChild('zoomImage') zoomImageRef!: ElementRef;

  
  closeViewer(): void{
    this.resetZoom();
    this.contentService.clearContentToView();
  }

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }


  // PAN col mouse
  startPan(event: MouseEvent): void {
    if (this.zoom <= 1) return; // no pan se non zoommato

    this.isPanning = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
  }

  onPan(event: MouseEvent): void {
    if (!this.isPanning) return;

    this.offsetX = event.clientX - this.startX;
    this.offsetY = event.clientY - this.startY;
  }

  endPan(): void {
    this.isPanning = false;
  }

  // ZOOM col mouse
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    const newZoom = this.zoom + direction * this.zoomStep;
    this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, newZoom));

    if (this.zoom <= 1) {
      this.offsetX = 0;
      this.offsetY = 0;
    }
  }

  resetZoom(): void {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }


  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.lastTouchDistance = this.getTouchDistance(event.touches);
    } else if (event.touches.length === 1 && this.zoom > 1) {
      this.startX = event.touches[0].clientX - this.offsetX;
      this.startY = event.touches[0].clientY - this.offsetY;
      this.isPanning = true;
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.lastTouchDistance != null) {
      const currentDistance = this.getTouchDistance(event.touches);
      const scaleChange = currentDistance / this.lastTouchDistance;

      this.zoom *= scaleChange;
      this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, this.zoom));
      this.lastTouchDistance = currentDistance;
      event.preventDefault();
    } else if (event.touches.length === 1 && this.isPanning) {
      this.offsetX = event.touches[0].clientX - this.startX;
      this.offsetY = event.touches[0].clientY - this.startY;
    }
  }

  getTouchDistance(touches: TouchList): number {
    const [touch1, touch2] = [touches[0], touches[1]];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

}
