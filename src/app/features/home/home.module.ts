import { HostListener, NgModule, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

import * as AOS from 'aos';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class HomeModule {

  constructor(){
    AOS.init({offset: 350});
  }
}
