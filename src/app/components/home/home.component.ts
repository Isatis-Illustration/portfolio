import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';
import { IconService } from '../../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environment/environment';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  route: Router = inject(Router);
  buttonService: ButtonService = inject(ButtonService);
  iconService: IconService = inject(IconService);
  
  nameGif: string = environment.icons.nameGif;
  lNameGif: string = environment.icons.lNameGif;
  buttons: CustomButton[] = [];

  constructor(){
    effect(() => {
      this.buttons = this.buttonService.buttons().filter(b => b.id != 0);
    })
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
