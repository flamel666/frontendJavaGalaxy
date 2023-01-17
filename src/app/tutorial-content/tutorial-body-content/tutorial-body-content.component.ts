import { AfterViewInit,  ChangeDetectorRef, Component, ComponentRef,   OnInit, QueryList, Renderer2, TemplateRef, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';


import { ComponentPageTutorial } from '../models/component-page-tutorial.model';
import { PageTutorial } from '../models/page.model';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { TabPanelComponent } from '../templates/tab-panel/tab-panel.component';

@Component({
  selector: 'app-tutorial-body-content',
  templateUrl: './tutorial-body-content.component.html',
  styleUrls: ['./tutorial-body-content.component.scss'],
  encapsulation: ViewEncapsulation.None//serve a far leggere il css per gli innerHTML
  
})
export class TutorialBodyContentComponent implements OnInit, AfterViewInit {
 /* @ViewChild('iconButton')
  iconButton!: ElementRef;*/

  @ViewChildren('tabbedPane', { read: ViewContainerRef })
  components!: QueryList<ViewContainerRef>;
 
  //lista delle tab all'interno della pagina che vanno eliminate ad ogni refresch o cambio pagina
  // private contentViewContainerRefToClear: ViewContainerRef[]=[];
  private contentViewContainerRefToClear: Map<ViewContainerRef, ComponentRef<TabPanelComponent>> = new Map();

  //lista dei tag html presi dal server
  public defaultContent: String[] = [];
  //lista dei tah html presi dal server che hanno come primo elemento una tabView
  public tabViewContents: Map<string, string[]> = new Map();

  //lista delle tabView che vanno all'interno della pagina
  public nestedTabViewContents: Map<number, ComponentPageTutorial> = new Map();

  public _gridOptions: Map<number, string> = new Map();

  public boh: boolean = true;

  private p = "p";
  public b = "p-tabPanel";

  pageToShow?: PageTutorial;

  constructor(private changeDetector:ChangeDetectorRef, private renderer: Renderer2, public chapterJavaService: TutorialJavaService, private viewContainerRef: ViewContainerRef, private sanitizer: DomSanitizer) {
    
    this.chapterJavaService.idChapterSubChanged$?.subscribe(id => {
      console.log("sono nel body-contet. sotto capitolo cambiato: " + id);
      this.chapterJavaService.getPageBySubChapter(id).subscribe(response => {
        //  console.log("lunghezza prima: "+this.contentViewContainerRefToClear.length);      
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })
        //   this.contentViewContainerRefToClear =[];
        //console.log("lunghezza poi: "+this.contentViewContainerRefToClear.length);      

        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log("nel subscribe ");
        console.log(response);
        this.pageToShow = response;
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });
    });

    this.chapterJavaService.idChapterChanged$?.subscribe(id => {
      console.log("sono nel body-contet. capitolo cambiato: " + id);
      this.chapterJavaService.getPageByChapter(id).subscribe(response => {
        //
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
          // el.clear();
        })
        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log(response);
        this.pageToShow = response;
        this.createPage(this.pageToShow);        
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
        else
        this.chapterJavaService.youTubeVideoChanged("");
        //   this.placeholderContainer.createComponent(TabPanelComponent);       
      });
    });
  

  }
 
 /*
  ngAfterViewChecked(){
    console.log("after content checked");
    this.changeDetector.detectChanges();
  }*/
 
  ngAfterViewInit() {
    
    
   /*
      console.log("ngAfterViewInit");
      this.contentViewContainerRefToClear = new Map();
      this.components.changes.subscribe(() => {
     
      this.nestedTabViewContents.forEach((tabElement, index) =>{
          console.log("elemento: "+tabElement.componentType!+" index: "+index);
  
          this.components.forEach(el => {         
  
            if (el.element.nativeElement.id == index) {
  
              let componentRef = el.createComponent(TabPanelComponent);          
  
              let contents: string[] = [];
             
              contents.push(tabElement.componentType!);            
              componentRef.instance.createPageTabViewTemplate(tabElement);
              this.contentViewContainerRefToClear.set(el, componentRef);
             
            }
  
          })
  
      });
      
      });   */

  }

  ngOnInit(): void {
    /*
    this.defaultContent.push(`<h1 class="reddo">NGONINIT</h1>`);
    this.defaultContent.push(`<${this.p} class="reddo">ser</${this.p}>`);
    this._gridOptions.set(4, `<${this.p} class="red">tata</${this.p}>`);
    // this.viewContainerRef.createComponent(tab);
*/
    this.chapterJavaService.getPageByChapter("1").subscribe(response => {
      this.chapterJavaService.notifyChangeFromTutorialBodyContent("1");
      console.log(response);
      this.pageToShow = response;
      this.createPage(this.pageToShow);

      /*
      this.pageToShow.compontentsPage?.forEach(el => {
        this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${el.componentContent}</${el.componentType}>`);
      });*/
    });
  }

  private createPage(pageToShow: PageTutorial) {

    // this.defaultContent.push(`<h1 class="reddo">CREATE PAGE</h1>`);
    if (pageToShow.compontentsPage![0].componentType == "p-tabView") {
      pageToShow.compontentsPage?.forEach(e => {
        console.log("page: " + e.componentType);
        e.childComponentsPageTutorialList?.forEach(el => {
          console.log("component: " + el.componentContent);
        });
      });
      console.log("finitoooooooooooooooooooooo");
      this.createPageTabViewTemplate(pageToShow);
      this.createNestedTabView();
    } else {
      this.createPageDefaultTemplate(pageToShow);
      this.createNestedTabView();
     
     
    }
    /*
    pageToShow.compontentsPage?.forEach(el=>{
      console.log("cazz "+el.componentType +"  "+el.childComponentsPageTutorialList + " "+el.standAlone+" "+el.parentComponentPageTutorial);

    /*  el.childComponentsPageTutorialList?.forEach((subEl: ComponentPageTutorial)=>{
        console.log("sub component "+subEl.componentType +" "+subEl.standAlone);
      });*/

    // console.log("sto per vedere se è undefine: "+el.childComponentsPageTutorialList?.length);
    // console.log("sto per vedere se è undefine und: "+(el.childComponentsPageTutorialList == undefined));
    // console.log("sto per vedere se è undefine null: "+(el.childComponentsPageTutorialList == null));
    // console.log("sto per vedere se è undefine: "+(el.childComponentsPageTutorialList == null));
    /* if(el.childComponentsPageTutorialList!.length > 0){
       let content = "";
     //  console.log("sono dentro");
       if(el.componentType == "p-tabView"){
 
          content = this.createTabViewInnestedComponent(el.childComponentsPageTutorialList!);
          this.tabViewContent.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${content}</${el.componentType}>`);
 
       }else{
         
         content = this.createInnestedComponent(el.childComponentsPageTutorialList!);
        this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${content}</${el.componentType}>`);
       
       }
          console.log("contenuto su "+content);
    //   console.log("content: "+content);   
     }else{
 
    //   console.log("sono dentro l'else");
    if(el.componentType == "p-tabView"){
     this.tabViewContent.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${el.componentContent}</${el.componentType}>`);
    }else{
       this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${el.componentContent}</${el.componentType}>`);
    }
     }
 
       
     });*/
/*
    this.defaultContent.push('<ul>')//non funziona spaccando il tag
    this.defaultContent.push('<li id="prova">ciso</li>')
    this.defaultContent.push('<code><span>sono uno span del cazzo</span></code>')
    this.defaultContent.push('<div class="subBodyContaine" id="prova2" ><p>sono un paragrafo nel div</p></div>')
    this.defaultContent.push('</ul>')

    this.defaultContent.push(`<div> <p-tabView> <p-tabPanel header="Header 1">Content 1</p-tabPanel> </p-tabView> </div>`);
    this.defaultContent.push(`<p-tree>
    asd
    </p-tree>`);
    */
  }

  private createPageDefaultTemplate(pageToShow: PageTutorial) {
    let i = 0;
    console.log("prima del forEach");
    this.nestedTabViewContents = new Map();
    pageToShow.compontentsPage?.forEach(el => {

      //  console.log("cazz " + el.componentType + "  " + el.childComponentsPageTutorialList + " " + el.standAlone + " " + el.parentComponentPageTutorial);
      /*  el.childComponentsPageTutorialList?.forEach((subEl: ComponentPageTutorial)=>{
          console.log("sub component "+subEl.componentType +" "+subEl.standAlone);
        });*/

      // console.log("sto per vedere se è undefine: "+el.childComponentsPageTutorialList?.length);
      // console.log("sto per vedere se è undefine und: "+(el.childComponentsPageTutorialList == undefined));
      // console.log("sto per vedere se è undefine null: "+(el.childComponentsPageTutorialList == null));
      // console.log("sto per vedere se è undefine: "+(el.childComponentsPageTutorialList == null));

      // console.log("lunghezza: "+this.defaultContent.length)
     // this.defaultContent.push(`<span class="provaaa" #tabbedPane></span>`);
      
      //console.log("lunghezza: "+this.defaultContent.length);
      console.log("dentro il foreacjh");
      if (el.childComponentsPageTutorialList!.length > 0) {
        let content = "";
        if (el.componentType != "p-tabView") {
         
          content = this.createInnestedComponent(el.childComponentsPageTutorialList!);
          this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id="${el.componentIdCss}">${content}</${el.componentType}>`);
        } else {
          console.log("qui c'è una cazzo di tab e dobbiamo fare qualcosa "+this.nestedTabViewContents.size);
          this.nestedTabViewContents.set(this.defaultContent.length - 1, el);
        }
      } else {
        console.log("introduzione: tipo: "+el.componentType);
        console.log("introduzione: class: "+el.componentClassCss);
        console.log("introduzione: id: "+el.componentIdCss);
        this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id="${el.componentIdCss}">${el.componentContent}</${el.componentType}>`);

      }
    });
    
  }

  private createPageTabViewTemplate(pageToShow: PageTutorial) {
    /*
        let componentRef = this.viewContainerRef.createComponent(TabPanelComponent);
        componentRef.instance.addElementInnerHtml(header, contents);*/
    pageToShow.compontentsPage?.forEach(page => {//qui entro nel tabView     
      let content = "";
      let header = "";

      console.log("entro nei panel");
      page.childComponentsPageTutorialList?.forEach(subElement => {//qui dentro sono nel tabPanel cicla per ogni panel
        let contents: string[] = [];

        if ((subElement.tagOptions !== undefined) && subElement.tagOptions!.length > 0)
          subElement.tagOptions!.forEach(op => {
            header = "" + op.optionValue;
          });

        //dobbiamo estrapolare tutto il contenuto del tab panel  
        if (subElement.childComponentsPageTutorialList!.length > 0)
          content = this.createInnestedComponent(subElement.childComponentsPageTutorialList!);
        else
          content = subElement.componentContent!;

        contents.push(content);
        contents.push("<p>sto <strong>cazzo</strong></p>");

        this.tabViewContents.set(header, contents);

      });
    });
  }


  private createInnestedComponent(components: Array<ComponentPageTutorial>): string {
    let content: string = "";

    console.log("nel metodo");
    components.forEach(el => {
      console.log("foreach " + content);
      //implementare la ricorsione appena avremo qualcosa da inserire
      if (el.childComponentsPageTutorialList!.length > 0) {
        let subContent: string = "";
        console.log("figli maggiorni di 0 con boolean:  " + el.standAlone);
        console.log("tag " + el.componentType);
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

  //crea una stringa con le opzioni aggiuntive per il tag che poi verrà inserito nel tag
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

  private createNestedTabView(): void {
    
    console.log("ngAfterViewInit");
    let indexToBeRemoved: number[] = [];
    this.contentViewContainerRefToClear = new Map();
    this.components.changes.subscribe(() => {
      console.log("sto per partire. pronti...partenza...");
    this.nestedTabViewContents.forEach((tabElement, index) =>{
        console.log("elemento: "+tabElement.componentType!+" index: "+index);

        this.components.forEach(el => {         

          if (el.element.nativeElement.id == index) {

            let componentRef = el.createComponent(TabPanelComponent);          

            let contents: string[] = [];
           
            contents.push(tabElement.componentType!);            
            componentRef.instance.createPageTabViewTemplate(tabElement);
            this.contentViewContainerRefToClear.set(el, componentRef);
            indexToBeRemoved.push(index);
          }

        })

    });
    indexToBeRemoved.forEach(id=>{
      this.nestedTabViewContents.delete(id);
    });
   

    
    });   
    //risolve l'errore NG0100 ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    this.changeDetector.detectChanges();
  }

  public previousArgument(): void {
    console.log("previous");
    this.chapterJavaService.previousChapter("1");
   //if the page offset(y) is greater than 100, go up
   this.goOnTop();
  }

  public nextArgument(): void {
    console.log("next");
    this.chapterJavaService.nextChapter("1");
    //if the page offset(y) is greater than 100, go up
    this.goOnTop();
  }


  public goOnTop(): void{
    if(window.pageYOffset > 100) {
      window.scrollTo(0, 100)
    }
  }

}
