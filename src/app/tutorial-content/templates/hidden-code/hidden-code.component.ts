import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentPageTutorial } from '../../models/component-page-tutorial.model';

@Component({
  selector: 'app-hidden-code',
  templateUrl: './hidden-code.component.html',
  styleUrls: ['./hidden-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HiddenCodeComponent implements OnInit {

  public buttonText: string = "Mostra";
  public olContents: String[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public createPageHiddenCodeTemplate(componentPage: ComponentPageTutorial) {

    componentPage.childComponentsPageTutorialList?.forEach(subElement => {

      this.olContents.push(`<${subElement.componentType} class="${subElement.componentClassCss}" 
      id="${subElement.componentIdCss}">${subElement.componentContent}</${subElement.componentType}>`);
       
    });
   
  }

  public showHide() : void{
    
    if(this.buttonText == "Mostra"){
      this.buttonText = "Nascondi";
      document.getElementById("glassWindow")?.classList.remove("glass");
      document.getElementById("codeBlockExercise")?.classList.remove("codeBlockHideOver");

    } else {
      this.buttonText = "Mostra";
      document.getElementById("glassWindow")?.classList.add("glass");
      document.getElementById("codeBlockExercise")?.classList.add("codeBlockHideOver");
    }
  }

}
