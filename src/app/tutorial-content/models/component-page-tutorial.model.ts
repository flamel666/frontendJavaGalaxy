import { ComponentTagOption } from "./component-tag-option";
import { PageTutorial } from "./page.model";


export class ComponentPageTutorial{

    id? : number;	
	componentType? : string;//tipo di tag
	componentClassCss? : string;//classe css del tag
	componentIdCss? : string;//id css del tag
	componentContent? : string;//contenuto del tag
	//compontentsPage? : Array<ComponentPageTutorial>;
	tagOptions? : Array<ComponentTagOption>;
	standAlone? : boolean;
	page? : PageTutorial;
	childComponentsPageTutorialList? : Array<ComponentPageTutorial>;
	parentComponentPageTutorial? : ComponentPageTutorial;
}