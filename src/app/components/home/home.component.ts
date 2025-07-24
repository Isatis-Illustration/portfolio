import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  route: Router = inject(Router);
  buttonService: ButtonService = inject(ButtonService);
  
  fNameGif = 'assets/home/name.gif';
  lNameGif = 'assets/home/surname.gif'
  buttons: CustomButton[] = []

  ngOnInit(): void{
    this.buttons = this.buttonService.buttons.filter(b => b.id != 0);
  }

  navigate(): void{
    this.route.navigate(['gallery']);
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
  }
  
}
