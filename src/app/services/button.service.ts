import { inject, Injectable } from '@angular/core';
import { SidebarButton } from './models/models';
import { IconService } from './icon.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  buttons: SidebarButton[] = [
    {
      id:0,
      label: 'Home',
      path: 'home',
      imageUrl: '',
      imageSVG: 'home'
    },
    {
      id:1,
      label: 'Illustrations',
      path: 'gallery',
      imageUrl: 'assets/home/illustration.png',
      imageSVG: 'illustration'
    },
    {
      id:2,
      label: 'Character Design',
      path: 'gallery',
      imageUrl: 'assets/home/character.png',
      imageSVG: 'character'
    },
    {
      id:3,
      label: 'Profile',
      path: 'profile',
      imageUrl: 'assets/home/profile.png',
      imageSVG: 'profile',
    },
    {
      id:4,
      label: 'Contacts',
      path: 'contacts',
      imageUrl: 'assets/home/contacts.png',
      imageSVG: 'contacts'
    }
  ];
}
