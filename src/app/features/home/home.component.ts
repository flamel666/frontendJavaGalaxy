import { Component, HostListener, OnInit, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfigLanguageService } from 'src/app/config-service/config-language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  displayModal: boolean = false;

  constructor(private router: Router, private configLanguageService: ConfigLanguageService, private cookieCreator: CookieService) { 
    
    if(!this.cookieCreator.check("betaModalVisited")){
      this.displayModal = true;      
    }
  }


  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: MouseEvent) {
   
    if(window.pageYOffset > 50)    
    document.getElementById('containerArrow')!.style.display = 'none';

    if(window.pageYOffset < 50)    
    document.getElementById('containerArrow')!.style.display = 'block';
   
  }

  public goToCourses(): void{
    this.router.navigate(["/code/lang/"+this.configLanguageService.getBrowserLanguage()]);
  }

  public hideModal(): void{
    this.displayModal = false;
    this.cookieCreator.set("betaModalVisited","read");
  }
  
}