// 我的世界还原体验页（含生存模式）

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import {
  ArrowLeft,
  MousePointerClick,
  Move,
  Box,
  Trash2,
  Eye,
  User,
  Video,
  Volume2,
  VolumeX,
  Heart,
  Utensils,
  Skull,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
import { VoxelWorld, PLACEABLE_BLOCKS, BlockType, BLOCK_DEFS } from "@/engine/minecraft/VoxelWorld";
import { VoxelRenderer } from "@/engine/minecraft/VoxelRenderer";
import { FirstPersonControls } from "@/engine/minecraft/FirstPersonControls";
import { OrbitControls } from "@/engine/minecraft/OrbitControls";
import { IsoRenderer, isWebGLAvailable } from "@/engine/minecraft/IsoRenderer";
import { PlayerAvatar } from "@/engine/minecraft/PlayerAvatar";
import { HeldBlock } from "@/engine/minecraft/HeldBlock";
import { BlockEffects } from "@/engine/minecraft/BlockEffects";
import { SoundSynth } from "@/engine/minecraft/SoundSynth";
import { SurvivalSystem, ItemType } from "@/engine/minecraft/SurvivalSystem";

type RenderMode = "webgl" | "iso";
type CameraMode = "first" | "orbit";

interface WebGLEngine {
  type: "webgl";
  world: VoxelWorld;
  renderer: VoxelRenderer;
  controls: FirstPersonControls | OrbitControls;
  cameraMode: CameraMode;
  avatar: PlayerAvatar;
  heldBlock: HeldBlock;
  effects: BlockEffects;
  sound: SoundSynth;
  survival: SurvivalSystem;
  leftMouseDown: boolean;
  lastStepTime: number;
}

interface IsoEngine {
  type: "iso";
  world: VoxelWorld;
  renderer: IsoRenderer;
}

export default function MinecraftPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WebGLEngine | IsoEngine | null>(null);
  const rafRef = useRef<number>(0);

  const [renderMode, setRenderMode] = useState<RenderMode>("webgl");
  const [cameraMode, setCameraMode] = useState<CameraMode>("first");
  const [selectedBlock, setSelectedBlock] = useState<BlockType>("grass");
  const selectedBlockRef = useRef<BlockType>("grass");
  selectedBlockRef.current = selectedBlock;

  const [isLocked, setIsLocked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [blockCount, setBlockCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 生存模式 UI 状态
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [dayTime, setDayTime] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [inventory, setInventory] = useState({ apple: 0, meat: 0 });

  const rebuild = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.type === "webgl") {
      engine.renderer.rebuildMesh();
    }
    setBlockCount(engine.world.blocks.size);
  }, []);

  const respawn = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;
    const y = 14;
    if (engine.cameraMode === "first") {
      engine.renderer.camera.position.set(0, y, 0);
    } else {
      (engine.controls as OrbitControls).target.set(0, y, 0);
      (engine.controls as OrbitControls).updateCamera();
    }
    engine.survival.respawn(0, y, 0);
    setIsDead(false);
    setHealth(100);
    setHunger(100);
  }, []);

  // 切换第一人称 / 第三人称
  const toggleCameraMode = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;

    const newMode = engine.cameraMode === "first" ? "orbit" : "first";
    const renderer = engine.renderer;
    const world = engine.world;

    engine.controls.dispose();

    if (newMode === "first") {
      const dir = new THREE.Vector3();
      renderer.camera.getWorldDirection(dir);
      const controls = new FirstPersonControls(renderer.camera, renderer.renderer.domElement, world);
      controls.onLockChange = (locked) => setIsLocked(locked);
      controls.yaw = Math.atan2(dir.x, dir.z);
      controls.pitch = Math.asin(Math.max(-1, Math.min(1, -dir.y)));
      controls.updateCameraRotation();
      engine.controls = controls;
      engine.avatar.setVisible(false);
      engine.heldBlock.setVisible(true);
    } else {
      const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement, world);
      controls.target.copy(getCameraLookPoint(renderer.camera));
      controls.distance = 18;
      controls.updateCamera();
      engine.controls = controls;
      engine.avatar.setVisible(true);
      engine.heldBlock.setVisible(false);
    }

    engine.cameraMode = newMode;
    setCameraMode(newMode);
  }, []);

  const toggleSound = useCallback(() => {
    const engine = engineRef.current;
    if (engine?.type === "webgl") {
      engine.sound.toggle();
      setSoundEnabled(engine.sound.enabled);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const world = new VoxelWorld();
    const webglOk = isWebGLAvailable();

    let cleanup = () => {};

    if (webglOk) {
      setRenderMode("webgl");
      const renderer = new VoxelRenderer(container, world);
      renderer.camera.position.set(0, 14, 22);
      renderer.camera.lookAt(0, 14, 0);

      // 默认使用第三人称环绕，避免 Pointer Lock 在某些环境不生效导致无法体验
      const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement, world);
      controls.target.set(0, 14, 0);
      controls.distance = 18;
      controls.updateCamera();

      const avatar = new PlayerAvatar();
      avatar.setVisible(true);
      renderer.scene.add(avatar.group);

      const heldBlock = new HeldBlock(renderer.camera);
      heldBlock.setType("grass");
      heldBlock.setVisible(false);

      const sound = new SoundSynth();
      const effects = new BlockEffects(renderer.scene, world);
      effects.onBreak = (x, y, z, type) => {
        sound.playBreak(type);
      };

      const survival = new SurvivalSystem(
        renderer.scene,
        world,
        renderer.sun,
        renderer.ambient,
        renderer.scene.background as THREE.Color,
      );
      survival.onDeath = () => setIsDead(true);
      survival.onRespawn = () => {
        setIsDead(false);
        setHealth(100);
        setHunger(100);
      };
      survival.onItemPickup = (type) => {
        setInventory((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      };

      engineRef.current = {
        type: "webgl",
        world,
        renderer,
        controls,
        cameraMode: "orbit",
        avatar,
        heldBlock,
        effects,
        sound,
        survival,
        leftMouseDown: false,
        lastStepTime: 0,
      };
      setCameraMode("orbit");

      const canvas = renderer.renderer.domElement;

      const handleMouseDown = (e: MouseEvent) => {
        const ctrl = engineRef.current;
        if (!ctrl || ctrl.type !== "webgl") return;

        if (e.button === 0) {
          if (ctrl.cameraMode === "first") {
            // 优先攻击怪物
            const attackPoint = getCameraForwardPoint(renderer.camera, 2.5);
            if (ctrl.survival.damageMobAt(attackPoint.x, attackPoint.y, attackPoint.z, 10)) {
              return;
            }
            const target = renderer.getTargetBlock();
            if (target) {
              ctrl.effects.startBreak(target.block.x, target.block.y, target.block.z, target.block.type);
              ctrl.leftMouseDown = true;
            }
          }
        } else if (e.button === 2) {
          const target = renderer.getTargetBlock();
          if (!target) return;

          const nx = target.block.x + Math.round(target.normal.x);
          const ny = target.block.y + Math.round(target.normal.y);
          const nz = target.block.z + Math.round(target.normal.z);

          let cx = 0, cy = 0, cz = 0;
          if (ctrl.cameraMode === "first") {
            const cam = renderer.camera.position;
            cx = Math.round(cam.x); cy = Math.round(cam.y); cz = Math.round(cam.z);
          } else {
            const t = (ctrl.controls as OrbitControls).target;
            cx = Math.round(t.x); cy = Math.round(t.y); cz = Math.round(t.z);
          }
          if (nx === cx && ny === cy && nz === cz) return;

          world.setBlock(nx, ny, nz, selectedBlockRef.current);
          ctrl.effects.spawnPlaceParticles(nx, ny, nz, selectedBlockRef.current);
          ctrl.sound.playPlace(selectedBlockRef.current);
          rebuild();
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        const ctrl = engineRef.current;
        if (!ctrl || ctrl.type !== "webgl") return;
        if (e.button === 0 && ctrl.leftMouseDown) {
          ctrl.effects.cancelBreak();
          ctrl.leftMouseDown = false;
        }
        if (e.button === 0 && ctrl.cameraMode === "orbit") {
          const orb = ctrl.controls as OrbitControls;
          if (orb.consumeClick()) {
            // 第三人称：快速点击优先攻击怪物，否则破坏方块
            const targetPos = (ctrl.controls as OrbitControls).target;
            const attackPoint = getCameraForwardPoint(renderer.camera, 2.5);
            if (!ctrl.survival.damageMobAt(attackPoint.x, attackPoint.y, attackPoint.z, 10)) {
              const target = renderer.getTargetBlock();
              if (target) {
                world.removeBlock(target.block.x, target.block.y, target.block.z);
                ctrl.effects.spawnBreakParticles(target.block.x, target.block.y, target.block.z, target.block.type);
                ctrl.sound.playBreak(target.block.type);
                rebuild();
              }
            }
          }
        }
      };

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("mouseup", handleMouseUp);

      let lastTime = performance.now();
      const loop = (time: number) => {
        const engine = engineRef.current as WebGLEngine | null;
        if (!engine || engine.type !== "webgl") return;
        const delta = Math.min((time - lastTime) / 1000, 0.1);

        engine.controls.update(delta);

        // 玩家位置
        let px = 0, py = 0, pz = 0;
        if (engine.cameraMode === "first") {
          const cam = engine.renderer.camera.position;
          px = cam.x; py = cam.y; pz = cam.z;
        } else {
          const t = (engine.controls as OrbitControls).target;
          px = t.x; py = t.y; pz = t.z;
        }

        // 动态加载区块
        engine.world.updateLoadedChunks(px, pz);

        // 生存系统更新
        engine.survival.update(delta, px, py, pz);

        const target = renderer.getTargetBlock();
        const currentTargetPos = target
          ? { x: target.block.x, y: target.block.y, z: target.block.z }
          : null;
        engine.effects.update(delta, currentTargetPos);

        engine.heldBlock.setType(selectedBlockRef.current);
        engine.heldBlock.update(delta, engine.controls.isMoving);

        // 玩家模型位置与动画
        if (engine.cameraMode === "orbit") {
          const orb = engine.controls as OrbitControls;
          engine.avatar.setPosition(orb.target.x, orb.target.y, orb.target.z);
          engine.avatar.update(delta, orb.isMoving, orb.moveDir);
        } else {
          const fp = engine.controls as FirstPersonControls;
          engine.avatar.setPosition(fp.camera.position.x, fp.camera.position.y, fp.camera.position.z);
          engine.avatar.update(delta, fp.isMoving, fp.moveDir);
        }

        // 脚步声
        if (engine.controls.isMoving && engine.sound.enabled) {
          const stepInterval = 0.35;
          if (time - engine.lastStepTime > stepInterval * 1000) {
            engine.sound.playStep();
            engine.lastStepTime = time;
          }
        }

        renderer.updateHighlight();
        renderer.render();

        setPosition({ x: Math.round(px), y: Math.round(py), z: Math.round(pz) });
        setBlockCount(engine.world.blocks.size);
        setHealth(engine.survival.health);
        setHunger(engine.survival.hunger);
        setDayTime(engine.survival.dayTime);
        setIsNight(engine.survival.isNight());

        lastTime = time;
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("mouseup", handleMouseUp);
        controls.dispose();
        avatar.group.traverse((obj) => {
          if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
          if ((obj as THREE.Mesh).material) {
            const mat = (obj as THREE.Mesh).material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
        renderer.scene.remove(avatar.group);
        heldBlock.dispose();
        effects.dispose();
        survival.dispose();
        renderer.destroy();
      };
    } else {
      setRenderMode("iso");
      const renderer = new IsoRenderer(container, world);
      engineRef.current = { type: "iso", world, renderer };

      const loop = (time: number) => {
        const engine = engineRef.current as IsoEngine | null;
        if (!engine || engine.type !== "iso") return;
        renderer.render();
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        renderer.destroy();
      };
    }

    setBlockCount(world.blocks.size);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDead) {
        if (e.code === "Enter" || e.code === "Space") {
          respawn();
        }
        return;
      }

      const index = Number(e.key);
      if (index >= 1 && index <= PLACEABLE_BLOCKS.length) {
        setSelectedBlock(PLACEABLE_BLOCKS[index - 1]);
      }
      if (e.code === "KeyR") {
        world.generate();
        rebuild();
        const engine = engineRef.current;
        if (engine?.type === "webgl") {
          engine.survival.health = 100;
          engine.survival.hunger = 100;
          engine.survival.isDead = false;
          engine.survival.dayTime = 0;
          engine.renderer.camera.position.set(0, 14, 22);
          engine.renderer.camera.lookAt(0, 14, 0);
          if (engine.cameraMode === "first") {
            const fp = engine.controls as FirstPersonControls;
            fp.yaw = 0;
            fp.pitch = 0;
            fp.updateCameraRotation();
          } else {
            const orb = engine.controls as OrbitControls;
            orb.target.set(0, 14, 0);
            orb.distance = 18;
            orb.updateCamera();
          }
        }
      }
      if (e.code === "KeyV") {
        toggleCameraMode();
      }
      if (e.code === "KeyE") {
        const engine = engineRef.current;
        if (engine?.type === "webgl") {
          const inv = inventoryRef.current;
          if (inv.meat > 0) {
            engine.survival.eat("meat");
            setInventory((prev) => ({ ...prev, meat: prev.meat - 1 }));
          } else if (inv.apple > 0) {
            engine.survival.eat("apple");
            setInventory((prev) => ({ ...prev, apple: prev.apple - 1 }));
          }
        }
      }
      if (e.code === "KeyM") {
        toggleSound();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cleanup();
      engineRef.current = null;
    };
  }, [rebuild, toggleCameraMode, toggleSound, respawn, isDead]);

  // 用于在 keydown 闭包中读取最新库存
  const inventoryRef = useRef(inventory);
  inventoryRef.current = inventory;

  const showOverlay = renderMode === "iso" || (cameraMode === "first" && !isLocked);

  return (
    <div className="h-screen w-screen overflow-hidden bg-ink-900 relative">
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-ink-200 hover:text-ember-400 hover:border-ember-500/40 transition-colors"
        >
          <ArrowLeft size={14} />
          <span className="text-xs font-mono">返回工坊</span>
        </Link>

        {renderMode === "webgl" && cameraMode === "first" && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <span className="flex items-center gap-1.5">
              <Move size={12} className="text-mint-400" />
              WASD 移动
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>空格上升 / Shift 下降</span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span className="flex items-center gap-1.5">
              <MousePointerClick size={12} className="text-ember-400" />
              左键攻击/破坏 / 右键放置
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>V 第三人称 · E 吃东西</span>
          </div>
        )}

        {renderMode === "webgl" && cameraMode === "orbit" && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <span className="flex items-center gap-1.5">
              <Move size={12} className="text-mint-400" />
              WASD 移动角色
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>空格上升 / Shift 下降</span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>拖拽旋转 · 滚轮缩放</span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>V 第一人称 · E 吃东西</span>
          </div>
        )}

        {renderMode === "iso" && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <span className="flex items-center gap-1.5">
              <Eye size={12} className="text-mint-400" />
              2D 等距预览模式
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>拖拽平移 · 滚轮缩放</span>
          </div>
        )}

        <div className="flex items-center gap-2 pointer-events-auto">
          {renderMode === "webgl" && (
            <>
              <button
                onClick={toggleSound}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-200 hover:text-ember-400 hover:border-ember-500/40 transition-colors"
                title="M 键切换音效"
              >
                {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              </button>
              <button
                onClick={toggleCameraMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-200 hover:text-ember-400 hover:border-ember-500/40 transition-colors"
                title="V 键切换"
              >
                {cameraMode === "first" ? <User size={12} /> : <Video size={12} />}
                <span>{cameraMode === "first" ? "第一人称" : "第三人称"}</span>
              </button>
            </>
          )}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <Box size={12} className="text-sun-400" />
            <span>方块: {blockCount}</span>
            {renderMode === "webgl" && (
              <>
                <span className="w-px h-3 bg-ink-600/60" />
                <span>
                  X:{position.x} Y:{position.y} Z:{position.z}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 生存模式状态条 */}
      {renderMode === "webgl" && (
        <div className="absolute top-16 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60">
            <Heart size={14} className="text-rose-500" />
            <div className="w-32 h-2 rounded-full bg-ink-900 overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all"
                style={{ width: `${Math.max(0, health)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-ink-200 w-8">{Math.ceil(health)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60">
            <Utensils size={14} className="text-amber-500" />
            <div className="w-32 h-2 rounded-full bg-ink-900 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${Math.max(0, hunger)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-ink-200 w-8">{Math.ceil(hunger)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            {isNight ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-sun-400" />}
            <span>{isNight ? "夜晚" : "白天"}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <span className="text-rose-400">🍎 {inventory.apple}</span>
            <span className="text-amber-400">🍖 {inventory.meat}</span>
          </div>
        </div>
      )}

      {renderMode === "webgl" && cameraMode === "first" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/80 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/80 -translate-x-1/2" />
          </div>
        </div>
      )}

      {showOverlay && !isDead && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm pointer-events-none">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="font-pixel text-2xl text-ember-400 text-glow-ember">MINECRAFT 3D</div>
            {renderMode === "webgl" && cameraMode === "first" ? (
              <>
                <div className="text-sm font-mono text-ink-200">点击画面开始探索方块世界</div>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-400">
                  <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">ESC</span>
                  <span>释放鼠标</span>
                  <span className="w-px h-3 bg-ink-600/60 mx-1" />
                  <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">V</span>
                  <span>切换第三人称</span>
                </div>
              </>
            ) : renderMode === "webgl" && cameraMode === "orbit" ? (
              <>
                <div className="text-sm font-mono text-ink-200">第三人称环绕模式</div>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-400">
                  <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">拖拽</span>
                  <span>旋转视角</span>
                  <span className="w-px h-3 bg-ink-600/60 mx-1" />
                  <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">V</span>
                  <span>切换第一人称</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-mono text-ink-200">当前使用 2D 等距预览模式</div>
                <div className="text-xs font-mono text-ink-400">您的环境未启用 WebGL，已自动切换</div>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-400">
                  <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">拖拽</span>
                  <span>平移 · 滚轮缩放</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 死亡画面 */}
      {isDead && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/80 backdrop-blur-md pointer-events-auto">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Skull size={40} className="text-ink-100" />
              <span className="font-pixel text-4xl text-ink-100">你死了</span>
            </div>
            <div className="text-sm font-mono text-ink-300">按 Enter / Space 或点击下方按钮重生</div>
            <button
              onClick={respawn}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-lg bg-ember-500 hover:bg-ember-400 text-ink-900 font-mono text-sm transition-colors"
            >
              <RefreshCw size={16} />
              重生
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-end gap-1.5 p-2 rounded-xl bg-ink-800/80 backdrop-blur border border-ink-600/60">
        {PLACEABLE_BLOCKS.map((type, idx) => {
          const def = BLOCK_DEFS[type];
          const active = selectedBlock === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedBlock(type)}
              className={`
                relative group w-12 h-12 rounded-lg border-2 transition-all
                ${active ? "border-ember-400 -translate-y-2 shadow-glow" : "border-ink-600/60 hover:border-ink-500"}
              `}
              style={{ backgroundColor: `#${def.color.toString(16).padStart(6, "0")}` }}
              title={type}
            >
              <span className="absolute -top-2 -left-1 w-5 h-5 flex items-center justify-center rounded bg-ink-900 border border-ink-600 text-[9px] font-pixel text-ink-200">
                {idx + 1}
              </span>
              <span className="sr-only">{type}</span>
            </button>
          );
        })}
      </div>

      <div className="sm:hidden absolute bottom-24 left-4 right-4 z-10 px-4 py-3 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-[10px] font-mono text-ink-300 space-y-1">
        {renderMode === "webgl" && cameraMode === "first" && (
          <>
            <div className="flex items-center gap-2">
              <Move size={10} className="text-mint-400" /> WASD 移动
            </div>
            <div>空格上升 · Shift 下降</div>
            <div className="flex items-center gap-2">
              <MousePointerClick size={10} className="text-ember-400" /> 左键攻击/破坏 / 右键放置
            </div>
            <div>E 吃东西 · M 开关音效</div>
          </>
        )}
        {renderMode === "webgl" && cameraMode === "orbit" && (
          <>
            <div className="flex items-center gap-2">
              <Move size={10} className="text-mint-400" /> WASD 移动角色
            </div>
            <div>拖拽旋转 · 滚轮缩放</div>
          </>
        )}
        {renderMode === "iso" && (
          <>
            <div className="flex items-center gap-2">
              <Eye size={10} className="text-mint-400" /> 2D 等距预览
            </div>
            <div>拖拽平移 · 滚轮缩放</div>
          </>
        )}
        <div className="flex items-center gap-2">
          <Trash2 size={10} className="text-ink-400" /> R 重新生成世界
        </div>
        {renderMode === "webgl" && (
          <div className="flex items-center gap-2">
            <Video size={10} className="text-ember-400" /> V 切换视角
          </div>
        )}
      </div>
    </div>
  );
}

function getCameraLookPoint(camera: THREE.PerspectiveCamera) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  return camera.position.clone().add(dir.multiplyScalar(10));
}

function getCameraForwardPoint(camera: THREE.PerspectiveCamera, distance: number) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  return camera.position.clone().add(dir.multiplyScalar(distance));
}
