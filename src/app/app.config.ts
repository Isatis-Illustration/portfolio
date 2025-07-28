import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation } from '@angular/router';
// src/app/app.config.ts
import { TranslationService } from './services/translation.service';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { Language, StorageKey } from './services/models/enums';

/**
 * Factory che Angular esegue prima del bootstrap:
 * restituisce una funzione che ritorna la Promise di caricamento JSON.
 */
export function initTranslations(ts: TranslationService): () => Promise<void> {
  return () => {
    // qui puoi anche leggere navigator.language o un cookie
    const defaultLang = localStorage.getItem(StorageKey.LANGUAGE) || Language.IT;
    return ts.loadLanguage(defaultLang);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withEnabledBlockingInitialNavigation(), withHashLocation()),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslations,
      deps: [TranslationService],
      multi: true
    }
  ],
};
