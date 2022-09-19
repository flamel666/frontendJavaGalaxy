import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ActiveAnimationSolid } from '../services-solid/active-animation-solid.services';

@Component({
  selector: 'app-moon-solid',
  templateUrl: './moon-solid.component.html',
  styleUrls: ['./moon-solid.component.scss']
})
export class MoonSolidComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  private idAnimationEclipse: number = -1;
  private idAnimationRemoveEclipse: number = -1;

  private camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  private sphereMoon!: THREE.Mesh;

  private directionalLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  private lightRight!: THREE.PointLight;
  private lightLeft!: THREE.PointLight;
  private lightTop!: THREE.PointLight;
  private lightDown!: THREE.PointLight;
  private lightTop2!: THREE.PointLight;
  private lightDown2!: THREE.PointLight;

  private iterator: number = 1;
  loaderGltf = new GLTFLoader();

  private actualTheme: string = "light";
  private requestTheme!: string;

  private height =  window.innerHeight;

/*
  private loaderGltf!: GLTFLoader;

private loader = new THREE.TextureLoader();
private geometry = new THREE.SphereGeometry(1.5,32,32);
private material = new THREE.MeshStandardMaterial({map : new THREE.TextureLoader().load('/javaGalaxy/src/assets/images/moo.jpg')})

private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
*/
  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  constructor(public animationService: ActiveAnimationSolid, private cookies: CookieService) {     
    this.animationService.themeChanged$?.subscribe(theme=>{
      this.requestTheme = theme;

      this.activeChooseTheme(theme);
     
      
    });
  }

  ngAfterViewInit(): void {
    this.createScene();
       
    if(this.cookies.check("THEME")){      
      if(this.requestTheme !== undefined){
      if(this.actualTheme != this.requestTheme){
        this.activeChooseTheme(this.cookies.get("THEME"));
        this.requestTheme = this.cookies.get("THEME");
      }
    }else{
      if(this.actualTheme != this.cookies.get("THEME")){
        this.activeChooseTheme(this.cookies.get("THEME"));
        this.requestTheme = this.cookies.get("THEME");
      }
    }
    }
    
  }

  ngOnInit(): void {
  }

  private activeChooseTheme(theme: string){
    if(theme == "dark"){       
      if(this.idAnimationEclipse == -1 && this.idAnimationRemoveEclipse == -1)
      this.eclipseAnimation();        
    }

    if(theme == "light"){
      if(this.idAnimationEclipse == -1 && this.idAnimationRemoveEclipse == -1)
      this.eclipseAnimatioRemove();        
    }
  }
  

  private createScene(){
    this.scene = new THREE.Scene();      
    this.scene.background = null;//new THREE.Color("brown");

    this.ambientLight = new THREE.AmbientLight(0x00000,1);
    this.ambientLight.position.y=200;
    this.ambientLight.position.set(0,-10,5)
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0,-1,4);
    //this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);    

    const sphereGeometryMoon = new THREE.SphereGeometry(35,50,50);    
    const sphereMaterialMoon = new THREE.MeshStandardMaterial(
      { 
        map : new THREE.TextureLoader().load('assets/images/solids/moonSolid.jpg'),      
       }); 
     
    const sphereMoon = new THREE.Mesh(sphereGeometryMoon, sphereMaterialMoon);    
    
    
    let light1 = new THREE.PointLight(0xffa64d, 0.3);
    light1.position.set(0,-50,300);
    this.scene.add(light1);

    this.scene.add(sphereMoon);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      75,
      aspectRatio,
      0.01,
      300
    );    

    this.camera.position.z = 200;
    this.camera.position.y = 2;
    this.camera.lookAt(0,0,0);  

   // const helper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
   // this.scene.add( helper ); 

    this.lightRight = new THREE.PointLight(0xffa64d, 4);
    this.lightRight.position.set(900,250,-1050);
    this.scene.add(this.lightRight); 

    this.lightLeft = new THREE.PointLight(0xffa64d, 1);
    this.lightLeft.position.set(-160,70,-120);//900,250,-1050
    this.scene.add(this.lightLeft);

    this.lightDown = new THREE.PointLight(0xffa64d, 1);
    this.lightDown.position.set(-20,20,-30);//900,250,-1050
    this.scene.add(this.lightDown);

    this.lightTop = new THREE.PointLight(0xffa64d, 1);
    this.lightTop.position.set(-50,130,-25);//900,250,-1050//x,y,z
    this.scene.add(this.lightTop);

    this.lightDown2 = new THREE.PointLight(0xffa64d, 1);
    this.lightDown2.position.set(20,20,-30);//900,250,-1050    
    this.scene.add(this.lightDown2);

    this.lightTop2 = new THREE.PointLight(0xffa64d, 1);
    this.lightTop2.position.set(30,130,-15);//900,250,-1050
    this.scene.add(this.lightTop2);   

     const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas:this.canvas});
