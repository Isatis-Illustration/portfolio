import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Language, StorageKey } from './models/enums';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  http: HttpClient = inject(HttpClient);


  currentLanguage: WritableSignal<string> = signal('it');
  private translations: any = {}
  private basePath: string = 'assets/i18n/'


   loadLanguage(lang: string): Promise<void> {
    return this.http
      .get<Record<string,string>>(`${this.basePath}${lang}.json`)
      .toPromise()
      .then(json => {
        this.translations = json;
        this.currentLanguage.set(lang);
        localStorage.setItem(StorageKey.LANGUAGE, lang);
      })
      .catch(err => {
        console.error(`Errore caricando la lingua ${lang}`, err);
        // Risolvi comunque per non bloccare l’avvio
      });
  }

  translate(value: string): string{
    return this.translations[value] || value;
  }


  toggleLanguage(): void{
    const newLang: Language = this.currentLanguage() === Language.IT ? Language.EN : Language.IT;
    this.loadLanguage(newLang);
  }

  getOtherLang(): string {
    return this.currentLanguage() === Language.IT ? Language.EN : Language.IT;
  }
}
