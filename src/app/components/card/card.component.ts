import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { GifSyncService } from '../../services/gif-sync.service';

@Component({
  selector: 'app-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  gifSync: GifSyncService = inject(GifSyncService);

  @Input() content!: Content;
  @Input() isCharacter: boolean = false;
  @Output() onClickImageEvent: EventEmitter<Content> = new EventEmitter<Content>;

  hasLoaded: boolean = false;
}
