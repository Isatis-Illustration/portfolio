// src/app/shared/directives/masonry.directive.ts

import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import Masonry from 'masonry-layout';

@Directive({
  selector: '[appMasonry]'
})
export class MasonryDirective implements AfterViewInit {
  private masonry: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.masonry = new Masonry(this.el.nativeElement, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
        gutter: 16,  // spazio di 16px tra colonne e righe
    });
  }
  
}