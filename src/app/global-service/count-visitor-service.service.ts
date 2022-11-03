import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ServiceConfigurationService } from '../config-service/service-configuration.service';

@Injectable({
  providedIn: "root"
})
export class CountVisitorServiceService { 

  constructor(public httpConnection: HttpClient, public configService: ServiceConfigurationService) {   
  }

  public incrementVisitour():void{       
    let ip = this.configService.getIpServer();
  /*
    this.httpConnection.post("https://javagalazy.sytes.net/java-galaxy/counter/visit/increment", { title: 'Increment visitour' }).subscribe(data => {
      
    });
    */
    this.httpConnection.post(ip+"counter/visit/increment", { title: 'Increment visitour' }).subscribe(data => {
    
  });
  }

}
