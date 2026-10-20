import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UserService } from '../../services/user.service';
import { User } from '../../services/models/models';

@Component({
  selector: 'app-privacy-policy',
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {

  userService: UserService = inject(UserService);

  user: Signal<User> = computed(() => this.userService.user())

  year: number = new Date().getFullYear();

  /** Campi del modulo di contatto */
  formDataKeys: string[] = [
    'PRIVACY_DATA_COLLECTED_ITEMS_NAME',
    'PRIVACY_DATA_COLLECTED_ITEMS_EMAIL',
    'PRIVACY_DATA_COLLECTED_ITEMS_SUBJECT',
    'PRIVACY_DATA_COLLECTED_ITEMS_MESSAGE',
  ];

  /**
   * Servizi esterni usati dal sito: tenere allineato a come è costruito
   * (hosting GitHub Pages, backend Vercel, Gmail per il modulo, Google Fonts, immagini Cloudinary).
   */
  providers = [
    { name: 'GitHub (GitHub Pages)', roleKey: 'PRIVACY_PROVIDER_GITHUB', privacyUrl: 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement' },
    { name: 'Vercel', roleKey: 'PRIVACY_PROVIDER_VERCEL', privacyUrl: 'https://vercel.com/legal/privacy-policy' },
    { name: 'Google (Gmail, Google Fonts)', roleKey: 'PRIVACY_PROVIDER_GOOGLE', privacyUrl: 'https://policies.google.com/privacy' },
    { name: 'Cloudinary', roleKey: 'PRIVACY_PROVIDER_CLOUDINARY', privacyUrl: 'https://cloudinary.com/privacy' },
  ];

  rightKeys: string[] = [
    'PRIVACY_RIGHTS_LIST_ACCESS',
    'PRIVACY_RIGHTS_LIST_RECTIFICATION',
    'PRIVACY_RIGHTS_LIST_DELETION',
    'PRIVACY_RIGHTS_LIST_LIMITATION',
    'PRIVACY_RIGHTS_LIST_OPPOSITION',
    'PRIVACY_RIGHTS_LIST_PORTABILITY',
  ];

  references = [
    { labelKey: 'PRIVACY_REFERENCES_GDPR', url: 'https://gdpr-info.eu/' },
    { labelKey: 'PRIVACY_REFERENCES_ART6', url: 'https://gdpr-info.eu/art-6-gdpr/' },
    { labelKey: 'PRIVACY_REFERENCES_ART13', url: 'https://gdpr-info.eu/art-13-gdpr/' },
    { labelKey: 'PRIVACY_REFERENCES_ART28', url: 'https://gdpr-info.eu/art-28-gdpr/' },
    { labelKey: 'PRIVACY_REFERENCES_GARANTE', url: 'https://www.garanteprivacy.it/' },
    { labelKey: 'PRIVACY_REFERENCES_COPYRIGHT', url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1941-04-22;633' },
  ];
}
