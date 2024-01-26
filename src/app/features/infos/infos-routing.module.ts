import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = 
[{ 
  path: "info/about", component: AboutPageComponent 
},
{
  path: "info/contact", component: ContactsComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfosRoutingModule { }
