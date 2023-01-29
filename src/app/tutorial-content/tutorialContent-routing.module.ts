import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalContentComponent } from './global-content/global-content.component';



const routes: Routes = [
  /*  {
      path: 'code/java',
      component: GlobalContentComponent
    },*/
    {
      path: 'code/:code',
      component: GlobalContentComponent
    }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class TutorialContentRoutingModule { }