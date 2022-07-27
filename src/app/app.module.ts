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
import { SafeHtmlPipe, WelcomePageComponent } from './welcome-page/welcome-page.component';


//angularMaterial




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WelcomePageComponent,   
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AuthenticationModule,
    TutorialContentModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
   
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

//metodo per la traduzione
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}