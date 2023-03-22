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
import {DragDropModule} from 'primeng/dragdrop';
import {SpeedDialModule} from 'primeng/speeddial';
import {TooltipModule} from 'primeng/tooltip';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { TutorialBodyContentComponent } from './tutorial-body-content/tutorial-body-content.component';
import { SimpleTemplateContentComponent } from './templates/simple-template-content/simple-template-content.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { TabPanelComponent } from './templates/tab-panel/tab-panel.component';
import { UtilityMenuComponent } from './utility-menu/utility-menu.component';
import { AppDraggableDirective } from '../global-directives/app-draggable.directive';
import { MessageService } from 'primeng/api';
import { HiddenCodeComponent } from './templates/hidden-code/hidden-code.component';




@NgModule({
  declarations: [
    SideBarComponent,
    GlobalContentComponent,
    TutorialBodyContentComponent,
    SimpleTemplateContentComponent,
    TabPanelComponent,
    UtilityMenuComponent,
    AppDraggableDirective,
    HiddenCodeComponent
    
  ],
  imports: [
    CommonModule,
    TutorialContentRoutingModule,
    PanelMenuModule,
    TreeModule,
    ButtonModule,
    TabViewModule ,
    SkeletonModule,
    DragDropModule,
    TooltipModule,
    SpeedDialModule,
    YouTubePlayerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [MessageService]
})
export class TutorialContentModule { }
