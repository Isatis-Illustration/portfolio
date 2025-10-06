import { Component, computed, inject, Signal } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contacts-info',
  imports: [
    TranslatePipe
  ],
  templateUrl: './contacts-info.component.html',
  styleUrl: './contacts-info.component.css'
})
export class ContactsInfoComponent {

  translateService: TranslationService = inject(TranslationService);
  userService: UserService = inject(UserService);


  user: Signal<User> = computed(() => this.userService.user())
  contactImg: Signal<string> = computed(() => {
    
    return `assets/contacts/contact_${this.translateService.currentLanguage()}.gif`
  });

  openEmail(): void{
    window.location.href = `mailto:${this.user().email.email}`
  }
 
} 
