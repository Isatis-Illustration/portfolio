import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: WritableSignal<User | null> = signal(null);

  identifies = {
    email: 'gmail',
    telegram: 't.me',
    instagram: 'instagram',
  }

  
  setUserByClaudinary(cUser: any): void{

    const user: User = {
      nick: cUser.nick,
      firstName: cUser.firstName,
      lastName: cUser.lastName,
      birthDate: cUser.birthDate,
      image: cUser.image,
      email: cUser.email,
      instagram: cUser.instagram,
      telegram: cUser.telegram,
      description: {
        it: cUser.descriptionIt,
        en: cUser.descriptionEn,
      },
    }

    this.user.set(user);
  }

}
