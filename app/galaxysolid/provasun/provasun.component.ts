import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ActiveAnimationSolid } from '../services-solid/active-animation-solid.services';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';


@Component({
  selector: 'app-provasun',
  templateUrl: './provasun.component.html',
  styleUrls: ['./provasun.component.scss']
})
export class ProvasunComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private scene1! : THREE.Scene;

  private time: number =0;

  private materialSun!: THREE.ShaderMaterial;
  private materialSunAround!: THREE.ShaderMaterial;
  private materialPerlin!: THREE.ShaderMaterial;

  private geometry!: THREE.SphereBufferGeometry;
  private geometryAround!: THREE.SphereBufferGeometry;
  private plane!: THREE.Mesh;
  private planeAround!: THREE.Mesh;
  private perlin!: THREE.Mesh;

  private cubeRenderTarget1!: THREE.WebGLCubeRenderTarget
  private cubeCamera1!: THREE.CubeCamera;

  private height =  window.innerHeight;

  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  }

  constructor() { }
  ngAfterViewInit(): void {
    this.createScene();
  }

  ngOnInit(): void {
  }

  private createScene(){

    this.scene = new THREE.Scene();
    this.scene.background = null;

    //render
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas:this.canvas});

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.height /*window.innerHeight*/, window.innerWidth);
    //this.renderer.setClearColor(0x000000,1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.autoClear = false;
    this.renderer.setClearColor( 0x000000, 0.0);
  //
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.height /*window.innerHeight*//window.innerWidth,
        0.001,
        1000
      );

      this.camera.position.set(0,0,2);
      this.camera.position.z = 6.5;
      this.camera.position.y = -1.9 ;
     
      this.addAround(); 
      this.addTexture();
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();

/*
    this.scene = new THREE.Scene();    
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.01,
      300
    );    

    this.camera.position.z = 200;
    this.camera.position.y = 2;
    this.camera.lookAt(0,0,0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas:this.canvas});
    
      const s = 250;

				const geometry = new THREE.BoxGeometry( s, s, s );
				const material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );
    
      for ( let i = 0; i < 3000; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = 8000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.y = 8000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.z = 8000 * ( 2.0 * Math.random() - 1.0 );

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        this.scene.add( mesh );

      }

      const dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
      dirLight.position.set( 0, - 1, 0 ).normalize();
      dirLight.color.setHSL( 0.1, 0.7, 0.5 );
      this.scene.add( dirLight );

      const textureLoader = new THREE.TextureLoader();

			const textureFlare0 = textureLoader.load( 'textures/lensflare/lensflare0.png' );
			const textureFlare3 = textureLoader.load( 'textures/lensflare/lensflare3.png' );

      this.addLight( 0.55, 0.9, 0.5, 5000, 0, - 1000,textureFlare0,textureFlare3 );
			this.addLight( 0.08, 0.8, 0.5, 0, 0, - 1000,textureFlare0,textureFlare3 );
			this.addLight( 0.995, 0.5, 0.9, 5000, 5000, - 1000,textureFlare0,textureFlare3 );

      renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.render( this.scene, this.camera );
*/



    /*
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 300 );    
    camera.position.z = 4;
    const scene = new THREE.Scene();
    */
    //this.scene.background = null;
/*
    let ambientLight = new THREE.AmbientLight(0x00000,1);
    ambientLight.position.y=200;
    ambientLight.position.set(0,-10,5)
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0,-1,4);
    //this.directionalLight.castShadow = true;
    scene.add(directionalLight);    
  */
   // this.scene.add(sphereMoon);
        

