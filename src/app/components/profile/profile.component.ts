import { Component } from '@angular/core';
import { environment } from '../../environment/environment';
import { User } from '../../services/models/models';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: User = environment.user
}
