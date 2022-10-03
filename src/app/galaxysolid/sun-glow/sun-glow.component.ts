import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {EffectPass, GodRaysEffect} from 'postprocessing'
import { ActiveAnimationSolid } from '../services-solid/active-animation-solid.services';

@Component({
  selector: 'app-sun-glow',
  templateUrl: './sun-glow.component.html',
  styleUrls: ['./sun-glow.component.scss']
})
export class SunGlowComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;

  private idAnimationEclipse: number = -1;
  private idAnimationRemoveEclipse: number = -1;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private bloomComposer!: EffectComposer;

  private sphereGlow!:  THREE.Mesh;
  private bloomPass!: UnrealBloomPass;

  private directionalLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  private starMaterial!: THREE.MeshBasicMaterial;

  private height =  window.innerHeight;

  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  constructor(public animationService: ActiveAnimationSolid) {   
    this.animationService.startAnimationGlowSun$?.subscribe(start=>{

      console.log("nel sun glow: "+start);
      if(start == "dark")
      this.eclipseAnimation();      

      if(start == "light")
      this.removeEclipseAnimation(); 

    });
   }


   //---------------------------resize event-------------------
   mobileMediaQuery:any = window.matchMedia("(max-width: 480px)")

   private setupResize(){
    window.addEventListener("resize", this.resize.bind(this));
  }

  private resize(){
    
    this.renderer.setSize(window.innerWidth, this.height /*window.innerHeight*/);
    this.camera.aspect = window.innerWidth/this.height/*window.innerHeight*/;
    this.bloomComposer.setSize(window.innerWidth,this.height/*window.innerHeight*/);
    this.camera.updateProjectionMatrix();

  }
  //---------------------------resize event-------------------

  ngAfterViewInit(): void {
    this.createScene();
    this.resize();
    
    if(this.mobileMediaQuery.matches){
      this.bloomPass.radius = 1;
    }
    
  }

  ngOnInit(): void {
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
  
   // this.scene.add(sphereMoon);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      75,
      aspectRatio,
      0.01,
      300
    );    

    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.camera.lookAt(0,0,0);
    this.camera.name="principale";

  //  this.camera.position.x = 30;
 //   this.camera.position.z = 200;
    //this.camera.position.x = 10;
    
    const helper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
    this.scene.add( helper ); 


    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas:this.canvas});

