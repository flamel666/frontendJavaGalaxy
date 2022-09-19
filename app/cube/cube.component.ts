import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import * as THREE from "three";
import {GLTFLoader, GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import { Scene } from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

    
  // loaderGltf = new GLTFLoader();
   
  //cube properties
  @Input() public rotationSpeedX: number = 0.012;
  @Input() public rotationSpeedY: number = 0;
  @Input() public size: number = 400;
  @Input() public texture: string = "assets/images/header.component/flag/flag-en.png";

  //stage properties
  @Input() public cameraZ: number = 200;
  @Input() public fieldOfView: number = 75;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlan: number = 30000;
  
  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }
 

 //private loader = new THREE.TextureLoader();
 // private geometry = new THREE.SphereGeometry(1.5,50,32);
 // private material = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});

  //private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private light1!: THREE.PointLight;
  private light2!: THREE.PointLight;
  private light3!: THREE.PointLight;
  private light4!: THREE.PointLight;
  private scene!: THREE.Scene;
 


  constructor() { }
  ngAfterViewInit() {
    //throw new Error('Method not implemented.');
    this.createScene();
  // this.startRenderingLoop();

    //this.createScene2();

/*
    this.loaderGltf.load('assets/shiba/scene.gltf', (gltf)=>{
      this.scene.add(gltf.scene);
    });*/    
   
  }

  ngOnInit(): void {
  }



  

  private createScene(){
    this.scene = new THREE.Scene();
    this.scene.position.y = 50;
    this.scene.position.x = 50;
    this.scene.background = new THREE.Color(0x00000);
    //this.camera.position.y=50;

    this.ambientLight = new THREE.AmbientLight(0x00000,1);
    this.ambientLight.position.y=200;
    this.ambientLight.position.set(1,1,5)
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0,1,4);
    //this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    /*
    this.directionalLight.shadow.camera.position.z=500;
    this.directionalLight.shadow.mapSize.width=1512;
    this.directionalLight.shadow.mapSize.height=1512;    
    this.directionalLight.shadow.camera.near=0.5;
    this.directionalLight.shadow.camera.far=500;*/
    
    
    const sphereGeometry = new THREE.SphereGeometry(25,50,50);
    const sphereMaterial = new THREE.MeshStandardMaterial(
      {//color:0x0000ff, 
        map : new THREE.TextureLoader().load('assets/images/8k_sun.jpg'),
       // transparent: true, 
        //opacity: 0.5, 
       // blending : THREE.AdditiveBlending,
        /*side: THREE.BackSide, */});

        const sphereGeometryGlow = new THREE.SphereGeometry(30,50,50);
        const sphereMaterialGlow = new THREE.MeshStandardMaterial(
          {color:0xffc14d, 
           // map : new THREE.TextureLoader().load('assets/images/8k_sun.jpg'),
           // transparent: true, 
            opacity: 0.5, 
           // blending : THREE.AdditiveBlending,
            side: THREE.BackSide, });

    const sphereGeometryMoon = new THREE.SphereGeometry(35,50,50);    
    const sphereMaterialMoon = new THREE.MeshStandardMaterial(
      {//color:0x0000ff, 
        map : new THREE.TextureLoader().load('assets/images/moo.jpg'),
       // transparent: true, 
        //opacity: 0.5, 
       // blending : THREE.AdditiveBlending,
        side: THREE.BackSide, });
      
        const shadersMaterial = new THREE.ShaderMaterial(
          {             
            transparent: true,
            blending : THREE.AdditiveBlending,
            side: THREE.BackSide, });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 60;    
    const sphereMoon = new THREE.Mesh(sphereGeometryMoon, sphereMaterialMoon);
    const sphereGlow = new THREE.Mesh(sphereGeometryGlow, sphereMaterialGlow);
    sphereMoon.position.y=50;
    sphereGlow.position.y = 60;
   // sphere.scale.set(1.1,1.1,1.1);
   
   // sphere.castShadow = true;
   // sphere.receiveShadow = false;
    this.scene.add(sphere);
    this.scene.add(sphereMoon);
    this.scene.add(sphereGlow);
    const helper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
    this.scene.add( helper ); 
    /*
    this.light1 = new THREE.PointLight(0x4b371c, 10);
    this.light1.position.set(0,200,400);
    this.scene.add(this.light1);
    this.light2 = new THREE.PointLight(0x4b371c, 10);
    this.light2.position.set(500,100,0);
    this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0x4b371c, 10);
    this.light3.position.set(0,100,-500);
    this.scene.add(this.light3);
    this.light4 = new THREE.PointLight(0x4b371c, 10);
    this.light4.position.set(-500,300,500);
    this.scene.add(this.light4);
*/

  //  this.scene.add(this.cube);
 /* 
  //serve a caricare i gltf
  this.loaderGltf.load('assets/star_of_sun/scene.gltf', (gltf)=>{   
    gltf.scene.children[0].position.y = -50;
    gltf.scene.children[0].position.x = 0;      
    gltf.scene.children[0].setRotationFromAxisAngle(new THREE.Vector3(1,0,0,),0);       
    this.scene.add(gltf.scene.children[0]);    
  });
*/
  


    let aspectRatio = this.getAspectRatio();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlan
    )


    this.camera.position.z = this.cameraZ;
    this.camera.position.y = 30;
    this.camera.position.x = 30;
    this.camera.position.z = 200;
    //this.camera.position.x = 10;
    
     let renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas:this.canvas});
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight); 
    
    //document.body.appendChild(renderer.domElement);


    let scen = this.scene;
    let cam = this.camera;
   // cam.position.z = 10000;
    (function animate(){
      requestAnimationFrame(animate);
      renderer.render(scen, cam);
      sphere.rotation.y += 0.003;
      sphereMoon.rotation.y -= 0.003;
    }());
  }
  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube(){
   // this.camera.rotation.y += this.rotationSpeedX;
   // this.camera.rotation.y += 0.001;
    //this.camera.rotation.x += 1;
   // this.camera.rotation.z += this.rotationSpeedX;
  // console.log("oj: "+this.object)
  // this.object.rotation.y += 0.001
    this.scene.rotation.y+= 0.01;
  }


  private startRenderingLoop(){
    this.renderer = new THREE.WebGLRenderer({
      antialias:true,
      canvas:this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);   

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.autoRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;    
    controls.update();


    let component: CubeComponent = this;
    (function render(){
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
    
  }

}