/*
   //funziona così così
    let clock = new THREE.Clock();
      
    const textureLoader = new THREE.TextureLoader();

    let uniforms = {

      'fogDensity': { value: 0.25 },
      'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
      'time': { value: 1.0 },
      'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
      'texture1': { value: textureLoader.load( 'assets/images/solids/cloud.png' ) },
      'texture2': { value: textureLoader.load( 'assets/images/solids/lavatile.jpg' ) }

    };

    uniforms[ 'texture1' ].value.wrapS = uniforms[ 'texture1' ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ 'texture2' ].value.wrapS = uniforms[ 'texture2' ].value.wrapT = THREE.RepeatWrapping;

    const size = 0.65;
    let vertexShader =`\n\n\t\t\tuniform vec2 uvScale;\n\t\t\tvarying vec2 vUv;\n\n\t\t\tvoid main()\n\t\t\t{\n\n\t\t\t\tvUv = uvScale * uv;\n\t\t\t\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\tgl_Position = projectionMatrix * mvPosition;\n\n\t\t\t}\n\n\t\t`;
    let fragmentShader =`\n\n\t\t\tuniform float time;\n\n\t\t\tuniform float fogDensity;\n\t\t\tuniform vec3 fogColor;\n\n\t\t\tuniform sampler2D texture1;\n\t\t\tuniform sampler2D texture2;\n\n\t\t\tvarying vec2 vUv;\n\n\t\t\tvoid main( void ) {\n\n\t\t\t\tvec2 position = - 1.0 + 2.0 * vUv;\n\n\t\t\t\tvec4 noise = texture2D( texture1, vUv );\n\t\t\t\tvec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;\n\t\t\t\tvec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;\n\n\t\t\t\tT1.x += noise.x * 2.0;\n\t\t\t\tT1.y += noise.y * 2.0;\n\t\t\t\tT2.x -= noise.y * 0.2;\n\t\t\t\tT2.y += noise.z * 0.2;\n\n\t\t\t\tfloat p = texture2D( texture1, T1 * 2.0 ).a;\n\n\t\t\t\tvec4 color = texture2D( texture2, T2 * 2.0 );\n\t\t\t\tvec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );\n\n\t\t\t\tif( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }\n\t\t\t\tif( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }\n\t\t\t\tif( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }\n\n\t\t\t\tgl_FragColor = temp;\n\n\t\t\t\tfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n\t\t\t\tconst float LOG2 = 1.442695;\n\t\t\t\tfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n\t\t\t\tfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\n\t\t\t\tgl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n\n\t\t\t}\n\n\t\t`;
    const material = new THREE.ShaderMaterial( {

      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader

    } );

    let mesh = new THREE.Mesh( new THREE.SphereGeometry(0.65,50,50), material );
    mesh.rotation.x = 0.3;
    scene.add( mesh )


   let renderer = new THREE.WebGLRenderer( { antialias: true,canvas:this.canvas,alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.autoClear = false;
    renderer.setClearColor( 0x000000, 0.0);
    renderer.autoClear = false;

    let light1 = new THREE.PointLight(0xffa64d, 1);
    light1.position.set(0,-50,300);
    scene.add(light1);

    const renderModel = new RenderPass( scene, camera );
    const effectBloom = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.9,
    0.9,
    3.85 );
   // const effectFilm = new EffectF( 0.35, 0.95, 2048, false );
   const composer = new EffectComposer( renderer );
   composer.renderToScreen = true;
   composer.addPass( renderModel );
   composer.addPass( effectBloom );
   
   (function animate(){
     requestAnimationFrame(animate);
  //  renderer.render(scen, cam);   
  const delta = 5 * clock.getDelta();

  uniforms[ 'time' ].value += 0.2 * delta;

  mesh.rotation.y += 0.0125 * delta;
  //mesh.rotation.x += 0.05 * delta;
  //camera.layers.set(1);
  renderer.clear();
  composer.render( );
 // camera.layers.set(1);
 
  
  }());
*/
  }

  private setupResize(){
    window.addEventListener("resize", this.resize.bind(this));
  }

  private resize(){
    
    this.renderer.setSize(window.innerWidth, this.height /*window.innerHeight*/);
    this.camera.aspect = window.innerWidth/this.height /*window.innerHeight*/;

    this.camera.updateProjectionMatrix();
  }

  private addObjects(){

    let vertex =`\n    uniform float time;\n    varying vec2 vUv;\n    varying vec3 vPosition;\n    varying vec3 vNormal;\n    varying vec2 pixels;\n    float pi = 3.141592653589;\n\n    varying vec3 vLayer0;\n  varying vec3 vLayer1;\n  varying vec3 vLayer2;\n  varying vec3 eyeVector;\n\n  mat2 rotate(float a){\n    float s = sin(a);\n    float c = cos(a);\n    return mat2(c, -s,s,c);\n  }\n\n  float Fresnel(vec3 eyeVector, vec3 worldNormal){\n    return pow(1.0+dot(eyeVector, worldNormal), 3.0);\n  }\n\n    void main()\n    {\n      vNormal = normal;\n\n      vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n      eyeVector = normalize(worldPosition.xyz - cameraPosition);\n\n      float t = time*0.002;\n\n      mat2 rot = rotate(t);\n\n      vec3 p0 = position;\n      p0.yz = rot*p0.yz;\n      vLayer0 = p0;\n\n      mat2 rot1 = rotate(t+10.);\n      vec3 p1 = position;\n      p1.xz = rot1*p1.xz;\n      vLayer1 = p1;\n\n      mat2 rot2 = rotate(t+10.);\n      vec3 p2 = position;\n      p2.xz = rot2*p2.xz;\n      vLayer2 = p2;\n\n      vUv = uv;\n     vPosition = position;\n     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);\n    }\n`;
    let fragment= `\n  uniform float time;\n  uniform float progress;\n  uniform sampler2D texture1;\n  uniform vec4 resolution;\n  uniform samplerCube uPerlin;\n  varying vec2 vUv;\n  varying vec3 vPosition;\n  varying vec3 vNormal;\n  varying vec3 vLayer0;\n  varying vec3 vLayer1;\n  varying vec3 vLayer2;\n  varying vec3 eyeVector;\n\n  float pi = 3.141592653589;\n\n  vec3 brightnessToColor(float b){\n    b *= 0.25;\n\n    return (vec3(b,b*b,b*b*b*b)/0.25)*0.8;\n  }\n\n  float supersun(){\n    float sum = 0.;\n    sum += textureCube(uPerlin, vLayer0).r;\n    sum += textureCube(uPerlin, vLayer1).r;\n    sum += textureCube(uPerlin, vLayer2).r;\n\n    sum *= 0.33;\n    return sum;\n  }\n\n  float Fresnel(vec3 eyeVector, vec3 worldNormal){\n    return pow(1.0+dot(eyeVector, worldNormal), 3.0);\n  }\n\n    void main()\n    { \n        float brightness = supersun();\n        brightness = brightness *4. +1.;\n\n        float fres = Fresnel(eyeVector, vNormal);\n        brightness+= fres;\n\n\n\n        vec3 col = brightnessToColor(brightness);\n\n        gl_FragColor = vec4(col,1.);\n      //  gl_FragColor = vec4(1.,0.,1.,1.);\n      // gl_FragColor = vec4(supersun());\n     //  gl_FragColor = vec4(1.,0.6,0.2,1.);\n        //gl_FragColor = textureCube(uPerlin, vPosition);\n      \n    }\n`;
    let that = this;
    this.materialSun = new THREE.ShaderMaterial({
      extensions: {
        derivatives: true
      },
      side: THREE.DoubleSide,
      uniforms: {
        'time': {value: 0},
        'uPerlin': {value : null},
        'resolution' : {value : new THREE.Vector4()},
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.SphereBufferGeometry(1,30,30);

    this.plane = new THREE.Mesh(this.geometry, this.materialSun);

    this.scene.add(this.plane);
  }

  private render(){

    this.cubeCamera1.update(this.renderer, this.scene1);

    this.materialSun.uniforms['uPerlin'].value = this.cubeRenderTarget1.texture;
    
    this.time += 0.05;
    this.materialSun.uniforms['time'].value = this.time;
    this.materialPerlin.uniforms['time'].value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
/*
  public addLight( h:number, s:number, l:number, x:number, y:number, z:number,textureFlare0:THREE.Texture, textureFlare3:THREE.Texture ) {

    const light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );
    this.scene.add( light );

    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
    light.add( lensflare );

  }
*/
private addTexture(){
  this.scene1 = new THREE.Scene();
  this.cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256,{
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding
  });

  this.cubeCamera1 = new THREE.CubeCamera(0.1,10,this.cubeRenderTarget1);

  let vertex =`\n    uniform float time;\n    varying vec2 vUv;\n    varying vec3 vPosition;\n    varying vec2 pixels;\n    float pi = 3.141592653589;\n\n    void main()\n    {\n      vUv = uv;\n     vPosition = position;\n     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);\n    }\n`;
 let fragment= `\n  uniform float time;\n  uniform float progress;\n  uniform sampler2D texture1;\n  uniform vec4 resolution;\n  varying vec2 vUv;\n  varying vec3 vPosition;\n  float pi = 3.141592653589;\n\nvec4 mod289(vec4 x) {\nreturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nfloat mod289(float x) {\nreturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\nreturn mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\nreturn mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\nreturn 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\nreturn 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n{\nconst vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\nvec4 p,s;\n\np.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\np.w = 1.5 - dot(abs(p.xyz), ones.xyz);\ns = vec4(lessThan(p, vec4(0.0)));\np.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\nreturn p;\n}\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n{\nconst vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n0.276393202250021,  // 2 * G4\n0.414589803375032,  // 3 * G4\n-0.447213595499958); // -1 + 4 * G4\n\n// First corner\nvec4 i  = floor(v + dot(v, vec4(F4)) );\nvec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\nvec4 i0;\nvec3 isX = step( x0.yzw, x0.xxx );\nvec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\ni0.x = isX.x + isX.y + isX.z;\ni0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\ni0.y += isYZ.x + isYZ.y;\ni0.zw += 1.0 - isYZ.xy;\ni0.z += isYZ.z;\ni0.w += 1.0 - isYZ.z;\n\n// i0 now contains the unique values 0,1,2,3 in each channel\nvec4 i3 = clamp( i0, 0.0, 1.0 );\nvec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\nvec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n//  x0 = x0 - 0.0 + 0.0 * C.xxxx\n//  x1 = x0 - i1  + 1.0 * C.xxxx\n//  x2 = x0 - i2  + 2.0 * C.xxxx\n//  x3 = x0 - i3  + 3.0 * C.xxxx\n//  x4 = x0 - 1.0 + 4.0 * C.xxxx\nvec4 x1 = x0 - i1 + C.xxxx;\nvec4 x2 = x0 - i2 + C.yyyy;\nvec4 x3 = x0 - i3 + C.zzzz;\nvec4 x4 = x0 + C.wwww;\n\n// Permutations\ni = mod289(i);\nfloat j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\nvec4 j1 = permute( permute( permute( permute (\ni.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n+ i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n+ i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n+ i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\nvec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\nvec4 p0 = grad4(j0,   ip);\nvec4 p1 = grad4(j1.x, ip);\nvec4 p2 = grad4(j1.y, ip);\nvec4 p3 = grad4(j1.z, ip);\nvec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\nvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\np0 *= norm.x;\np1 *= norm.y;\np2 *= norm.z;\np3 *= norm.w;\np4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\nvec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\nvec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\nm0 = m0 * m0;\nm1 = m1 * m1;\nreturn 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n+ dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n\nfloat fbm(vec4 p){\n  float sum =0.;\n  float amp = 1.;\n  float scale = 1.;\n  for(int i=0;i<6;i++){\n    sum+=snoise(p*scale)*amp;\n    p.w += 100.;\n    amp *=0.9;\n    scale *=2.;\n  }\n\n  return sum;\n\n}\n\n    void main()\n    {\n        \n        vec4 p = vec4(vPosition*4.,time*0.005);\n        float noisy = fbm(p);        \n       \n       vec4 p1 = vec4(vPosition*2., time*0.05);\n       float spots = max(snoise(p1),0.);\n\n        gl_FragColor = vec4(noisy);\n        gl_FragColor *= mix(1., spots, 0.7);\n      \n    }\n`;

  this.materialPerlin = new THREE.ShaderMaterial({
    extensions: {
      derivatives: true
    },
    side: THREE.DoubleSide,
    uniforms: {
      'time': {value: 0},
      'resolution' : {value : new THREE.Vector4()},
    },
    vertexShader: vertex,
    fragmentShader: fragment
  });

  this.geometry = new THREE.SphereBufferGeometry(0.99,30,30);

    this.perlin = new THREE.Mesh(this.geometry, this.materialPerlin);

    this.scene1.add(this.perlin);

}

private addAround(){
  let vertex =`\n    uniform float time;\n    varying vec2 vUv;\n    varying vec3 vPosition;\n    varying vec3 vNormal;\n    varying vec2 pixels;\n    float pi = 3.141592653589;\n\n    varying vec3 vLayer0;\n  varying vec3 vLayer1;\n  varying vec3 vLayer2;\n  varying vec3 eyeVector;\n\n  mat2 rotate(float a){\n    float s = sin(a);\n    float c = cos(a);\n    return mat2(c, -s,s,c);\n  }\n\n  float Fresnel(vec3 eyeVector, vec3 worldNormal){\n    return pow(1.0+dot(eyeVector, worldNormal), 3.0);\n  }\n\n    void main()\n    {\n      vNormal = normal;\n\n      vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n      eyeVector = normalize(worldPosition.xyz - cameraPosition);\n\n      float t = time*0.002;\n\n      mat2 rot = rotate(t);\n\n      vec3 p0 = position;\n      p0.yz = rot*p0.yz;\n      vLayer0 = p0;\n\n      mat2 rot1 = rotate(t+10.);\n      vec3 p1 = position;\n      p1.xz = rot1*p1.xz;\n      vLayer1 = p1;\n\n      mat2 rot2 = rotate(t+10.);\n      vec3 p2 = position;\n      p2.xz = rot2*p2.xz;\n      vLayer2 = p2;\n\n      vUv = uv;\n     vPosition = position;\n     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);\n    }\n`;
  let fragment= `\n  uniform float time;\n  uniform float progress;\n  uniform sampler2D texture1;\n  uniform vec4 resolution;\n  uniform samplerCube uPerlin;\n  varying vec2 vUv;\n  varying vec3 vPosition;\n  varying vec3 vNormal;\n  varying vec3 vLayer0;\n  varying vec3 vLayer1;\n  varying vec3 vLayer2;\n  varying vec3 eyeVector;\n\n  float pi = 3.141592653589;\n\n  vec3 brightnessToColor(float b){\n    b *= 0.25;\n\n    return (vec3(b,b*b,b*b*b*b)/0.25)*0.8;\n  }\n\n  float supersun(){\n    float sum = 0.;\n    sum += textureCube(uPerlin, vLayer0).r;\n    sum += textureCube(uPerlin, vLayer1).r;\n    sum += textureCube(uPerlin, vLayer2).r;\n\n    sum *= 0.33;\n    return sum;\n  }\n\n  float Fresnel(vec3 eyeVector, vec3 worldNormal){\n    return pow(1.0+dot(eyeVector, worldNormal), 3.0);\n  }\n\n    void main()\n    { \n      //  float brightness = supersun();\n      //  brightness = brightness *4. +1.;\n\n      //  float fres = Fresnel(eyeVector, vNormal);\n      //  brightness+= fres;\n\n\n        float radial = 1. - vPosition.z;\n        radial *= radial*radial;\n\n        float brightness = 1. + radial*0.83;\n\n        gl_FragColor.rgb = brightnessToColor(brightness)*radial;\n        gl_FragColor.a = radial;\n\n      //  vec3 col = brightnessToColor(brightness);\n\n      //    gl_FragColor = vec4(col,1.);\n       //   gl_FragColor = vec4(radial,0.,0.,1.);\n      // gl_FragColor = vec4(supersun());\n     //  gl_FragColor = vec4(1.,0.6,0.2,1.);\n        //gl_FragColor = textureCube(uPerlin, vPosition);\n      \n    }\n`;
  
  this.materialSunAround = new THREE.ShaderMaterial({
    extensions: {
      derivatives: true
    },
    side: THREE.BackSide,
    uniforms: {
      'time': {value: 0},
      'uPerlin': {value : null},
      'resolution' : {value : new THREE.Vector4()},
    },
    vertexShader: vertex,
    fragmentShader: fragment
  });

  this.geometryAround = new THREE.SphereBufferGeometry(1.07,30,30);

  this.planeAround = new THREE.Mesh(this.geometryAround, this.materialSunAround);

  this.scene.add(this.planeAround);
}

}
