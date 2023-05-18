import { isPlatformBrowser, isPlatformServer, JsonPipe, Location } from '@angular/common';
import { AfterViewInit,  ChangeDetectorRef, Component, ComponentRef,   Inject,   OnInit, PLATFORM_ID, QueryList, Renderer2, TemplateRef, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';


import { ComponentPageTutorial } from '../models/component-page-tutorial.model';
import { PageTutorial } from '../models/page.model';
import { LastChapterSelected } from '../services/last-selected-chapter';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { UrlPathService } from '../services/url-path.service';
import { HiddenCodeComponent } from '../templates/hidden-code/hidden-code.component';
import { TabPanelComponent } from '../templates/tab-panel/tab-panel.component';
import { ConfigLanguageService } from 'src/app/config-service/config-language.service';

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

  @ViewChildren('hiddenCode', { read: ViewContainerRef })
  componentsHiddenCode!: QueryList<ViewContainerRef>;
 
  //lista delle tab all'interno della pagina che vanno eliminate ad ogni refresch o cambio pagina
  // private contentViewContainerRefToClear: ViewContainerRef[]=[];
  private contentViewContainerRefToClear: Map<ViewContainerRef, ComponentRef<TabPanelComponent>> = new Map();

  private contentViewContainerRefHiddenCodeToClear: Map<ViewContainerRef, ComponentRef<HiddenCodeComponent>> = new Map();

  //lista dei tag html presi dal server
  public defaultContent: String[] = [];
  //lista dei tah html presi dal server che hanno come primo elemento una tabView
  public tabViewContents: Map<string, string[]> = new Map();

  //lista delle tabView che vanno all'interno della pagina
  public nestedTabViewContents: Map<number, ComponentPageTutorial> = new Map();

  public nestedHiddenCodeContents: Map<number, ComponentPageTutorial> = new Map();

  public _gridOptions: Map<number, string> = new Map();

  public boh: boolean = true;

  private p = "p";
  public b = "p-tabPanel";

  pageToShow?: PageTutorial;

  lastChapterSelected?: LastChapterSelected = new LastChapterSelected();

  constructor(private changeDetector:ChangeDetectorRef, private renderer: Renderer2, public chapterJavaService: TutorialJavaService, private viewContainerRef: ViewContainerRef, 
    private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute, private location: Location, 
    private metaService: Meta, private title:Title, private urlPathService: UrlPathService, private configLanguageService: ConfigLanguageService) {
      //this.metaService.updateTag({name: 'excerpt', content: "response.chapter?.chapterTitle!"});
   console.log("COSTRUTTOREEEEEEEEEEEEEEEEEEEE");
   
      if(isPlatformBrowser(this.platformId)){
    
    this.chapterJavaService.idChapterSubChanged$?.subscribe(id => { 
          console.log("COOOOODE: "+this.urlPathService.getCourseFromUrl(window.location.href));
      this.location.replaceState("/code/"+this.urlPathService.getCourseFromUrl(window.location.href)+"/chapter/"+id.substring(0,id.indexOf("."))+"/subchapter/"+id+"/lang/"+configLanguageService.getBrowserLanguage())
      console.log("sono nel body-contet. sotto capitolo cambiato: " + id);
      let programmingLanguage = this.route.snapshot.paramMap.get('code');
      this.chapterJavaService.getPageBySubChapter(id, programmingLanguage!).subscribe(response => {
        //  console.log("lunghezza prima: "+this.contentViewContainerRefToClear.length);      
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })
        //   this.contentViewContainerRefToClear =[];
        //console.log("lunghezza poi: "+this.contentViewContainerRefToClear.length);    
        //this.metaService.updateTag({name: 'excerpt', content: "sto cazzoooooooooo"});

        this.tabViewContents = new Map();
        this.defaultContent = [];

        console.log("nel subscribe ");
        //console.log(response);

        this.pageToShow = response;
        this.title.setTitle(""+response.subChapter?.subChapterTitle)
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });
    });

    this.chapterJavaService.idChapterChanged$?.subscribe(id => {
      console.log("sono nel body-contet. capitolo cambiato: " + id);
      let programmingLanguage = this.route.snapshot.paramMap.get('code');
      this.chapterJavaService.getPageByChapter(id, programmingLanguage!).subscribe(response => {
        this.location.replaceState("/code/"+this.urlPathService.getCourseFromUrl(window.location.href)+"/chapter/"+id+"/lang/"+this.configLanguageService.getBrowserLanguage());
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
        this.title.setTitle(""+response.chapter?.chapterTitle)
        this.createPage(this.pageToShow);        
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
        else
        this.chapterJavaService.youTubeVideoChanged("");
        //   this.placeholderContainer.createComponent(TabPanelComponent);       
      });
    });

    
  
  }
  }
 
 /*
  ngAfterViewChecked(){
    console.log("after content checked");
    this.changeDetector.detectChanges();
  }*/
 
  ngAfterViewInit() {

    this.components.changes.subscribe(() => {
      this.createNestedTabView();
    });
   
    this.componentsHiddenCode.changes.subscribe(() => {
      this.createNestedHiddenCode();
    });
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
  //console.log("location: "+this.route.snapshot);
  //console.log("location: "+this.getUrlPath().includes("subchapter"));
  



  if(isPlatformBrowser(this.platformId)){
    console.log("-----------------------------BROWSER--------------------------------"+this.urlPathService.getCourseFromUrl(window.location.href));
    let chapter = "1";
    let subChapter = "";
    let language = "it";
    let urlPath = this.urlPathService.getUrlPath(window.location.href);
  
    if(urlPath.includes("it"))
      language = "it";
    else if(urlPath.includes("en"))
      language = "en";
    else
    language = this.configLanguageService.getBrowserLanguage();

    this.configLanguageService.forceSilecentUpdateLanguage(language);   
    !urlPath.includes("chapter")
    if(!urlPath.includes("chapter")){
      console.log("il path è quello base, inizializziamo ad 1");
        chapter = "1";      
    } else if(urlPath.includes("subchapter")){
      console.log("il path iniziale contiene il subchapter");
      chapter = this.urlPathService.getChapterFromUrlPath(urlPath);
      subChapter = this.urlPathService.getSubChapterFromUrlPath(urlPath);
    }else{
      console.log("il path iniziale non contiene subchapter");
      chapter = this.urlPathService.getChapterFromUrlPath(urlPath);      
    }  
    
  /*
    if(this.cookies.check("lastChapterSelected")){      
      this.lastChapterSelected = JSON.parse(this.cookies.get("lastChapterSelected"));      
      chapter = ""+this.lastChapterSelected?.chapter;
    }*/
    
    //if(this.lastChapterSelected?.subChapter == "0" || this.lastChapterSelected?.subChapter == undefined){
      //inizializza la pagina con il primo capitolo
  if(subChapter == "") {   
    let programmingLanguage = this.route.snapshot.paramMap.get('code');
    this.chapterJavaService.getPageByChapter(chapter, programmingLanguage!).subscribe(response => {
      //nel capitolo setto il path se non è specificato nulla e quindi inizializzo al primo
      this.location.replaceState("/code/"+this.urlPathService.getCourseFromUrl(window.location.href)+"/chapter/"+chapter+"/lang/"+language);
      //
      this.contentViewContainerRefToClear.forEach((el, c) => {
        c.clear();
        el.destroy();
        // el.clear();
      });
      this.chapterJavaService.notifyChangeFromTutorialBodyContent(chapter);
      this.tabViewContents = new Map();
      this.defaultContent = [];
      console.log(response);
      this.pageToShow = response;
      this.createPage(this.pageToShow);    
      this.updateMetaTag(this.pageToShow, true);
      
           
      if(response.videoYouTubeId != undefined)    
        this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
      else
      this.chapterJavaService.youTubeVideoChanged("");
      //   this.placeholderContainer.createComponent(TabPanelComponent);       
    });
    }else{
      let programmingLanguage = this.route.snapshot.paramMap.get('code');
      this.chapterJavaService.getPageBySubChapter(subChapter, programmingLanguage!).subscribe(response => {
        //  console.log("lunghezza prima: "+this.contentViewContainerRefToClear.length);      
        this.location.replaceState("/code/"+this.urlPathService.getCourseFromUrl(window.location.href)+"/chapter/"+subChapter.substring(0,subChapter.indexOf("."))+"/subchapter/"+subChapter+"/lang/"+this.configLanguageService.getBrowserLanguage())
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })
        //   this.contentViewContainerRefToClear =[];
        //console.log("lunghezza poi: "+this.contentViewContainerRefToClear.length);      
        this.chapterJavaService.notifyChangeFromTutorialBodyContentAboutSubChapter(subChapter);
        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log("nel subscribe ");
        //console.log(response);
        this.pageToShow = response;
        this.updateMetaTag(this.pageToShow, false);
       
     
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });      
    }
  }//BROWSER
