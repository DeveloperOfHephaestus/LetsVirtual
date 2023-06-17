//import *as CANNON from "./cannon-es/dist/cannon-es.cjs";//uncomment this during developing
import *as CANNON from "CANNON";  //un comment this during running
import *as THREE from "./three.module.js";

export  class PhysicsWorld
{ Bodies=[];
  Gravity=new CANNON.Vec3(0,-9.81,0);
  World;
  TimeStep=1/20;
  Masses={
    zeroMass:0,
    defaultMass:5, //default
  };
  constructor()
  { this.World=new CANNON.World({gravity:this.Gravity,broadphase:new CANNON.NaiveBroadphase()});
  }

  Add_Ground(ground_MESH) //adds the ground ;
  { const GroundBody=new CANNON.Body({mass:this.Masses.zeroMass,shape:new CANNON.Plane()});
  const materila=new CANNON.Material({});
    materila.friction=10;
    GroundBody.material=materila;
//

    const Body=this.Wrapper(ground_MESH,GroundBody,true);
    this.Add_to_World(GroundBody);
    this.Bodies.push(Body);

  }
 Add_Kinematic_Body(mesh,cannonBody)
 {  const materila=new CANNON.Material({});
    materila.friction=1;
     cannonBody.material=materila;
//
cannonBody.linearDamping = 0.5; // Adjust linear damping value as needed
cannonBody.angularDamping = 0.5; // Adjust angular damping value as needed

    const wrapped=this.Wrapper(mesh,cannonBody);
    this.Add_to_World(wrapped.phyBody);
    this.Bodies.push(wrapped);

 } 

//heightfield
Add_HeightField(position,mesh)
{ const HeightData=[
  [0, 0, 0, 0],   // Heights of row 1
  [1, 2, 1, 1],   // Heights of row 2
  [2, 3, 2, 1],   // Heights of row 3
  [1, 1, 1, 0]    // Heights of row 4
 
  
  // ... add more rows if needed
]

const scale = 1; // The scale of the heightfield grid (adjust as needed)
const maxHeight = 3; // The maximum height in the heightfield (adjust as needed)
const minHeight = 0; // The minimum height in the heightfield (adjust as needed)


const heightfieldShape = new CANNON.Heightfield(HeightData, {
  elementSize: scale,
  maxValue: maxHeight,
  minValue: minHeight
});

const heightfieldBody = new CANNON.Body({ mass: 0 });
heightfieldBody.addShape(heightfieldShape);
 heightfieldBody.position.copy(position);

//wrapping
const wrapped=this.Wrapper(mesh,heightfieldBody,true);
    this.Add_to_World(wrapped.phyBody);
    this.Bodies.push(wrapped);

}

 getBody_byName(THREE_mesh_name)  //access the phyBody with three mesh name you assigned
 { var Found;
    this.Bodies.forEach(wrapper=>{
        if(wrapper.visualBody.name==THREE_mesh_name)
        {Found=wrapper.phyBody}
    })
  return Found;
 }
//world
Add_to_World(cannonBody)
{this.World.addBody(cannonBody)}
Step_World()
{this.World.step(this.TimeStep)}  
//world

//wraps the two bodies as Single body
Wrapper(mesh,cannonBody,isGround)
{ let Wrapped={phyBody:cannonBody,visualBody:mesh,GroundException:isGround};
   return Wrapped
}
Update_Mesh_Phy()
{ this.Bodies.forEach(wrapped=>{
    if(wrapped.GroundException)
    { wrapped.phyBody.quaternion.copy(wrapped.visualBody.quaternion);
      wrapped.visualBody.position.copy(wrapped.phyBody.position);
    }
    else 
    { wrapped.phyBody.quaternion.copy(wrapped.visualBody.quaternion);
      wrapped.visualBody.position.copy(wrapped.phyBody.position);

    }
})

}
UpdateWorld()
{ 
    
this.Update_Mesh_Phy();
this.Step_World();
}
}