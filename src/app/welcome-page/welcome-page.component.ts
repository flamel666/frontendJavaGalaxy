
import { Component, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'], 
  encapsulation: ViewEncapsulation.None 
})
export class WelcomePageComponent implements OnInit {

  

  userHtml: String = '<style> .pippo { color: purple; } </style> <h3 class="pippo"> Hello there </h3>';

  prova: String ='<div [ngStyle]=\"{ \'font-size\': 300px; }\"><b>This is my HTML.</b></div>';
  innerHTML: string = `<p>Hello, world!</p>`;
  constructor() { 
    
  }


  ngOnInit(): void {
  }

}

