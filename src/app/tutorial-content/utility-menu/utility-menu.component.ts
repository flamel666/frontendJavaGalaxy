import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import {  MessageService } from 'primeng/api';
import { TutorialJavaService } from '../services/tutorial-java.service';


@Component({
  selector: 'app-utility-menu',
  templateUrl: './utility-menu.component.html',
  styleUrls: ['./utility-menu.component.scss']
})
export class UtilityMenuComponent implements OnInit {

  public availabilityMessage: string = "Video non ancora disponibile";
  public isAvailable: boolean = false;
  public num: number = 10;
  
  public videoId: string = "";

  private lastScroll =0;

  constructor(private messageService: MessageService, public chapterJavaService: TutorialJavaService) { 
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

  
@HostListener('window:scroll', ['$event'])
onScroll(event: MouseEvent) {   
  
  if(window.scrollY>=78){   
  document.getElementById("ContentToolBar")!.style.marginTop = ""+(window.scrollY-78)+"px";
  }else{
    document.getElementById("ContentToolBar")!.style.marginTop = "0px";
  }

}


}
