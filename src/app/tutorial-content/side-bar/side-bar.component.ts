
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {  Meta } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { delay } from 'rxjs';

import { ChaptersCourse } from "../models/chapters.model";
import { Children } from '../models/children.model';
import { PageTutorial } from '../models/page.model';
import { lastChapterSelected } from '../services/last-selected-chapter';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { UrlPathService } from '../services/url-path.service';
import { ConfigLanguageService } from 'src/app/config-service/config-language.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  private languageCode?: string;
  private language?: string;

  //current selected chapter or subchapter 
  private selectedElementInTheBar?:string;

  items!: MenuItem[];
  item!: MenuItem[];

  nodes: TreeNode[] = [];

  childrenParam!: Children[];
  chaptersJavaCourse?: ChaptersCourse[];

  pageToShow?: PageTutorial;

  selectedChapter?: TreeNode;
  previousChapter?: TreeNode;
  nextChapter?: TreeNode;

  selectedSubChapter?: TreeNode = undefined;
  previousSubChapter?: TreeNode = undefined;
  nextSubChapter?: TreeNode = undefined;

  lastChapterSelected?: lastChapterSelected = new lastChapterSelected();
  constructor(private router: Router, public chapterJavaService: TutorialJavaService, private route: ActivatedRoute,
    private cookies: CookieService, @Inject(PLATFORM_ID) private platformId: Object, private metaService: Meta, private urlPathService: UrlPathService, 
    private location: Location, private configLanguageService: ConfigLanguageService) {
       console.log("------------------COSTRUTTORE SIDE BAR-----------------------")

    this.selectedElementInTheBar ="1";

    this.chapterJavaService.actionFromTutorialBodyContentChanged$?.subscribe(key => {
      console.log("sono nel costruttore della sideBar ");
      this.initializeChapter(key);
    });

    this.chapterJavaService.actionFromTutorialBodyContentAboutSubChapterChanged$?.subscribe(key => {
      console.log("sono nel costruttore della sideBar per quanto riguarda il cambio del sotto capitolo "+key);
      if(isPlatformBrowser(this.platformId)){
      this.initializerSubChapterFromUrl(key);
      }
    });


    this.chapterJavaService.actionFromTutorialBodyNextContentChanged$?.subscribe(event => {
      console.log("sono nel costruttore della sideBar ");
      this.nextChapterFromRequestBody();
    });

    this.chapterJavaService.actionFromTutorialBodyPreviousContentChanged$?.subscribe(event => {
      this.previousChapterFromRequestBody();
    });

    this.chapterJavaService.actionFromHeaderChangeLanguareChanged$?.subscribe(event => {
    //  console.log("js"+window.location.href)
      console.log("sono nella sidebar, ho cambiato la lingua "+this.configLanguageService.getBrowserLanguage());
      
 
      let urlPath = this.urlPathService.getUrlPath(window.location.href);   
      this.location.replaceState(urlPath.substring(0, urlPath.length-2)+this.configLanguageService.getBrowserLanguage());
      console.log("sono nella sidebar, ho cambiato la lingua "+urlPath.substring(0, urlPath.length-2)); 

      window.location.reload();


    
    });
  
  }

  ngOnInit(): void {        
    if (isPlatformServer(this.platformId)) {
      
      this.chapterJavaService.getChapters("java", "it").subscribe(response => {//modificare il service per passargli il linguaggio di programmazione per recuperare i capitoli
      //  console.log(response);
        this.chaptersJavaCourse = response;
        this.nodes = [];
  
        this.chaptersJavaCourse.forEach(el => {
          console.log(el.id);
          console.log(el.chapterNumber);
  
          this.childrenParam = [];
  
          if (el.subChapters != null) {
  
            el.subChapters.forEach(subch => {
              let child = new Children;
              child.data = "" + subch.id;
              child.key = "" + subch.subChapterNumber;
              child.label = "" + subch.subChapterTitle;
  
              this.childrenParam.push(
                child
              );
  
            });
          }
  
          this.nodes.push({
            key: "" + el.chapterNumber,
            data: "" + el.id,
            label: el.chapterTitle,
            children: this.childrenParam
          });
        });
       // console.log(this.chaptersJavaCourse);
      });
     }
   
    if (isPlatformBrowser(this.platformId)) {
      this.initSidebar();
  }
  }

  public navigate() {
    this.router.navigate(["/auth/signin"]);
  }

  public changeChapter(lable: TreeNode, key: string) {
    console.log('--------------------------------------');
    console.log('scope chapter is key ' + lable.key);
    console.log('scope chapter is data ' + lable.data);
    console.log('scope chapter is ' + lable.label);
    console.log('scope chapter is ' + lable.children?.length);
    console.log('scope chapter is ex ' + lable.expanded);
    console.log('--------------------------------------');

    if (lable.expanded != true) {
      lable.expanded = true;
    }

    if(this.selectedElementInTheBar != lable.key){
      this.selectedElementInTheBar = lable.key;
    document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
    document.getElementById(this.selectedChapter?.key!)?.classList.remove("selectedArgument");
    document.getElementById(lable.key!)?.classList.add("selectedArgument");
      console.log("id del capitolo: "+lable?.data)
    this.chapterJavaService.changeIdChapter("" + lable?.key);
    this.lastChapterSelected!.chapter = lable?.data;
    this.lastChapterSelected!.subChapter = "0";
    this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
    //evaluate next chapter
    this.evalueateNextChapters(lable);
    this.evalueatePreviousChapters(this.selectedChapter!);
    this.initializeSubChapter(this.selectedChapter!);
    }
  }

  public changeSubChapter(lable: TreeNode, key: string) {
    console.log('--------------------------------------' + key);
    console.log('scope subchapter is ' + lable.key);
    console.log('sotto capitolo numero:  ' +key.substring(key.indexOf(".")+1,key.length));
    console.log('scope subchapter data ' + lable.data);
    console.log('scope subchapter is ' + lable.label);
    console.log('scope subchapter is ' + lable.children?.length);

    console.log('---------------------------parent-------' + lable.parent?.key);

    if(this.selectedElementInTheBar != lable.key){
      this.selectedElementInTheBar = lable.key;
    document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
    document.getElementById(lable.key!)?.classList.add("selectedArgument");    

    this.chapterJavaService.changeIdSubChapter(key);
    
    //calcoliamo i nuovi valori
    this.evalueateNextSubChapters(lable!);
    this.evalueatePreviousSubChapters(this.selectedSubChapter!);

    if(lable.parent?.key != this.selectedChapter?.key){
      document.getElementById(this.selectedChapter?.key!)?.classList.remove("selectedArgument");
      this.evalueateNextChapters(lable.parent!);
      this.evalueatePreviousChapters(this.selectedChapter!);
      document.getElementById(this.selectedChapter?.key!)?.classList.add("selectedArgument");
    }
    this.lastChapterSelected!.subChapter = key;
    this.lastChapterSelected!.chapter = this.selectedChapter!.data;
    this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
  }
  }

  private initializerSubChapterFromUrl(selectedSubCapId: string){
    //settaggio per selezionare il capitolo
    let chapterId = selectedSubCapId.substring(0,selectedSubCapId.indexOf("."));
    document.getElementById(chapterId)?.classList.add("selectedArgument");
    
     
    this.selectedChapter = this.nodes[Number(chapterId) - 1];
    this.metaService.updateTag({name: 'keywords', content: ""+this.selectedChapter.key+" boh"});
    if (this.nodes.length > Number(chapterId))
      this.nextChapter = this.nodes[Number(chapterId)];
    else
      this.nextChapter = undefined;

    if((Number(chapterId) - 1) > 0)
      this.previousChapter = this.nodes[Number(chapterId) - 2];
    else
      this.previousChapter = undefined;

      if (this.selectedChapter?.expanded != true) {
        this.selectedChapter!.expanded = true;
      }

      //settaggio per selezionare il sotto capitolo
      let subChapterId = selectedSubCapId.substring(selectedSubCapId.indexOf(".")+1, selectedSubCapId.length);

      console.log("il sub chapterId sottostringa: "+subChapterId);
      if(this.selectedChapter.children != undefined){
        if(this.selectedChapter.children?.length >= Number(subChapterId))
          this.selectedSubChapter = this.selectedChapter.children[Number(subChapterId)-1];

        if((this.selectedChapter.children?.length > 0 && (Number(subChapterId)-1) > 0) && (this.selectedChapter.children?.length >= (Number(subChapterId)-1)))
          this.previousSubChapter = this.selectedChapter.children[Number(subChapterId)-2];
          else  
            this.previousSubChapter = undefined;

        if(this.selectedChapter.children?.length > Number(subChapterId))
          this.nextSubChapter = this.selectedChapter.children[Number(subChapterId)];

          setTimeout(() => {     
            document.getElementById(selectedSubCapId)?.classList.add("selectedArgument");     
           
        }, 0.1);
        }

        
        
      
 //     this.nextSubChapter = this.selectedChapter.children[0];           
    

  }

  private initializeChapter(selectedCapId: string) {
    
   /* 
    if(!this.cookies.check("lastChapterSelected")){
        this.lastChapterSelected!.chapter = selectedCapId;
        this.lastChapterSelected!.subChapter = "0";
        this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected));      
    }else{
      this.lastChapterSelected = JSON.parse(this.cookies.get("lastChapterSelected"));      
      selectedCapId = ""+this.lastChapterSelected?.chapter;
    }

    
    console.log("inizializzo con keya: " + this.lastChapterSelected?.chapter);
    console.log("inizializzo con keyb: " + this.lastChapterSelected?.subChapter);*/
    console.log("inizializzo con key: " + selectedCapId);     
    document.getElementById(selectedCapId)?.classList.add("selectedArgument");
    
    this.selectedChapter = this.nodes[Number(selectedCapId) - 1];
    console.log("node length: " + this.nodes.length);
    
    

    if (this.nodes.length > 1)
      this.nextChapter = this.nodes[Number(this.selectedChapter!.key)];

    this.previousChapter = undefined;

    if (this.selectedChapter?.expanded != true) {
      this.selectedChapter!.expanded = true;
    }  

    this.initializeSubChapter(this.selectedChapter);
    console.log("capitolo successivo: " + this.nextChapter?.key);
    console.log("sotto capitolo successivo: " + this.nextSubChapter?.key);
    
  }

  

  private initializeSubChapter(actualChapterSelected: TreeNode) {
    var selectedSubChapter = "1";
    /*
   if(!(this.lastChapterSelected?.subChapter == "0")){
    setTimeout(() => {     
      document.getElementById(this.lastChapterSelected?.subChapter!)?.classList.add("selectedArgument");     
     
  }, 0.1);

    var subChapterFlat = this.lastChapterSelected?.subChapter!;
    selectedSubChapter = subChapterFlat.substring(subChapterFlat.indexOf(".")+1, subChapterFlat.length);
    console.log("sottocapitolo: "+selectedSubChapter);
   }*/
   console.log("nella sideBar = "+actualChapterSelected.children);
    if (actualChapterSelected.children != undefined) {

      //this.selectedSubChapter = document.getElementById("1.3").;
    //  console.log("elemento html: "+document.getElementById("1.3"));
    // console.log("sono dell'if dell'init subchapter: "+actualChapterSelected.children[Number(selectedSubChapter)-1].parent);

      this.nextSubChapter = actualChapterSelected.children[0];     
      this.selectedSubChapter = undefined;
      this.previousSubChapter = undefined;
      
    //  console.log("sono dell'if dell'init subchapter parent: "+this.selectedSubChapter.parent);
    //  this.chapterJavaService.changeIdSubChapter(this.selectedSubChapter.key!);
     

    /*  this.evalueatePreviousSubChapters(this.selectedSubChapter);
      this.evalueateNextSubChapters(this.selectedSubChapter);
      console.log("sottocapitolo precedente: "+this.previousSubChapter?.label);
      console.log("sottocapitolo successivo: "+this.selectedSubChapter.label);*/
    }
  }



  private nextChapterFromRequestBody() {    
    console.log("nextChapterFromRequestBody");
    //console.log("sub: " + this.nextSubChapter?.key);
    console.log("sub: " + this.nextSubChapter);
    if (this.nextSubChapter != undefined) {
      document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
      //this.nextSubChapter.key.substring(key.indexOf(".")+1,key.length)
      this.chapterJavaService.changeIdSubChapter(""+this.nextSubChapter.key);      
      document.getElementById(this.nextSubChapter?.key!)?.classList.add("selectedArgument");

      this.lastChapterSelected!.subChapter = this.nextSubChapter.key;
      this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
      //evaluete new subChapters
      this.evalueateNextSubChapters(this.nextSubChapter);
      this.evalueatePreviousSubChapters(this.selectedSubChapter!);
    } else if (this.nextChapter != undefined) {
      document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
      document.getElementById(this.selectedChapter?.key!)?.classList.remove("selectedArgument");
      this.chapterJavaService.changeIdChapter(this.nextChapter.key!);      
      document.getElementById(this.nextChapter?.key!)?.classList.add("selectedArgument");
      this.lastChapterSelected!.chapter =this.nextChapter.key;
      this.lastChapterSelected!.subChapter = "0";
      this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   

      this.evalueateNextChapters(this.nextChapter);
      this.evalueatePreviousChapters(this.selectedChapter!);
      
      this.initializeSubChapter(this.selectedChapter!);
    }

  }

  private previousChapterFromRequestBody() {

    if (this.previousSubChapter != undefined) {
      document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
      
      this.chapterJavaService.changeIdSubChapter(""+this.previousSubChapter.key);
      document.getElementById(this.previousSubChapter?.key!)?.classList.add("selectedArgument");

      this.lastChapterSelected!.subChapter = this.previousSubChapter?.key!;
      this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
      //evaluete new subChapterss
      this.evalueatePreviousSubChapters(this.previousSubChapter);
      this.evalueateNextSubChapters(this.selectedSubChapter!);
     
    } else if (this.previousChapter != undefined) {
      document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
      document.getElementById(this.selectedChapter?.key!)?.classList.remove("selectedArgument");

      if(this.previousChapter.children == undefined || this.previousChapter.children.length == 0){
        this.chapterJavaService.changeIdChapter(this.previousChapter.key!);
        this.lastChapterSelected!.chapter = this.previousChapter?.key!;
        this.lastChapterSelected!.subChapter = "0";        
        this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
        this.evalueatePreviousChapters(this.previousChapter);
        this.evalueateNextChapters(this.selectedChapter!);
       
        this.initializeSubChapter(this.selectedChapter!);
        
      }else{
        let selectedSubChapter = this.previousChapter.children[this.previousChapter.children.length-1];        
        this.chapterJavaService.changeIdSubChapter(selectedSubChapter.key!);
        document.getElementById(selectedSubChapter?.key!)?.classList.add("selectedArgument");
        this.lastChapterSelected!.subChapter = this.selectedSubChapter?.key!;
        this.cookies.set("lastChapterSelected", JSON.stringify(this.lastChapterSelected), { path: '/' });   
        this.evalueatePreviousSubChapters(selectedSubChapter);
        this.evalueateNextSubChapters(this.selectedSubChapter!);
        this.evalueatePreviousChapters(this.previousChapter);
        this.evalueateNextChapters(this.selectedChapter!);
      }

      document.getElementById(this.selectedChapter?.key!)?.classList.add("selectedArgument");
      //evaluate new chapters
      
    }

  }

  //calcolo sub chapter successivo
  private evalueateNextSubChapters(acutalSubChaptersStart: TreeNode) {
    console.log("evaluate next subChapter. Parend: " + acutalSubChaptersStart.parent?.key);
    this.selectedSubChapter = acutalSubChaptersStart;

    let children: TreeNode[] = [];
    //calcoliamo il next:
    if (acutalSubChaptersStart.parent?.children != undefined)
      children = acutalSubChaptersStart.parent?.children;

    if (children.length > 0) {
      let indexOfSelectedSubChapter = children.indexOf(this.selectedSubChapter);
      if (indexOfSelectedSubChapter == (children.length - 1)) {
        this.nextSubChapter = undefined;
      } else {
        this.nextSubChapter = children[indexOfSelectedSubChapter + 1];
      }
    }
    console.log("-----------next--SUB-------------------");
    console.log("selected sub chapter " + this.selectedSubChapter.key);
    console.log("nex sub chapter " + this.nextSubChapter?.key);
    console.log("previous sub chapter " + this.previousSubChapter?.key);

  }

  //calcolo chapter successivo
  private evalueateNextChapters(acutalChaptersStart: TreeNode) {
    console.log("evaluate next subChapter. ");
    this.selectedChapter = acutalChaptersStart;

    let children: TreeNode[] = [];
    //calcoliamo il next:

    if((this.nodes.length - 1 ) > this.nodes.indexOf(this.selectedChapter)){
      this.nextChapter = this.nodes[this.nodes.indexOf(this.selectedChapter)+1];
    }else{
      this.nextChapter = undefined;
    }
  
    console.log("-----------next---------------------");
    console.log("selected  chapter " + this.selectedChapter.key);
    console.log("nex  chapter " + this.nextChapter?.key);
    console.log("previous  chapter " + this.previousChapter?.key);

  }

  //calcolo sub chapter precedente
  private evalueatePreviousSubChapters(actualSubChaptersStart: TreeNode) {
    console.log("evaluate previous subChapter. Parend: " + actualSubChaptersStart.parent?.key);
    this.selectedSubChapter = actualSubChaptersStart;

    let children: TreeNode[] = [];

    if (actualSubChaptersStart.parent?.children != undefined)
      children = actualSubChaptersStart.parent?.children;

    if (children.length > 0) {
      if (children.indexOf(this.selectedSubChapter) == 0) {
        this.previousSubChapter = undefined;
      } else {
        this.previousSubChapter = children[children.indexOf(this.selectedSubChapter) - 1];
      }
    }

    console.log("-----------previous----SUB-----------------");
    console.log("selected sub chapter " + this.selectedSubChapter.key);
    console.log("nex sub chapter " + this.nextSubChapter?.key);
    console.log("previous sub chapter " + this.previousSubChapter?.key);

  }

  //calcolo chapter precedente
  private evalueatePreviousChapters(actualChaptersStart: TreeNode) {
    console.log("evaluate previous subChapter. Parend: ");
    this.selectedChapter = actualChaptersStart;


    if(this.nodes.indexOf(this.selectedChapter) > 0 ){
      this.previousChapter = this.nodes[this.nodes.indexOf(this.selectedChapter)-1];
    }else{
      this.previousChapter = undefined;
    }

    console.log("-----------previous---------------------");
    console.log("selected  chapter " + this.selectedChapter.key);
    console.log("nex  chapter " + this.nextChapter?.key);
    console.log("previous  chapter " + this.previousChapter?.key);

  }

  refreshChildSelectedAddedEffects(event: any){
   
   if(event.node.key == this.selectedChapter?.key)
   (async () => { 
    setTimeout(() => 
    {
      document.getElementById(this.selectedSubChapter?.key!)?.classList.add("selectedArgument");
    },
    50);

      })();    
  }

  refreshChildSelectedRemoveEffects(event: any){    
    if(event.node.key == this.selectedChapter?.key)
      document.getElementById(this.selectedSubChapter?.key!)?.classList.remove("selectedArgument");
  }

  initSidebar(){
    this.languageCode = this.route.snapshot.paramMap.get('code')!;

    this.chapterJavaService.getChapters(this.languageCode, "").subscribe(response => {//modificare il service per passargli il linguaggio di programmazione per recuperare i capitoli
      //console.log(response);
      this.chaptersJavaCourse = response;
      this.nodes = [];

      this.chaptersJavaCourse.forEach(el => {
        console.log(el.id);
        console.log(el.chapterNumber);

        this.childrenParam = [];

        if (el.subChapters != null) {

          el.subChapters.forEach(subch => {
            let child = new Children;
            child.data = "" + subch.id;
            child.key = "" + subch.subChapterNumber;
            child.label = "" + subch.subChapterTitle;

            this.childrenParam.push(
              child
            );

          });
        }

        this.nodes.push({
          key: "" + el.chapterNumber,
          data: "" + el.id,
          label: el.chapterTitle,
          children: this.childrenParam
        });
      });
      //console.log(this.chaptersJavaCourse);
    });

  
    /*
        this.nodes = [
          {
              key: '0',
              label: 'Introduction',
              children: [
                  {key: '0-0', label: 'What is Angular', data:'https://angular.io', type: 'url'},
                  {key: '0-1', label: 'Getting Started', data: 'https://angular.io/guide/setup-local', type: 'url'},
                  {key: '0-2', label: 'Learn and Explore', data:'https://angular.io/guide/architecture', type: 'url'},
                  {key: '0-3', label: 'Take a Look', data: 'https://angular.io/start', type: 'url'}
              ]
          },
        {
            key: '1',
            label: 'sto cazzo',
            children: [
    
            ]
        }];
        */
    this.item = [
      {
        label: "capitolo 0",
        items: [{
          label: 'introduzione',
          command: () => this.navigate(),

        }]
      }
 
    ]
  }


}
