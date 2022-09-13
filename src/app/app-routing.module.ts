import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "**",
    redirectTo: 'home'
  }, 
  {
    path: "",
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  }, 
  
  
  {
    path: "auth",
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: "code",
    loadChildren: () => import('./tutorial-content/tutorial-content.module').then(m => m.TutorialContentModule)
  
  },
  { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
