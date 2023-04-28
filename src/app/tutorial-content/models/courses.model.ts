import { SubCourses } from "./sub-courses.model";

export class Courses{

    id? : number;		
    courseName?: string;		
    activeCourse? : boolean;
    iconCourse?: string;
    translateCourse?: string;
    subCourses? : Array<SubCourses>;
}