import *as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js";
//import *as CANNON from "cannon-es";//uncomment this during developing
import *as CANNON from "CANNON";  //un comment this during running
export class Initializer 
{ Scene;
  Camera;
  Renderer;
  Entities=[];
  Dev_Controls;
  constructor(isDeveloper)
  { this.Scene=new THREE.Scene();
    this.Camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    this.Renderer=new THREE.WebGLRenderer();
    if(isDeveloper==true)
    { this.Dev_Controls=new OrbitControls(this.Camera,this.Renderer.domElement);
    }
  }
   Initialize(camera_Position) //initializes basic three js 
   { this.Camera.position.copy(camera_Position);
     this.Renderer.setSize(window.innerWidth,window.innerHeight);
     document.body.appendChild(this.Renderer.domElement);
   }
   pushEntity(Enitity,Name,Purpose) //any entity introduced, will be wrapped and pushed to Entities_array
   { this.Entities.push({Enitity:Enitity,Name:Name,Purpose:Purpose,needsUpdate:true});
   }
   Deactivate_Entity(Name)
   { this.Entities.forEach((e)=>{
    if(e.Name==Name)
   { e.needsUpdate=false;
   console.log("Deactivated",e)}
    
   })
   }





Update() //updates all properties must be called with requestAnimationFrame()
{ if(this.Dev_Controls)
    this.Dev_Controls.update();
  if(this.Entities.length>0) 
  this.Entities.forEach(entity=>{
    if(entity.needsUpdate==true)
    entity.Enitity.Update();
  })  
   this.Renderer.render(this.Scene,this.Camera);
   return true;
}

}


//controls
export class Controls{
  object;
  camera;
  KeyPress={front:false,back:false,right:false,left:false,crouch:false}
  DefaultKeys={front:"s",left:"d",right:"a",back:"w",crouch:"c"};
  State_Machine=new State_Machine();
  Animations={walk:undefined,crouch:undefined,idle:undefined,attacks:[],death:undefined};
  CurrentState;
  Quaternion=new THREE.Quaternion();
  Direction=new THREE.Vector3();
  Axis=new THREE.Vector3(0,1,0);
  PhysicalBody;
  orbitControls;
     constructor(obj,cam,PhyBody,orbitControls)
     { this.camera=cam;
       this.object=obj;
       document.addEventListener("keydown",this.KeyDown_DOM_listener.bind(this));
       document.addEventListener("keyup",this.KeyUp_DOM_listener.bind(this));
      if(PhyBody)
      this.PhysicalBody=PhyBody;
      if(orbitControls)
      this.orbitControls=orbitControls;
     }
     
    KeyDown_DOM_listener(event){
      if(event.key==this.DefaultKeys.front)
      this.KeyPress.front=true;
      if(event.key==this.DefaultKeys.back)
      this.KeyPress.back=true;
      if(event.key==this.DefaultKeys.right)
      this.KeyPress.right=true;
      if(event.key==this.DefaultKeys.left)
      this.KeyPress.left=true;
      if(event.key==this.DefaultKeys.crouch)
      this.KeyPress.crouch=true;


     }
     KeyUp_DOM_listener(event){
      if(event.key==this.DefaultKeys.front)
      this.KeyPress.front=false;
      if(event.key==this.DefaultKeys.back)
      this.KeyPress.back=false;
      if(event.key==this.DefaultKeys.right)
      this.KeyPress.right=false;
      if(event.key==this.DefaultKeys.left)
      this.KeyPress.left=false;
      if(event.key==this.DefaultKeys.crouch)
      this.KeyPress.crouch=false;
     }

   Animation_SetUp(animationsObject) //must have properties walk,crouch,idle ,shooting etc
   { this.Animations.idle=animationsObject.idle;
     this.Animations.crouch=animationsObject.crouch;
     this.Animations.walk=animationsObject.walk;
     this.Animations.attacks=animationsObject.attacks;
   }

