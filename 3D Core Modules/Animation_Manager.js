import *as THREE from "./three.module.js";
export class Animation_Manager
{ Mixers=[];
  SceneManager;
  Animations=[];  
  Clock=new THREE.Clock();
  constructor(SceneManager){
    this.SceneManager=SceneManager;
  }
  IntroduceAnimation(Clip,NameOfModel,Name_Youassign)
  { let mixer=new THREE.AnimationMixer(this.SceneManager.getObjectByName(NameOfModel));
   let action=mixer.clipAction(Clip);
   this.Mixers.push({mixer:mixer,Name:NameOfModel});
   this.Animations.push({Ani:action,Name:Name_Youassign})
  }
  PlayAnimation(nameOFAnimation)
  { this.Animations.forEach(a=>{
    if(a.Name==nameOFAnimation)
    a.Ani.play();
  })
  }
  StopAnimation(nameOFAnimation)
  {this.Animations.forEach(a=>{
    if(a.Name==nameOFAnimation)
    a.Ani.stop();
  })

  }
  Update()
  { const delta=this.Clock.getDelta();
    this.Mixers.forEach(mixer=>{
    mixer.mixer.update(delta);
  })
  return true

  }
  getAnimationByName(name){
    var found;
    this.Animations.forEach(ani=>{if(ani.Name==name)found=ani.Ani})
    return found;
  }
  Change_Animation_Loop(name,THREE_Loop){
  const get=this.getAnimationByName(name);
  get.loop=THREE_Loop;

  }

  getMixerByModel_name(name){
    var found;
    this.Mixers.forEach(mixer=>{if(mixer.Name==name)found=mixer.mixer})
    return found;

  }
}