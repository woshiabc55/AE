// 简单的方块人角色模型（类似 Steve），用于第三人称视角

import * as THREE from "three";

export class PlayerAvatar {
  group: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;

  // 皮肤色、衣服色
  skinColor = 0xffccaa;
  shirtColor = 0x3c6eb4;
  pantsColor = 0x2a2a5a;

  walkTime = 0;
  isMoving = false;

  constructor() {
    this.group = new THREE.Group();

    const skinMat = new THREE.MeshLambertMaterial({ color: this.skinColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: this.shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: this.pantsColor });

    // 头 8x8x8
    this.head = new THREE.Group();
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), skinMat);
    headMesh.position.y = 0.25;
    this.head.add(headMesh);
    this.head.position.y = 1.5;
    this.group.add(this.head);

    // 身体 8x12x4
    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.25), shirtMat);
    this.body.position.y = 0.875;
    this.group.add(this.body);

    // 手臂
    this.leftArm = this.createLimb(0.2, 0.75, 0.2, shirtMat, skinMat);
    this.leftArm.position.set(-0.35, 1.25, 0);
    this.group.add(this.leftArm);

    this.rightArm = this.createLimb(0.2, 0.75, 0.2, shirtMat, skinMat);
    this.rightArm.position.set(0.35, 1.25, 0);
    this.group.add(this.rightArm);

    // 腿
    this.leftLeg = this.createLimb(0.22, 0.75, 0.22, pantsMat, pantsMat);
    this.leftLeg.position.set(-0.13, 0.375, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = this.createLimb(0.22, 0.75, 0.22, pantsMat, pantsMat);
    this.rightLeg.position.set(0.13, 0.375, 0);
    this.group.add(this.rightLeg);
  }

  private createLimb(w: number, h: number, d: number, upperMat: THREE.Material, lowerMat: THREE.Material) {
    const group = new THREE.Group();
    const upper = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.6, d), upperMat);
    upper.position.y = -h * 0.2;
    const lower = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.4, d), lowerMat);
    lower.position.y = -h * 0.7;
    group.add(upper, lower);
    return group;
  }

  update(delta: number, moving: boolean, velocityDir?: THREE.Vector3) {
    if (moving) {
      this.walkTime += delta * 8;
      this.isMoving = true;
    } else {
      this.walkTime *= 0.8;
      this.isMoving = false;
    }

    // 四肢摆动
    const swing = Math.sin(this.walkTime) * 0.6;
    this.leftArm.rotation.x = swing;
    this.rightArm.rotation.x = -swing;
    this.leftLeg.rotation.x = -swing;
    this.rightLeg.rotation.x = swing;

    // 转身：面向移动方向或相机方向
    if (velocityDir && moving) {
      const targetYaw = Math.atan2(velocityDir.x, velocityDir.z);
      // 平滑转向
      let diff = targetYaw - this.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.group.rotation.y += diff * 10 * delta;
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y - 1.5, z); // 脚底对齐 y
  }

  setVisible(visible: boolean) {
    this.group.visible = visible;
  }
}
