import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalContentComponent } from './global-content/global-content.component';
import { CoursesDispatcherComponent } from './courses-dispatcher/courses-dispatcher.component';



const routes: Routes = [
    {
      path: 'code/lang/:lang',
      component: CoursesDispatcherComponent
    },
    {
      path: 'code/:code',
      component: GlobalContentComponent
    },
    {
      path: 'code/:code/chapter/:chapter/lang/:lang',
      component: GlobalContentComponent
    },
    {
      path: 'code/:code/chapter/:chapter/subchapter/:subchapter/lang/:lang',
      component: GlobalContentComponent
    }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialContentRoutingModule { }