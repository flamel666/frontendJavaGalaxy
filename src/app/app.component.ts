import { Component } from '@angular/core';

//import per la traduzione
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'javaGalaxy';

  
  /*
  constructor(public translate: TranslateService) {
    translate.addLangs(['it', 'en']);
    translate.setDefaultLang('en');
  }

  //metodo per il cambio della lingua
  public switchLang(lang: string) {
    this.translate.use(lang);
  }*/
}
