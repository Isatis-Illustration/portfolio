import { Component, computed, inject, Signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { User } from '../../services/models/models';
import { TranslationService } from '../../services/translation.service';
import { Language } from '../../services/models/enums';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  translateService: TranslationService = inject(TranslationService);

  user: User = environment.user

  description: Signal<string> = computed(() => {
    return this.translateService.currentLanguage() == Language.IT ? this.user.description.it : this.user.description.en;
  })
}
