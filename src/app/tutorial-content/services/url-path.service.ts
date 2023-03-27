import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceConfigurationService } from 'src/app/config-service/service-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class UrlPathService {

  constructor(public configService: ServiceConfigurationService) { 
    
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
}
