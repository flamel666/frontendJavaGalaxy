import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActiveAnimationSolid } from '../galaxysolid/services-solid/active-animation-solid.services';
import {MenuItem} from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { TutorialJavaService } from '../tutorial-content/services/tutorial-java.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigLanguageService } from '../config-service/config-language.service';
import { json } from 'express';
import { Platform } from '@angular/cdk/platform';

interface Language {
  name: string
  code: String
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
 
  @ViewChild("drop", {static: false}) dropDownelement!: ElementRef;

  languages!: Language[];

  selectedLenguage!: Language;

  items!: MenuItem[];

  activedThema?: boolean;//true se light else false
  openSideBar: boolean = false;
  logo: string="";
  
  private dropDownHeader!: string;
  private dropDownSubHeader!: string;

  constructor(public translate: TranslateService, public animationService: ActiveAnimationSolid, 
    private cookies: CookieService, @Inject(PLATFORM_ID) private platformId: Object, public chapterJavaService: TutorialJavaService, 
    private route: ActivatedRoute, private configLanguageService : ConfigLanguageService, private platform: Platform
    ) {
    
     if (isPlatformBrowser(this.platformId)) {
        this.translate.addLangs(['it', 'en']);    
        console.log("COSTRUTTORE HEADER");
      let lang = configLanguageService.getBrowserLanguage();

      this.selectedLenguage = {name: ''+lang, code: ''+lang.toUpperCase()};
      this.translate.setDefaultLang(lang);             

      this.languages = [
        {name: 'it', code:"IT"},
        {name: 'en', code: "EN"},       
      ];  
    
    
    console.log("thema: "+this.activedThema);
    if(this.cookies.check("THEME")){
      this.setThema(this.cookies.get("THEME"));
    }else{
     this.cookies.set("THEME","light", { path: '/' }); 
     this.activedThema = false;
     this.logo=""
    }

    console.log("thema: "+this.activedThema);

   
    
  this.translate.get("header.menu.header").forEach(e =>{      
    this.dropDownHeader = e;

   /* this.translate.get("header.menu.subItem").forEach(e =>{
     
      this.dropDownSubHeader = e;
     // this.setLabels();
    });*/
  });


  chapterJavaService.getCourses().subscribe(reponse => {
    let courses: MenuItem[] = [];
   
    let counterSubCorses: number = 0;
    let counterCorses: number = 0;
    let separator: MenuItem;
    separator = {} as MenuItem;
    separator.separator = true;
    counterCorses = reponse.length;
      reponse.forEach(async course =>{
        let courseItem: MenuItem = {};

        let nameCourse = course.courseName;
            if(course.translateCourse != undefined){
              const n = await this.getTranslateLabel(course.translateCourse);
              nameCourse = n;
            }

        courseItem.label = nameCourse;
        courseItem.icon = course.iconCourse;
        courseItem.styleClass = course.translateCourse;
        courseItem.routerLink = "/code/lang/"+configLanguageService.getBrowserLanguage();
        console.log("Router link: "+courseItem.routerLink);
        courseItem.disabled = !course.activeCourse;
        
        courseItem.command = (event: any) => {
          this.touchScreenDetec();
        }
        let subCourseItem: MenuItem = {};
        
        if(course.subCourses?.length != undefined && course.subCourses?.length > 0){
          courseItem.items = [];
          counterSubCorses = course.subCourses.length;
          course.subCourses.forEach(async subCoruse =>{
            let nameSubCourse = subCoruse.subCourseName;
            if(subCoruse.translateSubCourse != undefined){
              const n2 = await this.getTranslateLabel(subCoruse.translateSubCourse);
              nameSubCourse = n2
            }
            
            subCourseItem.label = nameSubCourse;
            subCourseItem.icon = subCoruse.iconSubCourse;
            subCourseItem.routerLink = "/code/"+nameSubCourse?.replace(" ", "-");
            subCourseItem.styleClass = subCoruse.translateSubCourse;
            subCourseItem.disabled = !subCoruse.activeSubCourse;
            subCourseItem.command = (event: any) => {
              this.closeSideBar();
            }
           
              
            courseItem.items?.push(subCourseItem);
            if((counterSubCorses-1)>0) {
              courseItem.items?.push(separator);
              counterSubCorses--;
            }
            subCourseItem = {};

          });
        }
       
        courses.push(courseItem);
        if((counterCorses-1)>0) {
          courses.push(separator);
          counterCorses--;
        }
      });

      this.setLabels(courses);
  });
}

   }  

   private setLabels(courses: MenuItem[]){

    this.items = [{
      label: ''+this.dropDownHeader,
      icon:'pi pi-fw pi-book', 
      items: courses,
      styleClass: "header"
    }];
    
   }

   private async getTranslateLabel(label: string): Promise<string>{
    let labelTranslated : string = "";
    await this.translate.get("header.menu."+label).forEach(e =>{
      console.log("tradotto: "+e);
      labelTranslated = e;   
    });

    return labelTranslated;
   }

  ngOnInit(): void {    

  }

