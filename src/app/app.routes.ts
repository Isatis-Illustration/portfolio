import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { GalleryComponent } from './components/gallery/gallery.component';

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
        path:"gallery",
        component: GalleryComponent,
    },
    {
        path:"detail/:id",
        component: CardDetailComponent,
    }
];
