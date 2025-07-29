import { Injectable } from '@angular/core';
import { CustomButton } from './models/models';
import { environment } from '../environment/environment';

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
      imageUrl: environment.icons.buttons.button1,
      imageSVG: 'illustration'
    },
    {
      id:2,
      label: 'Character Design',
      path: 'gallery/character-design',
      imageUrl: environment.icons.buttons.button2,
      imageSVG: 'character'
    },
    {
      id:3,
      label: 'Profile',
      path: 'profile',
      imageUrl: environment.icons.buttons.contacts,
      imageSVG: 'profile',
    },
    {
      id:4,
      label: 'Contacts',
      path: 'contacts',
      imageUrl: environment.icons.buttons.profile,
      imageSVG: 'contacts'
    }
  ];
}
