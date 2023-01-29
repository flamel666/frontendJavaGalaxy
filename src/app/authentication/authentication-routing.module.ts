import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';


const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
      },
      {
        path: 'auth/signin',
        component: SigninComponent
      }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }