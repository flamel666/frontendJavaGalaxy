import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//custom modules
import { AuthenticationModule } from './authentication/authentication.module';
import { TutorialContentModule } from './tutorial-content/tutorial-content.module';


//import per il componente di traduzione
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

//primeNG component
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {MenubarModule} from 'primeng/menubar';


import { HomeModule } from './features/home/home.module';

import { CookieService } from 'ngx-cookie-service';
import { CountVisitorServiceService } from './global-service/count-visitor-service.service';

import { CubeComponent } from './cube/cube.component';
import { MoonSolidComponent } from './galaxysolid/moon-solid/moon-solid.component';
import { SunGlowComponent } from './galaxysolid/sun-glow/sun-glow.component';
import { SunSolidComponent } from './galaxysolid/sun-solid/sun-solid.component';
import { CollapseCanvasComponent } from './galaxysolid/collapse-canvas/collapse-canvas.component';
import { ProvasunComponent } from './galaxysolid/provasun/provasun.component';
import { PreliminaryCollapseComponent } from './galaxysolid/preliminary-collapse/preliminary-collapse.component';
import { isPlatformBrowser } from '@angular/common';
import { ConfigLanguageService } from './config-service/config-language.service';


//import { AppDraggableDirective } from './global-directives/app-draggable.directive';

//angularMaterial




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
     CubeComponent, MoonSolidComponent, SunGlowComponent, SunSolidComponent, CollapseCanvasComponent, ProvasunComponent, PreliminaryCollapseComponent
  ],
  imports: [        
   
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AuthenticationModule,
    TutorialContentModule,       
    
    HomeModule, 
    AppRoutingModule,
    DropdownModule,
    MenubarModule,
    
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    ToggleButtonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {

  private expireDate!: Date;

    constructor(private cookieCreator: CookieService, private counterService: CountVisitorServiceService, 
      @Inject(PLATFORM_ID) private platformId: Object, private metaService: Meta){  

        // decommentare in prod per disabilitare i log in console
      //  console.log = function (): void { };

        console.log("--------------------START----------------------------- ");

      if (isPlatformBrowser(this.platformId)) {
        
      if(!this.cookieCreator.check("visit")){
        
        this.counterService.incrementVisitour();
        let date = new Date();
        console.log("date: "+date);
        date.setUTCHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        console.log("after set date: "+date);
        this.cookieCreator.set("visit","visited", date,  '/' );
       }

       
     /* if(this.cookieCreator.check("EX"))
      this.cookieCreator.set("ALL","MAZZ");
      else{
        this.expireDate = new Date();
        this.expireDate.setDate(this.expireDate.getDate() + 100)
        this.cookieCreator.set("EX","maxx", this.expireDate, '/' ); //settare l'expiration date al coockie
      }*/
    }

  }

 }

//metodo per la traduzione
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json'); 
}

/*
ngOnInit(): void {
  }
*/