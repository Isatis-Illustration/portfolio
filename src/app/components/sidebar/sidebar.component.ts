import { Component, inject } from '@angular/core';
import { CustomButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  instaram = environment.user.instagram;

  fNameGif = 'assets/home/name.gif';
  lNameGif = 'assets/home/surname.gif'

  user: User = environment.user;
  year: number = new Date().getFullYear()

  buttons: CustomButton[] = this.buttonService.buttons;

  trackById(item: any): number {
    return item.id;
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

}
