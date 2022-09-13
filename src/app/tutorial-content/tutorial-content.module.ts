import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';
import { GlobalContentComponent } from './global-content/global-content.component';
import { TutorialContentRoutingModule } from './tutorialContent-routing.module';

//primeNG component
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {SkeletonModule} from 'primeng/skeleton';

import { TutorialBodyContentComponent } from './tutorial-body-content/tutorial-body-content.component';
import { SimpleTemplateContentComponent } from './templates/simple-template-content/simple-template-content.component';

@NgModule({
  declarations: [
    SideBarComponent,
    GlobalContentComponent,
    TutorialBodyContentComponent,
    SimpleTemplateContentComponent,    
  ],
  imports: [
    CommonModule,
    TutorialContentRoutingModule,
    PanelMenuModule,
    TreeModule,
    ButtonModule,
    TabViewModule ,
    SkeletonModule
  ]
})
export class TutorialContentModule { }
