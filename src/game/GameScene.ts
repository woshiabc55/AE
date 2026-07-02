import * as THREE from "three";
import { RendererCore } from "./RendererCore";
import { World } from "./World";
import { Player } from "./Player";
import { Entities } from "./Entities";
import { Input } from "./Input";
import { Weapon } from "./Weapon";
import { LEVELS, parseLevel, cellToWorld, randomFragment } from "./levels";
import { useGameStore } from "@/store/useGameStore";

// 复用临时向量，避免每帧分配
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _end = new THREE.Vector3();
const _barrel = new THREE.Vector3();

export class GameScene {
  private container: HTMLElement;
  private core: RendererCore;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private input: Input;
  private world: World | null = null;
  private entities: Entities | null = null;
  private player: Player;
  private weapon: Weapon | null = null;
  // 拖尾光线（短暂存活）
  private tracers: { line: THREE.Line; life: number }[] = [];
  private tracerMat: THREE.LineBasicMaterial;
  private raf = 0;
  private last = 0;
  private transitioning = false;
  private disposed = false;
  public onLockChange?: (locked: boolean) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    const store = useGameStore.getState();
    this.core = new RendererCore(container, store.settings.pixelScale);
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.05, 120);
    this.input = new Input(this.core.canvas);
    this.input.sensitivity = store.settings.sensitivity;
    this.input.onLockChange = (locked) => {
      this.onLockChange?.(locked);
      const gs = useGameStore.getState();
      if (!locked && gs.gameState === "playing") gs.pause();
      if (locked && gs.gameState === "paused") gs.resume();
    };
    this.scene.background = new THREE.Color(0x05060a);
    // 相机加入场景，使其子物体（武器 viewmodel）能被渲染
    this.scene.add(this.camera);

    this.player = new Player(this.camera);
    this.tracerMat = new THREE.LineBasicMaterial({
      color: 0xffe48a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    this.loadLevel(store.stats.level);
    window.addEventListener("resize", this.handleResize);
    this.last = performance.now();
    this.loop();
  }

  private handleResize = () => {
    this.core.resize();
    this.updateCameraAspect();
  };

  private updateCameraAspect() {
    const { w, h } = this.core.getDrawingSize();
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  loadLevel(index: number) {
    this.transitioning = true;
    // 清理旧关卡
    if (this.world) {
      this.scene.remove(this.world.group);
      this.world.dispose();
    }
    if (this.entities) {
      this.scene.remove(this.entities.group);
      this.entities.dispose();
    }

    const safeIndex = Math.max(1, Math.min(LEVELS.length, index));
    const level = LEVELS[safeIndex - 1];
    const parsed = parseLevel(level);
    const store = useGameStore.getState();

    this.world = new World(parsed, store.settings.fogDensity, level.theme);
    this.scene.fog = this.world.fog;
    this.scene.background = new THREE.Color(level.theme.fog);
    this.scene.add(this.world.group);

    this.entities = new Entities({
      onCollectEcho: () => {
        const lvl = LEVELS[safeIndex - 1];
        useGameStore.getState().collectEcho(randomFragment(lvl));
      },
      onAllCollected: () => useGameStore.getState().showBanner("传送门已开启"),
      onDamage: (amt) => {
        useGameStore.getState().damage(amt);
        this.player.addShake(0.6);
      },
      onPortalEnter: () => this.onPortalEnter(),
    });

    // 生成回响
    for (const e of parsed.echoes) {
      const { x, z } = cellToWorld(e.r, e.c, parsed.cols, parsed.rows);
      this.entities.spawnEcho(x, z);
    }
    // 生成暗影
    for (const s of parsed.shadows) {
      const { x, z } = cellToWorld(s.r, s.c, parsed.cols, parsed.rows);
      this.entities.spawnShadow(x, z, level.enemySpeed);
    }
    // 生成传送门
    if (parsed.portal) {
      const { x, z } = cellToWorld(parsed.portal.r, parsed.portal.c, parsed.cols, parsed.rows);
      this.entities.spawnPortal(x, z);
    }
    // 玩家出生
    const spawn = parsed.playerSpawn ?? { r: 1, c: 1 };
    const sp = cellToWorld(spawn.r, spawn.c, parsed.cols, parsed.rows);
    this.player.spawn(sp.x, sp.z);

    // 武器：首关创建，后续关卡仅重置弹药
    if (!this.weapon) {
      this.weapon = new Weapon(this.camera, level.ammo);
    } else {
      this.weapon.reset(level.ammo);
    }

    this.scene.add(this.entities.group);

    // 同步状态
    store.enterLevel(safeIndex, level.name, parsed.echoes.length, level.ammo);
    store.setResonance(100);
    this.updateCameraAspect();
    this.transitioning = false;
  }

  private onPortalEnter() {
    if (this.transitioning) return;
    const cur = useGameStore.getState().stats.level;
    if (cur >= LEVELS.length) {
      useGameStore.getState().win();
      this.input.exitLock();
    } else {
      useGameStore.getState().completeLevel();
      this.loadLevel(cur + 1);
    }
  }

  requestLock() {
    this.input.requestLock();
  }
  isLocked() {
    return this.input.isLocked();
  }

  applySettings() {
    const s = useGameStore.getState().settings;
    this.core.setPixelScale(s.pixelScale);
    this.input.sensitivity = s.sensitivity;
    this.world?.setFogDensity(s.fogDensity);
    this.updateCameraAspect();
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.05) dt = 0.05; // 防止切后台后大跳

    const gs = useGameStore.getState();
    const canUpdate =
      !this.transitioning &&
      gs.gameState === "playing" &&
      this.input.isLocked() &&
      this.world &&
      this.entities;

    if (canUpdate) {
      this.player.update(dt, this.input, this.world!);
      this.entities!.update(dt, this.player.position, this.world!);
      const t = performance.now() / 1000;
      // 行者之光闪烁 + 心跳增强
      this.world!.updateFlicker(t, this.entities!.heartbeat);
      // 武器更新（带移动/冲刺 bob）
      const moving = this.input.getMove().x !== 0 || this.input.getMove().z !== 0;
      if (this.weapon) {
        this.weapon.update(dt, moving, this.player.isSprinting);
        // 开火输入
        if (this.input.consumeFire()) this.tryFire();
      }
      // 瞄准检测（准星是否对准暗影）
      this.updateAim();
      // 拖尾衰减
      this.updateTracers(dt);
      // 同步状态到 store（心跳、冲刺、闪烁衰减）
      gs.setHeartbeat(this.entities!.heartbeat);
      gs.setSprinting(this.player.isSprinting);
      gs.decayFlashes(dt);
      gs.tick(dt);
      // 失败检测
      if (useGameStore.getState().gameState === "defeat") {
        this.input.exitLock();
      }
    }

    this.core.render(this.scene, this.camera);
  };

  // 开火：射线检测暗影，命中则造成伤害
  private tryFire() {
    if (!this.weapon || !this.entities) return;
    const fired = this.weapon.fire();
    const gs = useGameStore.getState();
    if (!fired) {
      // 空仓/冷却：轻微反馈（无弹药时）
      return;
    }
    gs.setAmmo(this.weapon.ammo);
    gs.setFireFlash(performance.now());
    this.player.addShake(0.22);
    // 射线
    this.camera.getWorldPosition(_origin);
    this.camera.getWorldDirection(_dir);
    const range = 32;
    const res = this.entities.hitTest(_origin, _dir, range);
    if (res) {
      _end.copy(res.point);
      const killed = this.entities.damageShadow(res.shadow, 1);
      gs.setHitMarker(performance.now());
      if (killed) gs.addKill();
    } else {
      _end.copy(_origin).addScaledVector(_dir, range);
    }
    // 枪口世界坐标（从相机局部空间转换）
    _barrel.set(0.42, -0.08, -0.98);
    this.camera.localToWorld(_barrel);
    this.showTracer(_barrel, _end);
  }

  // 瞄准检测：准星是否对准存活暗影
  private updateAim() {
    if (!this.entities) return;
    this.camera.getWorldPosition(_origin);
    this.camera.getWorldDirection(_dir);
    const aiming = this.entities.hoverTest(_origin, _dir, 32);
    useGameStore.getState().setAimingAtEnemy(aiming);
  }

  // 生成一条短暂拖尾
  private showTracer(from: THREE.Vector3, to: THREE.Vector3) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const line = new THREE.Line(geo, this.tracerMat);
    line.renderOrder = 998;
    this.scene.add(line);
    this.tracers.push({ line, life: 0.08 });
  }

  private updateTracers(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.life -= dt;
      if (tr.life <= 0) {
        this.scene.remove(tr.line);
        tr.line.geometry.dispose();
        this.tracers.splice(i, 1);
      } else {
        (tr.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, tr.life / 0.08);
      }
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.handleResize);
    this.input.dispose();
    this.weapon?.dispose(this.camera);
    this.world?.dispose();
    this.entities?.dispose();
    for (const tr of this.tracers) {
      this.scene.remove(tr.line);
      tr.line.geometry.dispose();
    }
    this.tracers = [];
    this.tracerMat.dispose();
    this.core.dispose();
  }
}
