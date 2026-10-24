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
import { ZoomPanDirective } from '../../directives/zoom-pan.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Proporzioni di una tavola prima che l'immagine sia caricata (A4 verticale) */
const DEFAULT_RATIO = 1 / Math.SQRT2;
/** Sblocco di sicurezza dello scorrimento programmato se scrollend non arriva */
const SCROLL_LOCK_TIMEOUT = 1200;

interface ProjectMeta {
  key: string;
  title: string;
  headerImageUrl?: string | null;
}

@Component({
  selector: 'app-project-viewer',
  standalone: true,
  imports: [CommonModule, ZoomPanDirective, TranslatePipe],
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

  /**
   * Pagina da cui si è aperto il viewer (Home o Progetti Personali), letta dalla navigazione
   * precedente; se si arriva da un link diretto si torna alla Home.
   */
  readonly backUrl: string = this.previousUrl();
  readonly backLabel: string = this.backUrl.startsWith('/personal-projects') ? 'PERSONAL_PROJECTS' : 'HOME';

  /** Proporzioni (larghezza/altezza) delle tavole caricate: la cornice segue i bordi dell'immagine */
  ratios = signal<Record<number, number>>({});

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

  /** Pagina verso cui sta scorrendo un clic sulla barra: fino all'arrivo lo scroll non cambia pagina */
  private scrollTarget: number | null = null;
  private scrollLockTimer: any = null;

  private previousUrl(): string {
    const url = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();
    return url && !url.startsWith('/project/') ? url : '/home';
  }

  ratio(index: number): number {
    return this.ratios()[index] ?? DEFAULT_RATIO;
  }

  onImageLoad(index: number, event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.naturalWidth || !img.naturalHeight) return;
    this.ratios.update(r => ({ ...r, [index]: img.naturalWidth / img.naturalHeight }));
  }

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
      this.ratios.set({});
      this.releaseScrollLock();
      setTimeout(() => {
        const vp = this.viewportRef()?.nativeElement;
        if (vp) vp.scrollTop = 0;
      }, 100);
    });

    this.destroyRef.onDestroy(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('overflow-hidden', 'h-full');
        document.body.classList.remove('overflow-hidden', 'h-full');
      }
      if (this.moveTimer) {
        clearTimeout(this.moveTimer);
      }
      this.releaseScrollLock();
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

    // scorrimento avviato dalla barra: la goccia è già sulla pagina di arrivo, le pagine
    // attraversate non devono spostarla avanti e indietro
    if (this.scrollTarget !== null) return;

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
      this.lockScroll(index);
      vp.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
      this.changePage(index);
    }
  }

  /** Fine dello scorrimento (scrollend, dove supportato): sblocca il cambio pagina da scroll */
  onViewportScrollEnd(): void {
    if (this.scrollTarget === null) return;
    this.releaseScrollLock();
    this.onViewportScroll();
  }

  private lockScroll(index: number): void {
    this.releaseScrollLock();
    this.scrollTarget = index;
    this.scrollLockTimer = setTimeout(() => this.onViewportScrollEnd(), SCROLL_LOCK_TIMEOUT);
  }

  private releaseScrollLock(): void {
    this.scrollTarget = null;
    if (this.scrollLockTimer) {
      clearTimeout(this.scrollLockTimer);
      this.scrollLockTimer = null;
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
    this.router.navigateByUrl(this.backUrl);
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
