import { Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-utility-menu',
  templateUrl: './utility-menu.component.html',
  styleUrls: ['./utility-menu.component.scss']
})
export class UtilityMenuComponent implements OnInit {

    public availabilityMessage: string = "Video non ancora disponibile";
    public isAvailable: boolean = false;
    public num: number = 10;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
   
  }


  public openAndCloseBurger(){    
    document.getElementById("burger")?.classList.toggle("open");
    document.getElementById("contentMenuLeft")?.classList.toggle("contentMenuLeftOpen");
    document.getElementById("contentMenuRight")?.classList.toggle("contentMenuRightOpen");
    document.getElementById("toolBarShake")?.classList.toggle("toolBarShake");    
  }



}
