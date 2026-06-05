import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'gallery/:filter',
                loadComponent: () => import('./components/gallery/gallery.component').then(m => m.GalleryComponent),
            },
            {
                path: 'profile',
                loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
            },
            {
                path: 'contacts',
                loadComponent: () => import('./components/contacts/contacts.component').then(m => m.ContactsComponent),
            },
            {
                path: 'detail/:id',
                loadComponent: () => import('./components/card-detail/card-detail.component').then(m => m.CardDetailComponent),
            },
            {
                path: 'privacy-policy',
                loadComponent: () => import('./components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
            }
        ]
    }
];
