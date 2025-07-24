import { Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CustomButton, User } from '../../services/models/models';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);
  router: Router = inject(Router);

  user: User = environment.user
  isMenuOpen: boolean = false;

  buttons: CustomButton[] = this.buttonService.buttons

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

  toggleMenu(): void{
    this.isMenuOpen = !this.isMenuOpen
  }

  navigateToHome(): void{
    this.router.navigate(['home']);
  }
}
