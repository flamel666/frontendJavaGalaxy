import { Injectable } from '@angular/core';

enum ipConfig{
    IPPUBLICSERVER="localhost:8080/"//localhost:8080 //https://serverjg.herokuapp.com/
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
