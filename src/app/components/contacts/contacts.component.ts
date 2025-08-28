import { Component, computed, inject, Signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CommonModule } from '@angular/common';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  userService: UserService = inject(UserService);
  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  imgLoaded: boolean = false;

  user: Signal<User> = computed(() => this.userService.user())
  isMenuOpen: Signal<boolean> = computed(() => this.buttonService.isNavbarMenuOpen());
  
  contactDec: string = environment.icons.contactFrame;


  openEmail(): void{
    window.location.href = `mailto:${this.user().email.email}`
  }


  encodeForMailto(text: string): string {
    return encodeURIComponent(text);
  }


  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
