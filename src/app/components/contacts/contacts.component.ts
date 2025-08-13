import { Component, computed, inject, Signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  imgLoaded: boolean = false;

  isMenuOpen: Signal<boolean> = computed(() => this.buttonService.isNavbarMenuOpen());
  contactDec: string = environment.icons.contactDec;
  contacts = environment.user.contacts;

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
