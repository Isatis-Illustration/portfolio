# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Portfolio site for illustrator Isabella Laurenzi (Isatis Illustration). Angular 19 (standalone components, signals), Tailwind CSS 4. UI text and code comments are in Italian.

## Commands

- `npm start`: dev server at http://localhost:4200
- `npm run build`: production build into `dist/portfolio/browser` (`baseHref: /portfolio/`). The bundle and `home.component.css` currently exceed the warning budgets; those warnings are expected.
- `npm test`: Karma/Jasmine. The schematics are set to `skipTests` and there are no spec files, so verify changes with a build.

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`. The `docs/` folder is an old build output, so don't edit it.

## Architecture

**Data source.** All content comes from one call: `ContentService.getCloudinaryImages()` → `GET {environment.baseUrl}/images`, an external Vercel backend in front of Cloudinary. Each image's Cloudinary `context` becomes a `Content` object in `createContent()`:
- `type`: comes from `context.type`, or from the middle segment of the filename (`name.type.position.ext`). It is normalized through `TYPE_ALIASES` in `models/enums.ts`, and the default is `illustration`.
- `position`: sort order.
- `prev`: order inside a Home pouch. Only images that have it are used as pouch previews.
- `bg`: `1`/`true` means the image gets a polaroid frame. The default is true.
- An image with `context.caption === 'user'` is not content. It fills the profile in `UserService`.

Components read slices of the `contents` signal: `filteredContent` (the gallery shows only `illustration` and `character`), `getContentsByType(key)` for the project viewer, and `getPouchPreviewsByType` for Home.

**Projects.** Collaboration projects (Home pouches: `slap-it`, `navarra`) and personal projects (`/personal-projects`) both open `project/:key` → `ProjectViewerComponent`. That component loads its slides with `getContentsByType(key)`. When the API returns nothing, Home, Project Viewer and Personal Projects fall back to hardcoded metadata and images.

**Planned backend contract.** `BACKEND_CONTRACT.md` and `services/models/project.models.ts` (`CollaborationProject`, `PersonalProjectModel`, `GalleryItemModel`, `LocalizedText`) describe the planned structured API. They are **not wired in yet**. Keep the contract, the models and the UI in sync when any of them changes. When the UI and the contract disagree because something was removed from the UI on purpose, update the docs instead of putting the element back.

**Routing/layout.** Routing uses hash location (`#/...`), and every route is lazy-loaded under `layout/shell`. On `/detail/` and `/project/` routes the shell becomes a full-height, non-scrolling layout without the footer.

**i18n.** `TranslationService` loads `assets/i18n/{it,en}.json` before bootstrap (`APP_INITIALIZER`). Templates use the impure `translate` pipe with UPPER_SNAKE keys, so add each new key to **both** JSON files. Language-specific images follow the `*_it.png` / `*_en.png` pattern, built from `currentLanguage()`.

**Styling.** The design tokens (palette `crema`, `verde-scuro`, `arancione`, `title`…, and the fonts `barriecito`/`fredoka`/`quicksand`) are defined in the `@theme` block of `src/styles.css`. The felt "pouch" visuals use CSS custom properties (`--back`, `--front`, `--stitch`, `--c1..--c3`) bound from component data, plus inline SVG filters and clip paths. Inline SVG icons live in `IconService`.

**Config.** `src/app/environment/environment.ts` holds the API base URL, the refresh polling settings and the default profile data.

## Communication

From `.agents/rules/comunication.md`: short sentences, no filler or preamble, no narration. Run the tools, show the result, stop.
