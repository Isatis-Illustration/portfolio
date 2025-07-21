import { Component } from '@angular/core';
import { SidebarButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';

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

  user: User = environment.user;

  year: number = new Date().getFullYear()

  buttons: SidebarButton[] = [
    {
      id:0,
      label: 'Home',
      path: 'home',
      image: ''
    },
    {
      id:1,
      label: 'Illustrations',
      path: 'gallery',
      image: ''
    },
    {
      id:1,
      label: 'Character Design',
      path: 'gallery',
      image: ''
    },
    {
      id:1,
      label: 'Backgrounds',
      path: 'gallery',
      image: ''
    },
    {
      id:0,
      label: 'About me',
      path: 'about',
      image: ''
    },
    {
      id:0,
      label: 'Contacts',
      path: 'contacts',
      image: ''
    }
  ]


  trackById(item: any): number {
    return item.id;
  }
}
