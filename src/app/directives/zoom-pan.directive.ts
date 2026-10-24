import { Directive, ElementRef, HostListener, inject, Input, OnChanges, Renderer2 } from '@angular/core';

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const WHEEL_STEP = 0.1;
const DOUBLE_CLICK_ZOOM = 2;
const TRANSITION = 'transform 0.2s ease';

/**
 * Zoom e pan dell'immagine dentro il suo contenitore (le tavole del Project Viewer),
 * con gli stessi gesti del viewer del dettaglio:
 * - PC: rotella con Ctrl (o pinch del trackpad) per zoomare verso il cursore, trascinamento
 *   per spostare, doppio clic per zoomare/resettare. Da zoomata anche la rotella semplice zooma,
 *   da non zoomata la rotella resta allo scorrimento delle tavole.
 * - Telefono: pinch per zoomare, un dito per spostare da zoomata, doppio tap per zoomare/resettare.
 * L'immagine resta sempre dentro il contenitore (pan limitato ai bordi).
 * Va sull'elemento che ritaglia l'immagine (overflow hidden); l'immagine è il primo <img> figlio.
 */
@Directive({
  selector: '[appZoomPan]',
  standalone: true,
  host: {
    '[class.is-zoomed]': 'zoom > 1',
    '[style.touch-action]': 'zoom > 1 ? "none" : "pan-y"',
  },
})
export class ZoomPanDirective implements OnChanges {

  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  /** Quando diventa false (es. la tavola non è più quella visibile) lo zoom si azzera */
  @Input() appZoomPan: boolean | '' = true;

  zoom = ZOOM_MIN;
  private x = 0;
  private y = 0;

  private panStart: { x: number, y: number } | null = null;
  private pinch: { distance: number, zoom: number } | null = null;

  ngOnChanges(): void {
    if (this.appZoomPan === false && this.zoom !== ZOOM_MIN) {
      this.set(ZOOM_MIN, 0, 0, true);
    }
  }

  // ── PC ──

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (this.zoom === ZOOM_MIN && !event.ctrlKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1 + WHEEL_STEP : 1 / (1 + WHEEL_STEP);
    this.zoomAt(this.zoom * factor, event.clientX, event.clientY, true);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.zoom === ZOOM_MIN || event.button !== 0) return;
    event.preventDefault();
    this.panStart = { x: event.clientX - this.x, y: event.clientY - this.y };
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.panStart) return;
    this.set(this.zoom, event.clientX - this.panStart.x, event.clientY - this.panStart.y, false);
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.panStart = null;
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    if (this.zoom > ZOOM_MIN) {
      this.set(ZOOM_MIN, 0, 0, true);
    } else {
      this.zoomAt(DOUBLE_CLICK_ZOOM, event.clientX, event.clientY, true);
    }
  }

  // ── Touch ──

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.panStart = null;
      this.pinch = { distance: touchDistance(event.touches), zoom: this.zoom };
    } else if (event.touches.length === 1 && this.zoom > ZOOM_MIN) {
      const t = event.touches[0];
      this.panStart = { x: t.clientX - this.x, y: t.clientY - this.y };
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinch) {
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const zoom = this.pinch.zoom * touchDistance(event.touches) / this.pinch.distance;
      this.zoomAt(zoom, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2, false);
    } else if (event.touches.length === 1 && this.panStart) {
      event.preventDefault();
      const t = event.touches[0];
      this.set(this.zoom, t.clientX - this.panStart.x, t.clientY - this.panStart.y, false);
    }
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) this.pinch = null;
    if (event.touches.length === 0) this.panStart = null;
  }

  // ── Calcoli ──

  /** Zoom mantenendo fermo il punto sotto il cursore / al centro delle dita */
  private zoomAt(target: number, clientX: number, clientY: number, animate: boolean): void {
    const zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, target));
    const rect = this.host.nativeElement.getBoundingClientRect();
    const px = clientX - (rect.left + rect.width / 2);
    const py = clientY - (rect.top + rect.height / 2);
    const ratio = zoom / this.zoom;
    this.set(zoom, px - (px - this.x) * ratio, py - (py - this.y) * ratio, animate);
  }

  /** Applica zoom e spostamento, tenendo l'immagine dentro il contenitore */
  private set(zoom: number, x: number, y: number, animate: boolean): void {
    const el = this.host.nativeElement;
    const maxX = (zoom - 1) * el.clientWidth / 2;
    const maxY = (zoom - 1) * el.clientHeight / 2;
    this.zoom = zoom;
    this.x = Math.min(maxX, Math.max(-maxX, x));
    this.y = Math.min(maxY, Math.max(-maxY, y));

    const img = el.querySelector('img');
    if (!img) return;
    this.renderer.setStyle(img, 'transition', animate ? TRANSITION : 'none');
    this.renderer.setStyle(img, 'transform', zoom === ZOOM_MIN ? '' : `translate(${this.x}px, ${this.y}px) scale(${zoom})`);
  }
}

function touchDistance(touches: TouchList): number {
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return Math.hypot(dx, dy);
}
