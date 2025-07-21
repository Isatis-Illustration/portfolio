import { Injectable } from '@angular/core';
import { User } from './models/models';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user!: User;

  constructor(){
    this.user = environment.user;
    this.calculateAge();
  }

  calculateAge(): void {

    const birthDate = new Date(this.user.birthDate);
    const today = new Date();

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;
    }

    this.user.age = calculatedAge;
  }
}