   getAnimation_to_Play()
   {var Return;
    var SM_state=this.CurrentState; 
    
    if(SM_state=="idle")
    Return=this.Animations.idle;
    if(SM_state=="walk")
    Return=this.Animations.walk;
    if(SM_state=="attack")
    Return=this.Animations.attacks[Math.floor(Math.random()*this.Animations.attacks.length)];   
   
    return Return;
   }
    
   TransForm()
   { 
    const CameraYDirection=Math.atan2((this.camera.position.x-this.object.position.x),
    (this.camera.position.z-this.object.position.z));

    const Directionoffset=this.Calculate_oFFSET();
  
    this.Quaternion.setFromAxisAngle(this.Axis,CameraYDirection+Directionoffset);
    if(this.CurrentState=="walk")
    this.object.quaternion.copy(this.Quaternion);

    //camera 
    this.camera.getWorldDirection(this.Direction);
    this.Direction.y=0;
    this.Direction.normalize();
    this.Direction.applyAxisAngle(this.Axis,Directionoffset);

    const moveX=this.Direction.x*0.5
    const moveZ=this.Direction.z*0.5;
    if(this.PhysicalBody&&this.CurrentState=="walk")
   { this.PhysicalBody.position.x-=moveX;
    this.PhysicalBody.position.z-=moveZ;

     this.object.position.copy(this.PhysicalBody.position);
    this.UpdateCamera(moveX,moveZ);
   }

   
   

   }
   UpdateCamera(x,z)
   { this.camera.position.x-=x;
     this.camera.position.z-=z;
     
     const CameraTarget=new THREE.Vector3(this.object.position.x,this.object.position.y+1,this.object.position.z);
     if(this.orbitControls)
     { this.orbitControls.target=CameraTarget;

     }

   }

   Calculate_oFFSET()
   {var offset=Math.PI; 
    if(this.KeyPress.front==true&&(this.KeyPress.crouch==false&&this.KeyPress.left==false&&this.KeyPress.right==false&&this.KeyPress.back==false))
     {offset=0};

     if(this.KeyPress.back==true&&(this.KeyPress.crouch==false&&this.KeyPress.left==false&&this.KeyPress.right==false&&this.KeyPress.front==false))
     {offset=Math.PI};

     if(this.KeyPress.left==true&&(this.KeyPress.crouch==false&&this.KeyPress.front==false&&this.KeyPress.right==false&&this.KeyPress.back==false))
     {offset=Math.PI/2};

     if(this.KeyPress.right==true&&(this.KeyPress.crouch==false&&this.KeyPress.front==false&&this.KeyPress.left==false&&this.KeyPress.back==false))
     {offset=-Math.PI/2};
//
     if(this.KeyPress.front==true&&this.KeyPress.right)
     {offset=-Math.PI/4};

     if(this.KeyPress.front==true&&this.KeyPress.left)
     {offset=Math.PI/4};

     if(this.KeyPress.back==true&&this.KeyPress.right)
     {offset=-3*(Math.PI/4)};

     if(this.KeyPress.back==true&&this.KeyPress.left)
     {offset=3*(Math.PI/4)};

   return offset;
   }

   Update()
   { const getState=this.State_Machine.Update(this.KeyPress);
    this.CurrentState=getState;
      this.TransForm();
      

   }

}

export class State_Machine{
  NextState;
  

  Update(Controls_keys)
  {  
     let front=Controls_keys.front;
     let back=Controls_keys.back;
     let right=Controls_keys.right;
     let left=Controls_keys.left;
     let crouch=Controls_keys.crouch;
     //check
    if((front==true||back==true||right==true||left==true)&&crouch==false)
    this.NextState="walk";
    if((front==true||back==true||right==true||left==true)&&crouch==true)
    this.NextState="attack";
    if((front==false||back==false||right==false||left==false)&&crouch==true)
    this.NextState="attack";
    if((front==false&&back==false&&right==false&&left==false)&&crouch==false)
    this.NextState="idle";
     



  return this.NextState; 
  } 
}

