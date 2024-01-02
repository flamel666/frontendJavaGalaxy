import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceConfigurationService } from 'src/app/config-service/service-configuration.service';
import { prefixUrl } from 'src/app/global-service/enum-prefixurl';

@Injectable({
  providedIn: 'root'
})
export class UrlPathService {

  constructor(public configService: ServiceConfigurationService, public translate: TranslateService) { 
    
  }


  public getUrlPath(path: string) : string{  

    return path.substring(path.indexOf(this.getTargetPrefixUrl(path)), path.length);
  }

  public getChapterFromUrlPath(url: string): string{
    //code/java/chapter/1/lang/it
    let pathUrl = url;
    let chapter = pathUrl.substring(pathUrl.indexOf("chapter/"), pathUrl.length)
        .replace("chapter/", "").replace("/","£");

    console.log("subString of url for the chapte getChapterFromUrlPath: "+chapter.substring(0, chapter.indexOf("£")));
    return chapter.substring(0, chapter.indexOf("£"));
  }

  public getSubChapterFromUrlPath(url: string): string{
    let pathUrl = url;
    let subChapter = pathUrl.substring(pathUrl.indexOf("subchapter/"), pathUrl.length)
        .replace("subchapter/", "").replace("/","£");

    console.log("subString of url for the chapte getSubChapterFromUrlPath: "+subChapter.substring(0, subChapter.indexOf("£")));
    return subChapter.substring(0, subChapter.indexOf("£"));
  }

  public getCourseFromUrl(url: string): string{
    
    let course = "";
    let prefixUrl = this.getTargetPrefixUrl(url);
  
    console.log("subString of url for the chapte getCourseFromUrl: "+url);
    let pathUrl = url;
    console.log("subString of url for the chapte getCourseFromUrl: "+pathUrl.substring(pathUrl.indexOf(prefixUrl+"/"), pathUrl.length));
    course =  pathUrl.substring(pathUrl.indexOf(prefixUrl+"/"), pathUrl.length).replace(prefixUrl+"/", "").replace("/","£");
    console.log("subString of url for the chapte getCourseFromUrl: "+course);
    console.log("subString of url for the chapte getCourseFromUrl: "+course.substring(0, course.indexOf("£")));
   

    if(course.includes("£"))
      return course.substring(0, course.indexOf("£"));
    else
      return course.substring(0, course.length);
  }

  public getTargetPrefixUrl(url: string): string {

    if(url.includes(prefixUrl.CODE)) 
      return prefixUrl.CODE;
    
    if(url.includes(prefixUrl.FUNDAMENTALS)) 
      return prefixUrl.FUNDAMENTALS;  

    return "unknown";
  }

  public async getTranslateCourseFromUrl(url: string): Promise<string>{
    let course = this.getCourseFromUrl(url);
    let trans = "";
    switch(course){
      case "Java-base":
      case "Basic-Java":
        trans = "javaBasic";
        break;
      case "Java-avanzato":
      case "Advanced-Java":
        trans = "javaAdvanced";
        break;
      case "Programmazione-orientata-agli-oggetti":
      case "Object-oriented-programming":
        trans = "oop";
        break;
    }
  
    const response = await this.getTranslateLabel(trans);
   
    return response.replace(/\s/g, "-");
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
