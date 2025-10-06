import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-privacy-policy-tooltip',
  imports: [
    TranslatePipe
  ],
  templateUrl: './privacy-policy-tooltip.component.html',
  styleUrl: './privacy-policy-tooltip.component.css'
})
export class PrivacyPolicyTooltipComponent {

}
