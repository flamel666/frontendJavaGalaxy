import { Injectable } from '@angular/core';

enum ipConfig{
    IPPUBLICSERVER="http://localhost:8087/"//localhost:8080 //https://serverjg.herokuapp.com/
}

@Injectable({
  providedIn: 'root'
})
export class ServiceConfigurationService {  

  constructor() { }


  public getIpServer():string{
    return ipConfig.IPPUBLICSERVER;
  }

}
