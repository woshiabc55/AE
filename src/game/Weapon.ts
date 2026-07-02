import * as THREE from "three";
import { makeWeaponSprite, makeMuzzleFlash } from "./textures";

// 武器系统：第一人称 viewmodel（挂在相机下的 sprite）+ 射击节奏 + 后坐力 + 枪口火光
export class Weapon {
  viewmodel: THREE.Sprite;
  muzzle: THREE.Sprite;
  ammo: number;
  maxAmmo: number;
  private vmMat: THREE.SpriteMaterial;
  private muzzleMat: THREE.SpriteMaterial;
  private cooldown = 0;
  private fireDelay = 0.26; // 射击间隔
  private muzzleTimer = 0;
  private recoilKick = 0; // viewmodel 后坐 0~1
  private bobPhase = 0;
  // viewmodel 在相机空间的基础位姿（右、下、前）
  private basePos = new THREE.Vector3(0.42, -0.34, -0.85);
  private muzzleBase = new THREE.Vector3(0.42, -0.08, -0.98);
  private baseScale = 0.6;
  // 开火脉冲（供外部读取做镜头抖动等）
  firePulse = 0;

  constructor(camera: THREE.Camera, maxAmmo: number) {
    this.maxAmmo = maxAmmo;
    this.ammo = maxAmmo;
    this.vmMat = new THREE.SpriteMaterial({
      map: makeWeaponSprite(),
      transparent: true,
      fog: false,
      depthTest: false,
      depthWrite: false,
    });
    this.viewmodel = new THREE.Sprite(this.vmMat);
    this.viewmodel.scale.set(this.baseScale, this.baseScale, 1);
    this.viewmodel.position.copy(this.basePos);
    this.viewmodel.renderOrder = 999;
    camera.add(this.viewmodel);

    this.muzzleMat = new THREE.SpriteMaterial({
      map: makeMuzzleFlash(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      depthTest: false,
      depthWrite: false,
    });
    this.muzzle = new THREE.Sprite(this.muzzleMat);
    this.muzzle.scale.set(0.42, 0.42, 1);
    this.muzzle.position.copy(this.muzzleBase);
    this.muzzle.visible = false;
    this.muzzle.renderOrder = 1000;
    camera.add(this.muzzle);
  }

  canFire() {
    return this.cooldown <= 0 && this.ammo > 0;
  }

  // 尝试开火，成功返回 true
  fire(): boolean {
    if (!this.canFire()) return false;
    this.ammo--;
    this.cooldown = this.fireDelay;
    this.muzzleTimer = 0.06;
    this.muzzle.visible = true;
    this.recoilKick = 1;
    this.firePulse = 1;
    return true;
  }

  reset(maxAmmo: number) {
    this.maxAmmo = maxAmmo;
    this.ammo = maxAmmo;
    this.cooldown = 0;
    this.recoilKick = 0;
    this.muzzle.visible = false;
  }

  update(dt: number, moving: boolean, sprinting: boolean) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.muzzleTimer -= dt;
    if (this.muzzleTimer <= 0) this.muzzle.visible = false;
    this.recoilKick = Math.max(0, this.recoilKick - dt * 6);
    this.firePulse = Math.max(0, this.firePulse - dt * 4);

    // viewmodel bob
    const bobSpeed = sprinting ? 14 : 9;
    if (moving) this.bobPhase += dt * bobSpeed;
    const bobX = Math.sin(this.bobPhase) * 0.012;
    const bobY = Math.abs(Math.sin(this.bobPhase)) * 0.012;
    const kickY = this.recoilKick * 0.07;
    const kickZ = this.recoilKick * 0.1;
    this.viewmodel.position.set(
      this.basePos.x + bobX,
      this.basePos.y + bobY - kickY,
      this.basePos.z + kickZ,
    );
    this.muzzle.position.set(
      this.muzzleBase.x + bobX,
      this.muzzleBase.y + bobY - kickY,
      this.muzzleBase.z + kickZ,
    );
    // 枪口火光抖动
    if (this.muzzle.visible) {
      this.muzzle.scale.setScalar(0.34 + Math.random() * 0.14);
      this.muzzle.material.rotation = Math.random() * Math.PI;
    }
  }

  setVisibility(v: boolean) {
    this.viewmodel.visible = v;
    if (!v) this.muzzle.visible = false;
  }

  dispose(camera: THREE.Camera) {
    camera.remove(this.viewmodel);
    camera.remove(this.muzzle);
    this.vmMat.map?.dispose();
    this.vmMat.dispose();
    this.muzzleMat.map?.dispose();
    this.muzzleMat.dispose();
  }
}
