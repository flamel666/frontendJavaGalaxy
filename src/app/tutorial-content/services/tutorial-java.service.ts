import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { ServiceConfigurationService } from "src/app/config-service/service-configuration.service";
import { ChaptersCourse } from "../models/chapters.model";
import { PageTutorial } from "../models/page.model";
import { ConfigLanguageService } from "src/app/config-service/config-language.service";


@Injectable({
    providedIn: "root"
})

export class TutorialJavaService{

    private language?: string;//TODO sistemare la faccenda della lingua, che in realtà
    //dovrebbe essere settata prendendo la lingua dal dropdown
    private actionFromHeaderChangeLanguare? = new Subject<string>();
    actionFromHeaderChangeLanguareChanged$? = this.actionFromHeaderChangeLanguare?.asObservable();


    private programmingLanguage?: string;

    private actionFromTutorialBodyContent? = new Subject<string>();
    private actionFromTutorialBodyContentAboutSubChapter? = new Subject<string>();

    actionFromTutorialBodyContentChanged$? = this.actionFromTutorialBodyContent?.asObservable();
    actionFromTutorialBodyContentAboutSubChapterChanged$ = this.actionFromTutorialBodyContentAboutSubChapter?.asObservable();

    private actionFromTutorialBodyNextContent? = new Subject<string>();
    private actionFromTutorialBodyPreviousContent? = new Subject<string>();

    actionFromTutorialBodyNextContentChanged$? = this.actionFromTutorialBodyNextContent?.asObservable();
    actionFromTutorialBodyPreviousContentChanged$? = this.actionFromTutorialBodyPreviousContent?.asObservable();


    private idChapter? = new Subject<string>();
    private idSubChapter? = new Subject<string>();

    idChapterChanged$? = this.idChapter?.asObservable(); 
    idChapterSubChanged$? = this.idSubChapter?.asObservable(); 

    private youtubeVideo? = new Subject<string>();

    youtubeVideoChanged$? = this.youtubeVideo?.asObservable();


    constructor(public httpConnection: HttpClient, public configService: ServiceConfigurationService, 
        private configLanguageService: ConfigLanguageService){
            console.log("costruttore service tutorial")

            this.language = configLanguageService.getBrowserLanguage();

            this.configLanguageService.actionForceChangeLanguage$?.subscribe(lang => {
                console.log("nel subscribe del language");
                this.changeLanguage(lang);
            });
    
    }

    public notifyChangeFromTutorialBodyContent(id : string){
        this.actionFromTutorialBodyContent?.next(id);
    }

    public notifyChangeFromTutorialBodyContentAboutSubChapter(id : string){
        console.log("NEL SERVICE PER LA NOTIFICATION");
        this.actionFromTutorialBodyContentAboutSubChapter?.next(id);
    }

    //get chapters by programming language and language http://localhost:8080/
    public getChapters(programmingLanguage: string, languages: string):Observable<ChaptersCourse[]>{//79.32.72.214        
       // this.language = language;
        this.programmingLanguage = programmingLanguage;
        let ip = this.configService.getIpServer();
        return this.httpConnection.get<ChaptersCourse[]>(ip+"tutorial/chapters/langcode/"+programmingLanguage+"/lang/"+this.configLanguageService.getBrowserLanguage());
    }

    public getPageByChapter(chapterId: string):Observable<PageTutorial>{
        let ip = this.configService.getIpServer();
        console.log("chapter id is: "+chapterId);     
       
        return this.httpConnection.get<PageTutorial>(ip+"tutorial/page/course/"+this.programmingLanguage+"/chapter/"+chapterId+"/lang/"+this.configLanguageService.getBrowserLanguage());
    }

    public getPageBySubChapter(subChapterId: string):Observable<PageTutorial>{        
        let chapter = subChapterId.substring(0,subChapterId.indexOf("."));
        let subChapter = subChapterId.substring(subChapterId.indexOf(".")+1,subChapterId.length);
        let ip = this.configService.getIpServer();
        console.log("chapter id is: "+chapter); 
        console.log("subChapter id is: "+subChapter); 
        console.log("ip id is: "+ip); 
        console.log("language id is: "+this.language); 
        return this.httpConnection.get<PageTutorial>(ip+"tutorial/page/course/"+this.programmingLanguage+"/chapter/"+chapter+"/subchapter/"+subChapter+"/lang/"+this.configLanguageService.getBrowserLanguage());
    }

    changeIdChapter(id : string){       
        this.idChapter?.next(id);
    }

    changeIdSubChapter(id : string){
        this.idSubChapter?.next(id);
    }

    nextChapter(event : string){
        console.log("service");
        this.actionFromTutorialBodyNextContent?.next(event);
    }

    previousChapter(event : string){
        console.log("service");
        this.actionFromTutorialBodyPreviousContent?.next(event);
    }
   
    youTubeVideoChanged(idVideo: string){
        this.youtubeVideo?.next(idVideo);
    }

    changeLanguage(lang : string){
        console.log("service");
        this.language = lang;
        this.actionFromHeaderChangeLanguare?.next(lang);
    }

    changeSilentLanguageONLYSSRBUILD(lang : string){
        console.log("service");
        this.language = lang;
    }

}