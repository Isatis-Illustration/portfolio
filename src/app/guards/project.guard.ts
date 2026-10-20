import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContentService } from '../services/content.service';

/**
 * Il Project Viewer non deve mai aprirsi vuoto: attende i dati del portfolio e lascia passare
 * solo se il progetto esiste ed è mostrabile (ContentService.isPublishable, che richiede almeno
 * una tavola). Altrimenti torna alla pagina delle bustine (Progetti Personali per un progetto
 * personale, Home negli altri casi).
 */
export const projectGuard: CanActivateFn = async (route) => {
  const contentService = inject(ContentService);
  const router = inject(Router);

  await contentService.whenLoaded();

  const key = route.paramMap.get('key')?.toLowerCase() ?? '';
  if (contentService.canOpenProject(key)) {
    return true;
  }

  const isPersonal = contentService.personalProjects().some(p => p.id === key);
  return router.parseUrl(isPersonal ? '/personal-projects' : '/home');
};
