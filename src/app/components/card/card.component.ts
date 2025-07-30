import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-card',
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input() content!: Content;
  @Output() onClickImageEvent: EventEmitter<Content> = new EventEmitter<Content>;

  ngOnInit(): void{
  }

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
