import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';
import { TranslationService } from '../../services/translation.service';
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

  user: Signal<User> = computed(() => this.userService.user());

  contactImg: Signal<string> = computed(() => {
    return `assets/contacts/contact_${this.translateService.currentLanguage()}.gif`;
  });

  openEmail(): void {
    window.location.href = `mailto:${this.user().email.email}`;
  }
}
