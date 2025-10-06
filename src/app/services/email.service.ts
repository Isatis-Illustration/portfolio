import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contact } from './models/models';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  http: HttpClient = inject(HttpClient);

  private sendEmailEndpoint: string = environment.baseUrl+environment.formUlr;
  

  sendContact(contact: Contact): Observable<string>{
    
    const payload = contact;

    return this.http.post<string>(this.sendEmailEndpoint, payload);
  }
}
