import { SubChaptersCourse } from "./sub-chapters.model";

export class ChaptersCourse{

    id? : number;		
	chapterNumber? : number;	
	chapterTitle? : string;		
	programmingLanguage?: string;
	language?: string;
	linked?: boolean;
	active?: boolean;
	subChapters? : Array<SubChaptersCourse>;	
   
}