console.log("quasi nel server");
  if(isPlatformServer(this.platformId)){
    //this.route.snapshot.paramMap.get('code')!;
    console.log("quasi nel server "+this.route.snapshot.paramMap.get('code'));
    console.log("-----------------SERVER-----------------");
    let chapter = "1";
  let subChapter = "";
  let language = "it";
  console.log("sto per chiamare il metodo");
  let urlPath = this.getUrlPath();
  console.log("urlPath: "+urlPath);
  console.log("urlPath: "+urlPath.includes("subchapter"));


  if(urlPath.includes("it"))
  language = "it";

  if(urlPath.includes("en"))
  language = "en";

  this.configLanguageService.forceSilecentUpdateLanguage(language);   
  this.chapterJavaService.changeSilentLanguageONLYSSRBUILD(language);

    if(!urlPath.includes("chapter")){
      console.log("il path è quello base, inizializziamo ad 1");
       chapter = "1";      
    } else if(urlPath.includes("subchapter")){
      console.log("il path iniziale contiene il subchapter");
      chapter = this.getChapterFromUrlPath();
      subChapter = this.getSubChapterFromUrlPath();
    }else{
      console.log("il path iniziale non contiene subchapter");
      chapter = this.getChapterFromUrlPath();      
    }  

   
    
    console.log("DOPO IL CONTROLLO DELL'URL");
  /*
    if(this.cookies.check("lastChapterSelected")){      
      this.lastChapterSelected = JSON.parse(this.cookies.get("lastChapterSelected"));      
      chapter = ""+this.lastChapterSelected?.chapter;
    }*/
    
    //if(this.lastChapterSelected?.subChapter == "0" || this.lastChapterSelected?.subChapter == undefined){
      //inizializza la pagina con il primo capitolo
      let programmingLanguage = this.route.snapshot.paramMap.get('code');
  if(subChapter == "") {   
    this.chapterJavaService.getPageByChapter(chapter, programmingLanguage!).subscribe(response => {
      //nel capitolo setto il path se non è specificato nulla e quindi inizializzo al primo
      console.log("CHAPTER CHANGE URL");
      this.location.replaceState("/code/"+programmingLanguage+"/chapter/"+chapter+"/lang/"+language);
      console.log("CHAPTER AFTER CHANGE URL");
      //
      this.contentViewContainerRefToClear.forEach((el, c) => {
        c.clear();
        el.destroy();
        // el.clear();
      });
      this.chapterJavaService.notifyChangeFromTutorialBodyContent(chapter);
      this.tabViewContents = new Map();
      this.defaultContent = [];
      console.log(response);
      this.pageToShow = response;
      this.createPage(this.pageToShow);    
      this.updateMetaTag(this.pageToShow, true);
      
           
      if(response.videoYouTubeId != undefined)    
        this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
      else
      this.chapterJavaService.youTubeVideoChanged("");
      //   this.placeholderContainer.createComponent(TabPanelComponent);       
    });
    }else{
      let programmingLanguage = this.route.snapshot.paramMap.get('code');
      this.chapterJavaService.getPageBySubChapter(subChapter, programmingLanguage!).subscribe(response => {
        //  console.log("lunghezza prima: "+this.contentViewContainerRefToClear.length); 
        console.log("SUBCHAPTER "+subChapter);     
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })
         console.log("AFTER CLEAR AND DESTROY"); 
        //   this.contentViewContainerRefToClear =[];
        //console.log("lunghezza poi: "+this.contentViewContainerRefToClear.length);   
        console.log("NOTIFICATION");    
        this.chapterJavaService.notifyChangeFromTutorialBodyContentAboutSubChapter(subChapter);
        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log("nel subscribe ");
       // console.log(response);
        this.pageToShow = response;
        this.updateMetaTag(this.pageToShow, false);
       
     
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });      
    }

  }
    /*if (isPlatformServer(this.platformId)) {
      if((""+this.route).includes("chapter/1/lang")){
        this.chapterJavaService.getPageByChapter("1").subscribe(response => {
          this.chapterJavaService.notifyChangeFromTutorialBodyContent(chapter);
          console.log(response);
          this.pageToShow = response;
          this.createPage(this.pageToShow);
          this.metaService.updateTag({name: 'excerpt', content: ""+this.pageToShow.chapter?.chapterTitle});
        });
      }

    if((""+this.route).includes("1.1")){
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: "+this.route);
      this.chapterJavaService.getPageBySubChapter("1.1").subscribe(response => {
            
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })      
  
        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log("nel subscribe ");
        console.log(response);
        this.pageToShow = response;
        this.metaService.updateTag({name: 'excerpt', content: ""+this.pageToShow.chapter?.chapterTitle});
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });
    }
  }

  if (isPlatformServer(this.platformId)) {
    if((""+this.route).includes("1.2")){
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: "+this.route);
      this.chapterJavaService.getPageBySubChapter("1.2").subscribe(response => {
            
        this.contentViewContainerRefToClear.forEach((el, c) => {
          c.clear();
          el.destroy();
        })      
        this.tabViewContents = new Map();
        this.defaultContent = [];
        console.log("nel subscribe ");
        console.log(response);
        this.pageToShow = response;
        this.metaService.updateTag({name: 'excerpt', content: "non so cosa sia ma non è introduzione"});
        this.createPage(this.pageToShow);   
        if(response.videoYouTubeId != undefined)    
          this.chapterJavaService.youTubeVideoChanged(response.videoYouTubeId);
          else
        this.chapterJavaService.youTubeVideoChanged("");
      });
    }
  }
  */