const AboutMeDiv=document.createElement("div");
AboutMeDiv.className="AboutMe";
AboutMeDiv.innerHTML="<img src =../assets/JustMe.jpg>"
+"<p>My name is saif and i am a web app,game and site developer . Created a multiplayer game in three js , Portfolio etc</p>";

const AboutUniversityDiv=document.createElement("div");
AboutUniversityDiv.className="AboutUni";
AboutUniversityDiv.innerHTML=""
+"<p>Uni Website</p><iframe src=https://hu.edu.pk/>";

const SocialLinkDiv=document.createElement("div");
SocialLinkDiv.className="SocialLinks";
SocialLinkDiv.innerHTML="<img src=../assets/TikTok.png >"
+"<p>Follow me on TikTok as M_Kopesh <p>";

const AboutUsDiv=document.createElement("div");
AboutUsDiv.className="AboutUs";
AboutUsDiv.innerHTML="<p>We are students of BSSE and have experience in three js , html and css and node js ";

export {AboutMeDiv,AboutUniversityDiv,SocialLinkDiv,AboutUsDiv};

export class MobileControls extends Controls 
{ 
  constructor( obj,cam,PhyBody,orbitControls,DOMkeys,ExactKeys)
  { super(obj,cam,PhyBody,orbitControls);
    this.DefaultKeys={front:DOMkeys[0],left:DOMkeys[1],right:DOMkeys[2],back:DOMkeys[3],crouch:DOMkeys[4]};;//dom keys must be ids 
    //exact keys are html buttons responsible for moving they should be in order array
    ExactKeys.forEach(key=>{key.addEventListener("touchstart",this.TouchDown_DOM_listener.bind(this));
        key.addEventListener("touchend",this.TouchUp_DOM_listener.bind(this))})
    console.log(this.DefaultKeys)
    
    
  }

//touch start
TouchDown_DOM_listener(obj){
  
  let event={key:obj.srcElement.id};//modified to avoid changing below 
  if(event.key==this.DefaultKeys.front)
  this.KeyPress.front=true;
  if(event.key==this.DefaultKeys.back)
  this.KeyPress.back=true;
  if(event.key==this.DefaultKeys.right)
  this.KeyPress.right=true;
  if(event.key==this.DefaultKeys.left)
  this.KeyPress.left=true;
  if(event.key==this.DefaultKeys.crouch)
  this.KeyPress.crouch=true;

 


 }
 TouchUp_DOM_listener(obj){
  
  let event={key:obj.srcElement.id};//modified to avoid changing
  if(event.key==this.DefaultKeys.front)
  this.KeyPress.front=false;
  if(event.key==this.DefaultKeys.back)
  this.KeyPress.back=false;
  if(event.key==this.DefaultKeys.right)
  this.KeyPress.right=false;
  if(event.key==this.DefaultKeys.left)
  this.KeyPress.left=false;
  if(event.key==this.DefaultKeys.crouch)
  this.KeyPress.crouch=false;
 }

  update()//call this if mobile
  {
    this.Update();
    
  }

}
//if mobile detected

const ForwardButton=document.createElement("button");
ForwardButton.id="Forward";
ForwardButton.innerText="Forward";
const BackwardButton=document.createElement("button");
BackwardButton.id="Backward";
BackwardButton.innerText="Backward";
const RightButton=document.createElement("button");
RightButton.id="Right";
RightButton.innerText="Right";
const LeftButton=document.createElement("button");
LeftButton.id="Left";
LeftButton.innerText="Left";
const SpecialButton=document.createElement("button");
SpecialButton.id="Special";
SpecialButton.innerText="Dance";

export  const MobileControlsPackage=[BackwardButton,RightButton,LeftButton,ForwardButton,SpecialButton];