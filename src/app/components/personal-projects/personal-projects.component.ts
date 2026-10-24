import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ContentService } from '../../services/content.service';
import { cloudinaryResized } from '../../services/cloudinary-image';

/** Larghezza della copertina richiesta a Cloudinary: la cartolina è ~220px, ×2.7 per gli schermi retina */
const COVER_WIDTH = 600;

export interface PersonalProject {
  key: string;
  title: string;
  badge: string;
  description: string;
  coverUrl: string;
  coverHasBg: boolean;
  backColor: string;
  frontColor: string;
  stitchColor: string;
  c1Color: string;
  c2Color: string;
  c3Color: string;
}

@Component({
  selector: 'app-personal-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './personal-projects.component.html',
  styleUrl: './personal-projects.component.css'
})
export class PersonalProjectsComponent {
  private router = inject(Router);
  private contentService = inject(ContentService);

  /** true finché GET /portfolio non ha risposto: mostra il loader al posto delle bustine */
  isLoading: Signal<boolean> = computed(() => !this.contentService.loaded());

  /** Progetti personali dal BE (GET /portfolio) */
  projects: Signal<PersonalProject[]> = computed(() => {
    const fromApi = this.contentService.personalProjects()
      .filter(p => this.contentService.isPublishable(p))
      .sort((a, b) => a.order - b.order);

    return fromApi.map(p => ({
      key: p.id,
      title: this.contentService.resolveText(p.title),
      badge: this.contentService.resolveText(p.badge),
      description: this.contentService.resolveText(p.shortText),
      coverUrl: cloudinaryResized(p.coverUrl || '', COVER_WIDTH),
      coverHasBg: p.coverHasBg !== false,
      backColor: p.colors.back,
      frontColor: p.colors.front,
      stitchColor: p.colors.stitch,
      c1Color: p.colors.c1,
      c2Color: p.colors.c2,
      c3Color: p.colors.c3,
    }));
  });

  gridClass: Signal<string> = computed(() => {
    const count = this.projects().length;
    if (count === 1) {
      return 'flex justify-center items-start';
    }
    if (count === 2) {
      return 'flex flex-col md:flex-row items-start justify-center gap-10 sm:gap-12 lg:gap-14';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 items-start justify-items-center';
  });

  goToGallery(): void {
    this.router.navigate(['/gallery']);
  }

  openProject(key: string): void {
    this.router.navigate(['/project', key]);
  }
}
