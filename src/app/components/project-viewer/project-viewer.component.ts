import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { Type } from '../../services/models/enums';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface ProjectMeta {
  key: string;
  title: string;
  badgeKey: string;
  descKey: string;
}

@Component({
  selector: 'app-project-viewer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './project-viewer.component.html',
  styleUrl: './project-viewer.component.css',
})
export class ProjectViewerComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private contentService: ContentService = inject(ContentService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  viewportRef = viewChild<ElementRef<HTMLDivElement>>('viewport');
  slideRefs = viewChildren<ElementRef<HTMLDivElement>>('slideItem');

  projectKey = signal<string>('slap-it');
  currentPage = signal<number>(0);
  scrollProgress = signal<number>(0);
  hasUserScrolled = signal<boolean>(false);

  private metaMap: Record<string, ProjectMeta> = {
    'slap-it': {
      key: 'slap-it',
      title: 'Slap-It',
      badgeKey: 'FOLDER_SLAP_IT_BADGE',
      descKey: 'FOLDER_SLAP_IT_DESC',
    },
    'navarra': {
      key: 'navarra',
      title: 'Navarra Editore',
      badgeKey: 'FOLDER_NAVARRA_BADGE',
      descKey: 'FOLDER_NAVARRA_DESC',
    },
  };

  /** Fallback Slap-It */
  private fallbackSlapIt: Content[] = [
    { id: 101, title: 'Slap-It — Tavola 1', imageUrl: 'assets/home/illustration_it.png', type: Type.SLAP_IT, isGif: false, position: 1 },
    { id: 102, title: 'Slap-It — Character Design', imageUrl: 'assets/home/character.png', type: Type.SLAP_IT, isGif: false, position: 2 },
    { id: 103, title: 'Slap-It — Tavola 2', imageUrl: 'assets/home/profile_it.png', type: Type.SLAP_IT, isGif: false, position: 3 },
    { id: 104, title: 'Slap-It — Dettagli & Colori', imageUrl: 'assets/home/contacts_it.png', type: Type.SLAP_IT, isGif: false, position: 4 },
  ];

  /** Fallback Navarra Editore */
  private fallbackNavarra: Content[] = [
    { id: 201, title: 'Navarra — Copertina', imageUrl: 'assets/home/illustration_en.png', type: Type.NAVARRA, isGif: false, position: 1 },
    { id: 202, title: 'Navarra — Personaggi', imageUrl: 'assets/home/contacts_en.png', type: Type.NAVARRA, isGif: false, position: 2 },
    { id: 203, title: 'Navarra — Tavola interna 1', imageUrl: 'assets/home/profile_en.png', type: Type.NAVARRA, isGif: false, position: 3 },
    { id: 204, title: 'Navarra — Tavola interna 2', imageUrl: 'assets/home/character.png', type: Type.NAVARRA, isGif: false, position: 4 },
  ];

  currentMeta = computed<ProjectMeta>(() => {
    const key = this.projectKey();
    return (
      this.metaMap[key] || {
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        badgeKey: 'FOLDER_SLAP_IT_BADGE',
        descKey: 'FOLDER_SLAP_IT_DESC',
      }
    );
  });

  pages = computed<Content[]>(() => {
    const key = this.projectKey();
    const fromApi = this.contentService.getContentsByType(key);
    if (fromApi && fromApi.length > 0) {
      return fromApi;
    }
    if (key === 'navarra') {
      return this.fallbackNavarra;
    }
    return this.fallbackSlapIt;
  });

  totalPages = computed<number>(() => this.pages().length);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const key = params.get('key')?.toLowerCase() || 'slap-it';
      this.projectKey.set(key);
      this.currentPage.set(0);
      this.scrollProgress.set(0);
      this.hasUserScrolled.set(false);
      setTimeout(() => this.setupObserver(), 100);
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  private setupObserver(): void {
    this.observer?.disconnect();

    const vp = this.viewportRef()?.nativeElement;
    if (!vp) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-index');
            if (indexStr !== null) {
              const idx = parseInt(indexStr, 10);
              this.currentPage.set(idx);
              if (idx > 0) {
                this.hasUserScrolled.set(true);
              }
            }
          }
        });
      },
      {
        root: vp,
        threshold: 0.55,
      }
    );

    const slides = this.slideRefs();
    slides.forEach((slide) => {
      this.observer?.observe(slide.nativeElement);
    });
  }

  onViewportScroll(): void {
    const vp = this.viewportRef()?.nativeElement;
    if (!vp) return;

    const maxScroll = vp.scrollHeight - vp.clientHeight;
    if (maxScroll > 0) {
      const prog = Math.min(1, Math.max(0, vp.scrollTop / maxScroll));
      this.scrollProgress.set(prog);
      if (vp.scrollTop > 30) {
        this.hasUserScrolled.set(true);
      }
    }
  }

  scrollToPage(index: number): void {
    const slides = this.slideRefs();
    if (slides[index]) {
      slides[index].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      this.currentPage.set(index);
    }
  }

  nextPage(): void {
    const next = Math.min(this.currentPage() + 1, this.totalPages() - 1);
    this.scrollToPage(next);
  }

  prevPage(): void {
    const prev = Math.max(this.currentPage() - 1, 0);
    this.scrollToPage(prev);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      this.nextPage();
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      this.prevPage();
    } else if (event.key === 'Escape') {
      this.goBack();
    }
  }
}
