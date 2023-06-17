import *as THREE from "./three.module.js";
export class BubbleWrapper
{ bubble=undefined;
  Name=undefined;
  connectedTo=undefined;
  Material=new THREE.MeshPhongMaterial({color:"black",side:THREE.DoubleSide,transparent:true,fog:false,opacity:0.1,
reflectivity:300});
  Geometry=new THREE.SphereGeometry(10,100,100);  
  constructor(model,name)
  { this.bubble=new THREE.Mesh(this.Geometry,this.Material);
    this.Name=name;
    this.connectedTo=model;
    this.connectedTo.add(this.bubble)
  }
  ChangeScale(scale)
  { this.bubble.scale.copy(scale);
  }
  ChangePosition(position)
  {
    this.bubble.position.copy(position);
  }
  ChangeQuaternion(quaternion)
  {this.bubble.quaternion.copy(quaternion)}
  ChangeRotation_X(radians)
  {this.bubble.rotation.x=radians}
  ChangeRotation_Y(radians)
  {this.bubble.rotation.y=radians}
  ChangeRotation_Z(radians)
  {this.bubble.rotation.z=radians}
  
 ChangePosition_x(x){this.bubble.position.x=x}
 ChangePosition_z(z){this.bubble.position.z=z};
 ChangePosition_y(y){this.bubble.position.y=y}
  
}