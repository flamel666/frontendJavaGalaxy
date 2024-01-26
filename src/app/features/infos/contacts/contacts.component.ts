import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

// FormBuilder to create form and Validators for validations
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfigLanguageService } from 'src/app/config-service/config-language.service';
import { ContactMeServiceService } from 'src/app/global-service/contact-me-service.service';

interface Motivations {
  name: string,
  code: string
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  motivations: Motivations[]; 

  autoResizeTextArea: boolean = true;

  displayModal: boolean = false;

  firstName: string = "";

userForm = this.formBuilder.group({
  firstName: new FormControl('',Validators.required), 
  lastName: new FormControl(''),
  email: new FormControl('',Validators.required),
  drop:new FormControl('',Validators.required),
  textArea: new FormControl('')
});

  constructor(private formBuilder: FormBuilder, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, public translate: TranslateService,
  private configLanguageService: ConfigLanguageService, private sendMailService: ContactMeServiceService) {

    this.configLanguageService.actionForceChangeLanguage$?.subscribe(lang => {      
      this.motivations = [];
      this.createDropDownArgument();
  });

    if(isPlatformBrowser(this.platformId)){    
      this.router.events.subscribe((evt: any) => {//serve ad andare top nella pagina quando termina la navigazione
        if (!(evt instanceof NavigationEnd)) {//forse dobbiamo metterlo ancora più su
            return;
        }
        window.scrollTo(0, 0)
      });  
    }

    this.motivations = [];
    this.createDropDownArgument();

   }

  ngOnInit(): void {
  }

  public sendMail(): void {
   
    let motivation: Motivations = JSON.parse(JSON.stringify(this.userForm.value.drop))
    
   // console.log("this.personForm.value "+motivation.name);

    let firstName = ""+this.userForm.value.firstName;
    let lastName = ""+this.userForm.value.lastName;
    let email = ""+this.userForm.value.email;
    let contactReason =""+motivation.name;
    let message = ""+this.userForm.value.textArea;
    
    this.sendMailService.sendMessageToServer(firstName, lastName, 
      email, contactReason, message);

    this.userForm.reset();
    this.displayModal = true;
  }

  public hideModal(): void{
    this.displayModal = false;
  }

  private createDropDownArgument(){
    for(let i = 1; i < 6; i++ )
      this.translate.get("contact.email.motivation"+i).forEach(e =>{
              
        let motivation: Motivations = {name:e, code:""+i};
        this.motivations.push(motivation)
        
      });
  }

 

}
