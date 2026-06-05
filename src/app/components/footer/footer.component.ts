import { Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IconService } from '../../services/icon.service';
import { User } from '../../services/models/models';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  userService: UserService = inject(UserService);
  iconService: IconService = inject(IconService);

  user: Signal<User> = computed(() => this.userService.user());
  year: number = new Date().getFullYear();
  instagram = environment.user.instagram;

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }
}
