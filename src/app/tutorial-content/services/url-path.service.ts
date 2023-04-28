import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceConfigurationService } from 'src/app/config-service/service-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class UrlPathService {

  constructor(public configService: ServiceConfigurationService, public translate: TranslateService) { 
    
  }


  public getUrlPath(path: string) : string{  

    return path.substring(path.indexOf("code"), path.length);
  }

  public getChapterFromUrlPath(url: string): string{
    //code/java/chapter/1/lang/it
    let pathUrl = url;
    let chapter = pathUrl.substring(pathUrl.indexOf("chapter/"), pathUrl.length)
        .replace("chapter/", "").replace("/","£");

    console.log("subString of url for the chapte: "+chapter.substring(0, chapter.indexOf("£")));
    return chapter.substring(0, chapter.indexOf("£"));
  }

  public getSubChapterFromUrlPath(url: string): string{
    let pathUrl = url;
    let subChapter = pathUrl.substring(pathUrl.indexOf("subchapter/"), pathUrl.length)
        .replace("subchapter/", "").replace("/","£");

    console.log("subString of url for the chapte: "+subChapter.substring(0, subChapter.indexOf("£")));
    return subChapter.substring(0, subChapter.indexOf("£"));
  }

  public getCourseFromUrl(url: string): string{
    console.log("subString of url for the chapte: "+url);
    let pathUrl = url;
    let course =  pathUrl.substring(pathUrl.indexOf("code/"), pathUrl.length).replace("code/", "").replace("/","£");
    console.log("subString of url for the chapte: "+course.substring(0, course.indexOf("£")));
    if(course.includes("£"))
      return course.substring(0, course.indexOf("£"));
    else
      return course.substring(0, course.length);
  }

  public async getTranslateCourseFromUrl(url: string): Promise<string>{
    let course = this.getCourseFromUrl(url);
    let trans = "";
    switch(course){
      case "Java%20base":
      case "Basic%20Java":
        trans = "javaBasic";
        break;
      case "Java%20avanzato":
      case "Advanced%20Java":
        trans = "javaAdvanced";
        break;
    }
  
    const response = await this.getTranslateLabel(trans);
   
    return response;
  }

  private async getTranslateLabel(label: string): Promise<string>{
    let labelTranslated : string = "";
    await this.translate.get("header.menu."+label).forEach(e =>{
      console.log("tradotto: "+e);
      labelTranslated = e;   
    });

    return labelTranslated;
   }
}
