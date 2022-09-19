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
   
}