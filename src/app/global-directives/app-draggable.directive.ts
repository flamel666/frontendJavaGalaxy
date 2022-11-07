import { Directive, HostBinding, HostListener } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

interface position{
  x: number,
  y: number
}

@Directive({
  selector: '[appAppDraggable]'
})
export class AppDraggableDirective {
  @HostBinding("style.transform") 
  get tranform(): SafeStyle{
    return this.sanitizer.bypassSecurityTrustStyle(`translateX(${this.position.x}px) translateY(${this.position.y}px)`);
  }

  @HostBinding("style.opacity") 
  get opacity(): SafeStyle{
    return this.sanitizer.bypassSecurityTrustStyle(`${this.opacityValue}`);
  }

  // opacity: 0.4;

  @HostBinding("class.draggable") 
  draggable = true;  

  private position: position = {x:0, y:0};

  private startPosition?: position;

  private opacityValue = 1;

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragstart", ["$event"]) 
  onDragStart(event: PointerEvent){  
    this.startPosition ={
      x: event.clientX - this.position.x,
      y: event.clientY -this.position.y
    }
    this.opacityValue = 0.4;
  }

  @HostListener("drag", ["$event"]) 
  onDragMove(event: PointerEvent){
    this.position.x = event.clientX - this.startPosition!.x;
    this.position.y = event.clientY - this.startPosition!.y;    
  }

  @HostListener("dragend", ["$event"]) 
  onDragEnd(event: PointerEvent){    
    this.position.x = event.clientX - this.startPosition!.x;
    this.position.y = event.clientY - this.startPosition!.y;
    this.opacityValue = 1;    
  }

}
