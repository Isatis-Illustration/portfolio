# Specifiche Backend & Contratto Dati per App Mobile (Portfolio Isabella Laurenzi)

Questo documento definisce il contratto dati JSON che il **Backend** (alimentato da un'**App Mobile** o CMS gestionale) deve inviare al Frontend Angular del portfolio.

> **Stato attuale:** contratto implementato nel backend (`cloudinary-backend`). Le interfacce TypeScript corrispondenti sono in `src/app/services/models/project.models.ts`. Il Frontend usa un solo endpoint aggregato, `GET /api/portfolio` (vedi §7), che restituisce in una chiamata gli stessi payload degli endpoint dedicati. Il Frontend non ha contenuti di riserva: Home e Progetti Personali mostrano un loader finché `/api/portfolio` non risponde, e la route `#/project/:id` si apre solo se il progetto esiste e ha almeno una slide (altrimenti si torna alla pagina delle bustine).

---

## 1. Principi Generali

1. **Endpoint REST dedicati**: Il Frontend riceve payload JSON strutturati completi (`/api/projects/collaborations`, `/api/projects/personal`, `/api/gallery`), disponibili anche tutti insieme in `/api/portfolio`.
2. **Supporto Multilingua (IT / EN)**: Tutti i testi (titoli, descrizioni, badge, didascalie) possono essere inviati come oggetto bilingue `{ "it": "...", "en": "..." }` oppure come stringa singola.
3. **Colori in formato HEX**: Tutte le parti in feltro e le card interne accettano codici esadecimali validi (es. `#b7c8da`, `#f2c7d0`).
4. **Header Viewer (Titolo vs Foto/Logo)**: Nel lettore tavole (Project Viewer), se `headerImageUrl` è valorizzato, l'immagine sostituisce il titolo testuale; altrimenti viene mostrato `title`. Per "nessun logo" si può omettere il campo oppure inviare `null`. L'header del viewer non mostra altro (niente badge né descrizione).
5. **Galleria unificata**: Illustrazioni e Character Design sono stati unificati in un'unica griglia con ordinamento numerico crescente.
6. **Slug univoci globali**: Collaborazioni e Progetti Personali condividono la stessa route `#/project/:id`, quindi gli `id` devono essere univoci **tra entrambe le tipologie** (non solo all'interno della propria lista).

---

## 2. Tipologie Dati di Base

### LocalizedText
```typescript
type LocalizedText = {
  it: string;
  en: string;
} | string;
```
*Esempio bilingue:*
```json
{
  "it": "Slap-It",
  "en": "Slap-It"
}
```

---

## 3. Progetti Collaborazione (Home)

**Endpoint consigliato:** `GET /api/projects/collaborations`  
Rappresenta le bustine di feltro animate nella Home, con foto a ventaglio che sbucano dall'interno e lettore a tutta pagina dedicato.

### Schema JSON Collaborazione
```json
{
  "id": "slap-it",
  "type": "collaboration",
  "title": {
    "it": "Slap-It",
    "en": "Slap-It"
  },
  "shortText": {
    "it": "Illustrazioni & character design",
    "en": "Illustrations & character design"
  },
  "colors": {
    "back": "#b7c8da",
    "front": "#f2c7d0",
    "stitch": "#fff9f4"
  },
  "previewImages": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/.../tavola1.png",
      "caption": {
        "it": "Personaggi Principali",
        "en": "Main Characters"
      },
      "hasBg": true,
      "order": 1
    },
    {
      "id": 2,
      "url": "https://res.cloudinary.com/.../adesivo.png",
      "caption": {
        "it": "Adesivo Sagomato",
        "en": "Die-cut Sticker"
      },
      "hasBg": false,
      "order": 2
    }
  ],
  "viewer": {
    "header": {
      "title": {
        "it": "Slap-It",
        "en": "Slap-It"
      },
      "headerImageUrl": "https://res.cloudinary.com/.../slap-it-logo.png"
    },
    "slides": [
      {
        "id": 101,
        "imageUrl": "https://res.cloudinary.com/.../slide_01.jpg",
        "title": {
          "it": "Tavola 1 — Panoramica sticker",
          "en": "Plate 1 — Sticker Overview"
        },
        "order": 1
      },
      {
        "id": 102,
        "imageUrl": "https://res.cloudinary.com/.../slide_02.jpg",
        "title": {
          "it": "Tavola 2 — Dettaglio personaggi",
          "en": "Plate 2 — Characters Detail"
        },
        "order": 2
      }
    ]
  },
  "order": 1,
  "visible": true
}
```

### Dettaglio Campi Collaborazione
| Campo | Tipo | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Sì | Slug univoco usato nella URL di routing (`#/project/slap-it`). Caratteri minuscoli e trattini. |
| `type` | `"collaboration"` | Sì | Discriminatore tipologia progetto. |
| `title` | `LocalizedText` | Sì | Titolo stampato sul fronte della bustina. |
| `shortText` | `LocalizedText` | Sì | Sottotitolo breve stampato sotto il titolo del sacchetto. |
| `colors.back` | `string` (HEX) | Sì | Colore del feltro posteriore (es. `#b7c8da`). |
| `colors.front` | `string` (HEX) | Sì | Colore del feltro frontale con apertura (es. `#f2c7d0`). |
| `colors.stitch`| `string` (HEX) | Sì | Colore del filo delle cuciture tratteggiate (es. `#fff9f4`). |
| `previewImages`| `Array` | Sì | Immagini che sbucano a ventaglio dalla tasca (da 1 a **massimo 6**, eventuali immagini oltre la sesta vengono ignorate). Il ventaglio si centra sul numero di foto: ogni foto in più si aggiunge a destra e il gruppo si ricentra; più sono, più si stringono. |
| `previewImages[].id` | `number` o `string` | No | Identificativo dell'immagine (usato per il tracking del rendering). |
| `previewImages[].url` | `string` (URL) | Sì | URL diretta dell'immagine (Cloudinary o CDN). |
| `previewImages[].caption` | `LocalizedText` | No | Testo scritto sotto la foto stile polaroid (se `hasBg: true`). |
| `previewImages[].hasBg` | `boolean` | Sì | `true` = cornice polaroid bianca; `false` = immagine sagomata/raw senza cornice. |
| `previewImages[].order` | `number` | Sì | Posizione nel ventaglio da sinistra a destra (1, 2, 3...). |
| `viewer.header.title` | `LocalizedText` | Sì | Titolo testuale nel viewer (usato come fallback o attributo alt). |
| `viewer.header.headerImageUrl` | `string` (URL) o `null` | No | Se fornito, **sostituisce** il titolo testuale mostrando il logo/foto nell'header. |
| `viewer.slides` | `Array` | Sì | Sequenza delle tavole a tutta pagina da sfogliare verticalmente. |
| `viewer.slides[].id` | `number` o `string` | Sì | Identificativo univoco della tavola. |
| `viewer.slides[].imageUrl` | `string` (URL) | Sì | URL immagine ad alta risoluzione. |
| `viewer.slides[].hasBg` | `boolean` | No | `true` (default) = tavola su foglio bianco con ombra; `false` = immagine libera senza foglio (es. PNG trasparente). Dal context `bg` della tavola. |
| `viewer.slides[].title` | `LocalizedText` | No | Titolo della tavola, usato solo come testo alternativo (`alt`) dell'immagine: non viene mostrato a schermo. Il footer della tavola mostra solo "Tavola N". |
| `viewer.slides[].order` | `number` | Sì | Ordine di scorrimento verticale (1, 2, 3...). |
| `order` | `number` | Sì | Posizione nella griglia della Home (1 per primo sacchetto, 2 per secondo...). |
| `visible` | `boolean` | Sì | Se `false`, la bustina non viene mostrata sul sito. |

---

## 4. Progetti Personali

**Endpoint consigliato:** `GET /api/projects/personal`  
Rappresenta le bustine di feltro nella pagina `/personal-projects`, con cartolina di copertina centrale, card estetiche interne a comparsa morbida e lettore a tutta pagina.

### Schema JSON Progetto Personale
```json
{
  "id": "piccolo-bosco",
  "type": "personal",
  "title": {
    "it": "Il Piccolo Bosco",
    "en": "The Little Forest"
  },
  "shortText": {
    "it": "Cartoline e studi di atmosfera dedicati ai piccoli abitanti di una foresta incantata.",
    "en": "Postcards and mood studies dedicated to the little inhabitants of an enchanted forest."
  },
  "badge": {
    "it": "Serie Illustrata",
    "en": "Illustrated Series"
  },
  "coverUrl": "https://res.cloudinary.com/.../cover_bosco.png",
  "colors": {
    "back": "#c3d3bd",
    "front": "#f4dfae",
    "stitch": "#fffaf2",
    "c1": "#f3d6dd",
    "c2": "#dce8f1",
    "c3": "#fbedd2"
  },
  "viewer": {
    "header": {
      "title": {
        "it": "Il Piccolo Bosco",
        "en": "The Little Forest"
      },
      "headerImageUrl": null
    },
    "slides": [
      {
        "id": 201,
        "imageUrl": "https://res.cloudinary.com/.../bosco_01.jpg",
        "title": {
          "it": "Il Piccolo Bosco — Atmosfera",
          "en": "The Little Forest — Mood"
        },
        "order": 1
      },
      {
        "id": 202,
        "imageUrl": "https://res.cloudinary.com/.../bosco_02.jpg",
        "title": {
          "it": "Il Piccolo Bosco — Dettagli",
          "en": "The Little Forest — Details"
        },
        "order": 2
      }
    ]
  },
  "order": 1,
  "visible": true
}
```

### Dettaglio Campi Progetto Personale
| Campo | Tipo | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Sì | Slug univoco per routing URL (`#/project/piccolo-bosco`). |
| `type` | `"personal"` | Sì | Discriminatore tipologia progetto. |
| `title` | `LocalizedText` | Sì | Titolo principale della bustina. |
| `shortText` | `LocalizedText` | Sì | Descrizione testuale mostrata sotto la bustina. |
| `badge` | `LocalizedText` | Sì | Etichetta pill (es. "Serie Illustrata", "Albo Illustrato", "Character Design"). |
| `coverUrl` | `string` (URL) | Sì | Immagine centrale tipo cartolina di presentazione della bustina. |
| `coverHasBg` | `boolean` | No | `true` (default) = cartolina con cartoncino bianco; `false` = immagine libera (es. PNG trasparente). Dal context `bg` della copertina. |
| `colors.back` | `string` (HEX) | Sì | Colore feltro posteriore. |
| `colors.front` | `string` (HEX) | Sì | Colore feltro frontale. |
| `colors.stitch`| `string` (HEX) | Sì | Colore cuciture tratteggiate. |
| `colors.c1` | `string` (HEX) | Sì | Colore card estetica interna sinistra (sbuca leggermente in hover). |
| `colors.c2` | `string` (HEX) | Sì | Colore card estetica interna centrale. |
| `colors.c3` | `string` (HEX) | Sì | Colore card estetica interna destra. |
| `viewer` | `Object` | Sì | Configurazione identica al Project Viewer delle Collaborazioni (header con solo titolo/logo, slides). |
| `order` | `number` | Sì | Ordinamento nella griglia dei Progetti Personali. |
| `visible` | `boolean` | Sì | Flag visibilità attivabile dall'app mobile. |

---

## 5. Galleria (Unificata)

**Endpoint consigliato:** `GET /api/gallery` (oppure endpoint Cloudinary esistente)  
La galleria espone in un unico flusso visivo tutte le illustrazioni e i character design. Ha bisogno solo dei campi base e dell'ordinamento.

### Schema JSON Item Galleria
```json
[
  {
    "id": 1,
    "imageUrl": "https://res.cloudinary.com/.../artwork_01.jpg",
    "title": {
      "it": "Festa d'autunno",
      "en": "Autumn Festival"
    },
    "description": {
      "it": "Studio colore e texture a pastello digitale",
      "en": "Color and texture study in digital pastel"
    },
    "category": "illustration",
    "order": 1,
    "isGif": false,
    "visible": true
  },
  {
    "id": 2,
    "imageUrl": "https://res.cloudinary.com/.../character_01.gif",
    "title": {
      "it": "Folletto del muschio",
      "en": "Moss Pixie"
    },
    "description": {
      "it": "Animazione ciclo camminata",
      "en": "Walk cycle animation"
    },
    "category": "character",
    "order": 2,
    "isGif": true,
    "visible": true
  }
]
```

### Dettaglio Campi Galleria
| Campo | Tipo | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- |
| `id` | `number` o `string` | Sì | Identificativo univoco dell'opera. |
| `imageUrl` | `string` (URL) | Sì | URL diretta immagine o GIF ad alta risoluzione. |
| `title` | `LocalizedText` | Sì | Titolo dell'opera. |
| `description` | `LocalizedText` | No | Descrizione o tecnica artistica. |
| `category` | `string` | No | Categoria d'origine (`"illustration"`, `"character"`). Se assente vale `"illustration"`. La Galleria mostra **solo** gli elementi di queste due categorie. |
| `order` | `number` | Sì | Posizione sequenziale nell'elenco della Galleria (ordinamento crescente). |
| `isGif` | `boolean` | No | Se `true`, abilita eventuale ottimizzazione animazioni GIF. |
| `visible` | `boolean` | No | Se `false`, l'opera non viene mostrata. Le opere oscurate dall'app (context `hidden=1`) sono già escluse dal BE, che invia sempre `true`. |

---

## 6. Riepilogo Regole di Layout nel Frontend

Per aiutare lo sviluppo dell'App Mobile o del Backend, ecco come il Frontend reagisce al numero di elementi inviati:

1. **Home e Progetti Personali (Centratura Dinamica)**:
   - **1 elemento restituito**: La colonna è centrata al centro esatto dello schermo.
   - **2 elementi restituiti**: Entrambi gli elementi sono centrati affiancati (senza spazi vuoti asimmetrici).
   - **3 o più elementi**: Si attiva la griglia standard a 3 colonne su desktop, che si riempie partendo da sinistra.
2. **Galleria**:
   - Layout masonry: **1 colonna** sotto i 768px, **3 colonne** da 768px in su (`grid-cols-1 md:grid-cols-3`).
   - Gli elementi (ordinati per `order` crescente) vengono distribuiti per riga: 1° nella colonna sinistra, 2° in quella centrale, 3° a destra, 4° di nuovo a sinistra, ecc.
3. **Project Viewer**:
   - Lo scorrimento verticale snap rileva automaticamente il numero di `slides` inviate.
   - La scrollbar personalizzata con l'indicatore a goccia verde ricalcola proporzioni, altezza e tappe in tempo reale.

---

## 7. Endpoint aggregato e origine dei dati

**Endpoint usato dal Frontend:** `GET /api/portfolio`

```json
{
  "collaborations": [ /* CollaborationProject[] (§3) */ ],
  "personal": [ /* PersonalProjectModel[] (§4) */ ],
  "gallery": [ /* GalleryItemModel[] (§5) */ ],
  "profile": { "url": "...", "public_id": "...", "context": { "nick": "...", "...": "..." } }
}
```

- Una sola lettura Cloudinary per tutto il sito; la risposta è in cache sulla CDN Vercel (`s-maxage=60, stale-while-revalidate=300`), quindi una modifica fatta dall'app può impiegare qualche minuto a comparire.
- Il BE restituisce solo i progetti **visibili e completi**, già ordinati per `order`. Un progetto è completo se ha:
  - titolo in italiano **e** in inglese;
  - almeno una tavola (`viewer.slides`);
  - progetti personali: l'immagine di copertina (`role=cover`; non c'è più il ripiego sulla prima tavola);
  - collaborazioni: almeno una foto nella bustina (`previewImages`);
  - la traduzione di ogni testo compilato: `shortText`, `badge`, titolo dell'header del viewer, didascalie delle foto della bustina e titoli delle tavole. Un testo scritto in una sola lingua blocca la pubblicazione.

  La regola è `projectIssues()` in `cloudinary-backend/lib/projects.js` (copia nell'uploader in `services/project-issues.ts`, che mostra cosa manca). Il Frontend ripete un controllo strutturale (`ContentService.isPublishable`: titolo, tavole, copertina/foto della bustina) e non apre il viewer per progetti non mostrabili.
- `profile` è l'immagine Cloudinary con `caption = "user"` (stesso formato di prima), oppure `null`.

**Origine dei dati (tutto su Cloudinary):**

| Dato | Dove è salvato | Come si imposta dall'app |
| :--- | :--- | :--- |
| Titoli, `shortText`, `badge`, colori, header viewer, `order`, `visible` del progetto | File raw `portfolio/_config/projects.json` | Tab "Progetti" |
| Tavole del viewer (`viewer.slides`) | Immagini con context `project=<id>`, `role=slide`; ordine da `position`; `bg=1/0` per `hasBg` | Upload/modifica immagine → Destinazione "Progetto", ruolo "Tavola" |
| Anteprime a ventaglio (`previewImages`) | Immagini del progetto con `prev=1..6` (`role=slide` o `role=preview`), `bg=1/0` per `hasBg` | Striscia "Foto della bustina" nel progetto (aggiunta, riordino con drag, rimozione) oppure campi "Posizione nel ventaglio" + "Cornice polaroid" dell'immagine (solo collaborazioni) |
| `coverUrl` / `coverHasBg` (progetti personali) | Immagine con `role=cover` (`bg=1/0` per `coverHasBg`); se manca si usa la prima tavola | Ruolo "Copertina bustina" |
| `viewer.header.headerImageUrl` | Immagine con `role=logo`; se manca vale `null` | Ruolo "Logo header viewer" |
| Galleria | Immagini senza `project`, `type=i` (illustration) o `type=c` (character); ordine da `position`; `hidden=1` = oscurata (esclusa) | Tab Galleria / Upload; occhio sulla card o "Nascosta sul sito" per oscurarla |
| Testi delle immagini | `caption`/`alt` (IT) e `caption_en`/`alt_en` (EN, facoltativi) | Campi Title/Description IT e EN |

Se il testo EN manca o è uguale all'IT, il BE invia una stringa singola invece dell'oggetto `{ it, en }`.
