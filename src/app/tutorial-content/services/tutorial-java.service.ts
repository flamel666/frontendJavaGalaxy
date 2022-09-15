import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ChaptersCourse } from "../models/chapters.model";
import { PageTutorial } from "../models/page.model";


@Injectable({
    providedIn: "root"
})

export class TutorialJavaService{

    private actionFromTutorialBodyContent? = new Subject<string>();

    actionFromTutorialBodyContentChanged$? = this.actionFromTutorialBodyContent?.asObservable();

    private actionFromTutorialBodyNextContent? = new Subject<string>();
    private actionFromTutorialBodyPreviousContent? = new Subject<string>();

    actionFromTutorialBodyNextContentChanged$? = this.actionFromTutorialBodyNextContent?.asObservable();
    actionFromTutorialBodyPreviousContentChanged$? = this.actionFromTutorialBodyPreviousContent?.asObservable();


    private idChapter? = new Subject<string>();
    private idSubChapter? = new Subject<string>();

    idChapterChanged$? = this.idChapter?.asObservable(); 
    idChapterSubChanged$? = this.idSubChapter?.asObservable(); 

    private idActualChapter? = new Subject<string>();
    private idPreviousChapter? = new Subject<string>();
    private idNextChapter? = new Subject<string>();

    private idActualSunChapter? = new Subject<string>();
    private idPreviousSunChapter? = new Subject<string>();
    private idNextSunChapter? = new Subject<string>();

    idActualChapterChanged$? = this.idActualChapter?.asObservable(); 
    idPreviousChapterChanged$? = this.idPreviousChapter?.asObservable();
    idNextChapterChanged$? = this.idNextChapter?.asObservable();

    idActualSubChapterChanged$? = this.idActualSunChapter?.asObservable(); 
    idPreviousSubChapterChanged$? = this.idPreviousSunChapter?.asObservable();
    idNextSubChapterChanged$? = this.idNextSunChapter?.asObservable();




    constructor(public httpConnection: HttpClient){

    }

    public notifyChangeFromTutorialBodyContent(id : string){
        this.actionFromTutorialBodyContent?.next(id);
    }

    //get chapters by programming language and language
    public getChapters(programmingLanguage: string, language: string):Observable<ChaptersCourse[]>{
        return this.httpConnection.get<ChaptersCourse[]>("http://localhost:8080/tutorial/chapters/langcode/"+programmingLanguage+"/lang/"+language);
    }

    public getPageByChapter(chapterId: string):Observable<PageTutorial>{
        return this.httpConnection.get<PageTutorial>("http://localhost:8080/tutorial/java/page/chapter/"+chapterId);
    }

    public getPageBySubChapter(subChapterId: string):Observable<PageTutorial>{
        return this.httpConnection.get<PageTutorial>("http://localhost:8080/tutorial/java/page/subchapter/"+subChapterId);
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

    /*
    potrei creare delle variabili da condividere tra il sideBar e il tutorialBodyContent.
        previous, actual e next argument
    su queste 3 variabili andrebbero sottoscritti degli observable, sia in un componente che nell'altro(forse no).
    posso inserire l'observable solo nel sideBar per quelle 3 variabili mentre il tutorialBodyContent può chiamare direttametne un metodo nel service che si occuperà
    di aggiornare il capitolo successivo e sfruttare l'observable già sottoscritto con il sideBar.
    l'unico dilemma potrebbe essere: "come marchio a video il capitolo che sto leggendo se nn ci clicco direttamente sopra, ma utilizzo i tasti next/previous"?
    posso provare a manipolare direttamente l'oggetto ThreeNode. da provare
    */
}