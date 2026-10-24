import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';
import { IconService } from '../../services/icon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userService: UserService = inject(UserService);
  iconService: IconService = inject(IconService);
  router: Router = inject(Router);

  imgLoaded: boolean = false;

  user: Signal<User> = computed(() => this.userService.user());

  /** Titoli delle opere: restano in lingua originale */
  publications = [
    { title: 'Benvenuti a Trentacapre', details: 'Cinzia Montagna, Navarra Editore', year: 2023 },
    { title: 'Bentornati a Trentacapre', details: 'Cinzia Montagna, Navarra Editore', year: 2025 },
  ];

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }

  goToContacts(): void {
    this.router.navigate(['contacts']);
  }
}
