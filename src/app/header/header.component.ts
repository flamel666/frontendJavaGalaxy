import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public translate: TranslateService) {

 
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');
    

    this.languages = [
      {name: 'it', code:"IT"},
      {name: 'en', code: "EN"},
     
  ];
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
}

public switchColor(): void{
  console.log('colore cambiato prova elementohtml '+this.dropDownelement.nativeElement);
  document.body.classList.toggle("dark")
}

}
