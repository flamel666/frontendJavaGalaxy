import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

import { CubeComponent } from './cube/cube.component';
import { MoonSolidComponent } from './galaxysolid/moon-solid/moon-solid.component';
import { SunGlowComponent } from './galaxysolid/sun-glow/sun-glow.component';
import { SunSolidComponent } from './galaxysolid/sun-solid/sun-solid.component';
import { CollapseCanvasComponent } from './galaxysolid/collapse-canvas/collapse-canvas.component';
import { ProvasunComponent } from './galaxysolid/provasun/provasun.component';
import { CookieService } from 'ngx-cookie-service';
import {MenubarModule} from 'primeng/menubar';
import { HomeModule } from './features/home/home.module';






//angularMaterial




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
     CubeComponent, MoonSolidComponent, SunGlowComponent, SunSolidComponent, CollapseCanvasComponent, ProvasunComponent
  ],
  imports: [        
    BrowserModule,
    AuthenticationModule,
    TutorialContentModule,
    HomeModule,
    AppRoutingModule,
    HttpClientModule,
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

    constructor(private cookieCreator: CookieService){      
      if(this.cookieCreator.check("EX"))
      this.cookieCreator.set("ALL","cazz");
      else{
        this.expireDate = new Date();
        this.expireDate.setDate(this.expireDate.getDate() + 100)
        this.cookieCreator.set("EX","cazz", this.expireDate);
      }
    }
 }

//metodo per la traduzione
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}