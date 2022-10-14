import { Injectable } from '@angular/core';

enum ipConfig{
    IPPUBLICSERVER="https://serverjg.herokuapp.com/"//localhost:8080
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