//////queste due istruzioni servono a mettere il background trasparente. il background della scena deve essere impostato a null
      renderer.autoClear = false;
      renderer.setClearColor( 0x000000, 0.0);
/////
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth, this.height /*window.innerHeight*/);  //this.canvas.clientWidth, this.canvas.clientHeight
    this.renderer = renderer;
    this.sphereMoon = sphereMoon;   
    this.renderer = renderer;
    let scen = this.scene;
    let cam = this.camera;
   
   sphereMoon.position.y=30; 
    this.camera.position.x =300;
    this.camera.position.z =300;

    (function animate(){
      requestAnimationFrame(animate);
      renderer.render(scen, cam);    
      sphereMoon.rotation.y += 0.003;
   
    }());

  
   
    this.setupResize();
    this.resize();
  } 

  //---------------------------resize event-------------------
  private setupResize(){
    window.addEventListener("resize", this.resize.bind(this));
  }

  private resize(){   

    this.renderer.setSize(window.innerWidth, this.height /*window.innerHeight*/);    
    this.camera.aspect = window.innerWidth/this.height /*window.innerHeight*/;   
    this.camera.updateProjectionMatrix();

  }
  //---------------------------resize event-------------------

  private getAspectRatio(){
    return window.innerWidth/this.height /*window.innerHeight*///this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private eclipseAnimation(){
    this.actualTheme = "dark";

    let scena = this.scene;
    let camera = this.camera;    
    
  let moonSolid: MoonSolidComponent = this;
  (function animate() {       
      
    moonSolid.idAnimationEclipse = requestAnimationFrame(animate);
    moonSolid.eclipseAnimationStart(moonSolid.idAnimationEclipse);
    moonSolid.renderer.render(scena, camera);   
    //  console.log("start "+moonSolid.idAnimationEclipse);
    }());
   

  }

  private eclipseAnimationStart(idAnimation: number){
    this.idAnimationEclipse = idAnimation;
   // console.log(" dentro il metodo "+idAnimation);
    if(this.camera.position.z>208){//parte da 300
      this.camera.position.z -= 0.31;//0.1
      //console.log("z velocs: "+camera.position.z);
      this.sphereMoon.rotation.y += 0.005;
    }     

    if(this.camera.position.x>=68){//parte da 300
      this.camera.position.x -= 0.78;   //  0.23
    //console.log("x velocs: "+camera.position.z);
    }

    if(this.sphereMoon.position.y<=58){//parte da 30
      this.sphereMoon.position.y +=0.0898;  //    0.0245
    }

    if(this.camera.position.z>200 && this.camera.position.z<=208){
      if(this.iterator==1){
     //   console.log("starto l'animazione");
      this.animationService.startAnimationGlowSun("dark");
      this.iterator++;
      }
      this.camera.position.z -= 0.1;//0.1               
    } 
    
    if(this.camera.position.x>=0 && this.camera.position.x<=68){
      this.camera.position.x -= 0.23;     
      this.sphereMoon.rotation.y += 0.004;
      if(this.lightLeft.intensity<=5){
      this.lightDown.intensity += 0.01;
      this.lightDown2.intensity += 0.01;
      this.lightLeft.intensity += 0.01;
      this.lightTop.intensity += 0.01;
      this.lightTop2.intensity += 0.01;
      }
    }

    if(this.sphereMoon.position.y>=58 && this.sphereMoon.position.y<=62.9){//parte da 30
      this.sphereMoon.position.y +=0.02;  //    0.0245
    }

    if(this.camera.position.z < 200 && this.camera.position.x <0 && this.sphereMoon.position.y > 62.9){
    
      this.iterator = 1;
      this.idAnimationEclipse = -1;
    
      cancelAnimationFrame( idAnimation );
      if(this.actualTheme != this.requestTheme){
        this.activeChooseTheme(this.requestTheme);
      }
      
      }      
  }


  private eclipseAnimatioRemove(){
    this.actualTheme = "light";    
    
    let scena = this.scene;
    let camera = this.camera;    
    let sphereMoon =this.sphereMoon;       
        
  let moonSolid: MoonSolidComponent = this;
  (function animate() {             
    moonSolid.idAnimationRemoveEclipse = requestAnimationFrame(animate);
    moonSolid.removeEclipseAnimationStart(moonSolid.idAnimationRemoveEclipse);
    moonSolid.renderer.render(scena, camera);   
    
      
    }());
   
  }

  private removeEclipseAnimationStart(idAnimation: number){      
    
      
      if(this.camera.position.z < 200.12){
        //this.camera.position.z += 0.31;//0.1        
        this.camera.position.z += 0.0005;
        if(this.iterator==1){             
           this.animationService.startAnimationGlowSun("light");
           this.iterator++;
           }
        
      } 

      if(this.camera.position.x>=-60){       
      
       this.camera.position.x -= 0.12;
       this.sphereMoon.rotation.y += 0.002;
       if(this.lightLeft.intensity >= 4){
          this.lightLeft.intensity -= 0.01;
       }
       if(this.lightRight.intensity>=1){
        this.lightDown.intensity -= 0.01;
        this.lightDown2.intensity -= 0.01;
        this.lightRight.intensity -= 0.01;
        this.lightTop.intensity -= 0.01;
        this.lightTop2.intensity -= 0.01;
        }
    
      }

      if(this.sphereMoon.position.y >= 59){       
        this.sphereMoon.position.y -=0.01;  //    0.0245
      }

      

      if(this.camera.position.z>200.12 && this.camera.position.z<=205){       
        this.camera.position.z += 0.04;//0.1               
      } 

      if(this.camera.position.z>204.9 && this.camera.position.z<=310){        
        this.camera.position.z += 0.08;//0.1               
      } 

      if(this.camera.position.z>204.9 && this.camera.position.z<=315){        
        this.camera.position.z += 0.03;//0.1               
      } 



      if(this.camera.position.x<=-59.9 && this.camera.position.x>=-510){       
        this.camera.position.x -= 0.187;     
        this.sphereMoon.rotation.y += 0.005;
        if(this.lightLeft.intensity<5){
          this.lightLeft.intensity+=0.01;
        }
      }   
     
      if(this.sphereMoon.position.y>=30 && this.sphereMoon.position.y <= 59){//parte da 30          
        this.sphereMoon.position.y -=0.02;  //    0.0245
      }

      if(this.sphereMoon.position.y<=30 && this.sphereMoon.position.y >= 0){//parte da 30          
        this.sphereMoon.position.y -=0.0245;  //    0.0245
      }

      if(this.camera.position.x <=-505){   
               
        this.iterator = 1;                 
        
        this.camera.position.z = 315;
        this.camera.position.x = 510;
        this.sphereMoon.position.y = 0;
        this.eclipseAnimationResetRestorePosition()        
        cancelAnimationFrame( idAnimation );
        /*
        setTimeout(()=>{//chiamare la funzione dopo un pò  
        this.eclipseAnimationReset();
      }, 5);*/
      
      }
      
      
  }

  private eclipseAnimationResetRestorePosition(){
   
    let scena = this.scene;
    let camera = this.camera; 

  let moonSolid: MoonSolidComponent = this;
  (function animate() {       
      
    moonSolid.idAnimationRemoveEclipse = requestAnimationFrame(animate);
    moonSolid.eclipseAnimationResetRestorePositionStart(moonSolid.idAnimationRemoveEclipse);
    moonSolid.renderer.render(scena, camera);   
      
    }());

  }

  private eclipseAnimationResetRestorePositionStart(idAnimation: number){

    if(this.camera.position.z >= 300){
  //    console.log("in z");
      this.camera.position.z -= 0.08;
      this.sphereMoon.rotation.y += 0.005;
      this.lightRight.intensity += 0.02;
    }

    if(this.camera.position.x >= 300){
   //   console.log("in x");
      this.camera.position.x -= 0.187;
    }

    if(this.sphereMoon.position.y <= 30){
   //   console.log("in y");
      this.sphereMoon.position.y += 0.0245;
    } 

    if(this.camera.position.z >= 299.5 && this.camera.position.x <= 300 && this.sphereMoon.position.y >= 29.9){ 
        
      this.idAnimationRemoveEclipse = -1;
     
      this.sphereMoon.position.y=30; 
      this.camera.position.x =300;
      this.camera.position.z =300;
      this.lightRight.intensity = 4;
      this.lightDown.intensity = 1;
      this.lightDown2.intensity = 1;
      this.lightLeft.intensity = 1;
      this.lightTop.intensity = 1;
      this.lightTop2.intensity = 1;
      cancelAnimationFrame( idAnimation );
      if(this.actualTheme != this.requestTheme){
        this.activeChooseTheme(this.requestTheme);
      }
    }
    
  }

}
