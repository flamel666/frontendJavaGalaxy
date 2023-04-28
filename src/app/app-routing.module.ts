import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: "", pathMatch: "full", redirectTo: 'home'
   // loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  { path: 'home',
   loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
  
  
  {
    path: "auth",
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: "code",
    loadChildren: () => import('./tutorial-content/tutorial-content.module').then(m => m.TutorialContentModule)
  
  },
  {//questo va messo sempre alla fine 
    path: "**",//se vado su una pagina che non esiste allora mi dirotta su home
    redirectTo: 'home'//magari usarlo per un errore 404 custom
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  /*  public pattero: string = "/";
    constructor(private router: Router){
      console.log("COSTRUTTORE ROUTER "+window.location.href);
      if(window.location.href.toString().includes("sto"))
      this.router.navigate(["/code/lang/it"]);
    }*/
 }
