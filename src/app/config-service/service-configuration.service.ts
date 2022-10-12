import { Injectable } from '@angular/core';

enum ipConfig{
    IPPUBLICSERVER="https://93.148.120.184:80/"//localhost:8080
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
