import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TutorialJavaService } from '../services/tutorial-java.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, Location, isPlatformServer } from '@angular/common';
import { UrlPathService } from '../services/url-path.service';
import { ConfigLanguageService } from 'src/app/config-service/config-language.service';
import { Meta, Title } from '@angular/platform-browser';

interface ModelCourse{
  courseTitle?: string;
  subCourse?: ModelSubCourse[];
  isActive?: boolean;
  translateCourse?: string;
}

interface ModelSubCourse{
  subCourseTitle?: string;
  icon?: string;
  url?: string;
  description?: string; 
  isActive?: boolean; 
  translateSubCourse?: string;
}

@Component({
  selector: 'app-courses-dispatcher',
  templateUrl: './courses-dispatcher.component.html',
  styleUrls: ['./courses-dispatcher.component.scss']
})
export class CoursesDispatcherComponent implements OnInit {

  titleCourse!: string;
  titleSubCourse!: string;

  modelCourse!: ModelCourse[];

  constructor(public chapterJavaService: TutorialJavaService, private router: Router, 
    public translate: TranslateService,  @Inject(PLATFORM_ID) private platformId: Object,
    private urlPathService: UrlPathService, private configLanguageService: ConfigLanguageService, 
    private location: Location, private metaService: Meta, private route: ActivatedRoute, private title:Title) {

      console.log("COSTRUTTORE DISP 2");

    this.titleCourse = "Java";
    this.titleSubCourse = "Java base";
    this.modelCourse = [];

    chapterJavaService.getCourses().subscribe(reponse => {

      console.log("object"+JSON.stringify(reponse));

      reponse.forEach(courses => {
        console.log("nel for each: "+courses);
        let modelCourse: ModelCourse = {};

        modelCourse!.courseTitle = courses.courseName!;
        modelCourse!.isActive = courses.activeCourse!;
        modelCourse!.translateCourse = courses.translateCourse;
        modelCourse!.subCourse = [];

        courses.subCourses?.forEach(subCourse =>{
          console.log("nel sub for each: "+subCourse);
          let modelSubCourse: ModelSubCourse = {};
          
          modelSubCourse!.subCourseTitle = subCourse.subCourseName!;
          modelSubCourse!.url = subCourse.subCourseName!;
          modelSubCourse!.translateSubCourse = subCourse.translateSubCourse;
          modelSubCourse!.isActive = subCourse.activeSubCourse;
          modelCourse!.subCourse!.push(modelSubCourse!);

        });
        
        this.modelCourse.push(modelCourse!);
        
      });
      if(isPlatformBrowser(this.platformId)){  
      setTimeout(() => { 
        this.modelCourse.forEach(course => {

          if(course.subCourse != undefined){            
            document.getElementById(""+(course.subCourse.length-1))?.classList.add("lastCourse");
          }
        });
    }, 0.01);
  }
    });

    this.configLanguageService.actionForceChangeLanguageForDispacherPage$?.subscribe(newLang => {
      let urlPath = this.urlPathService.getUrlPath(window.location.href); 
   
      if(urlPath.includes("code/lang"))
        this.location.replaceState(urlPath.substring(0, urlPath.indexOf("lang/"))+"lang/"+this.configLanguageService.getBrowserLanguage());
    });

    if(isPlatformServer(this.platformId))
      this.setPagaTag();
   }

   ngOnInit(): void {   
    console.log("NELLA GLOBAL NG");
   
    if(isPlatformBrowser(this.platformId)){    
    this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
      if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
        
          return;
      }
      window.scrollTo(0, 0)       
  });
}

   }

  public async navigateToCourse(subCourse: ModelSubCourse) : Promise<void>{

    const endPoint = await this.getTranslateLabel(subCourse.translateSubCourse!);

    console.log("/code/"+endPoint.replace(" ", "-"));
    this.router.navigate(["/code/"+endPoint.replace(" ", "-")]);
  }

  private async getTranslateLabel(label: string): Promise<string>{
    let labelTranslated : string = "";
    await this.translate.get("header.menu."+label).forEach(e =>{     
      labelTranslated = e;   
    });

    return labelTranslated;
   }

   private setPagaTag(): void{
    console.log("META TAG");
      let language = this.route.snapshot.paramMap.get('lang');
      if(language == "it"){
        console.log("META ITA");
        this.metaService.updateTag({property: 'og:title', content: "Corsi"});
        this.title.setTitle("Corsi");

        this.metaService.updateTag({name: 'description', content: "Descrizione dei corsi"});
        this.metaService.updateTag({name: 'excerpt', content: "Descrizione dei corsi"});
        this.metaService.updateTag({name: 'keywords', content: "keywords"});
      
        this.metaService.updateTag({property: 'og:title', content: "Corsi"});
        this.metaService.updateTag({property: 'og:description', content: "Descrizione dei corsi"});
        this.metaService.updateTag({property: 'og:type', content: "article"});
      
        //this.metaService.updateTag({itemprop: ''+meta.metaType, content: ""+meta.content});

      } else {
        console.log("META ENG");
        this.metaService.updateTag({property: 'og:title', content: "Courses"});
        this.title.setTitle("Courses");

        this.metaService.updateTag({name: 'description', content: "Description of courses"});
        this.metaService.updateTag({name: 'excerpt', content: "Description of courses"});
        this.metaService.updateTag({name: 'keywords', content: "keywords"});
      
        this.metaService.updateTag({property: 'og:title', content: "Courses"});
        this.metaService.updateTag({property: 'og:description', content: "Description of courses"});
        this.metaService.updateTag({property: 'og:type', content: "article"});
      }
    }
   


}
