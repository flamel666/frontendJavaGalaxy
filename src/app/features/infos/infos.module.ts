import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './about-page/about-page.component';
import { InfosRoutingModule } from './infos-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ContactsComponent } from './contacts/contacts.component';

import {DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DialogModule} from 'primeng/dialog';

// Reactive form for generate and validate the form
import { ReactiveFormsModule } from '@angular/forms'; 



@NgModule({
  declarations: [
    AboutPageComponent,
    ContactsComponent    
  ],
  imports: [
    CommonModule,
    InfosRoutingModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextareaModule,
    DialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class InfosModule {
  constructor(){
    console.log("costruttore chiamato 0");
  }
 }
