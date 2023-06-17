// file responsible for loading Contact page 

/*----------Importing core modules--------------------------*/
import *as THREE from "three";
import {SceneManager} from "./3D Core Modules/Scene_Manager.js";
import {Animation_Manager} from "./3D Core Modules/Animation_Manager.js";
import {Create_LoadManager} from "./CommonLoadingManager.js";
import{OrbitControls} from "./3D Core Modules/OrbitControls.js";

document.addEventListener("DOMContentLoaded",LoadWeb);

function LoadWeb()
{
/*--------------------------------------------3D Scene-------------------------------------------------*/
const Scene=new THREE.Scene();
const Camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
const Renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});

//settings
Renderer.setSize(window.innerWidth,window.innerHeight);
Camera.position.set(-0.22,1.29,2.45);
document.body.appendChild(Renderer.domElement);
const orbit=new OrbitControls(Camera,Renderer.domElement);
orbit.target=new THREE.Vector3(-0.21,1.29,2.43);
orbit.enableZoom=false;
orbit.enablePan=false;
var AllowClick=false; //to prevent directly clicking on 3d by clicking cancel button

//mobile device detections
const querry=window.navigator.userAgent;
var isMobile;
if(querry.includes("Android")||querry.includes("iPhone")||querry.includes("Phone"))
isMobile=true;
else isMobile=false;
console.log("is device Mobile ? ",isMobile);

//raycaster
const rayCaster=new THREE.Raycaster();

const pointer=new THREE.Vector2();
document.addEventListener("mousemove",onPointerMove)
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//


//resize handler
window.addEventListener("resize",function(){
    Renderer.setSize(this.window.innerWidth,this.window.innerWidth);
    Camera.updateProjectionMatrix();
})
//

//managers
const LoadingManager=Create_LoadManager(AddModels,ProgressHandler);
const Scene_Handler=new SceneManager(Scene,LoadingManager);
var Animation_Handler;  //is varribale because i want to add animation when scene manager have models

Camera.lookAt(new THREE.Vector3(0,1,-5))

//

//progress handler


//load controller
const loadBar=document.getElementById("loaded");
const loadDiv=document.getElementById("loadDiv");
const percentShow=document.getElementById("percent");

function ProgressHandler(url,loaded,total)
{ loadBar.value=Math.floor((loaded/total)*100);
  percentShow.innerText=loadBar.value+" % loaded";

}



//models
const Greeter=Scene_Handler.Model_Adder("./assets/HomePageGreeter.glb","greeter");
const Home=Scene_Handler.Model_Adder("./assets/smartphone.glb","h");
const Greeter2=Scene_Handler.Model_Adder("./assets/HomePageGreeter3.glb","greeter2");
const Greeter3=Scene_Handler.Model_Adder("./assets/HomePageGreeter2.glb","greeter3");
const BG=Scene_Handler.Model_Adder("./assets/VirtualBG.glb","bg");

var GreeterSelected=localStorage.getItem("Greeter") || undefined;

if(GreeterSelected==undefined)
GreeterSelected="Default";
//

//lights
 const Lights=[
    new THREE.DirectionalLight("white",1),
    new THREE.SpotLight("white",1),
    new THREE.AmbientLight("white",0.2)
   ]
   Lights.forEach(l=>{Scene.add(l);l.position.z=5;if(l.isSpotLight){l.lookAt(0,0,0);}})
//

