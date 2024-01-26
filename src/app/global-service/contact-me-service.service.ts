import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceConfigurationService } from '../config-service/service-configuration.service';

interface ContactMeRequest{
  firstName: string, 
  lastName: string, 
  email: string, 
  contactReason: string, 
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ContactMeServiceService {

  constructor(public httpConnection: HttpClient, public configService: ServiceConfigurationService) { }

  public sendMessageToServer(firstName: string, lastName: string, email: string, contactReason: string, message: string){
    let ip = this.configService.getIpServer();

    let contactMeRequest: ContactMeRequest = {firstName: firstName, lastName: lastName, email: email, contactReason: contactReason, message: message};

    this.httpConnection.post(ip+"site/contactme", contactMeRequest).subscribe(data => {
    
    });

  }
}
