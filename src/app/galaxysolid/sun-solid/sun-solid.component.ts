import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ActiveAnimationSolid } from '../services-solid/active-animation-solid.services';


@Component({
  selector: 'app-sun-solid',
  templateUrl: './sun-solid.component.html',
  styleUrls: ['./sun-solid.component.scss']
})
export class SunSolidComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  private id!:number;

  private camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;


  private directionalLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  private light1!: THREE.PointLight;
  private light2!: THREE.PointLight;
  private light3!: THREE.PointLight;
  private light4!: THREE.PointLight;

  private height =  window.innerHeight;

  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  constructor(public animationService: ActiveAnimationSolid, @Inject(PLATFORM_ID) private platformId: Object) { 
 
  }
  
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) { 
    this.createScene();
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

/**/
    this.light1 = new THREE.PointLight(0xffa64d, 1);
    this.light1.position.set(0,-50,300);
    this.scene.add(this.light1);

    
    
    this.light2 = new THREE.PointLight(0xe62e00, 4);
    this.light2.position.set(0,-100,500);
    this.light2.intensity=2;
    this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0x4b371c, 20);
    this.light3.position.set(0,0,0);
    this.scene.add(this.light3);
    this.light4 = new THREE.PointLight(0x4b371c, 0.5);
    this.light4.position.set(-500,300,500);
    this.scene.add(this.light4);/*
*/
    const sphereGeometryMoon = new THREE.SphereGeometry(35,50,50);    
    const sphereMaterialMoon = new THREE.MeshStandardMaterial(
      { 
        map : new THREE.TextureLoader().load('assets/images/solids/sunSolid.jpg'),      
       }); 
     
    const sphereMoon = new THREE.Mesh(sphereGeometryMoon, sphereMaterialMoon);    
    sphereMoon.position.y=62.5;    
   
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
   
  //  this.camera.position.x = 30;
 //   this.camera.position.z = 200;
    //this.camera.position.x = 10;
    

  //  const helper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
  //  this.scene.add( helper ); 

     const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas:this.canvas});

//////queste due istruzioni servono a mettere il background trasparente. il background della scena deve essere impostato a null
      renderer.autoClear = false;
      renderer.setClearColor( 0x000000, 0.0);
/////
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth,this.height/*window.innerHeight*/);    
       
    this.renderer = renderer
    let scen = this.scene;
    let cam = this.camera;

   // const renderScene = 
   // renderer.render(scen, cam); 
   // cam.position.z = 10000;
    let id;    

    (function animate(){
      id = requestAnimationFrame(animate);
      renderer.render(scen, cam);   
   
     // console.log("y: "+sphereMoon.rotation.y);
      //if(sphereMoon.rotation.y<2)
      sphereMoon.rotation.y += 0.003;
     // else
     // cancelAnimationFrame( id );
    }());

  //  cancelAnimationFrame( id );
    console.log("id: "+id);
    (function animate(){
      requestAnimationFrame(animate);
      renderer.render(scen, cam);        
      //sphereMoon.rotation.z += 0.003;
    }());

    this.setupResize();
    this.resize();
  }

  //---------------------------resize event-------------------
  private setupResize(){
    window.addEventListener("resize", this.resize.bind(this));
  }

  private resize(){
    
    this.renderer.setSize(window.innerWidth, this.height/*window.innerHeight*/);
    this.camera.aspect = window.innerWidth/this.height/*window.innerHeight*/;   
    this.camera.updateProjectionMatrix();

  }
  //---------------------------resize event-------------------
  

  private getAspectRatio(){
    return window.innerWidth/this.height/*window.innerHeight*/;
  }




}
