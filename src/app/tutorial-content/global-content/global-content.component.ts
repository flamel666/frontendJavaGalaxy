import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { UrlPathService } from '../services/url-path.service';

@Component({
  selector: 'app-global-content',
  templateUrl: './global-content.component.html',
  styleUrls: ['./global-content.component.scss']
})
export class GlobalContentComponent implements OnInit {    

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    console.log("NELLA GLOBAL CONSTR");
    if(isPlatformBrowser(this.platformId)){    
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
          return;
      }
      window.scrollTo(0, 0)
  });  
}
console.log("NELLA GLOBAL CONSTR FINE");
  }

  ngOnInit(): void {   
    console.log("NELLA GLOBAL NG");
    if(isPlatformBrowser(this.platformId)){
    
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
          return;
      }
      window.scrollTo(0, 0)
  });
}
console.log("NELLA GLOBAL NG FINE");
  }


  public navigate(){
    this.router.navigate(["/auth/signin"]);
  }

}
