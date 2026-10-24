import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { User } from '../../services/models/models';
import { UserService } from '../../services/user.service';
import { IconService } from '../../services/icon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ContentService } from '../../services/content.service';
import { cloudinaryResized } from '../../services/cloudinary-image';

interface CvCollaboration {
  id: string;
  title: string;
  shortText: string;
  /** Prima tavola del viewer, per la miniatura al passaggio del mouse */
  thumbUrl: string | null;
}

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
  contentService: ContentService = inject(ContentService);

  imgLoaded: boolean = false;

  user: Signal<User> = computed(() => this.userService.user());

  /** CV · Collaborazioni: le stesse pubblicate in Home (dal BE), ognuna apre il suo progetto */
  collaborations: Signal<CvCollaboration[]> = computed(() =>
    this.contentService.collaborations()
      .filter(p => this.contentService.isPublishable(p))
      .sort((a, b) => a.order - b.order)
      .map(p => ({
        id: p.id,
        title: this.contentService.resolveText(p.title),
        shortText: this.contentService.resolveText(p.shortText),
        // miniatura da 140px: versione ridimensionata da Cloudinary invece dell'originale
        thumbUrl: cloudinaryResized([...p.viewer.slides].sort((a, b) => a.order - b.order)[0]?.imageUrl ?? '', 320) || null,
      }))
  );

  getIcon(name: string): SafeHtml {
    return this.iconService.getIcon(name);
  }

  goToContacts(): void {
    this.router.navigate(['contacts']);
  }

  openProject(id: string): void {
    this.router.navigate(['/project', id]);
  }
}
