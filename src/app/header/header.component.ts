import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActiveAnimationSolid } from '../galaxysolid/services-solid/active-animation-solid.services';
import {MenuItem} from 'primeng/api';

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

  constructor(public translate: TranslateService, public animationService: ActiveAnimationSolid, private cookies: CookieService) {
    
    this.translate.addLangs(['it', 'en']);    
    
    if(this.cookies.check("LANG")){
      this.translate.setDefaultLang(this.cookies.get("LANG"));      
      this.selectedLenguage = {name: ''+this.cookies.get("LANG"), code: ''+this.cookies.get("LANG").toUpperCase()};
    }else{
      this.cookies.set("LANG","it");  
      this.translate.setDefaultLang(this.cookies.get("LANG"));  
    }  
    

    console.log("thema: "+this.activedThema);
    if(this.cookies.check("THEME")){
      this.setThema(this.cookies.get("THEME"));
    }else{
     this.cookies.set("THEME","light"); 
     this.activedThema = false;
     this.logo=""
    }

    console.log("thema: "+this.activedThema);

    this.languages = [
      {name: 'it', code:"IT"},
      {name: 'en', code: "EN"},
     
  ];
  
 
  this.translate.get("header.menu.header").forEach(e =>{      
    this.dropDownHeader = e;

    this.translate.get("header.menu.subItem").forEach(e =>{
     
      this.dropDownSubHeader = e;
      this.setLabels();
    });
  });
    

   }  

   private setLabels(){
    this.items =[{
      label: ''+this.dropDownHeader,
      icon:'pi pi-fw pi-book',      
      items:[{
        label: this.dropDownSubHeader,
        icon:'fa-brands fa-java',
        routerLink: "/code/java"        
      }]
    }];
   }

  ngOnInit(): void {    

  }

  onChange(String: string) {
    console.log('event :' + String);
    //console.log(event.value);
}

//metodo per il cambio della lingua
public switchLang(lang: string) {
  this.translate.use(lang);
  this.cookies.set("LANG",lang);
  
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
    this.cookies.set("THEME","dark");   
    this.activedThema = true;
    this.logo="-white";
  }
  else{
    this.animationService.changeTheme("light");    
    this.cookies.set("THEME","light");
    this.activedThema = false;
    this.logo="";
  }
}

public setThema(thema: string){

  document.body.classList.toggle(thema)  
  this.cookies.set("THEME",thema);  
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
  
  if(window.pageYOffset > 50)    
    document.getElementById('containerArrow')!.style.display = 'none';

    if(window.pageYOffset < 50)    
    document.getElementById('containerArrow')!.style.display = 'block';

  if(window.pageYOffset > 100)    
    document.getElementById('gooey-button')!.style.display = 'block';
  
  if((window.pageYOffset < 100))
    document.getElementById('gooey-button')!.style.display = 'none';
}

openCloseSideBar(){  
  document.getElementById('collapserSideBar')?.classList.toggle("collapse");
}



}