//////queste due istruzioni servono a mettere il background trasparente. il background della scena deve essere impostato a null
this.renderer.autoClear = false;
this.renderer.setClearColor( 0x000000, 0.0);
/////
this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
this.renderer.setSize(window.innerWidth,this.height/*window.innerHeight*/); 
            
   // this.renderer = renderer;
    let scen = this.scene;
    let cam = this.camera;

    cam.position.z=6;
    const renderScene = new RenderPass(scen, cam);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth,this.height /*window.innerHeight*/),
      1.9,
      0.9,
      3.85
    )
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 1.8;
    this.bloomPass.radius = 2;

    const bloomComposer = new EffectComposer(this.renderer);
    bloomComposer.setSize(window.innerWidth, this.height /*window.innerHeight*/);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(this.bloomPass);

    this.bloomComposer = bloomComposer;
    const color = new THREE.Color('#FDB813');
    const geometryAlt = new THREE.IcosahedronGeometry(0.95,25);
    const materialAlt = new THREE.MeshBasicMaterial({color: color});
    
    this.sphereGlow = new THREE.Mesh(geometryAlt, materialAlt);
   // sphereGlow.material.lightMapIntensity = 0;
   this.sphereGlow.position.set(0,1.55,0);
   this.sphereGlow.layers.set(1);
    this.scene.add(this.sphereGlow);
  //  geometryAlt = new THREE.IcosahedronGeometry(0.45,25);
  //  sphereGlow = new THREE.Mesh(geometryAlt, materialAlt);
  //  this.scene.remove(sphereGlow);
      //galaxy

      const starGeometry = new THREE.SphereGeometry(80,64,64);
      this.starMaterial = new THREE.MeshBasicMaterial({
        map : new THREE.TextureLoader().load('assets/images/solids/starGalaxy.png'),   
        side : THREE.BackSide,
        transparent: true,
        lightMapIntensity: 500,
       reflectivity: 1500
      }); 
      

      const starMesh = new THREE.Mesh(starGeometry, this.starMaterial);
      starMesh.layers.set(1);
      this.scene.add(starMesh);
     // 

    


    let id;
    let count =0;
  //  cam.layers.set(1);
   // bloomComposer.render();
    (function animate(){
      id = requestAnimationFrame(animate);
    //  renderer.render(scen, cam);   
/*
    if(bloomPass.radius <= 2.3 && count == 0){
    bloomPass.radius += 0.001  
    bloomPass.strength += 0.0001;  
    }else if(count == 0){      
      count++;
    }  
    if(count == 1 && bloomPass.radius >= 1.99){
      bloomPass.radius -= 0.001 
      bloomPass.strength -= 0.0001; 
    }else if(count == 1){      
      count=0;
    }   */
    
    cam.layers.set(1);
    bloomComposer.render();
    //if(id>300)
   // cancelAnimationFrame(id);
    }());

    this.resize();    
      this.setupResize();
      

  //  cancelAnimationFrame( id );
  /*
    console.log("id: "+id);
    (function animate(){
      requestAnimationFrame(animate);
      renderer.render(scen, cam);        
      //sphereMoon.rotation.z += 0.003;
    }());*/
  }

  private eclipseAnimation(){

    let scena = this.scene;
    let camera = this.camera;
        
  let sunGlowSolid: SunGlowComponent = this;  
  (function animate() {       
      
    //moonSolid.idAnimationEclipse = 
    sunGlowSolid.idAnimationEclipse = requestAnimationFrame(animate);
    sunGlowSolid.eclipseAnimationStart(sunGlowSolid.idAnimationEclipse);
    sunGlowSolid.renderer.render(scena, camera);   
      
    }()); 

  }

  private eclipseAnimationStart(idAnimation: number){
    this.idAnimationEclipse = idAnimation;

    //console.log("radius: "+this.bloomPass.radius);
    //console.log("streght: "+this.bloomPass.strength);

    if(this.bloomPass.radius > 0.8)
    this.bloomPass.radius -= 0.004 //2

    if(this.bloomPass.strength > 0.8)
    this.bloomPass.strength -= 0.003; //1.8
    
    if(this.bloomPass.radius < 1.69)
      this.starMaterial.transparent = false;

    if(this.bloomPass.radius < 0.8){
      console.log("cancellato "+this.bloomPass.radius);
      cancelAnimationFrame( idAnimation );     
      this.idAnimationEclipse = -1;
    }

    this.camera.layers.set(1);
    this.bloomComposer.render();
  }

  private removeEclipseAnimation(){   

    let scena = this.scene;
    let camera = this.camera;
        
  let sunGlowSolid: SunGlowComponent = this;  
  (function animate() {       
      
    //moonSolid.idAnimationEclipse = 
    sunGlowSolid.idAnimationEclipse = requestAnimationFrame(animate);
    sunGlowSolid.removeEclipseAnimationStart(sunGlowSolid.idAnimationEclipse);
    sunGlowSolid.renderer.render(scena, camera);   
      
    }()); 

  }

  private removeEclipseAnimationStart(idAnimation: number){
    this.idAnimationEclipse = idAnimation;

    // console.log("radius: "+this.bloomPass.radius);
    // console.log("streght: "+this.bloomPass.strength);
    
     if(this.bloomPass.radius <= 2){
     // console.log("radius "+this.bloomPass.radius);
      this.bloomPass.radius += 0.002 //2
     }
 
     if(this.bloomPass.strength <= 1.8)
     this.bloomPass.strength += 0.003; //1.8
     
     if(this.bloomPass.radius > 1.68)
     this.starMaterial.transparent = true;
 
     if(this.bloomPass.radius >= 2){      
       cancelAnimationFrame( idAnimation );     
       this.idAnimationRemoveEclipse = -1;
     }
 
     this.camera.layers.set(1);
     this.bloomComposer.render();
  }

  private getAspectRatio(){
    return window.innerWidth/this.height /*window.innerHeight*/;
  }

  

}
