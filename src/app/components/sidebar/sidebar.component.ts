import { Component, inject } from '@angular/core';
import { SidebarButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

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

  fNameGif = 'assets/home/name.gif';
  lNameGif = 'assets/home/surname.gif'

  user: User = environment.user;
  year: number = new Date().getFullYear()

  buttons: SidebarButton[] = [
    {
      id:0,
      label: 'Home',
      path: 'home',
      image: 'home'
    },
    {
      id:1,
      label: 'Illustrations',
      path: 'gallery',
      image: 'illustration'
    },
    {
      id:1,
      label: 'Character Design',
      path: 'gallery',
      image: 'character'
    },
    {
      id:0,
      label: 'Profile',
      path: 'profile',
      image: 'profile'
    },
    {
      id:0,
      label: 'Contacts',
      path: 'contacts',
      image: 'contacts'
    }
  ]


  trackById(item: any): number {
    return item.id;
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
