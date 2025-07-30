import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card-detail-setup',
  imports: [],
  templateUrl: './card-detail-setup.component.html',
  styleUrl: './card-detail-setup.component.css'
})
export class CardDetailSetupComponent {
  
  
  @Output() goPreviousEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() goNextEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() showInfoEvent: EventEmitter<boolean> = new EventEmitter<boolean>()

  private showInfo: boolean = false;

  toggleInfoVisibility(): void{
    this.showInfo = !this.showInfo;
    this.showInfoEvent.emit(this.showInfo);
  }
}
