import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MenuItem} from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { Observable } from 'rxjs';

import { ChaptersCourse } from "../models/chapters.model";
import { Children } from '../models/children.model';
import { PageTutorial } from '../models/page.model';
import { TutorialJavaService } from '../services/tutorial-java.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  private languageCode: string;
  private language: string;

  items!: MenuItem[];
  item!: MenuItem[];

  nodes: TreeNode[]=[];  

  childrenParam!: Children[];
  chaptersJavaCourse?: ChaptersCourse[];

  pageToShow?: PageTutorial;

  constructor(private router: Router, public chapterJavaService: TutorialJavaService) {
    this.languageCode = "java";
    this.language = "ita";
    
   }

  ngOnInit(): void {
   
    console.log(""+this.languageCode+" "+this.language)
    this.chapterJavaService.getChapters(this.languageCode, this.language).subscribe(response=>{//modificare il service per passargli il linguaggio di programmazione per recuperare i capitoli
      console.log(response);
      this.chaptersJavaCourse = response;
      this.nodes= [];

      this.chaptersJavaCourse.forEach(el => {
        console.log(el.id)

       this.childrenParam = [];

        if(el.subChapters != null){

          el.subChapters.forEach(subch =>{  
            let child = new Children;
            child.data =""+subch.id;
            child.key =  ""+subch.subChapterNumber;
            child.label = ""+subch.subChapterTitle;

            this.childrenParam.push(
             child
              );
            
    });
  }

  this.nodes.push({
    key: ""+el.id,
    label: el.chapterTitle,
    children:  this.childrenParam
  });
      });
      console.log(this.chaptersJavaCourse);
    });


/*
    this.nodes = [
      {
          key: '0',
          label: 'Introduction',
          children: [
              {key: '0-0', label: 'What is Angular', data:'https://angular.io', type: 'url'},
              {key: '0-1', label: 'Getting Started', data: 'https://angular.io/guide/setup-local', type: 'url'},
              {key: '0-2', label: 'Learn and Explore', data:'https://angular.io/guide/architecture', type: 'url'},
              {key: '0-3', label: 'Take a Look', data: 'https://angular.io/start', type: 'url'}
          ]
      },
    {
        key: '1',
        label: 'sto cazzo',
        children: [

        ]
    }];
    */
    this.item = [
      {
        label:"capitolo 0",
        items: [{
          label: 'introduzione',
          command: () => this.navigate(),
         
        }]
      }
    ]
    
  }

  public navigate(){
    this.router.navigate(["/auth/signin"]);
  }

  public changeChapter(lable: TreeNode, key: string){
    console.log('--------------------------------------');
    console.log('scope chapter is ' + lable.key);
    console.log('scope chapter is ' + lable.label);
    console.log('scope chapter is ' + lable.children?.length);
    console.log('scope chapter is ex ' + lable.expanded);
    console.log('--------------------------------------');

    if(lable.expanded != true){
      lable.expanded= true;
    }
    
    this.chapterJavaService.changeIdChapter(""+lable?.key);

  }

  public changeSubChapter(lable: TreeNode, key: string){
    console.log('--------------------------------------' +key);
    console.log('scope subchapter is ' + lable.key);
    console.log('scope subchapter is ' + lable.label);
    console.log('scope subchapter is ' + lable.children?.length);
    console.log('--------------------------------------');
    document.getElementById(key)?.classList.toggle("part");
    console.log('scope subchapter is ' + document.getElementById(key));
    this.chapterJavaService.changeIdSubChapter(""+lable?.data);    
  }
 
}
