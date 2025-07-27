import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ContactsComponent } from './components/contacts/contacts.component';

export const routes: Routes = [
    {
        path:"",
        pathMatch:"full",
        redirectTo:"home"
    },
    {
        path:"home",
        component: HomeComponent,
    },
    {
        path:"gallery/:filter",
        component: GalleryComponent,
    },
    {
        path:"profile",
        component: ProfileComponent,
    },
    {
        path:"contacts",
        component: ContactsComponent,
    },
    {
        path:"detail/:id",
        component: CardDetailComponent,
    }
];
