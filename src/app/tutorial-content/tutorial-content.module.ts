import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';
import { GlobalContentComponent } from './global-content/global-content.component';
import { TutorialContentRoutingModule } from './tutorialContent-routing.module';


import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {ButtonModule} from 'primeng/button';
import { TutorialBodyContentComponent } from './tutorial-body-content/tutorial-body-content.component';

@NgModule({
  declarations: [
    SideBarComponent,
    GlobalContentComponent,
    TutorialBodyContentComponent,    
  ],
  imports: [
    CommonModule,
    TutorialContentRoutingModule,
    PanelMenuModule,
    TreeModule,
    ButtonModule
    
 
  ]
})
export class TutorialContentModule { }
