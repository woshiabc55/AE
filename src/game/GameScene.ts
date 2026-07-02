import * as THREE from "three";
import { RendererCore } from "./RendererCore";
import { World } from "./World";
import { Player } from "./Player";
import { Entities } from "./Entities";
import { Input } from "./Input";
import { LEVELS, parseLevel, cellToWorld } from "./levels";
import { useGameStore } from "@/store/useGameStore";

export class GameScene {
  private container: HTMLElement;
  private core: RendererCore;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private input: Input;
  private world: World | null = null;
  private entities: Entities | null = null;
  private player: Player;
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

    this.player = new Player(this.camera);

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

    this.world = new World(parsed, store.settings.fogDensity);
    this.scene.fog = this.world.fog;
    this.scene.add(this.world.group);

    this.entities = new Entities({
      onCollectEcho: () => useGameStore.getState().collectEcho(),
      onAllCollected: () => useGameStore.getState().showBanner("传送门已开启"),
      onDamage: (amt) => useGameStore.getState().damage(amt),
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

    this.scene.add(this.entities.group);

    // 同步状态
    store.enterLevel(safeIndex, level.name, parsed.echoes.length);
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
      gs.tick(dt);
      // 失败检测
      if (useGameStore.getState().gameState === "defeat") {
        this.input.exitLock();
      }
    }

    this.core.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.handleResize);
    this.input.dispose();
    this.world?.dispose();
    this.entities?.dispose();
    this.core.dispose();
  }
}
