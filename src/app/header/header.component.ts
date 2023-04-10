import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActiveAnimationSolid } from '../galaxysolid/services-solid/active-animation-solid.services';
import {MenuItem} from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { TutorialJavaService } from '../tutorial-content/services/tutorial-java.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigLanguageService } from '../config-service/config-language.service';

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
    private route: ActivatedRoute, private configLanguageService : ConfigLanguageService
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

    this.translate.get("header.menu.subItem").forEach(e =>{
     
      this.dropDownSubHeader = e;
      this.setLabels();
    });
  });
}

   }  

   private setLabels(){
    this.items =[{
      label: ''+this.dropDownHeader,
      icon:'pi pi-fw pi-book',      
      items:[{
        label: this.dropDownSubHeader,
        icon:'fa-brands fa-java',
        routerLink: "/code/java"
       /* items:[{
          label: this.dropDownSubHeader,
          icon:'fa-brands fa-java',
          routerLink: "/code/java",
        },
        {
          label: "spring boot",
          icon:'fa-brands fa-java',
          routerLink: "/code/java",
        }]*/       
      }]
       
    }];
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

  if(currentPath.includes("code"))
    this.configLanguageService.forcePropagateUpdateLanguage(lang);
  else  
    this.configLanguageService.forceSilecentUpdateLanguage(lang);
  
 /* if(currentPath.includes("code"))
    this.chapterJavaService.changeLanguage(lang);
  else
    this.chapterJavaService.changeLanguageSilent(lang);*/

  this.translate.get("header.menu.header").forEach(e =>{      
    this.dropDownHeader = e;

    this.translate.get("header.menu.subItem").forEach(e =>{
     
      this.dropDownSubHeader = e;
      this.setLabels();
    });
  });
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



}


