import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { UrlPathService } from '../tutorial-content/services/url-path.service';

@Injectable({
  providedIn: 'root'
})

export class ConfigLanguageService {

  private browserLanguage?: string;

  private actionForceChangeLanguage? = new Subject<string>();
  actionForceChangeLanguage$? = this.actionForceChangeLanguage?.asObservable();

  constructor(private cookies: CookieService, @Inject(PLATFORM_ID) private platformId: Object, private urlPathService: UrlPathService) { 
    console.log("COSTRUTTORE SERVICE LANGUAGE");
    if(isPlatformBrowser(this.platformId)){
      let language = "";
      let urlPath = this.urlPathService.getUrlPath(window.location.href);
      if(urlPath.includes("code")){

        if(urlPath.includes("it"))
        language = "it";

        if(urlPath.includes("en"))
        language = "en";

      } else {
      language = window.navigator.language;
    }

    if(language.includes("it") || language.includes("IT")){
      this.browserLanguage = "it";
    } else {
      this.browserLanguage = "en";
    }
  
   
    this.updateCoockiesLanguage(this.browserLanguage);
    console.log("language attuale: "+this.browserLanguage);
  }

  if(isPlatformServer(this.platformId)){
    this.browserLanguage = "it";
   // this.updateCoockiesLanguage(this.browserLanguage);
  }

  }

  /**
   * aggiorna il cookie della lingua con la lingua in input
   * @param language 
   * 
   */
  private updateCoockiesLanguage(language : string) : void{

    if(this.cookies.check("LANG")){   

      let lang = this.cookies.get("LANG");
      this.cookies.delete("LANG");
      this.cookies.set("LANG", lang, { path: '/' });
      
      this.browserLanguage = lang;

    }else{
      this.cookies.set("LANG",language);
    }

  }

  forceSilecentUpdateLanguage(language: string): void{

    this.browserLanguage = language;
    if(isPlatformBrowser(this.platformId)){
      this.cookies.delete("LANG");
      this.cookies.set("LANG",language, { path: '/' });
    }
  }

  forcePropagateUpdateLanguage(language: string): void{
    console.log("forzo propagazione");
    this.browserLanguage = language;

    this.cookies.delete("LANG");
    this.cookies.set("LANG",language);

    //propagazione del cambio
    this.actionForceChangeLanguage?.next(language);
    }


  getBrowserLanguage() : string {
    return this.browserLanguage!;
  }




}
