import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';
import { TranslationService } from '../../services/translation.service';
import { IconService } from '../../services/icon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ContactsFormComponent } from "../contacts-form/contacts-form.component";

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule,
    TranslatePipe,
    ContactsFormComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  userService: UserService = inject(UserService);
  translateService: TranslationService = inject(TranslationService);
  iconService: IconService = inject(IconService);

  user: Signal<User> = computed(() => this.userService.user());

  /** Titolo illustrato "Contattami" nella lingua corrente */
  contactImg: Signal<string> = computed(() => {
    return `assets/contacts/contact_${this.translateService.currentLanguage()}.gif`;
  });

  /** Disegno "Contatti" con busta e telefono, decorativo */
  contactsDrawing: Signal<string> = computed(() => {
    return `assets/home/contacts_${this.translateService.currentLanguage()}.png`;
  });

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }
}
