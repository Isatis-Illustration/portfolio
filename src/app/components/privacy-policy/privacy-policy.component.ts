import { Component, computed, inject, Signal } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UserService } from '../../services/user.service';
import { User } from '../../services/models/models';

@Component({
  selector: 'app-privacy-policy',
  imports: [
    TranslatePipe
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {

  userService: UserService = inject(UserService);

  user: Signal<User> = computed(() => this.userService.user())
}
