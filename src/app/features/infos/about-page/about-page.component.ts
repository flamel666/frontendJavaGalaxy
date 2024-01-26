import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  private lastMenuItemChoiseId: string = "bassodestra";

  showContent: string = "bassodestra";

  constructor(private router: Router) {
    console.log("costruttore chiamato");
   }

  ngOnInit(): void {
    console.log("costruttore chiamato 2");
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

}
