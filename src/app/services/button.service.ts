import { Injectable } from '@angular/core';
import { CustomButton } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  buttons: CustomButton[] = [
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
      path: 'gallery/illustrations',
      imageUrl: 'assets/home/illustration.png',
      imageSVG: 'illustration'
    },
    {
      id:2,
      label: 'Character Design',
      path: 'gallery/character-design',
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