//model Adder
function AddModels()
{ Scene_Handler.Add_Recursive_Collection([Greeter,Home,Greeter2,Greeter3,BG]);
  //default greeter  
 if(GreeterSelected=="Default"||GreeterSelected==undefined)
Scene_Handler.Add_Recursive_Models([Greeter,Home,BG]);
//JSON
if(GreeterSelected=="JSON")
Scene_Handler.Add_Recursive_Models([Greeter2,Home,BG]);
//Armina 
if(GreeterSelected=="Armina")
Scene_Handler.Add_Recursive_Models([Greeter3,Home,BG]);



console.log(GreeterSelected);
  Scene_Handler.ChangePosition("h",15,0.5,2);
  Scene_Handler.ChangePosition("greeter2",-1,0,0);
  Scene_Handler.ChangePosition("greeter3",-1,0,0);
  Scene_Handler.ChangePosition("greeter",-1,0,0);
  Scene_Handler.ChangeRotation("greeter2",0,(Math.PI/180)*30,0);
  Scene_Handler.ChangeRotation("greeter3",0,(Math.PI/180)*30,0);
  Scene_Handler.ChangeRotation("greeter",0,(Math.PI/180)*30,0);



 
  Animation_Handler=new Animation_Manager(Scene_Handler);
  Lights[0].target=Greeter.model;
     
    Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter.animations,"TalkingMouth"),
    "greeter","a1"),
    Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter.animations,"TalkingSmile"),
    "greeter","a2")
    Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter.animations,"Talking1"),
    "greeter","a3")
   Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter.animations,"GoodTalking"),
    "greeter","a4")
    
  //JSON animations
   
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter2.animations,"NromalIdle"),
  "greeter2","Ja1");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter2.animations,"Idle2"),
  "greeter2","Ja2");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter2.animations,"Talking"),
  "greeter2","Ja3");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter2.animations,"Holding"),
  "greeter2","Ja4");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter2.animations,"Excited"),
  "greeter2","Ja5");

  //Armina animations
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter3.animations,"Idle"),
  "greeter3","Aa1");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter3.animations,"Idle2"),
  "greeter3","Aa2");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter3.animations,"Talking"),
  "greeter3","Aa3");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter3.animations,"Holding"),
  "greeter3","Aa4");
  Animation_Handler.IntroduceAnimation(THREE.AnimationClip.findByName(Greeter3.animations,"Excited"),
  "greeter3","Aa5");
  
  
  //Adjust animations loop
  Animation_Handler.Change_Animation_Loop("Ja1",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Ja2",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Ja3",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Ja4",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Ja5",THREE.LoopPingPong);

  Animation_Handler.Change_Animation_Loop("Aa1",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Aa2",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Aa3",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Aa4",THREE.LoopPingPong);
  Animation_Handler.Change_Animation_Loop("Aa5",THREE.LoopPingPong);
  //
 

if(GreeterSelected=="Default")
{Animation_Handler.PlayAnimation("a1");
Animation_Handler.PlayAnimation("a2");
Animation_Handler.PlayAnimation("a3");
Animation_Handler.PlayAnimation("a4");
}

if(GreeterSelected=="JSON")
{Animation_Handler.PlayAnimation("Ja2")}
if(GreeterSelected=="Armina")
{Animation_Handler.PlayAnimation("Aa2")}



loadDiv.remove();

}
//some before access varribales
var beingIntersected=false,isClicked=false;
document.addEventListener("click",function(){
  isClicked=true;
  setTimeout(Recover,100);
})
function Recover(){isClicked=false}
//RenderLoop 
RenderLoop();
function RenderLoop(){
    requestAnimationFrame(RenderLoop);
   

    //updating enteties
   if(Animation_Handler){Animation_Handler.Update()};

   //raycasting for document get
   if(Animation_Handler&&Greeter.model&&Greeter2.model&&Greeter3.model)
   { const intersect=rayCaster.intersectObject(Home.model);
    if(intersect.length!==0)
    { beingIntersected=true;
    }
    if(beingIntersected==true&&isClicked==true&&AllowClick==true)
    { if(Home.model.position.x>10)
        Home.model.position.x-=0.3;
        if(Home.model.position.z<20)
        Home.model.position.z+=0.3;
       
        if(Home.model.position.z>18)
        {document.getElementById("Contact").style.display="flex"}

    }

   }

   

   
 
  
   
   Renderer.render(Scene,Camera);
}



/*---------------------------------------------------------DOM------------------------------------------*/
//cancel guide
const GuideButton=document.getElementById("GuideCancel");
GuideButton.addEventListener("click",function(){
    document.getElementById("guide").remove();
    setTimeout(allowClick,1000);
    
})
function allowClick(){AllowClick=true}
if(isMobile==true)
{confirm("Please Rotate the device and reload page for better experience")}

//cancel contact
const CancelContact=document.getElementById("CancelContact");
CancelContact.onclick=function(){
  document.getElementById("Contact").style.display="none";
  AllowClick=false;
}
















}