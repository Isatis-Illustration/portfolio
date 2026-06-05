import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IconService } from '../../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent, FooterComponent, CommonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  iconService: IconService = inject(IconService);
  router: Router = inject(Router);

  getBackground(): SafeHtml {
    return this.iconService.getIcon('background');
  }

  isDetailRoute(): boolean {
    return this.router.url.includes('/detail/');
  }
}
