import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';
import { IconService } from '../../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';

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
  iconService: IconService = inject(IconService);
  
  buttons: CustomButton[] = [];

  ngOnInit(): void{
    this.buttons = this.buttonService.buttons.filter(b => b.id != 0);
  }

  navigate(path: string): void{
    this.route.navigate([path]);
  }

  
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
  
}
