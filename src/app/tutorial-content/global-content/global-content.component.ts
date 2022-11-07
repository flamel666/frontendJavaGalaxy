import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-global-content',
  templateUrl: './global-content.component.html',
  styleUrls: ['./global-content.component.scss']
})
export class GlobalContentComponent implements OnInit {    

  constructor(private router: Router) {
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
          return;
      }
      window.scrollTo(0, 0)
  });
  }

  ngOnInit(): void {   
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
          return;
      }
      window.scrollTo(0, 0)
  });
  }


  public navigate(){
    this.router.navigate(["/auth/signin"]);
  }

}
