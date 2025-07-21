import { Component, computed, effect, HostListener, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from '../card/card.component';
import { Content } from '../../services/models/models';
import { ContentService } from '../../services/content.service';
import { Route, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  route: Router = inject(Router)
  
  nameGif = 'assets/home/artist.gif'
  buttons = [
    'assets/home/illustrations.png',
    'assets/home/characters.png',
    'assets/home/backgrounds.png',
    'assets/home/profile.png',
    'assets/home/contacts.png',
  ];

  navigate(): void{
    this.route.navigate(['gallery']);
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
  }
  
}
