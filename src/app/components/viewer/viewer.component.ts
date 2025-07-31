import { Component, inject, Input } from '@angular/core';
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


  closeViewer(): void{
    this.contentService.clearContentToView();
  }

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }
}
