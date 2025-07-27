import { Component, inject, OnInit } from '@angular/core';
import { CustomButton, User } from '../../services/models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment/environment';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { ButtonService } from '../../services/button.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  iconService: IconService = inject(IconService);
  buttonService: ButtonService = inject(ButtonService);

  instaram = environment.user.instagram;

  // interval: number = 5*1000;
  // logoIndex: number = 0;
  logo: string = `assets/logo/logo.png`

  user: User = environment.user;
  year: number = new Date().getFullYear()

  buttons: CustomButton[] = this.buttonService.buttons;


  ngOnInit(): void {
    // interval(this.interval).subscribe(() => {
    //   this.logoIndex++
    //   this.logoIndex = this.logoIndex > 3 ? 0 : this.logoIndex
    //   this.logo = `assets/logo/logo${this.logoIndex}.png`;
    // })
  }


  trackById(item: any): number {
    return item.id;
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }

}
