import { Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CustomButton } from '../../services/models/models';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  
  isMenuOpen: boolean = false;

  buttons: CustomButton[] = this.buttonService.buttons

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleMenu(): void{
    this.isMenuOpen = !this.isMenuOpen
  }
}
