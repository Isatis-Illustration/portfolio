import { Injectable, signal, WritableSignal } from '@angular/core';
import { Email, Instagram, Telegram, User } from './models/models';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: WritableSignal<User> = signal(environment.user);

  identifies = {
    email: 'gmail',
    telegram: 't.me',
    instagram: 'instagram',
  }

  
  setUserByClaudinary(cUser: any): void{

    const email: Email = {
      email: cUser.context.email,
      icon: 'contacts',
      subject: cUser.context.emailSubject,
      body: cUser.context.emailBody
    };

    const instagram: Instagram = {
      nick: this.getInstagramNick(cUser.context.instagram),
      icon: 'instagram',
      link: cUser.context.instagram
    };

    const telegram: Telegram = {
      nick: this.getTelegramNick(cUser.context.telegram),
      icon: 'telegram',
      link: cUser.context.telegram
    };

    const user: User = {
      imageUrl: cUser.url,
      nick: cUser.context.nick,
      firstName: cUser.context.firstName,
      lastName: cUser.context.lastName,
      birthDate: cUser.context.birthDate,
      email: email,
      instagram: instagram,
      telegram: telegram,
      description: {
        it: cUser.context.descriptionIt,
        en: cUser.context.descriptionEn,
      },
    };

    this.user.set(user);
  }


  getInstagramNick(url: string): string{
    const parts: string[] = url.split('/');
    const nick: string = parts[parts.length-1];
    
    return `@${nick}`;
  }

  getTelegramNick(url: string): string{
    const parts: string[] = url.split('/');
    const nick: string = parts[parts.length-1].replace('_', '.');
    
    return `${nick}`;
  }
}
