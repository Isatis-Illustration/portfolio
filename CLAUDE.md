# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Portfolio site for illustrator Isabella Laurenzi (Isatis Illustration). Angular 19 (standalone components, signals), Tailwind CSS 4. UI text and code comments are in Italian.

## Commands

- `npm start`: dev server at http://localhost:4200
- `npm run build`: production build into `dist/portfolio/browser` (`baseHref: /portfolio/`). The bundle and `home.component.css` currently exceed the warning budgets; those warnings are expected.
- `npm test`: Karma/Jasmine. The schematics are set to `skipTests` and there are no spec files, so verify changes with a build.

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`. The `docs/` folder is an old build output, so don't edit it.

## Architecture

**Data source.** All content comes from one call: `ContentService.getPortfolio()` → `GET {environment.baseUrl}/portfolio`, an external Vercel backend (`cloudinary-backend`) in front of Cloudinary. The response is `{ collaborations, personal, gallery, profile }`, already shaped by the backend as described in `BACKEND_CONTRACT.md` (§3–§5, §7). The service keeps them in the `collaborations`, `personalProjects` and `galleryItems` signals (set only when the data changes, so polling does not re-render). `profile` (the Cloudinary image with `caption === 'user'`) fills `UserService`.

`contents` is a `computed` that maps `galleryItems` to `Content` in the current language (`id` is the index, used by `detail/:id`). The gallery reads `filteredContent` (only `illustration` and `character`). `resolveText()` resolves a `LocalizedText` in the current language and is reactive because it reads `currentLanguage()`.

**Projects.** Collaboration projects (Home pouches) and personal projects (`/personal-projects`) both open `project/:key` → `ProjectViewerComponent`, which finds the project with `getProject(key)` (ids are unique across both lists). Home maps `collaborations` to `ProjectFolder` (1–6 fan photos; their CSS position vars come from `fanLayout()` in `services/pouch-fan.ts`, which centers the fan on the photo count and shrinks the cards above 4; the uploader has a copy of that file, keep them in sync), Personal Projects maps `personalProjects` to `PersonalProject`, and the viewer builds its header and slides from `project.viewer`. Only complete projects are published: the backend filters them (`projectIssues()`: IT+EN title, at least one slide, cover for personal, at least one fan photo for collaborations, both languages for every filled text) and `ContentService.isPublishable()` repeats the structural part; the translation check can't be repeated here because the backend sends a plain string when IT and EN are equal. There is no hardcoded/mock content: Home and Personal Projects show the global `.loader` (in `styles.css`) until `ContentService.loaded()` is true. `project/:key` is protected by `guards/project.guard.ts`, which awaits `ContentService.whenLoaded()` and only lets the viewer open if `canOpenProject()` (project exists and `isPublishable`); otherwise it redirects to `/personal-projects` (personal project) or `/home`.

**Backend contract.** `BACKEND_CONTRACT.md` and `services/models/project.models.ts` (`CollaborationProject`, `PersonalProjectModel`, `GalleryItemModel`, `LocalizedText`) describe the API that the backend implements. Keep the contract, the models, the backend builders (`cloudinary-backend/lib/projects.js`) and the UI in sync when any of them changes. When the UI and the contract disagree because something was removed from the UI on purpose, update the docs instead of putting the element back.

**Routing/layout.** Routing uses hash location (`#/...`), and every route is lazy-loaded under `layout/shell`. On `/detail/` and `/project/` routes the shell becomes a full-height, non-scrolling layout without the footer.

**i18n.** `TranslationService` loads `assets/i18n/{it,en}.json` before bootstrap (`APP_INITIALIZER`). Templates use the impure `translate` pipe with UPPER_SNAKE keys, so add each new key to **both** JSON files. Language-specific images follow the `*_it.png` / `*_en.png` pattern, built from `currentLanguage()`.

**Styling.** The design tokens (palette `crema`, `verde-scuro`, `arancione`, `title`…, and the fonts `barriecito`/`fredoka`/`quicksand`) are defined in the `@theme` block of `src/styles.css`. The felt "pouch" visuals use CSS custom properties (`--back`, `--front`, `--stitch`, `--c1..--c3`) bound from component data, plus inline SVG filters and clip paths. Inline SVG icons live in `IconService`.

**Config.** `src/app/environment/environment.ts` holds the API base URL, the refresh polling settings and the default profile data.

## Communication

From `.agents/rules/comunication.md`: short sentences, no filler or preamble, no narration. Run the tools, show the result, stop.
