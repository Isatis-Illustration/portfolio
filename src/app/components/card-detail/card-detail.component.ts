import { Component, effect, inject, HostListener, Signal, computed, signal, viewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Content } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { StorageKey } from '../../services/models/enums';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ZoomPanDirective } from '../../directives/zoom-pan.directive';

/** Proporzioni prima che l'immagine sia caricata */
const DEFAULT_RATIO = 1;
/** Da PC: distanza tra il bordo destro del foglio e la nuvola (dove stanno i batuffoli), = left del box nel CSS */
const THOUGHT_GAP = 78;
/** Da PC: margine tra la nuvola e il bordo destro dell'area */
const THOUGHT_MARGIN = 20;

/**
 * Dettaglio di un'illustrazione della galleria, con lo stesso stile del Project Viewer:
 * barra in alto con titolo, foglio bianco che segue i bordi dell'immagine e zoom dentro la cornice
 * (ZoomPanDirective). Frecce, swipe e tastiera passano all'illustrazione precedente/successiva
 * della lista filtrata della galleria.
 */
@Component({
  selector: 'app-card-detail',
  imports: [
    CommonModule,
    TranslatePipe,
    ZoomPanDirective
  ],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  contentService: ContentService = inject(ContentService);

  content: Content | undefined;
  /** id dell'illustrazione aperta, per il contatore */
  private currentId = signal<number | null>(null);

  /**
   * Come si mostra la descrizione:
   * 'bubble' = nuvoletta dei pensieri dal tastino sull'angolo del foglio (hover o click; da telefono tap)
   * 'panel'  = tasto info nella barra in alto e pannello che sale dal basso
   */
  descriptionLayout: 'bubble' | 'panel' = 'bubble';

  showInfo: boolean = false;
  /** Nuvoletta aperta (hover o click) */
  thoughtOpen: boolean = false;
  /** Aperta col click/tap: resta aperta finché non si clicca di nuovo */
  private thoughtPinned: boolean = false;
  /** Aperta col mouse mentre il foglio scivola a sinistra: non si chiude perdendo l'hover del tasto */
  private thoughtHeldBySlide: boolean = false;
  private thoughtCloseTimer: any = null;
  /** Spostamento a sinistra del foglio (px) per far posto alla nuvola da PC */
  thoughtShift: number = 0;

  private stageRef = viewChild<ElementRef<HTMLElement>>('stage');
  private wrapRef = viewChild<ElementRef<HTMLElement>>('sheetWrap');
  private deskBoxRef = viewChild<ElementRef<HTMLElement>>('deskBox');
  hasLoaded: boolean = false;
  /** Larghezza/altezza dell'immagine caricata: la cornice segue i suoi bordi */
  ratio: number = DEFAULT_RATIO;

  /** Posizione nella lista filtrata della galleria (0 se non trovata) */
  index: Signal<number> = computed(() => {
    const id = this.currentId();
    return Math.max(0, this.contentService.filteredContent().findIndex(c => c.id === id));
  });
  total: Signal<number> = computed(() => this.contentService.filteredContent().length);

  // SWIPE
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private multiTouch: boolean = false;
  private readonly SWIPE_THRESHOLD = 50;

  onTouchStart(event: TouchEvent): void {
    this.multiTouch = event.touches.length > 1;
    this.touchStartX = event.changedTouches[0].clientX;
    this.touchStartY = event.changedTouches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    // pinch o immagine zoomata: il gesto serve allo zoom/pan, non a cambiare illustrazione
    if (this.multiTouch || event.touches.length > 0) return;
    if ((event.target as HTMLElement).closest?.('.is-zoomed')) return;

    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;

    // Ignora se il gesto è principalmente verticale
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx > this.SWIPE_THRESHOLD) {
      this.goToPrevious();
    } else if (dx < -this.SWIPE_THRESHOLD) {
      this.goToNext();
    }
  }

  constructor() {
    effect(() => {
      const filterStorage = localStorage.getItem(StorageKey.FILTER);

      if (filterStorage)
        this.contentService.filter.set(filterStorage);

      const list = this.contentService.contents();

      this.route.paramMap.subscribe(params => {
        let id: number = Number(params.get('id')!);

        if(Number.isNaN(id))
          id = Number(localStorage.getItem(StorageKey.DETAIL_ID)) || 0!

        localStorage.setItem(StorageKey.DETAIL_ID, JSON.stringify(id))
        this.content = list.find(c => c.id === id);
        this.currentId.set(id);
      });
    });
  }

  loaded(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      this.ratio = img.naturalWidth / img.naturalHeight;
    }
    this.hasLoaded = true;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : String(n);
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  /** La nuvoletta c'è solo nel layout 'bubble' e se l'illustrazione ha una descrizione */
  get hasThought(): boolean {
    return this.descriptionLayout === 'bubble' && !!this.content?.description;
  }

  // ── Nuvoletta ──

  /** Hover (solo dispositivi con mouse): apre; un piccolo ritardo in uscita permette di passare dal tasto al box */
  onThoughtEnter(): void {
    if (!canHover()) return;
    clearTimeout(this.thoughtCloseTimer);
    if (!this.thoughtOpen) {
      this.openThought();
      // il foglio (e il tasto con lui) scivola via da sotto il mouse: senza questo l'hover si
      // perderebbe e la nuvola si richiuderebbe subito. Resta aperta finché il mouse è sull'area
      // dell'immagine (onStageLeave), o fino a clic fuori / Esc / clic sul tasto.
      if (this.thoughtShift > 0) this.thoughtHeldBySlide = true;
    }
  }

  /** Il mouse esce dall'area dell'immagine: chiude la nuvola tenuta aperta dallo spostamento */
  onStageLeave(): void {
    if (this.thoughtHeldBySlide && !this.thoughtPinned) this.closeThought();
  }

  onThoughtLeave(): void {
    if (this.thoughtHeldBySlide) return;
    if (!canHover() || this.thoughtPinned) return;
    this.thoughtCloseTimer = setTimeout(() => this.thoughtOpen = false, 180);
  }

  toggleThought(event: Event): void {
    event.stopPropagation();
    clearTimeout(this.thoughtCloseTimer);
    // con il mouse l'hover l'ha già aperta: il click la fissa (o la chiude se era già fissata).
    // Se era tenuta aperta dallo spostamento del foglio, il click sul tasto la chiude.
    if (this.thoughtHeldBySlide && !this.thoughtPinned) {
      this.closeThought();
      return;
    }
    if (canHover() && this.thoughtOpen && !this.thoughtPinned) {
      this.thoughtPinned = true;
      return;
    }
    if (this.thoughtOpen) {
      this.closeThought();
    } else {
      this.openThought();
      this.thoughtPinned = true;
    }
  }

  /**
   * Da PC la nuvola sta a destra del foglio, fuori dalla cornice: se lo spazio a destra non basta,
   * il foglio scivola a sinistra quanto serve (al massimo fino al bordo sinistro dell'area).
   * Le misure si prendono a nuvola chiusa, quando il foglio non è ancora spostato.
   */
  private openThought(): void {
    this.thoughtShift = 0;
    const stage = this.stageRef()?.nativeElement;
    const wrap = this.wrapRef()?.nativeElement;
    const box = this.deskBoxRef()?.nativeElement;
    if (canHover() && stage && wrap && box && window.matchMedia('(min-width: 640px)').matches) {
      const stageRect = stage.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const needed = THOUGHT_GAP + box.offsetWidth + THOUGHT_MARGIN;
      const spaceRight = stageRect.right - wrapRect.right;
      const spaceLeft = wrapRect.left - stageRect.left;
      this.thoughtShift = Math.max(0, Math.min(needed - spaceRight, spaceLeft));
    }
    this.thoughtOpen = true;
  }

  /** Click/tap fuori dalla nuvoletta (sull'immagine o sullo sfondo): la chiude */
  onStageClick(event: Event): void {
    if (!this.thoughtOpen) return;
    if ((event.target as HTMLElement).closest('.thought-box, .thought-btn')) return;
    this.closeThought();
  }

  private closeThought(): void {
    clearTimeout(this.thoughtCloseTimer);
    this.thoughtOpen = false;
    this.thoughtPinned = false;
    this.thoughtHeldBySlide = false;
  }

  goToNext(): void {
    if (this.content) this.open(this.contentService.getNextContent(this.content));
  }

  goToPrevious(): void {
    if (this.content) this.open(this.contentService.getPrevContent(this.content));
  }

  private open(content: Content): void {
    if (!content || content.id === this.content?.id) return;
    this.hasLoaded = false;
    this.showInfo = false;
    this.closeThought();
    this.router.navigate([`detail/${content.id}`]);
  }

  goBack(): void {
    this.router.navigate([`gallery/${this.contentService.filter()}`]);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.goToNext();
    } else if (event.key === 'ArrowLeft') {
      this.goToPrevious();
    } else if (event.key === 'Escape') {
      if (this.showInfo) this.showInfo = false;
      else if (this.thoughtOpen) this.closeThought();
      else this.goBack();
    }
  }
}

/** Dispositivo con mouse (hover reale): su touch la nuvoletta si apre solo col tap */
function canHover(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
}
