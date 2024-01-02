import { Component, OnInit, HostListener, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import {  MessageService } from 'primeng/api';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { fromEvent, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { media } from '../services/media-query.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-utility-menu',
  templateUrl: './utility-menu.component.html',
  styleUrls: ['./utility-menu.component.scss']
})

export class UtilityMenuComponent implements OnInit {

  public availabilityMessage: string = "Video non ancora disponibile";
  public isAvailable: boolean = false;
  public num: number = 10;
  public height: number = 300;
  public width: number = 630;
  public created: boolean = false;

  public iconBook: string = "fa-sharp fa-solid fa-book";
  
  public videoId: string = "";

  private lastScroll =0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private messageService: MessageService, public chapterJavaService: TutorialJavaService) { 
    if (isPlatformBrowser(this.platformId)) {
    media('(max-width: 2024px) and (min-width: 769px)').subscribe((matches) =>{
      console.log("1024px= "+matches) 
      if(!this.created && !matches){

      }else{     
       
        if(matches){
          this.height = 300;
        this.width = 630;
        }
      }
    }
    );
    media('(max-width: 768px) and (min-width: 481px)').subscribe((matches) =>{
    console.log("768px=1 "+matches) // true or false
    console.log("768px=1 "+this.created)
    if(!this.created && !matches){
      console.log("768px=2 "+matches) // true or false
      console.log("768px=2 "+this.created)
    }else{
      console.log("768px=3 "+matches) // true or false
    console.log("768px=3 "+this.created)
    if(!matches){
      this.height = 300;
      this.width = 630;
    }else{
    this.height = 250;
    this.width = 540;
    } }
  }
  );
  media('(max-width: 480px)').subscribe((matches) =>{
  console.log("480px= "+matches) // true or false
  if(!this.created && !matches){

  }else{
  if(matches){
    this.height = 150;
    this.width = 315;
  }}
}
);
  this.created = true;
    this.chapterJavaService.youtubeVideoChanged$?.subscribe(idVideo => {
      console.log("entrato: "+idVideo)
      if(idVideo == ""){
        console.log("video vuoto: ")
        this.availabilityMessage = "Video non ancora disponibile";
        this.isAvailable = false; 
        this.videoId = idVideo;
        document.getElementById("youTubeContent")?.classList.remove("openYouTubeContentAnimation");
      }else{
      this.videoId = idVideo;
      this.isAvailable = true;      
      this.availabilityMessage = "";
      }
    });
  }
  }

  

  ngOnInit(): void {
    
  }


  public openAndCloseBurger() {
    document.getElementById("burgerUtilityMenu")?.classList.toggle("open");
    document.getElementById("contentMenuLeft")?.classList.toggle("contentMenuLeftOpen");
    document.getElementById("contentMenuRight")?.classList.toggle("contentMenuRightOpen");
    document.getElementById("toolBarShake")?.classList.toggle("toolBarShake");

    if(document.getElementById("youTubeContent")?.classList.contains("openYouTubeContentAnimation")){
      document.getElementById("youTubeContent")?.classList.remove("openYouTubeContentAnimation");
    }

  }


  public openAndCloseYouTube() {
    //open and close youtube content
    document.getElementById("youTubeContent")?.classList.toggle("openYouTubeContentAnimation");  
    
  }

  public openAndCloseLegend(){
    document.getElementById("utilitySideBar")?.classList.toggle("utilitySideBarOpen"); 
    if(document.getElementById("utilitySideBar")?.classList.contains("utilitySideBarOpen")){
      this.iconBook = "fa-solid fa-book-open";
    } else {
      this.iconBook = "fa-sharp fa-solid fa-book";
    }
  }

  
@HostListener('window:scroll', ['$event'])
onScroll(event: MouseEvent) {   
  
  if(window.scrollY>=78){   
  document.getElementById("ContentToolBar")!.style.marginTop = ""+(window.scrollY-78)+"px";
  }else{
    document.getElementById("ContentToolBar")!.style.marginTop = "0px";
  }

}

}
