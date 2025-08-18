import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { GifSyncService } from '../../gif-sync.service';

@Component({
  selector: 'app-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements AfterViewInit {

  gifSync: GifSyncService = inject(GifSyncService)

  @Input() content!: Content;
  @Input() isCharacter: boolean = false;
  @Output() onClickImageEvent: EventEmitter<Content> = new EventEmitter<Content>;

  @ViewChild('gifImg') imgRef!: ElementRef<HTMLImageElement>;

  hasTitle: boolean = false;
  hasLoaded: boolean = false;


  ngAfterViewInit() {
    if (this.content.isGif && this.imgRef) {
      this.gifSync.registerGif(this.imgRef.nativeElement);
    }
  }
  
  showTitle(): void {
    this.hasTitle = true;
  }

  hideTitle(): void{
    this.hasTitle = false;
  }
}
