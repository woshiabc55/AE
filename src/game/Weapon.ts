import * as THREE from "three";
import { makeWeaponSprite, makeMuzzleFlash } from "./textures";
import type { OperatorDef, WeaponType } from "./operators";

export class Weapon {
  viewmodel: THREE.Sprite;
  muzzle: THREE.Sprite;
  ammo: number; // 弹匣内
  magSize: number;
  reserveAmmo: number; // 备弹
  damage: number;
  fireDelay: number;
  weaponType: WeaponType;
  weaponName: string;
  headMult: number;
  range: number;
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

  // —— 枪械设计：散布 / 后坐力 / 瞄准 ——
  private baseSpread: number;
  private bloomStep: number;
  private bloomMax: number;
  private bloomRecover: number;
  private recoilStep: number;
  private recoilRecover: number;
  adsFov: number;
  private adsSpreadMult: number;
  private moveSpreadMult: number;
  bloom = 0; // 当前累积散布(弧度)
  recoilPitch = 0; // 当前累积后坐力上抬(弧度，作用于 pitch)
  adsT = 0; // 瞄准插值 0..1

  constructor(camera: THREE.Camera, op: OperatorDef) {
    this.magSize = op.magSize;
    this.ammo = op.magSize;
    this.reserveAmmo = op.reserveAmmo;
    this.damage = op.damage;
    this.fireDelay = op.fireDelay;
    this.weaponType = op.weaponType;
    this.weaponName = op.weaponName;
    this.headMult = op.headMult;
    this.range = op.range;
    this.baseSpread = op.baseSpread;
    this.bloomStep = op.bloom;
    this.bloomMax = op.bloomMax;
    this.bloomRecover = op.bloomRecover;
    this.recoilStep = op.recoil;
    this.recoilRecover = op.recoilRecover;
    this.adsFov = op.adsFov;
    this.adsSpreadMult = op.adsSpreadMult;
    this.moveSpreadMult = op.moveSpreadMult;

    this.vmMat = new THREE.SpriteMaterial({
      map: makeWeaponSprite(op.weaponType),
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

  // 当前实际散布(弧度)，考虑移动/瞄准/bloom
  getSpread(moving: boolean, aiming: boolean): number {
    let s = this.baseSpread + this.bloom;
    if (moving) s *= this.moveSpreadMult;
    if (aiming) s *= this.adsSpreadMult;
    return s;
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
    // 累积散布与后坐力
    this.bloom = Math.min(this.bloomMax, this.bloom + this.bloomStep);
    this.recoilPitch += this.recoilStep;
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
    this.bloom = 0;
    this.recoilPitch = 0;
  }

  // 补给备弹（回合开始重置）
  refill(op: OperatorDef) {
    this.ammo = op.magSize;
    this.reserveAmmo = op.reserveAmmo;
    this.reloading = false;
    this.bloom = 0;
    this.recoilPitch = 0;
  }

  update(dt: number, moving: boolean, sprinting: boolean, aiming: boolean) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.muzzleTimer -= dt;
    if (this.muzzleTimer <= 0) this.muzzle.visible = false;
    this.recoilKick = Math.max(0, this.recoilKick - dt * 6);
    this.firePulse = Math.max(0, this.firePulse - dt * 4);

    // 散布恢复(瞄准时恢复更快)
    const recoverMult = aiming ? 1.6 : 1.0;
    this.bloom = Math.max(0, this.bloom - this.bloomRecover * recoverMult * dt);
    // 后坐力上抬恢复
    this.recoilPitch = Math.max(0, this.recoilPitch - this.recoilRecover * dt);

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

    // 瞄准插值(ADS 时收枪至屏幕中、放大)
    const adsTarget = aiming && !sprinting ? 1 : 0;
    this.adsT += (adsTarget - this.adsT) * Math.min(1, dt * 10);

    const bobSpeed = sprinting ? 14 : 9;
    if (moving) this.bobPhase += dt * bobSpeed;
    const bobX = Math.sin(this.bobPhase) * 0.012;
    const bobY = Math.abs(Math.sin(this.bobPhase)) * 0.012;
    const kickY = this.recoilKick * 0.07;
    const kickZ = this.recoilKick * 0.1;
    // 装弹时下沉
    const reloadDrop = this.reloading ? Math.sin((1 - this.reloadTimer / this.reloadTime) * Math.PI) * 0.18 : 0;

    // ADS：viewmodel 移向屏幕中心并放大
    const adsX = this.adsT * -0.42; // 0.42 -> 0
    const adsY = this.adsT * 0.30; // -0.34 -> -0.04
    const adsScale = this.baseScale * (1 + this.adsT * 0.55);

    this.viewmodel.position.set(
      this.basePos.x + bobX + adsX,
      this.basePos.y + bobY - kickY - reloadDrop + adsY,
      this.basePos.z + kickZ,
    );
    this.viewmodel.scale.set(adsScale, adsScale, 1);
    this.muzzle.position.set(
      this.muzzleBase.x + bobX + adsX,
      this.muzzleBase.y + bobY - kickY - reloadDrop + adsY,
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
