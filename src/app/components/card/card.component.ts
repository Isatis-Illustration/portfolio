import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() content!: Content;
  @Output() onClickImageEvent: EventEmitter<Content> = new EventEmitter<Content>;

  hasTitle: boolean = false;
  hasLoaded: boolean = false;

  loaded(): void{
    this.hasLoaded = true;
  }

  
  showTitle(): void {
    this.hasTitle = true;
  }

  hideTitle(): void{
    this.hasTitle = false;
  }
}
