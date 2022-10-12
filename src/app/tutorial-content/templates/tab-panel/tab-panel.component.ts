import {AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentPageTutorial } from '../../models/component-page-tutorial.model';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabPanelComponent implements OnInit { 

  public tabViewContents: Map<string, string[]> = new Map();
  public scrollableTabView: boolean = true;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.scrollableTabView = false;
      
   }
   
  ngOnInit(): void {
    
  }

  public createPageTabViewTemplate(componentPage: ComponentPageTutorial) {
   
      this.tabViewContents = new Map();
      let content = "";
      let header = "";

      console.log("entro nei panel");
      componentPage.childComponentsPageTutorialList?.forEach(subElement => {//qui dentro sono nel tabPanel cicla per ogni panel
        console.log("panel numero:  "+subElement.componentClassCss);
        console.log("panel numero content:  "+subElement.componentContent);
        
        let contents: string[] = [];

        if ((subElement.tagOptions !== undefined) && subElement.tagOptions!.length > 0)
          subElement.tagOptions!.forEach(op => {
            header = "" + op.optionValue;
          });
          header = subElement.componentClassCss!;
        //dobbiamo estrapolare tutto il contenuto del tab panel  
        if (subElement.childComponentsPageTutorialList!.length > 0)
          content = this.createInnestedComponent(subElement.childComponentsPageTutorialList!);
        else
          content = subElement.componentContent!;


        contents.push(content);
        contents.push("<p>sto <strong>cazzo</strong></p>");

        this.tabViewContents.set(header, contents);


      });
    
  }

  private createInnestedComponent(components: Array<ComponentPageTutorial>): string {
    let content: string = "";
  
    components.forEach(el => {     
      //implementare la ricorsione appena avremo qualcosa da inserire
      if (el.childComponentsPageTutorialList!.length > 0) {
        let subContent: string = "";
      
        /*   if(el.standAlone){//se vero il tag si apre e si chiude con il component    
             subContent = this.createInnestedComponent(el.childComponentsPageTutorialList!);    
             content = content + `<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${subContent}</${el.componentType}>`;          
           }*/
        subContent = this.createInnestedComponent(el.childComponentsPageTutorialList!);
        //div
        let options: string = "";
        options = this.createOptionsTag(el);
        content = content + `<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss} ${options}>${subContent}</${el.componentType}>`;

      } else {
        let options: string = "";
        options = this.createOptionsTag(el);
        content = content + `<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss} ${options}>${el.componentContent}</${el.componentType}>`;
      }
    });
    console.log("nel metodo: " + content);
    return content;
  }

  private createOptionsTag(component: ComponentPageTutorial): string {
    let options: string = "";
    console.log("nel metodo option " + component.tagOptions!);
    if (component.tagOptions! != undefined)
      if (component.tagOptions!.length > 0) {
        component.tagOptions?.forEach(op => {
          options = options + " " + op.option + "" + op.optionValue;
        });
      }

    return options;
  }


}
