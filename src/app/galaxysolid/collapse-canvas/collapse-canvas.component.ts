import { Component, Inject, OnInit, PLATFORM_ID, ViewContainerRef } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PreliminaryCollapseComponent } from '../preliminary-collapse/preliminary-collapse.component';

@Component({
  selector: 'app-collapse-canvas',
  templateUrl: './collapse-canvas.component.html',
  styleUrls: ['./collapse-canvas.component.scss']
})
export class CollapseCanvasComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private viewContainerRef: ViewContainerRef) { 
    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      this.viewContainerRef.createComponent(PreliminaryCollapseComponent);
   }
   
   if (isPlatformServer(this.platformId)) {
     // Server only code.
     
   }
  }

  ngOnInit(): void {
  }

}
