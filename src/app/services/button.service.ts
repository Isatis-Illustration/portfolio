import { Injectable, signal, WritableSignal } from '@angular/core';
import { CustomButton } from './models/models';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  buttons: WritableSignal<CustomButton[]> = signal([
    {
      id:0,
      label: 'HOME',
      path: 'home',
      imageUrl: '',
      imageSVG: 'home'
    },
    {
      id:1,
      label: 'ILLUSTRATIONS',
      path: 'gallery/illustrations',
      imageUrl: 'assets/home/illustration.png',
      imageSVG: 'illustration'
    },
    {
      id:2,
      label: 'CHARACTER',
      path: 'gallery/character-design',
      imageUrl: 'assets/home/character.png',
      imageSVG: 'character'
    },
    {
      id:3,
      label: 'PROFILE',
      path: 'profile',
      imageUrl: 'assets/home/profile.png',
      imageSVG: 'profile',
    },
    {
      id:4,
      label: 'CONTACTS',
      path: 'contacts',
      imageUrl: 'assets/home/contacts.png',
      imageSVG: 'contacts'
    }
  ]);
}
