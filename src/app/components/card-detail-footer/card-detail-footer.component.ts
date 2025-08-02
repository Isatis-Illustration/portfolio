import { Component, EventEmitter, inject, Output } from '@angular/core';
import { IconService } from '../../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-card-detail-footer',
  imports: [],
  templateUrl: './card-detail-footer.component.html',
  styleUrl: './card-detail-footer.component.css'
})
export class CardDetailFooterComponent {
  
  iconService: IconService = inject(IconService);

  
  @Output() goPreviousEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() goNextEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() showInfoEvent: EventEmitter<void> = new EventEmitter<void>()

  toggleInfoVisibility(): void{
    this.showInfoEvent.emit();
  }


  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }
}