/*
    if (isPlatformServer(this.platformId)) {
      
    this.chapterJavaService.getPageBySubChapter("1.1").subscribe(response => {
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

    this.chapterJavaService.getPageBySubChapter("1.2").subscribe(response => {
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
  }
*/
  /*}  else{
      this.chapterJavaService.getPageBySubChapter(this.lastChapterSelected?.subChapter!).subscribe(response => {
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
    }*/
    

  }

  private createPage(pageToShow: PageTutorial) {

    // this.defaultContent.push(`<h1 class="reddo">CREATE PAGE</h1>`);
    if (pageToShow.compontentsPage![0].componentType == "p-tabView") {
      pageToShow.compontentsPage?.forEach(e => {
     //   console.log("page: " + e.componentType);
        e.childComponentsPageTutorialList?.forEach(el => {
        //  console.log("component: " + el.componentContent);
        });
      });
      console.log("finitoooooooooooooooooooooo");
      this.createPageTabViewTemplate(pageToShow);
      this.createNestedTabView();
    } else {
      this.createPageDefaultTemplate(pageToShow);
      this.createNestedTabView();     
      this.createNestedHiddenCode();
      //creare il nested per il componente che nasconde il codice per gli esercizi
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
    this.nestedHiddenCodeContents = new Map();
    let idHiddenCodeChild = 0; 
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
      
    //  console.log("dentro il foreacjh");         
      
      if (el.childComponentsPageTutorialList!.length > 0) {
        let content = "";
        if (el.componentType != "p-tabView") {
         
          if (el.componentType != "hiddenCode"){             
            content = this.createInnestedComponent(el.childComponentsPageTutorialList!);
            this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id="${el.componentIdCss}">${content}</${el.componentType}>`);
          } else {            
            el.childComponentsPageTutorialList?.forEach(child => { //TODO prendo l'id del figlio di hiddenCode così da non farlo renderizzare nella pagina html fuori da suo padre
              //modificarlo prendendo una lista di di              
              idHiddenCodeChild = child.id!;
            })
            this.nestedHiddenCodeContents.set(((this.defaultContent.length - 1)+1)*10000, el);            
          }
          } else {            
          console.log("qui c'è una cazzo di tab e dobbiamo fare qualcosa "+this.nestedTabViewContents.size);
          this.nestedTabViewContents.set(this.defaultContent.length - 1, el);
        }
      } else {
       // console.log("introduzione: tipo: "+el.componentType);
       // console.log("introduzione: class: "+el.componentClassCss);
      //  console.log("introduzione: id: "+el.componentIdCss);
     
        if(el.id != idHiddenCodeChild){          
          this.defaultContent.push(`<${el.componentType} class="${el.componentClassCss}" id="${el.componentIdCss}">${el.componentContent}</${el.componentType}>`);
        }

      }
    });
  //  console.log("sto inserendo il primo hidden code")
  //  let c = new ComponentPageTutorial;
 //   this.nestedHiddenCodeContents.set(((this.defaultContent.length - 1)+1)*10000, c);
   
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
     // console.log("foreach " + content);
      //implementare la ricorsione appena avremo qualcosa da inserire
      if (el.childComponentsPageTutorialList!.length > 0) {
        let subContent: string = "";
     //   console.log("figli maggiorni di 0 con boolean:  " + el.standAlone);
     //   console.log("tag " + el.componentType);
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
    //console.log("nel metodo: " + content);
    return content;
  }

  //crea una stringa con le opzioni aggiuntive per il tag che poi verrà inserito nel tag
  private createOptionsTag(component: ComponentPageTutorial): string {
    let options: string = "";
  //  console.log("nel metodo option " + component.tagOptions!);
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
  //  this.components.changes.subscribe(() => {
      console.log("sto per partire. pronti...partenza...");
    this.nestedTabViewContents.forEach((tabElement, index) =>{
      //  console.log("elemento: "+tabElement.componentType!+" index: "+index);

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

  //  });
    indexToBeRemoved.forEach(id=>{
      this.nestedTabViewContents.delete(id);
    });
   

    
    });   
    //risolve l'errore NG0100 ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    this.changeDetector.detectChanges();
  }

  private createNestedHiddenCode(): void {
    
    console.log("create hidden code nested");
    let indexToBeRemoved: number[] = [];
    this.contentViewContainerRefHiddenCodeToClear = new Map();
  //  this.componentsHiddenCode.changes.subscribe(() => {
      console.log("sto per partire. pronti...partenza...");
    this.nestedHiddenCodeContents.forEach((HiddenElement, index) =>{
      //  console.log("elemento: "+HiddenElement.componentType!+" index: "+index);

        this.componentsHiddenCode.forEach(el => {         

          if (el.element.nativeElement.id == index) {

            let componentRef = el.createComponent(HiddenCodeComponent);          

            let contents: string[] = [];
           
            contents.push(HiddenElement.componentType!);            
            componentRef.instance.createPageHiddenCodeTemplate(HiddenElement);
            this.contentViewContainerRefHiddenCodeToClear.set(el, componentRef);
            indexToBeRemoved.push(index);
          }

        })

    });
    indexToBeRemoved.forEach(id=>{
      this.nestedHiddenCodeContents.delete(id);
    });
   

    
  //  });   
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

  public getUrlPath(): string{

    console.log("sto per usare route");

    var b = "{"+this.route+"}";
    console.log("ho usato route");
    var url = JSON.parse(b.replace('Route(',"").replace(")","")
     .replace("url","\"url\"")
     .replace("path","\"path\"")
     .replace("\'","\"").replace("\'","\"").replace("\'","\"").replace("\'","\""))['url'];
     
     return url;
  }

  public getChapterFromUrlPath(): string{
    //code/java/chapter/1/lang/it
    let pathUrl = this.getUrlPath();
    let chapter = pathUrl.substring(pathUrl.indexOf("chapter/"), pathUrl.length)
        .replace("chapter/", "").replace("/","£");

    console.log("subString of url for the chapte: "+chapter.substring(0, chapter.indexOf("£")));
    return chapter.substring(0, chapter.indexOf("£"));
  }

  public getSubChapterFromUrlPath(): string{
    let pathUrl = this.getUrlPath();
    let subChapter = pathUrl.substring(pathUrl.indexOf("subchapter/"), pathUrl.length)
        .replace("subchapter/", "").replace("/","£");

    console.log("subString of url for the chapte: "+subChapter.substring(0, subChapter.indexOf("£")));
    return subChapter.substring(0, subChapter.indexOf("£"));
  }

  public getCourseFromUrlPath(): string{
    //code/java/chapter/1/lang/it
    let pathUrl = this.getUrlPath();

    let course =  pathUrl.substring(pathUrl.indexOf("code/"), pathUrl.length).replace("code/", "").replace("/","£");

    console.log("subString of url for the chapte: "+course.substring(0, course.indexOf("£")));    
    
    if(course.includes("£"))
      return course.substring(0, course.indexOf("£"));
    else
      return course.substring(0, course.length);   
   
  }



private updateMetaTag(pageToShow: PageTutorial, isChapter: boolean):void{
  console.log("SIAMO NEL METATAG");
  if(isChapter){
    console.log("è un capitolo il titolo è: "+pageToShow.chapter?.chapterTitle);
    this.metaService.updateTag({property: 'og:title', content: ""+pageToShow.chapter?.chapterTitle});
    this.title.setTitle(""+pageToShow.chapter?.chapterTitle)
  }else{    
    console.log("è un sotto capitolo il titolo è: "+pageToShow.subChapter?.subChapterTitle);
    this.title.setTitle(""+pageToShow.subChapter?.subChapterTitle)
    this.metaService.updateTag({property: 'og:title', content: ""+pageToShow.subChapter?.subChapterTitle});
  }
  console.log("meta: "+pageToShow.metaTags);
  if(pageToShow.metaTags != null && pageToShow.metaTags != undefined){
    pageToShow.metaTags.forEach(meta=>{
 //     console.log("meta: "+meta.metaTypeName);
      if(meta.metaTypeName == "name"){
        this.metaService.updateTag({name: ''+meta.metaType, content: ""+meta.content});
      }
      if(meta.metaTypeName == "property"){
        this.metaService.updateTag({property: ''+meta.metaType, content: ""+meta.content});
      }
      if(meta.metaTypeName == "itemprop"){
        this.metaService.updateTag({itemprop: ''+meta.metaType, content: ""+meta.content});
      }
    })
  }

 
}

public showHide(){
  console.log("show hide");
}

}

