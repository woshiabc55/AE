import * as THREE from "three";
import { makeWeaponSprite, makeMuzzleFlash } from "./textures";
import type { OperatorDef } from "./operators";

export class Weapon {
  viewmodel: THREE.Sprite;
  muzzle: THREE.Sprite;
  ammo: number; // 弹匣内
  magSize: number;
  reserveAmmo: number; // 备弹
  damage: number;
  fireDelay: number;
  private vmMat: THREE.SpriteMaterial;
  private muzzleMat: THREE.SpriteMaterial;
  private cooldown = 0;
  private muzzleTimer = 0;
  private recoilKick = 0;
  private bobPhase = 0;
  private basePos = new THREE.Vector3(0.42, -0.34, -0.85);
  private muzzleBase = new THREE.Vector3(0.42, -0.08, -0.98);
  private baseScale = 0.6;
  private reloading = false;
  private reloadTimer = 0;
  reloadTime = 1.8;
  firePulse = 0;

  constructor(camera: THREE.Camera, op: OperatorDef) {
    this.magSize = op.magSize;
    this.ammo = op.magSize;
    this.reserveAmmo = op.reserveAmmo;
    this.damage = op.damage;
    this.fireDelay = op.fireDelay;
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

  get reloadingNow() {
    return this.reloading;
  }

  canFire() {
    return this.cooldown <= 0 && this.ammo > 0 && !this.reloading;
  }

  startReload() {
    if (this.reloading) return false;
    if (this.ammo >= this.magSize) return false;
    if (this.reserveAmmo <= 0) return false;
    this.reloading = true;
    this.reloadTimer = this.reloadTime;
    return true;
  }

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

  reset(op: OperatorDef) {
    this.magSize = op.magSize;
    this.ammo = op.magSize;
    this.reserveAmmo = op.reserveAmmo;
    this.damage = op.damage;
    this.fireDelay = op.fireDelay;
    this.cooldown = 0;
    this.recoilKick = 0;
    this.reloading = false;
    this.muzzle.visible = false;
  }

  // 补给备弹（回合开始重置）
  refill(op: OperatorDef) {
    this.ammo = op.magSize;
    this.reserveAmmo = op.reserveAmmo;
    this.reloading = false;
  }

  update(dt: number, moving: boolean, sprinting: boolean) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.muzzleTimer -= dt;
    if (this.muzzleTimer <= 0) this.muzzle.visible = false;
    this.recoilKick = Math.max(0, this.recoilKick - dt * 6);
    this.firePulse = Math.max(0, this.firePulse - dt * 4);

    // 装弹进度
    if (this.reloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const need = this.magSize - this.ammo;
        const take = Math.min(need, this.reserveAmmo);
        this.ammo += take;
        this.reserveAmmo -= take;
        this.reloading = false;
      }
    }

    const bobSpeed = sprinting ? 14 : 9;
    if (moving) this.bobPhase += dt * bobSpeed;
    const bobX = Math.sin(this.bobPhase) * 0.012;
    const bobY = Math.abs(Math.sin(this.bobPhase)) * 0.012;
    const kickY = this.recoilKick * 0.07;
    const kickZ = this.recoilKick * 0.1;
    // 装弹时下沉
    const reloadDrop = this.reloading ? Math.sin((1 - this.reloadTimer / this.reloadTime) * Math.PI) * 0.18 : 0;
    this.viewmodel.position.set(
      this.basePos.x + bobX,
      this.basePos.y + bobY - kickY - reloadDrop,
      this.basePos.z + kickZ,
    );
    this.muzzle.position.set(
      this.muzzleBase.x + bobX,
      this.muzzleBase.y + bobY - kickY - reloadDrop,
      this.muzzleBase.z + kickZ,
    );
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
