/**
 * =====================================================================
 * MODELLI DATI PORTFOLIO ISABELLA LAURENZI (ISATIS ILLUSTRATION)
 * =====================================================================
 * Progettati per supportare personalizzazione totale da Backend / App Mobile.
 */

/**
 * Testo localizzato bilingue (IT / EN).
 * Accetta sia oggetto bilingue completo che stringa semplice come fallback.
 */
export type LocalizedText =
  | {
      it: string;
      en: string;
    }
  | string;

/**
 * Utility per estrarre la lingua desiderata da LocalizedText
 */
export function resolveLocalizedText(
  text?: LocalizedText | null,
  lang: 'it' | 'en' = 'it'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.it || text.en || '';
}

/**
 * Palette colori feltro per la bustina Collaborazione (Home)
 */
export interface CollabPouchColors {
  /** Colore esadecimale feltro posteriore (es. '#b7c8da') */
  back: string;
  /** Colore esadecimale feltro frontale con apertura sagomata (es. '#f2c7d0') */
  front: string;
  /** Colore esadecimale cuciture tratteggiate (es. '#fff9f4') */
  stitch: string;
}

/**
 * Singola immagine di anteprima che sbuca a ventaglio dalla bustina nella Home
 */
export interface CollabPreviewImage {
  id?: number | string;
  /** URL immagine (Cloudinary, storage cloud o CDN) */
  url: string;
  /** Didascalia facoltativa scritta sotto la foto polaroid */
  caption?: LocalizedText;
  /**
   * true = inserita in polaroid rettangolare bianca
   * false = immagine sagomata/trasparente senza bordo
   */
  hasBg: boolean;
  /** Ordine di apparizione nel ventaglio da sinistra a destra (1, 2, 3...) */
  order: number;
}

/**
 * Tavola / Slide visualizzabile all'interno del Project Viewer
 */
export interface ViewerSlide {
  id: number | string;
  /** URL immagine ad alta risoluzione */
  imageUrl: string;
  /** Titolo o didascalia della tavola mostrata nel footer */
  title?: LocalizedText;
  /**
   * true (default) = tavola su foglio bianco con ombra
   * false = immagine libera senza foglio (es. PNG trasparente)
   */
  hasBg?: boolean;
  /** Ordine sequenziale di scorrimento verticale (1, 2, 3...) */
  order: number;
}

/**
 * Configurazione header superiore del Project Viewer
 */
export interface ViewerHeaderConfig {
  /** Titolo testuale mostrato al centro */
  title: LocalizedText;
  /**
   * URL opzionale immagine/logo: se valorizzato SOSTITUISCE il titolo testuale
   * nell'header del viewer (es. logo Slap-It). L'header mostra solo titolo o logo.
   */
  headerImageUrl?: string | null;
}

/**
 * MODELLO PROGETTO COLLABORAZIONE (Sezione Home)
 */
export interface CollaborationProject {
  /** Identificativo univoco/slug per URL route (es. 'slap-it', 'navarra') */
  id: string;
  type: 'collaboration';
  /** Titolo principale stampato sulla bustina */
  title: LocalizedText;
  /** Breve descrizione o sottotitolo stampato sulla bustina */
  shortText: LocalizedText;
  /** Colori esadecimali per tutte le parti del sacchetto di feltro */
  colors: CollabPouchColors;
  /** Immagini che sbucano a ventaglio (numero dinamico, con/senza sfondo) */
  previewImages: CollabPreviewImage[];
  /** Configurazione e slide per il lettore a tutta pagina (Project Viewer) */
  viewer: {
    header: ViewerHeaderConfig;
    slides: ViewerSlide[];
  };
  /** Ordine di apparizione nella griglia della Home */
  order: number;
  /** Flag visibilità (attivabile/disattivabile da app mobile) */
  visible: boolean;
}

/**
 * Palette colori feltro per la bustina Progetto Personale
 */
export interface PersonalPouchColors {
  /** Colore esadecimale feltro posteriore (es. '#c3d3bd') */
  back: string;
  /** Colore esadecimale feltro frontale (es. '#f4dfae') */
  front: string;
  /** Colore esadecimale cuciture tratteggiate (es. '#fffaf2') */
  stitch: string;
  /** Colore card estetica interna 1 (sinistra, es. '#f3d6dd') */
  c1: string;
  /** Colore card estetica interna 2 (centro, es. '#dce8f1') */
  c2: string;
  /** Colore card estetica interna 3 (destra, es. '#fbedd2') */
  c3: string;
}

/**
 * MODELLO PROGETTO PERSONALE (Sezione Progetti Personali)
 */
export interface PersonalProjectModel {
  /** Identificativo univoco/slug per URL route (es. 'piccolo-bosco') */
  id: string;
  type: 'personal';
  /** Titolo principale stampato sotto la bustina */
  title: LocalizedText;
  /** Breve descrizione o sottotitolo stampato sotto la bustina */
  shortText: LocalizedText;
  /** Etichetta badge sulla bustina (es. 'Serie Illustrata', 'Albo Illustrato') */
  badge: LocalizedText;
  /** URL immagine cartolina al centro della bustina */
  coverUrl: string;
  /** true (default) = cartolina con cartoncino bianco; false = immagine libera (es. PNG trasparente) */
  coverHasBg?: boolean;
  /** Colori esadecimali di tutte le parti in feltro e delle card estetiche interne */
  colors: PersonalPouchColors;
  /** Configurazione e slide per il lettore a tutta pagina (Project Viewer) */
  viewer: {
    header: ViewerHeaderConfig;
    slides: ViewerSlide[];
  };
  /** Ordine di apparizione nella pagina Progetti Personali */
  order: number;
  /** Flag visibilità */
  visible: boolean;
}

/**
 * MODELLO ITEM GALLERIA (Sezione Galleria unificata)
 */
export interface GalleryItemModel {
  id: number | string;
  imageUrl: string;
  title: LocalizedText;
  description?: LocalizedText;
  /** Categoria facoltativa per filtri futuri (es. 'illustration', 'character') */
  category?: string;
  /** Posizione ordinamento sequenziale crescente (1, 2, 3...) */
  order: number;
  isGif?: boolean;
  /** Se false l'opera non viene mostrata (oscurata dall'app). Il BE oggi esclude già le opere nascoste. */
  visible?: boolean;
}
