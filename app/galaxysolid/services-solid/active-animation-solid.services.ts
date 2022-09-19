import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ActiveAnimationSolid{

    private theme? = new Subject<string>();

    private innerWidth? = new Subject<number>();
    private innerHeight? = new Subject<number>();

    private animationGlowSun? = new Subject<string>();

    public innerWidthDimension?: number;
    public innerHeightDimension?: number;

    themeChanged$ = this.theme?.asObservable();
    innerWidth$ = this.innerWidth?.asObservable();
    startAnimationGlowSun$ = this.animationGlowSun?.asObservable();


    public changeTheme(theme: string){
        this.theme?.next(theme);
        ;
    }

    public resizeWindow(innerWidth: number, innerHeight: number){
        this.innerWidthDimension = innerWidth;
        this.innerHeightDimension = innerHeight;
        this.innerWidth?.next(innerWidth);
        this.innerHeight?.next(innerHeight);
         
    }

    public startAnimationGlowSun(start: string){
        console.log("nel service: "+start);
        this.animationGlowSun?.next(start);
    }
}