  onChange(String: string) {
  //  console.log('event :' + String);
    //console.log(event.value);
}

//metodo per il cambio della lingua
public switchLang(lang: string) {
  console.log("HEADERlocation: "+this.route.snapshot);
  console.log("HEADERlocation: "+window.location.href);

  this.translate.use(lang);

  let currentPath = window.location.href;
  console.log("HEADERlocation code: "+currentPath.includes("code/lang"));
  console.log("HEADERlocation code: "+!(currentPath.includes("code/lang")));
  console.log("HEADERlocation home: "+currentPath.includes("home"));
  console.log("HEADERlocation home: "+!(currentPath.includes("home")));
  if(!(currentPath.includes("code/lang")) && !(currentPath.includes("home"))){
    console.log("--------------FORZO-----------------");
    this.configLanguageService.forcePropagateUpdateLanguage(lang);
  }
  else  
    this.configLanguageService.forceSilecentUpdateLanguage(lang);  

  let myItem: MenuItem[] = Object.assign([], this.items);

  myItem.forEach(async item =>{
    console.log("sto per tradurre: "+item.label);
    console.log("sto per tradurre con style: "+item.styleClass);
    
    const value = await this.getTranslateLabel(item.styleClass!);
    item.label = value;
  
    console.log("Router link after change: "+item.routerLink);
    if(item.items?.length != undefined && item.items?.length > 0){
      item.items.forEach(async subItem => {
        
        console.log("sto per tradurre: "+subItem.label);
        console.log("sto per tradurre con style: "+subItem.styleClass);
        subItem.routerLink = "/code/lang/"+this.configLanguageService.getBrowserLanguage();
        if(subItem.styleClass != undefined){
          const value2 = await this.getTranslateLabel(subItem.styleClass!);
          subItem.label = value2;
          if(subItem.items?.length != undefined && subItem.items?.length > 0){
            subItem.items.forEach(async subSubItem => {
              if(subSubItem.styleClass != undefined){
              const value2 = await this.getTranslateLabel(subSubItem.styleClass!);
              subSubItem.label = value2;
              subSubItem.routerLink = "/code/"+subSubItem.label.replace(" ", "-");
              }
            });
          }
        }
      });
    }
    
   /*await this.translate.get("header.menu."+item.styleClass!).forEach(e =>{
      console.log("tradotto: "+e);
      s = e;
      item.label = s;
      
    //  this.setLabels();
    });*/


  
    //  item.label = "s";    
     
    this.updateItem(myItem);
 ///  item.label = s;//this.getTranslateLabel(item.styleClass!);
   
  });
  console.log("assegno");
 // this.items = [];
 // this.items = myItem;
 // this.items.forEach(item =>{

  //  item.label = "nameCourse";
   /* console.log("translate: "+item.styleClass);
    console.log("translate: "+this.getTranslateLabel(item.styleClass!));
    let nameCourse = item.label;
    if(item.styleClass != undefined)
      nameCourse = this.getTranslateLabel(item.styleClass);
    item.label = nameCourse;

    if(item.items?.length != undefined && item.items?.length > 0){
      item.items.forEach(subItem =>{
        let nameSubCourse = subItem.label;
        if(subItem.styleClass != undefined)
          nameSubCourse = this.getTranslateLabel(subItem.styleClass);
        subItem.label = nameSubCourse;

        if(subItem.items?.length != undefined && subItem.items?.length > 0){
          subItem.items.forEach(subSubItem =>{
            let nameSubSubCourse = subSubItem.label;
            if(subSubItem.styleClass != undefined)
            nameSubSubCourse = this.getTranslateLabel(subSubItem.styleClass);
              subSubItem.label = nameSubSubCourse;
          })

        }

      });
    }*/
 // });
/*
  this.translate.get("header.menu.header").forEach(e =>{      
    this.dropDownHeader = e;

    this.translate.get("header.menu.subItem").forEach(e =>{
     
      this.dropDownSubHeader = e;
    //  this.setLabels();
    });
  });*/
}

private updateItem(myItem: MenuItem[]): void{
  this.items = myItem;
}

public switchColor(): void{

  console.log('colore cambiato prova elementohtml '+this.dropDownelement.nativeElement);
  
  document.body.classList.toggle("dark")
  console.log("contiene dark: " +document.body.classList.contains("dark"));
  if(document.body.classList.contains("dark")){
    this.animationService.changeTheme("dark");    
    this.cookies.delete("THEME");
    this.cookies.set("THEME","dark", { path: '/' });   
    this.activedThema = true;
    this.logo="-white";
  }
  else{
    this.animationService.changeTheme("light");    
    this.cookies.set("THEME","light", { path: '/' });
    this.activedThema = false;
    this.logo="";
  }
}

public setThema(thema: string){

  document.body.classList.toggle(thema)  
  if(document.body.classList.contains("dark")){
    this.cookies.delete("THEME");
    this.cookies.set("THEME",thema, { path: '/' });  
  }else{
    this.cookies.set("THEME",thema, { path: '/' });  
  }
  this.activedThema = (thema=='light' ? false : true);
  if(thema=='light')
    this.logo="";
    else
    this.logo="-white";
}

onTop(){  
  window.scrollTo(0, 0);
}

@HostListener('window:scroll', ['$event'])
onScroll(event: MouseEvent) {  

  if(window.pageYOffset > 100)    
    document.getElementById('gooey-button')!.style.display = 'block';
  
  if((window.pageYOffset < 100))
    document.getElementById('gooey-button')!.style.display = 'none';
}

openCloseSideBar(){  
  
  document.getElementById('collapserSideBar')?.classList.toggle("collapse");
 
}


touchScreenDetec(){
  let isTouchDevice = this.platform.isBrowser && navigator.maxTouchPoints > 0;

  if(isTouchDevice)
    this.closeSideBar();
}

closeSideBar(){
  document.getElementById('collapserSideBar')?.classList.add("collapse");
}


}


