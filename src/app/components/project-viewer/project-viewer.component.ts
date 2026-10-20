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

interface ProjectMeta {
  key: string;
  title: string;
  headerImageUrl?: string | null;
}

@Component({
  selector: 'app-project-viewer',
  standalone: true,
  imports: [CommonModule],
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

  projectKey = signal<string>('');
  currentPage = signal<number>(0);
  scrollProgress = signal<number>(0);
  hasUserScrolled = signal<boolean>(false);

  /** Progetto dal BE (collaborazione o personale): projectGuard garantisce che esista e abbia tavole */
  private apiProject = computed(() => this.contentService.getProject(this.projectKey()));

  currentMeta = computed<ProjectMeta>(() => {
    const key = this.projectKey();
    const project = this.apiProject();
    if (!project) {
      return { key, title: '' };
    }
    const header = project.viewer.header;
    return {
      key,
      title: this.contentService.resolveText(header.title) || this.contentService.resolveText(project.title),
      headerImageUrl: header.headerImageUrl ?? null,
    };
  });

  pages = computed<Content[]>(() => {
    const key = this.projectKey();
    const slides = this.apiProject()?.viewer.slides ?? [];
    return [...slides]
      .sort((a, b) => a.order - b.order)
      .map((slide, i): Content => ({
        id: i,
        title: this.contentService.resolveText(slide.title),
        imageUrl: slide.imageUrl,
        type: key,
        isGif: /\.gif$/i.test(slide.imageUrl),
        position: slide.order,
        hasBg: slide.hasBg !== false,
      }));
  });

  totalPages = computed<number>(() => this.pages().length);

  dropletTop = computed<string>(() => {
    const total = this.totalPages();
    if (total <= 1) return '10px';
    const ratio = this.currentPage() / (total - 1);
    return `calc(10px + ${ratio} * (100% - 20px))`;
  });

  moveDirection = signal<'down' | 'up' | null>(null);
  isMoving = signal<boolean>(false);
  private moveTimer: any = null;

  changePage(newIndex: number): void {
    const current = this.currentPage();
    if (newIndex === current) return;

    this.moveDirection.set(newIndex > current ? 'down' : 'up');
    this.isMoving.set(true);
    this.currentPage.set(newIndex);

    if (this.moveTimer) {
      clearTimeout(this.moveTimer);
    }
    this.moveTimer = setTimeout(() => {
      this.isMoving.set(false);
      this.moveDirection.set(null);
    }, 450);
  }

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('overflow-hidden', 'h-full');
      document.body.classList.add('overflow-hidden', 'h-full');
    }
    this.route.paramMap.subscribe((params) => {
      const key = params.get('key')?.toLowerCase() || '';
      this.projectKey.set(key);
      this.currentPage.set(0);
      this.moveDirection.set(null);
      this.isMoving.set(false);
      this.scrollProgress.set(0);
      this.hasUserScrolled.set(false);
      setTimeout(() => {
        const vp = this.viewportRef()?.nativeElement;
        if (vp) vp.scrollTop = 0;
        this.setupObserver();
      }, 100);
    });

    this.destroyRef.onDestroy(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('overflow-hidden', 'h-full');
        document.body.classList.remove('overflow-hidden', 'h-full');
      }
      this.observer?.disconnect();
      if (this.moveTimer) {
        clearTimeout(this.moveTimer);
      }
    });
  }

  private setupObserver(): void {
    this.observer?.disconnect();

    const vp = this.viewportRef()?.nativeElement;
    if (!vp) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry) {
          const indexStr = (bestEntry as IntersectionObserverEntry).target.getAttribute('data-index');
          if (indexStr !== null) {
            const idx = parseInt(indexStr, 10);
            if (idx !== this.currentPage()) {
              this.changePage(idx);
            }
            if (idx > 0) {
              this.hasUserScrolled.set(true);
            }
          }
        }
      },
      {
        root: vp,
        threshold: [0.3, 0.5, 0.7],
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

    if (vp.scrollTop > 30) {
      this.hasUserScrolled.set(true);
    }

    const maxScroll = vp.scrollHeight - vp.clientHeight;
    if (maxScroll > 0) {
      const prog = Math.min(1, Math.max(0, vp.scrollTop / maxScroll));
      this.scrollProgress.set(prog);
    }

    const slides = this.slideRefs();
    if (!slides || slides.length === 0) return;

    // Individua la slide visibile più vicina al centro del viewport
    const vpCenter = vp.scrollTop + vp.clientHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < slides.length; i++) {
      const el = slides[i].nativeElement;
      const slideCenter = el.offsetTop + el.offsetHeight / 2;
      const dist = Math.abs(vpCenter - slideCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    if (closestIndex !== this.currentPage()) {
      this.changePage(closestIndex);
    }
  }

  onAsideWheel(event: WheelEvent): void {
    const vp = this.viewportRef()?.nativeElement;
    if (vp) {
      vp.scrollTop += event.deltaY;
    }
  }

  scrollToPage(index: number): void {
    const vp = this.viewportRef()?.nativeElement;
    const slides = this.slideRefs();
    if (vp && slides && slides[index]) {
      const target = slides[index].nativeElement;
      vp.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
      this.changePage(index);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.scrollToPage(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.scrollToPage(this.currentPage() - 1);
    }
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
