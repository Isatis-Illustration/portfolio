import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Content } from './models/models';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { environment } from '../environment/environment';
import { StorageKey, Type, normalizeContentType } from './models/enums';
import { UserService } from './user.service';
import { TranslationService } from './translation.service';
import {
  CollaborationProject,
  GalleryItemModel,
  LocalizedText,
  PersonalProjectModel,
  resolveLocalizedText,
} from './models/project.models';

/** Risposta di GET /portfolio: tutti i dati del sito in una sola chiamata */
interface PortfolioResponse {
  collaborations: CollaborationProject[];
  personal: PersonalProjectModel[];
  gallery: GalleryItemModel[];
  profile: any | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  http: HttpClient = inject(HttpClient);
  userService: UserService = inject(UserService);
  translateService: TranslationService = inject(TranslationService);


  private portfolioEndpoint: string = environment.baseUrl+environment.portfolioUrl;

  /** true dopo la prima risposta (o errore) di GET /portfolio */
  loaded: WritableSignal<boolean> = signal(false);
  private resolveLoaded!: () => void;
  private loadedPromise: Promise<void> = new Promise(resolve => this.resolveLoaded = resolve);

  collaborations: WritableSignal<CollaborationProject[]> = signal([]);
  personalProjects: WritableSignal<PersonalProjectModel[]> = signal([]);
  galleryItems: WritableSignal<GalleryItemModel[]> = signal([]);

  /** Opere della galleria nella lingua corrente (id = indice, usato dalla route detail/:id) */
  contents: Signal<Content[]> = computed(() => {
    const lang = this.translateService.currentLanguage();
    return this.galleryItems()
      .filter(item => item.visible !== false)
      .map((item, index) => this.createContent(item, index, lang));
  });

  contentToView: WritableSignal<Content | null> = signal(null);

  filter: WritableSignal<string> = signal('');

  setFilter(f: string): void{
    localStorage.setItem(StorageKey.FILTER, f)
    this.filter.set(f);
  }

  filteredContent: Signal<Content[]> = computed(() => {
    const f = this.filter()?.toLowerCase().trim();
    const all = this.contents();
    if (!f || f === 'all' || f === 'gallery') {
      return all
        .filter(c => c.type === Type.ILLUSTRATION || c.type === Type.CHARACTER)
        .sort((a, b) => a.position - b.position);
    }
    const targetType = normalizeContentType(f);
    return all
      .filter(c => c.type === targetType || f.includes(c.type))
      .sort((a, b) => a.position - b.position);
  });

  /** Progetto (collaborazione o personale) per slug: gli id sono univoci tra le due liste */
  getProject(id: string): CollaborationProject | PersonalProjectModel | undefined {
    return this.collaborations().find(p => p.id === id) || this.personalProjects().find(p => p.id === id);
  }

  /**
   * Progetto mostrabile: visibile, con titolo, almeno una tavola, la copertina (personali)
   * e almeno una foto nella bustina (collaborazioni). Il BE invia già solo i progetti completi
   * (traduzioni incluse, vedi BACKEND_CONTRACT.md §7): questo è un controllo di sicurezza.
   */
  isPublishable(project: CollaborationProject | PersonalProjectModel): boolean {
    if (project.visible === false) return false;
    if (!resolveLocalizedText(project.title)) return false;
    if (!project.viewer?.slides?.length) return false;
    return project.type === 'collaboration'
      ? project.previewImages?.length > 0
      : !!project.coverUrl;
  }

  /** Il progetto esiste ed è mostrabile (usato dalla guard del Project Viewer) */
  canOpenProject(id: string): boolean {
    const project = this.getProject(id);
    return !!project && this.isPublishable(project);
  }

  /** Si risolve quando i dati del portfolio sono arrivati (usato dalle guard) */
  whenLoaded(): Promise<void> {
    return this.loadedPromise;
  }

  /** Testo localizzato nella lingua corrente (legge il signal della lingua, quindi è reattivo) */
  resolveText(text?: LocalizedText | null): string {
    const lang = this.translateService.currentLanguage() === 'en' ? 'en' : 'it';
    return resolveLocalizedText(text, lang);
  }


  private hasRefresh: boolean = environment.hasRefresh;
  private refreshTime: number = environment.refreshTime*1000 //in millisecondi


  constructor(){
    this.getPortfolio()
    if(this.hasRefresh)
      interval(this.refreshTime).subscribe(() => {
      this.getPortfolio()
    });
  }


  setContentToView(content: Content): void{
    this.contentToView.set(content);
  }


  clearContentToView(): void{
    this.contentToView.set(null);
  }


  getNextContent(actualCont: Content): Content{
    let nextIndex = this.filteredContent().indexOf(actualCont)+1;
    nextIndex = nextIndex > this.getMaxContentsIndex() ? 0 : nextIndex;

    let nextContent: Content = this.filteredContent().at(nextIndex)!;
    nextContent = nextContent ? nextContent : this.contentToView()!;

    return nextContent;
  }


  getPrevContent(actualCont: Content): Content{
    let prevIndex: number = this.filteredContent().indexOf(actualCont)-1;
    prevIndex = prevIndex < 0 ? this.getMaxContentsIndex() : prevIndex;

    let prevContent: Content = this.filteredContent().at(prevIndex)!;
    prevContent = prevContent ? prevContent : this.contentToView()!;

    return prevContent;
  }


  getPortfolio(): void {
    this.http.get<PortfolioResponse>(this.portfolioEndpoint).subscribe({
      next: (res) => {
        if (res.profile) {
          this.userService.setUserByClaudinary(res.profile);
        }

        // aggiorna i signal solo se i dati sono cambiati (evita re-render col polling)
        this.setIfChanged(this.collaborations, res.collaborations || []);
        this.setIfChanged(this.personalProjects, res.personal || []);
        this.setIfChanged(this.galleryItems, res.gallery || []);
        this.markLoaded();
      },
      error: (err) => {
        console.error('Errore caricamento portfolio:', err);
        this.markLoaded();
      }
    });
  }


  private markLoaded(): void {
    this.loaded.set(true);
    this.resolveLoaded();
  }


  private setIfChanged<T>(target: WritableSignal<T>, value: T): void {
    if (JSON.stringify(target()) !== JSON.stringify(value)) {
      target.set(value);
    }
  }


  private createContent(item: GalleryItemModel, id: number, lang: string): Content{
    const language = lang === 'en' ? 'en' : 'it';

    return {
      id: id,
      imageUrl: item.imageUrl,
      title: resolveLocalizedText(item.title, language),
      description: resolveLocalizedText(item.description, language),
      type: normalizeContentType(item.category),
      position: item.order ?? 0,
      isGif: item.isGif ?? false,
    };
  }


  private getMaxContentsIndex(): number{
    return this.filteredContent().length - 1;
  }

}
