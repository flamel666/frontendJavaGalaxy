import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageTutorial } from '../models/page.model';
import { TutorialJavaService } from '../services/tutorial-java.service';

@Component({
  selector: 'app-tutorial-body-content',
  templateUrl: './tutorial-body-content.component.html',
  styleUrls: ['./tutorial-body-content.component.scss'],
  encapsulation: ViewEncapsulation.None//serve a far leggere il css per gli innerHTML
})
export class TutorialBodyContentComponent implements OnInit {

  public vett: String[]=[];
  public _gridOptions:Map<number, string> =  new Map();
  private p = "p";

  pageToShow?: PageTutorial;

  constructor(public chapterJavaService: TutorialJavaService) {
    this.chapterJavaService.idChapterSubChanged$?.subscribe(id=>{
      console.log("sono nel body-contet. sotto capitolo cambiato: "+id);
      this.chapterJavaService.getPageBySubChapter(id).subscribe(response=>{
        console.log("nel subscribe ");
        console.log(response);
        this.pageToShow = response;
        this.createPage(this.pageToShow);
      });
    });

    this.chapterJavaService.idChapterChanged$?.subscribe(id=>{
      console.log("sono nel body-contet. capitolo cambiato: "+id);
      this.chapterJavaService.getPageByChapter(id).subscribe(response=>{
        console.log(response);
        this.pageToShow = response;
        this.createPage(this.pageToShow);
      });
    });
   }

  ngOnInit(): void {
    this.vett.push(`<h1 class="reddo">NGONINIT</h1>`);
    this.vett.push(`<${this.p} class="reddo">ser</${this.p}>`);
    this._gridOptions.set(4, `<${this.p} class="red">tata</${this.p}>`)

    this.chapterJavaService.getPageByChapter("1").subscribe(response=>{
      console.log(response);
      this.pageToShow = response;
  
      console.log("pagina content: "+this.pageToShow.id);
      console.log("pagina: "+this.pageToShow.languagePage);
      console.log("pagina: "+this.pageToShow.programmingLanguage);
      console.log("pagina: "+this.pageToShow.compontentsPage);
      console.log("pagina: "+this.pageToShow.compontentsPage?.length)
      this.pageToShow.compontentsPage?.forEach(el=>{
        this.vett.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${el.componentContent}</${el.componentType}>`);

      });

  
    });
  }

  private createPage(pageToShow: PageTutorial){
    this.vett=[];
    this.vett.push(`<h1 class="reddo">CREATE PAGE</h1>`);
    pageToShow.compontentsPage?.forEach(el=>{
      console.log(""+el.componentType +"  "+el.componentContent);
      this.vett.push(`<${el.componentType} class="${el.componentClassCss}" id=""${el.componentIdCss}>${el.componentContent}</${el.componentType}>`);
    });
  }

}
