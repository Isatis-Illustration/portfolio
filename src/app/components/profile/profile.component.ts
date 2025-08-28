import { Component, computed, inject, Signal } from '@angular/core';
import { User } from '../../services/models/models';
import { TranslationService } from '../../services/translation.service';
import { Language } from '../../services/models/enums';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userService: UserService = inject(UserService);
  translateService: TranslationService = inject(TranslationService);

  imgLoaded: boolean = false;

  user: Signal<User> = computed(() => this.userService.user());

  description: Signal<string> = computed(() => {

    switch(this.translateService.currentLanguage()){

      case Language.IT: 
        return this.user().description.it;

      case Language.EN: 
        return this.user().description.en;

      default:
        return this.user().description.it;
    }
  });
  
}
