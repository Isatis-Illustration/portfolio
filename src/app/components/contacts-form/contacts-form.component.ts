import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../services/models/models';
import { EmailService } from '../../services/email.service';
import { environment } from '../../environment/environment';
import { noWhitespaceValidator } from '../../validators/noWitheSpace';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PrivacyPolicyTooltipComponent } from "../privacy-policy-tooltip/privacy-policy-tooltip.component";

@Component({
  selector: 'app-contacts-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    PrivacyPolicyTooltipComponent
],
  templateUrl: './contacts-form.component.html',
  styleUrl: './contacts-form.component.css'
})
export class ContactsFormComponent {

  emailService: EmailService = inject(EmailService);
  iconService: IconService = inject(IconService);
  router: Router = inject(Router);

  image: string = environment.icons.contactImg;
  isSending: boolean = false;
  formFeedback: string = '';

  contact: Contact = {name: '', email: '', subject: '', message: ''};  
  userForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email, noWhitespaceValidator()]),
    subject: new FormControl(''),
    message: new FormControl('', [Validators.required, noWhitespaceValidator()]),
  });

  onSubmit() {
    console.log("inviata")
    this.isSending = true;
    const contact: Contact = this.userForm.value;

    this.emailService.sendContact(contact).subscribe({
      next: res => {
        this.isSending = false;
        this.userForm.reset();
        this.formFeedback = 'FORM_SUCCESS'
      },
      error: err =>{
        this.isSending = false;
        this.formFeedback = 'FORM_ERROR'
      }
    });
  }

  getSendText(): string{
    return this.isSending ? 'FORM_SENDING' : 'FORM_SUBMIT'
  }

  goToPolicy(): void{
    this.router.navigate(['privacy-policy'])
  }

  isButtonDisabled(): Boolean{
    return this.userForm.invalid || this.isSending;
  }

  isRequiredValid(name: string): boolean | undefined{
    return !(this.userForm.get(name)?.invalid && this.userForm.get(name)?.touched);
  }

  getIcon(name: string): SafeHtml{
    return this.iconService.getIcon(name);
  }
}
