import { Component, inject } from '@angular/core';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  iconService: IconService = inject(IconService);


  contacts = environment.user.contacts;

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
