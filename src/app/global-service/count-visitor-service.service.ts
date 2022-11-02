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
    this.httpConnection.get<string>("https://37.183.210.228:443/java-galaxy/increment/test");
    console.log("chiamo l'increment "+this.httpConnection.get<string>("https://37.183.210.228:443/java-galaxy/increment/req"));
    this.httpConnection.get<string>("https://37.183.210.228:443/java-galaxy/increment/req").forEach(x=>{
      console.log("ritorno: "+x);
    })
    console.log("chiamo l'increment di nuovo");
    this.httpConnection.get<string>("https://37.183.210.228:443/java-galaxy/increment/req");
    this.httpConnection.get<string>("https://37.183.210.228:443/java-galaxy/increment/test");
    console.log("chiamo l'increment e ancora");
    this.httpConnection.post("https://37.183.210.228:443/java-galaxy/counter/visit/increment", { title: 'Increment visitour' }).subscribe(data => {
      console.log("boh: ");
    });/*
    this.httpConnection.post(ip+"counter/visit/increment", { title: 'Increment visitour' }).subscribe(data => {
    
  });*/
  }

}
