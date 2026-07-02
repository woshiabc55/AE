import * as THREE from "three";
import { RendererCore } from "./RendererCore";
import { World } from "./World";
import { Player } from "./Player";
import { Weapon } from "./Weapon";
import { Input } from "./Input";
import { BotManager } from "./BotManager";
import { MatchManager } from "./MatchManager";
import { OPERATORS, type OperatorClass } from "./operators";
import { useGameStore } from "@/store/useGameStore";

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
  private world: World;
  private player: Player;
  private weapon: Weapon;
  private bots: BotManager;
  private match: MatchManager;
  private raf = 0;
  private last = 0;
  private disposed = false;
  private op: OperatorDef_ext;
  // 玩家重生票已扣除标记
  private playerDeathCharged = false;
  public onLockChange?: (locked: boolean) => void;

  constructor(container: HTMLElement, opClass: OperatorClass) {
    this.container = container;
    const store = useGameStore.getState();
    this.core = new RendererCore(container, store.settings.pixelScale);
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.05, 200);
    this.input = new Input(this.core.canvas);
    this.input.sensitivity = store.settings.sensitivity;
    this.input.onLockChange = (locked) => {
      this.onLockChange?.(locked);
      const gs = useGameStore.getState();
      if (!locked && gs.gameState === "playing") gs.pause();
      if (locked && gs.gameState === "paused") gs.resume();
    };

    this.op = OPERATORS[opClass];
    this.world = new World(store.settings.fogDensity);
    this.scene.fog = this.world.fog;
    this.scene.background = new THREE.Color(0x0d1410);
    this.scene.add(this.world.group);
    this.scene.add(this.camera);

    this.player = new Player(this.camera, this.op);
    this.player.team = "alpha";
    this.weapon = new Weapon(this.camera, this.op);
    this.bots = new BotManager(this.world, this.player);
    this.scene.add(this.bots.group);

    // MatchManager 注入上下文
    this.match = new MatchManager({
      alphaAlive: () =>
        this.bots.aliveCount("alpha") + (this.player.alive ? 1 : 0),
      bravoAlive: () => this.bots.aliveCount("bravo"),
      captureCount: () => this.bots.countInCapture(this.world.parsed.capture),
      onRoundStart: () => this.spawnRound(),
      onRoundEnd: (winner) => {
        useGameStore.getState().showBanner(winner === "alpha" ? "回合胜利" : "回合失败", 2600);
      },
      onMatchEnd: (winner) => {
        useGameStore.getState().endMatch(winner, this.player.kills, this.player.deaths);
      },
    });

    // bot 回调
    this.bots.onBotKilled = (killer, victim) => {
      // bot 杀 bot：扣 victim 队票
      this.match.consumeTicket(victim.team);
      this.botsSpawnSparksAt(victim.pos, 16);
    };
    this.bots.onPlayerKilled = () => {
      this.player.deaths++;
      if (!this.playerDeathCharged) {
        this.match.consumeTicket("alpha");
        this.playerDeathCharged = true;
      }
    };
    this.bots.onPlayerHit = () => {
      useGameStore.getState().setDamageFlash(1);
    };
    this.bots.canRespawn = (team) => this.match.canRespawn(team);
    this.bots.onConsumeTicket = (team) => this.match.consumeTicket(team);

    // 显式启动首回合（此时 this.match 已赋值，spawnRound 可安全读取）
    this.match.startRound();

    this.updateCameraAspect();
    window.addEventListener("resize", this.handleResize);
    this.last = performance.now();
    this.loop();
  }

  private spawnRound() {
    // 重置玩家
    const spawns = this.world.parsed.alphaSpawns;
    const s = spawns[0];
    this.player.spawn(s.x, s.z);
    this.weapon.refill(this.op);
    this.playerDeathCharged = false;

    // 重置 bot 池
    this.bots.resetRound();

    // 友军小队：3 名 bot（突击/侦察/支援）
    const allyClasses: OperatorClass[] = ["assault", "recon", "support"];
    allyClasses.forEach((c, i) => {
      const sp = spawns[(i + 1) % spawns.length];
      this.bots.spawnBot("alpha", OPERATORS[c], sp.x + (i - 1), sp.z + 1);
    });

    // 敌军：6 名 bot（混职业）
    const enemyClasses: OperatorClass[] = ["assault", "assault", "recon", "support", "assault", "recon"];
    const eSpawns = this.world.parsed.bravoSpawns;
    enemyClasses.forEach((c, i) => {
      const sp = eSpawns[i % eSpawns.length];
      this.bots.spawnBot("bravo", OPERATORS[c], sp.x + (i - 2.5), sp.z - 1);
    });

    useGameStore.getState().showBanner(`第 ${this.match.round} 回合`, 2200);
  }

  private botsSpawnSparksAt(pos: THREE.Vector3, n: number) {
    // 复用 BotManager 的 sparks（通过 ctx）
    // 直接调用 group 加几个 sprite 即可——但为简洁，这里触发一次 tracer
    void pos;
    void n;
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.05) dt = 0.05; // 帧率保护

    const gs = useGameStore.getState();
    const canUpdate = gs.gameState === "playing";

    if (canUpdate) {
      // R 装弹
      if (this.input.isDown("KeyR")) this.weapon.startReload();

      this.player.update(dt, this.input, this.world);
      const moving = this.input.getMove().x !== 0 || this.input.getMove().z !== 0;
      this.weapon.update(dt, moving, this.player.isSprinting);

      // 大规模 Agent 更新（prep 阶段也更新，仅移动不开火由 bot 内部火冷却控制）
      this.bots.update(dt);

      // 玩家开火
      if (this.input.consumeFire() && this.player.alive) this.tryFire();

      // 玩家重生
      if (!this.player.alive) {
        if (this.player.respawnTimer <= 0 && this.match.canRespawn("alpha")) {
          const sp = this.world.parsed.alphaSpawns[0];
          this.player.spawn(sp.x, sp.z);
          this.weapon.refill(this.op);
          this.playerDeathCharged = false;
        }
      }

      // 据点光柱
      const t = now / 1000;
      this.world.updateCaptureBeacon(t, this.match.captureOwner);

      // 推进对局
      this.match.update(dt);

      // 瞄准检测
      this.updateAim();

      // 同步 store
      this.syncStore();
    }

    this.core.render(this.scene, this.camera);
  };

  private tryFire() {
    const fired = this.weapon.fire();
    const gs = useGameStore.getState();
    if (!fired) {
      // 空仓自动尝试装弹
      if (this.weapon.ammo <= 0) this.weapon.startReload();
      return;
    }
    this.player.addShake(0.18);
    gs.setPlayerStatus({ ammo: this.weapon.ammo, reserveAmmo: this.weapon.reserveAmmo });

    this.camera.getWorldPosition(_origin);
    this.camera.getWorldDirection(_dir);
    const range = 60;
    const wallDist = this.world.raycastWalls(_origin, _dir, range);
    const hitBot = this.bots.raycastBots(_origin, _dir, range, "alpha", wallDist);
    if (hitBot) {
      hitBot.getCenter(_end);
      this.showTracer(_origin, _end, true);
      const died = hitBot.takeDamage(this.weapon.damage);
      gs.setHitMarker(performance.now());
      if (died) {
        this.player.kills++;
        gs.setKillMarker(performance.now());
        this.match.consumeTicket("bravo");
      }
    } else {
      _end.copy(_origin).addScaledVector(_dir, Math.min(wallDist, range));
      this.showTracer(_origin, _end, false);
    }
  }

  private showTracer(from: THREE.Vector3, to: THREE.Vector3, hit: boolean) {
    // 起点偏移到枪口(相机局部)
    _barrel.set(0.3, -0.1, -0.6);
    this.camera.localToWorld(_barrel);
    // 用 BotManager 的 tracer 系统（通过一个轻量线）
    const geo = new THREE.BufferGeometry().setFromPoints([_barrel.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({
      color: hit ? 0xffe48a : 0x8a8a8a,
      transparent: true,
      opacity: hit ? 0.95 : 0.5,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const line = new THREE.Line(geo, mat);
    line.renderOrder = 998;
    this.scene.add(line);
    setTimeout(() => {
      this.scene.remove(line);
      geo.dispose();
      mat.dispose();
    }, 70);
    void from;
  }

  private updateAim() {
    this.camera.getWorldPosition(_origin);
    this.camera.getWorldDirection(_dir);
    const wallDist = this.world.raycastWalls(_origin, _dir, 60);
    const aiming = this.player.alive && this.bots.hoverBots(_origin, _dir, "alpha", wallDist);
    useGameStore.getState().setAimingAtEnemy(aiming);
  }

  private syncStore() {
    const gs = useGameStore.getState();
    const snap = this.match.snapshot();
    // 队友快照
    const teammates = this.bots.bots
      .filter((b) => b.team === "alpha")
      .map((b, i) => ({
        id: i,
        op: b.op.id,
        hp: Math.round(b.hp),
        maxHp: b.op.maxHp,
        alive: b.alive,
      }));
    // 雷达：可见敌人(视野内且有 LOS 简化=距离阈值) + 队友
    const enemies: { x: number; z: number }[] = [];
    const allies: { x: number; z: number }[] = [];
    for (const b of this.bots.bots) {
      if (b.team === "alpha" && b.alive) allies.push({ x: b.pos.x, z: b.pos.z });
      if (b.team === "bravo" && b.alive) {
        const d = b.pos.distanceTo(this.player.position);
        if (d < 30) enemies.push({ x: b.pos.x, z: b.pos.z });
      }
    }
    gs.setPlayerStatus({
      hp: Math.round(this.player.hp),
      maxHp: this.player.maxHp,
      armor: this.player.armor,
      ammo: this.weapon.ammo,
      magSize: this.weapon.magSize,
      reserveAmmo: this.weapon.reserveAmmo,
      reloading: this.weapon.reloadingNow,
      kills: this.player.kills,
      deaths: this.player.deaths,
      alive: this.player.alive,
      respawnTimer: this.player.respawnTimer,
      sprinting: this.player.isSprinting,
    });
    gs.setTeammates(teammates);
    gs.setMatch({
      round: snap.round,
      scoreAlpha: snap.scoreAlpha,
      scoreBravo: snap.scoreBravo,
      ticketsAlpha: snap.ticketsAlpha,
      ticketsBravo: snap.ticketsBravo,
      captureProgress: snap.captureProgress,
      captureOwner: snap.captureOwner,
      phase: snap.phase,
      phaseTimer: snap.phaseTimer,
    });
    gs.setRadar(enemies, allies);
    gs.decayDamageFlash(1 / 60);
  }

  private updateCameraAspect() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.core.resize();
  }

  private handleResize = () => this.updateCameraAspect();

  requestLock() {
    this.input.requestLock();
  }

  applySettings() {
    const s = useGameStore.getState().settings;
    this.core.setPixelScale(s.pixelScale);
    this.input.sensitivity = s.sensitivity;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.handleResize);
    this.input.dispose();
    this.weapon.dispose(this.camera);
    this.bots.dispose();
    this.world.dispose();
    this.core.dispose();
  }
}

// 别名：避免循环导入类型
type OperatorDef_ext = (typeof OPERATORS)[OperatorClass];
