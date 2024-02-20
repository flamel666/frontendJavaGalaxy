import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  private lastMenuItemChoiseId: string = "bassodestra";

  showContent: string = "bassodestra";

  constructor(private router: Router, private metaService: Meta) {
    console.log("costruttore chiamato");
    this.setMetaTags();
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
          return;
      }
      window.scrollTo(0, 0)
    });  
   }

  ngOnInit(): void {
    document.getElementById(this.lastMenuItemChoiseId)?.classList.add("clicked"+this.lastMenuItemChoiseId);
  }

  public menuClicked(id: string): void{
    
    if(this.lastMenuItemChoiseId != id) {
      console.log("cliccato: "+id);
      this.showContent = id;
      document.getElementById(this.lastMenuItemChoiseId)?.classList.remove("clicked"+this.lastMenuItemChoiseId);
      document.getElementById(id)?.classList.add("clicked"+id);
      this.lastMenuItemChoiseId = id;
    }

  }

  private setMetaTags() : void{
    this.metaService.updateTag({property: 'og:title', content: "About me page"});
    this.metaService.updateTag({property: 'og:type', content: "article"});
  }

}
