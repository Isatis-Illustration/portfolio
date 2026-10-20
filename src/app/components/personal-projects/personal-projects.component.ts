import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface PersonalProject {
  key: string;
  title: string;
  badge: string;
  description: string;
  coverUrl: string;
  backColor: string;
  frontColor: string;
  stitchColor: string;
  c1Color: string;
  c2Color: string;
  c3Color: string;
}

@Component({
  selector: 'app-personal-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './personal-projects.component.html',
  styleUrl: './personal-projects.component.css'
})
export class PersonalProjectsComponent {
  private router = inject(Router);

  projects: PersonalProject[] = [
    {
      key: 'piccolo-bosco',
      title: 'Il Piccolo Bosco',
      badge: 'Serie Illustrata',
      description: 'Cartoline e studi di atmosfera dedicati ai piccoli abitanti di una foresta incantata.',
      coverUrl: 'assets/home/illustration_it.png',
      backColor: '#c3d3bd',
      frontColor: '#f4dfae',
      stitchColor: '#fffaf2',
      c1Color: '#f3d6dd',
      c2Color: '#dce8f1',
      c3Color: '#fbedd2'
    },
    {
      key: 'storie-buonanotte',
      title: 'Storie della Buonanotte',
      badge: 'Albo Illustrato',
      description: 'Una raccolta di tavole notturne sui sogni, le stelle e gli animali dormiglioni.',
      coverUrl: 'assets/home/character.png',
      backColor: '#b8d4e3',
      frontColor: '#fce1d2',
      stitchColor: '#fffaf2',
      c1Color: '#dce8f1',
      c2Color: '#f3d6dd',
      c3Color: '#fbedd2'
    },
    {
      key: 'viaggio-lunare',
      title: 'Viaggio Lunare',
      badge: 'Character Design',
      description: 'Esplorazioni grafiche e personaggi fantastici in viaggio verso paesaggi magici.',
      coverUrl: 'assets/home/profile_it.png',
      backColor: '#e8d0db',
      frontColor: '#d5e5d5',
      stitchColor: '#fffaf2',
      c1Color: '#fbedd2',
      c2Color: '#dce8f1',
      c3Color: '#f3d6dd'
    }
  ];

  get gridClass(): string {
    const count = this.projects.length;
    if (count === 1) {
      return 'flex justify-center items-start';
    }
    if (count === 2) {
      return 'flex flex-col md:flex-row items-start justify-center gap-10 sm:gap-12 lg:gap-14';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 items-start justify-items-center';
  }

  openProject(key: string): void {
    this.router.navigate(['/project', key]);
  }
}
