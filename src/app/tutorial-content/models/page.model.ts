import { ChaptersCourse } from "./chapters.model";
import { ComponentPageTutorial } from "./component-page-tutorial.model";
import { SubChaptersCourse } from "./sub-chapters.model";

export class PageTutorial{

	id? : number;		
	languagePage? : string;
	programmingLanguage? : string;		
    chapter? : ChaptersCourse;
	subChapter? : SubChaptersCourse;
    compontentsPage? : Array<ComponentPageTutorial>;
	videoYouTubeId? : string;
}