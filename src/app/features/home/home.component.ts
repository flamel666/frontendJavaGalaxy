import { Component, HostListener, OnInit, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor() { 
    
  }


  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: MouseEvent) {
   
    if(window.pageYOffset > 50)    
    document.getElementById('containerArrow')!.style.display = 'none';

    if(window.pageYOffset < 50)    
    document.getElementById('containerArrow')!.style.display = 'block';
   
  }
  
}