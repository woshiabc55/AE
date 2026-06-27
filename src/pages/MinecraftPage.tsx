// 我的世界还原体验页（含生存 / 创造模式、主菜单、加载界面与设置面板）

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
  Zap,
  Settings,
  Keyboard,
  Crosshair,
  Play,
  Sliders,
  LogOut,
  Apple,
  Beef,
  Loader2,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
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
type GamePhase = "menu" | "loading" | "playing";
type ToastType = "info" | "success" | "warning" | "death";

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

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface GameSettings {
  fov: number;
  sensitivity: number;
  renderDistance: number;
  volume: number;
}

const SETTINGS_KEY = "mc-settings";
const DEFAULT_SETTINGS: GameSettings = {
  fov: 75,
  sensitivity: 0.003,
  renderDistance: 3,
  volume: 0.8,
};

const KEY_BINDINGS = [
  { keys: "W A S D", action: "移动" },
  { keys: "Space / Shift", action: "上升 / 下降" },
  { keys: "鼠标左键", action: "攻击怪物 / 按住破坏方块" },
  { keys: "鼠标右键", action: "放置方块" },
  { keys: "1 - 0", action: "选择方块" },
  { keys: "V", action: "切换第一/第三人称" },
  { keys: "C", action: "切换创造/生存模式" },
  { keys: "E", action: "吃东西" },
  { keys: "Tab", action: "暂停 / 设置" },
  { keys: "R", action: "重新生成世界" },
  { keys: "M", action: "开关音效" },
  { keys: "ESC", action: "释放鼠标" },
];

const BLOCK_LABELS: Record<BlockType, string> = {
  air: "空气",
  grass: "草方块",
  dirt: "泥土",
  stone: "石头",
  wood: "原木",
  leaves: "树叶",
  sand: "沙子",
  water: "水",
  glass: "玻璃",
  planks: "木板",
  brick: "砖块",
  diamond: "钻石矿",
};

export default function MinecraftPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WebGLEngine | IsoEngine | null>(null);
  const worldRef = useRef<VoxelWorld | null>(null);
  const rafRef = useRef<number>(0);
  const toastIdRef = useRef(0);

  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [renderMode, setRenderMode] = useState<RenderMode>("webgl");
  const [cameraMode, setCameraMode] = useState<CameraMode>("orbit");
  const [selectedBlock, setSelectedBlock] = useState<BlockType>("grass");
  const selectedBlockRef = useRef<BlockType>("grass");
  selectedBlockRef.current = selectedBlock;

  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsFromMenu, setSettingsFromMenu] = useState(false);
  const [creativeMode, setCreativeMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [blockCount, setBlockCount] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fps, setFps] = useState(0);

  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [dayTime, setDayTime] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [inventory, setInventory] = useState({ apple: 0, meat: 0 });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const inventoryRef = useRef(inventory);
  inventoryRef.current = inventory;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isDeadRef = useRef(isDead);
  isDeadRef.current = isDead;
  const renderModeRef = useRef(renderMode);
  renderModeRef.current = renderMode;
  const showSettingsRef = useRef(showSettings);
  showSettingsRef.current = showSettings;

  // 保存设置
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // 应用设置到运行中的引擎
  useEffect(() => {
    const engine = engineRef.current;
    if (engine?.type !== "webgl") return;
    engine.renderer.setFov(settings.fov);
    engine.controls.mouseSensitivity = settings.sensitivity;
    engine.world.renderDistance = settings.renderDistance;
    engine.sound.setVolume(settings.volume);
    // 渲染距离改变后下一帧会加载新区块
  }, [settings]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const startGame = useCallback(() => {
    setGamePhase("loading");
    setLoadingProgress(0);
    setIsPaused(false);
    setIsDead(false);
    setInventory({ apple: 0, meat: 0 });
    setHealth(100);
    setHunger(100);
  }, []);

  const returnToMenu = useCallback(() => {
    setGamePhase("menu");
    setIsPaused(false);
    setShowSettings(false);
  }, []);

  const openSettings = useCallback((fromMenu = false) => {
    setSettingsFromMenu(fromMenu);
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const rebuild = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.type === "webgl") {
      engine.renderer.rebuildMesh();
    }
    setBlockCount(engine.world.blocks.size);
    setChunkCount(engine.world.loadedChunks.size);
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
    showToast("已重生", "success");
  }, [showToast]);

  const setCreative = useCallback((enabled: boolean) => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;
    engine.survival.creativeMode = enabled;
    setCreativeMode(enabled);
    if (enabled) {
      setHealth(100);
      setHunger(100);
      setIsDead(false);
      showToast("已切换到创造模式", "success");
    } else {
      showToast("已切换到生存模式", "warning");
    }
  }, [showToast]);

  const eatItem = useCallback((type: ItemType) => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;
    const inv = inventoryRef.current;
    if (type === "meat" && inv.meat > 0) {
      engine.survival.eat("meat");
      setInventory((prev) => ({ ...prev, meat: prev.meat - 1 }));
      showToast("吃了烤肉，饥饿值 +25", "success");
    } else if (type === "apple" && inv.apple > 0) {
      engine.survival.eat("apple");
      setInventory((prev) => ({ ...prev, apple: prev.apple - 1 }));
      showToast("吃了苹果，饥饿值 +15", "success");
    } else {
      showToast("没有这种食物", "warning");
    }
  }, [showToast]);

  const toggleCameraMode = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;

    const newMode = engine.cameraMode === "first" ? "orbit" : "first";
    const renderer = engine.renderer;
    const world = engine.world;
    const s = settingsRef.current;

    engine.controls.dispose();

    if (newMode === "first") {
      const dir = new THREE.Vector3();
      renderer.camera.getWorldDirection(dir);
      const controls = new FirstPersonControls(renderer.camera, renderer.renderer.domElement, world);
      controls.onLockChange = (locked) => setIsLocked(locked);
      controls.mouseSensitivity = s.sensitivity;
      controls.yaw = Math.atan2(dir.x, dir.z);
      controls.pitch = Math.asin(Math.max(-1, Math.min(1, -dir.y)));
      controls.updateCameraRotation();
      engine.controls = controls;
      engine.avatar.setVisible(false);
      engine.heldBlock.setVisible(true);
      showToast("第一人称视角", "info");
    } else {
      const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement, world);
      controls.mouseSensitivity = s.sensitivity;
      controls.target.copy(getCameraLookPoint(renderer.camera));
      controls.distance = 18;
      controls.updateCamera();
      engine.controls = controls;
      engine.avatar.setVisible(true);
      engine.heldBlock.setVisible(false);
      showToast("第三人称视角", "info");
    }

    engine.cameraMode = newMode;
    setCameraMode(newMode);
  }, [showToast]);

  const toggleSound = useCallback(() => {
    const engine = engineRef.current;
    if (engine?.type === "webgl") {
      engine.sound.toggle();
      setSoundEnabled(engine.sound.enabled);
      showToast(engine.sound.enabled ? "音效已开启" : "音效已关闭", "info");
    }
  }, [showToast]);

  // 加载阶段：异步生成世界
  useEffect(() => {
    if (gamePhase !== "loading") return;

    let cancelled = false;

    (async () => {
      const webglOk = isWebGLAvailable();
      setRenderMode(webglOk ? "webgl" : "iso");

      const world = new VoxelWorld();
      worldRef.current = world;

      if (webglOk) {
        await world.generateAsync(settingsRef.current.renderDistance, (p) => {
          if (!cancelled) setLoadingProgress(p);
        });
      } else {
        world.generate();
      }

      if (!cancelled) {
        setBlockCount(world.blocks.size);
        setChunkCount(world.loadedChunks.size);
        setGamePhase("playing");
      }
    })();

    return () => {
      cancelled = true;
      // 注意：不要在这里清空 worldRef，因为紧接着的 playing 阶段还需要它
    };
  }, [gamePhase]);

  // 运行阶段：初始化渲染器与游戏循环
  useEffect(() => {
    if (gamePhase !== "playing" || !containerRef.current || !worldRef.current) return;

    const container = containerRef.current;
    const world = worldRef.current;
    let cleanup = () => {};

    if (renderModeRef.current === "webgl") {
      const renderer = new VoxelRenderer(container, world);
      renderer.camera.position.set(0, 14, 22);
      renderer.camera.lookAt(0, 14, 0);

      const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement, world);
      controls.mouseSensitivity = settingsRef.current.sensitivity;
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
      sound.setVolume(settingsRef.current.volume);
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
      survival.onDeath = () => {
        setIsDead(true);
        showToast("你死了！按 Enter / Space 重生", "death");
      };
      survival.onRespawn = () => {
        setIsDead(false);
        setHealth(100);
        setHunger(100);
      };
      survival.onItemPickup = (type) => {
        setInventory((prev) => ({ ...prev, [type]: prev[type] + 1 }));
        showToast(`拾取 ${type === "apple" ? "苹果" : "烤肉"}`, "success");
      };

      const engine: WebGLEngine = {
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
      engineRef.current = engine;
      setCameraMode("orbit");
      setCreativeMode(false);

      const canvas = renderer.renderer.domElement;

      const handleMouseDown = (e: MouseEvent) => {
        const ctrl = engineRef.current;
        if (!ctrl || ctrl.type !== "webgl" || isPausedRef.current || isDeadRef.current) return;

        if (e.button === 0) {
          if (ctrl.cameraMode === "first") {
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
        if (e.button === 0 && ctrl.cameraMode === "orbit" && !isPausedRef.current && !isDeadRef.current) {
          const orb = ctrl.controls as OrbitControls;
          if (orb.consumeClick()) {
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
      let frameCount = 0;
      let lastFpsTime = performance.now();
      let lastChunkCount = -1;

      const loop = (time: number) => {
        const engine = engineRef.current as WebGLEngine | null;
        if (!engine || engine.type !== "webgl") return;
        const delta = Math.min((time - lastTime) / 1000, 0.1);

        frameCount++;
        if (time - lastFpsTime >= 500) {
          setFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
          frameCount = 0;
          lastFpsTime = time;
        }

        if (!isPausedRef.current && !isDeadRef.current) {
          engine.controls.update(delta);
        }

        let px = 0, py = 0, pz = 0;
        if (engine.cameraMode === "first") {
          const cam = engine.renderer.camera.position;
          px = cam.x; py = cam.y; pz = cam.z;
        } else {
          const t = (engine.controls as OrbitControls).target;
          px = t.x; py = t.y; pz = t.z;
        }

        if (!isPausedRef.current && !isDeadRef.current) {
          engine.world.updateLoadedChunks(px, pz);
          if (engine.world.loadedChunks.size !== lastChunkCount) {
            lastChunkCount = engine.world.loadedChunks.size;
            engine.renderer.rebuildMesh();
          }
          engine.survival.update(delta, px, py, pz);
        }

        const target = renderer.getTargetBlock();
        const currentTargetPos = target
          ? { x: target.block.x, y: target.block.y, z: target.block.z }
          : null;
        engine.effects.update(delta, currentTargetPos);

        engine.heldBlock.setType(selectedBlockRef.current);
        engine.heldBlock.update(delta, engine.controls.isMoving);

        if (engine.cameraMode === "orbit") {
          const orb = engine.controls as OrbitControls;
          engine.avatar.setPosition(orb.target.x, orb.target.y, orb.target.z);
          engine.avatar.update(delta, orb.isMoving, orb.moveDir);
        } else {
          const fp = engine.controls as FirstPersonControls;
          engine.avatar.setPosition(fp.camera.position.x, fp.camera.position.y, fp.camera.position.z);
          engine.avatar.update(delta, fp.isMoving, fp.moveDir);
        }

        if (!isPausedRef.current && !isDeadRef.current && engine.controls.isMoving && engine.sound.enabled) {
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
        setChunkCount(engine.world.loadedChunks.size);
        setHealth(engine.survival.health);
        setHunger(engine.survival.hunger);
        setDayTime(engine.survival.dayTime);
        setIsNight(engine.survival.isNight());

        lastTime = time;
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      const handleResize = () => {
        renderer.resize();
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", handleResize);
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
        engineRef.current = null;
      };
    } else {
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
        engineRef.current = null;
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // 全局游戏按键阻止默认行为
      const gameKeys = [
        "KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft", "ShiftRight",
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      ];
      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "Tab") {
        e.preventDefault();
        if (showSettingsRef.current) {
          setShowSettings(false);
        } else if (!isDeadRef.current) {
          setIsPaused((p) => !p);
        }
        return;
      }

      if (isDeadRef.current && (e.code === "Enter" || e.code === "Space")) {
        e.preventDefault();
        respawn();
        return;
      }

      if (isPausedRef.current || isDeadRef.current) return;

      const index = Number(e.key);
      if (index >= 1 && index <= PLACEABLE_BLOCKS.length) {
        setSelectedBlock(PLACEABLE_BLOCKS[index - 1]);
      }
      if (e.code === "KeyR") {
        e.preventDefault();
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
        showToast("世界已重新生成", "info");
      }
      if (e.code === "KeyV") {
        e.preventDefault();
        toggleCameraMode();
      }
      if (e.code === "KeyC") {
        e.preventDefault();
        const engine = engineRef.current;
        if (engine?.type === "webgl") {
          setCreative(!engine.survival.creativeMode);
        }
      }
      if (e.code === "KeyE") {
        e.preventDefault();
        const engine = engineRef.current;
        if (engine?.type === "webgl") {
          const inv = inventoryRef.current;
          if (inv.meat > 0) {
            engine.survival.eat("meat");
            setInventory((prev) => ({ ...prev, meat: prev.meat - 1 }));
            showToast("吃了烤肉，饥饿值 +25", "success");
          } else if (inv.apple > 0) {
            engine.survival.eat("apple");
            setInventory((prev) => ({ ...prev, apple: prev.apple - 1 }));
            showToast("吃了苹果，饥饿值 +15", "success");
          } else {
            showToast("没有食物", "warning");
          }
        }
      }
      if (e.code === "KeyM") {
        e.preventDefault();
        toggleSound();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cleanup();
    };
  }, [gamePhase, rebuild, respawn, toggleCameraMode, toggleSound, showToast]);

  const showOverlay = gamePhase === "playing" && renderMode === "webgl" && cameraMode === "first" && !isLocked && !isPaused && !isDead;

  // 设置面板组件
  const SettingsPanel = () => {
    const fov = settings.fov;
    const sens = settings.sensitivity;
    const dist = settings.renderDistance;
    const vol = settings.volume;

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink-900/85 backdrop-blur-md pointer-events-auto">
        <div className="w-full max-w-md p-6 rounded-2xl bg-ink-800 border border-ink-600/60 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-xl text-ember-400 flex items-center gap-2">
              <Sliders size={20} />
              游戏设置
            </h2>
            <button
              onClick={closeSettings}
              className="p-2 rounded-lg hover:bg-ink-700 text-ink-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-ink-300">
                <span className="flex items-center gap-2"><Eye size={14} /> 视野 (FOV)</span>
                <span>{fov}°</span>
              </div>
              <input
                type="range"
                min={60}
                max={110}
                step={1}
                value={fov}
                onChange={(e) => setSettings((s) => ({ ...s, fov: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none bg-ink-900 accent-ember-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-ink-300">
                <span className="flex items-center gap-2"><MousePointerClick size={14} /> 鼠标灵敏度</span>
                <span>{sens.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.01}
                step={0.001}
                value={sens}
                onChange={(e) => setSettings((s) => ({ ...s, sensitivity: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none bg-ink-900 accent-ember-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-ink-300">
                <span className="flex items-center gap-2"><Box size={14} /> 渲染距离</span>
                <span>{dist} 区块</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={dist}
                onChange={(e) => setSettings((s) => ({ ...s, renderDistance: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none bg-ink-900 accent-ember-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-ink-300">
                <span className="flex items-center gap-2"><Volume2 size={14} /> 音量</span>
                <span>{Math.round(vol * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vol}
                onChange={(e) => setSettings((s) => ({ ...s, volume: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none bg-ink-900 accent-ember-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSettings(DEFAULT_SETTINGS);
              showToast("已恢复默认设置", "info");
            }}
            className="w-full px-4 py-2 rounded-lg bg-ink-700 border border-ink-600 text-ink-200 font-mono text-xs hover:bg-ink-600 transition-colors"
          >
            恢复默认设置
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-ink-900 relative">
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />

      {/* 主菜单 */}
      {gamePhase === "menu" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink-900 bg-noise pointer-events-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="font-pixel text-5xl sm:text-6xl text-ember-400 text-glow-ember tracking-wider">
                MINECRAFT
              </div>
              <div className="font-pixel text-lg text-ink-300">3D 方块世界还原</div>
            </div>

            <div className="w-64 h-1 mx-auto bg-gradient-to-r from-transparent via-ember-500 to-transparent opacity-60" />

            <div className="flex flex-col gap-3 w-72 mx-auto">
              <button
                onClick={startGame}
                className="group relative px-6 py-4 rounded-xl bg-mint-500/15 border border-mint-500/40 text-mint-300 font-pixel text-sm hover:bg-mint-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play size={18} />
                  开始游戏
                </span>
              </button>
              <button
                onClick={() => openSettings(true)}
                className="px-6 py-4 rounded-xl bg-ink-800 border border-ink-600 text-ink-200 font-pixel text-sm hover:bg-ink-700 hover:border-ember-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Sliders size={18} />
                设置
              </button>
              <Link
                to="/"
                className="px-6 py-4 rounded-xl bg-ink-800 border border-ink-600 text-ink-200 font-pixel text-sm hover:bg-ink-700 hover:border-ember-500/40 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                返回工坊
              </Link>
            </div>

            <div className="text-[10px] font-mono text-ink-500 pt-8">
              WASD 移动 · 空格上升 · 左键破坏/攻击 · 右键放置
            </div>
          </div>
        </div>
      )}

      {/* 加载界面 */}
      {gamePhase === "loading" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ink-900 bg-noise pointer-events-none">
          <div className="w-full max-w-md px-6 space-y-6 text-center">
            <div className="font-pixel text-2xl text-ember-400 text-glow-ember flex items-center justify-center gap-3">
              <Loader2 size={28} className="animate-spin" />
              生成世界中
            </div>

            <div className="space-y-2">
              <div className="h-4 rounded-full bg-ink-800 border border-ink-600 overflow-hidden shadow-panel">
                <div
                  className="h-full bg-gradient-to-r from-ember-600 to-ember-400 transition-all duration-200"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-ink-400">
                <span>加载地形与资源</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>

            <div className="text-xs font-mono text-ink-500 animate-pulse">
              {loadingProgress < 30 && "正在生成基岩层..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "正在铺设泥土与草地..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "正在种植树木..."}
              {loadingProgress >= 90 && "即将完成..."}
            </div>
          </div>
        </div>
      )}

      {/* 顶部 HUD */}
      {gamePhase === "playing" && (
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
              <span className="flex items-center gap-1.5"><Move size={12} className="text-mint-400" /> WASD 移动</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>空格上升 / Shift 下降</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span className="flex items-center gap-1.5"><MousePointerClick size={12} className="text-ember-400" /> 左键攻击/破坏 / 右键放置</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>V 第三人称 · E 吃东西 · Tab 设置</span>
            </div>
          )}

          {renderMode === "webgl" && cameraMode === "orbit" && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
              <span className="flex items-center gap-1.5"><Move size={12} className="text-mint-400" /> WASD 移动角色</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>空格上升 / Shift 下降</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>拖拽旋转 · 滚轮缩放</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>V 第一人称 · Tab 设置</span>
            </div>
          )}

          {renderMode === "iso" && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
              <span className="flex items-center gap-1.5"><Eye size={12} className="text-mint-400" /> 2D 等距预览模式</span>
              <span className="w-px h-3 bg-ink-600/60" />
              <span>拖拽平移 · 滚轮缩放</span>
            </div>
          )}

          <div className="flex items-center gap-2 pointer-events-auto">
            {renderMode === "webgl" && (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
                  <Crosshair size={12} className="text-ember-400" />
                  <span>FPS {fps}</span>
                </div>
                <button
                  onClick={() => setIsPaused(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-200 hover:text-ember-400 hover:border-ember-500/40 transition-colors"
                  title="Tab 键暂停"
                >
                  <Settings size={12} />
                </button>
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
                <button
                  onClick={() => setCreative(!creativeMode)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border text-xs font-mono transition-colors ${
                    creativeMode
                      ? "border-ember-500/60 text-ember-400"
                      : "border-ink-600/60 text-ink-200 hover:text-ember-400 hover:border-ember-500/40"
                  }`}
                  title="C 键切换"
                >
                  <Zap size={12} />
                  <span>{creativeMode ? "创造" : "生存"}</span>
                </button>
              </>
            )}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
              <Box size={12} className="text-sun-400" />
              <span>方块: {blockCount}</span>
              {renderMode === "webgl" && (
                <>
                  <span className="w-px h-3 bg-ink-600/60" />
                  <span>区块: {chunkCount}</span>
                  <span className="w-px h-3 bg-ink-600/60" />
                  <span>X:{position.x} Y:{position.y} Z:{position.z}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 生存模式状态条 */}
      {gamePhase === "playing" && renderMode === "webgl" && !creativeMode && (
        <div className="absolute top-16 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60">
            <Heart size={14} className="text-rose-500" />
            <div className="w-32 h-2 rounded-full bg-ink-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                style={{ width: `${Math.max(0, health)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-ink-200 w-8">{Math.ceil(health)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60">
            <Utensils size={14} className="text-amber-500" />
            <div className="w-32 h-2 rounded-full bg-ink-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
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
            <span className="text-rose-400 flex items-center gap-1"><Apple size={12} /> {inventory.apple}</span>
            <span className="text-amber-400 flex items-center gap-1"><Beef size={12} /> {inventory.meat}</span>
          </div>
        </div>
      )}

      {/* 创造模式指示器 */}
      {gamePhase === "playing" && renderMode === "webgl" && creativeMode && (
        <div className="absolute top-16 left-4 z-10 px-3 py-2 rounded-lg bg-ember-500/20 backdrop-blur border border-ember-500/40 text-xs font-mono text-ember-300 flex items-center gap-2">
          <Zap size={14} className="text-ember-400" />
          <span>创造模式 · 无敌 · 无怪物</span>
        </div>
      )}

      {/* 准星 */}
      {gamePhase === "playing" && renderMode === "webgl" && cameraMode === "first" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-6 h-6">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/90 -translate-y-1/2 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/90 -translate-x-1/2 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/60 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* 第一人称 / ISO 提示遮罩 */}
      {showOverlay && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm pointer-events-none">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="font-pixel text-2xl text-ember-400 text-glow-ember">MINECRAFT 3D</div>
            <>
              <div className="text-sm font-mono text-ink-200">点击画面锁定鼠标，开始探索方块世界</div>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-400">
                <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">ESC</span>
                <span>释放鼠标</span>
                <span className="w-px h-3 bg-ink-600/60 mx-1" />
                <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">Tab</span>
                <span>设置</span>
              </div>
            </>
          </div>
        </div>
      )}

      {/* 暂停 / 设置面板 */}
      {gamePhase === "playing" && isPaused && renderMode === "webgl" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink-900/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-md p-6 rounded-2xl bg-ink-800 border border-ink-600/60 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-xl text-ember-400 flex items-center gap-2">
                <Settings size={20} />
                游戏设置
              </h2>
              <button
                onClick={() => setIsPaused(false)}
                className="p-2 rounded-lg hover:bg-ink-700 text-ink-300 transition-colors"
              >
                <Play size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPaused(false)}
                className="px-4 py-3 rounded-lg bg-mint-500/20 border border-mint-500/40 text-mint-300 font-mono text-sm hover:bg-mint-500/30 transition-colors"
              >
                继续游戏
              </button>
              <button
                onClick={toggleCameraMode}
                className="px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-200 font-mono text-sm hover:bg-ink-600 transition-colors flex items-center justify-center gap-2"
              >
                <Video size={14} />
                切换视角
              </button>
              <button
                onClick={() => setCreative(!creativeMode)}
                className={`px-4 py-3 rounded-lg border font-mono text-sm transition-colors flex items-center justify-center gap-2 ${
                  creativeMode
                    ? "bg-ember-500/20 border-ember-500/40 text-ember-300 hover:bg-ember-500/30"
                    : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600"
                }`}
              >
                <Zap size={14} />
                {creativeMode ? "创造模式" : "生存模式"}
              </button>
              <button
                onClick={toggleSound}
                className="px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-200 font-mono text-sm hover:bg-ink-600 transition-colors flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                {soundEnabled ? "音效开" : "音效关"}
              </button>
            </div>

            {/* 库存物品 */}
            <div className="p-4 rounded-xl bg-ink-900/50 border border-ink-700/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
                <Box size={14} className="text-sun-400" />
                <span>背包</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => eatItem("apple")}
                  disabled={inventory.apple <= 0}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-800 border border-ink-600/60 text-ink-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-rose-500/40 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-mono">
                    <Apple size={16} className="text-rose-400" />
                    苹果
                  </span>
                  <span className="text-xs font-mono text-ink-400">x{inventory.apple}</span>
                </button>
                <button
                  onClick={() => eatItem("meat")}
                  disabled={inventory.meat <= 0}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-800 border border-ink-600/60 text-ink-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-500/40 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-mono">
                    <Beef size={16} className="text-amber-400" />
                    烤肉
                  </span>
                  <span className="text-xs font-mono text-ink-400">x{inventory.meat}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-ink-900/50 border border-ink-700/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
                <Keyboard size={14} className="text-sun-400" />
                <span>按键绑定</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                {KEY_BINDINGS.map((bind) => (
                  <div key={bind.action} className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-ink-700 text-ink-200">{bind.keys}</span>
                    <span className="text-ink-400">{bind.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ink-700/50">
              <button
                onClick={() => openSettings(false)}
                className="px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-200 font-mono text-sm hover:bg-ink-600 transition-colors flex items-center justify-center gap-2"
              >
                <Sliders size={14} />
                更多设置
              </button>
              <button
                onClick={returnToMenu}
                className="px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-200 font-mono text-sm hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                退出到主菜单
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-ink-400">
              <span>FPS {fps}</span>
              <span>方块 {blockCount} · 区块 {chunkCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* 详细设置面板 */}
      {showSettings && <SettingsPanel />}

      {/* 死亡画面 */}
      {gamePhase === "playing" && isDead && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/80 backdrop-blur-md pointer-events-auto">
          <div className="text-center space-y-6 animate-fade-in">
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
            <button
              onClick={returnToMenu}
              className="block mx-auto text-xs font-mono text-ink-400 hover:text-ink-200 transition-colors"
            >
              返回主菜单
            </button>
          </div>
        </div>
      )}

      {/* 快捷栏 */}
      {gamePhase === "playing" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-200 animate-fade-in">
            {BLOCK_LABELS[selectedBlock]}
          </div>
          <div className="flex items-end gap-1.5 p-2 rounded-xl bg-ink-800/80 backdrop-blur border border-ink-600/60">
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
                  title={BLOCK_LABELS[type]}
                >
                  <span className="absolute -top-2 -left-1 w-5 h-5 flex items-center justify-center rounded bg-ink-900 border border-ink-600 text-[9px] font-pixel text-ink-200">
                    {idx + 1}
                  </span>
                  <span className="sr-only">{BLOCK_LABELS[type]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 移动端操作提示 */}
      {gamePhase === "playing" && (
        <div className="sm:hidden absolute bottom-24 left-4 right-4 z-10 px-4 py-3 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-[10px] font-mono text-ink-300 space-y-1">
          {renderMode === "webgl" && cameraMode === "first" && (
            <>
              <div className="flex items-center gap-2"><Move size={10} className="text-mint-400" /> WASD 移动</div>
              <div>空格上升 · Shift 下降</div>
              <div className="flex items-center gap-2"><MousePointerClick size={10} className="text-ember-400" /> 左键攻击/破坏 / 右键放置</div>
              <div>E 吃东西 · Tab 设置 · M 音效</div>
            </>
          )}
          {renderMode === "webgl" && cameraMode === "orbit" && (
            <>
              <div className="flex items-center gap-2"><Move size={10} className="text-mint-400" /> WASD 移动角色</div>
              <div>拖拽旋转 · 滚轮缩放</div>
            </>
          )}
          {renderMode === "iso" && (
            <>
              <div className="flex items-center gap-2"><Eye size={10} className="text-mint-400" /> 2D 等距预览</div>
              <div>拖拽平移 · 滚轮缩放</div>
            </>
          )}
          <div className="flex items-center gap-2"><Trash2 size={10} className="text-ink-400" /> R 重新生成世界</div>
          {renderMode === "webgl" && (
            <>
              <div className="flex items-center gap-2"><Video size={10} className="text-ember-400" /> V 切换视角</div>
              <div className="flex items-center gap-2"><Zap size={10} className="text-ember-400" /> C 创造模式</div>
            </>
          )}
        </div>
      )}

      {/* Toast 通知 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const icon =
            toast.type === "success" ? <CheckCircle2 size={16} className="text-mint-400" /> :
            toast.type === "warning" ? <AlertTriangle size={16} className="text-amber-400" /> :
            toast.type === "death" ? <Skull size={16} className="text-rose-400" /> :
            <Info size={16} className="text-sun-400" />;
          const border =
            toast.type === "success" ? "border-mint-500/40" :
            toast.type === "warning" ? "border-amber-500/40" :
            toast.type === "death" ? "border-rose-500/40" :
            "border-ember-500/40";
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800/95 backdrop-blur border ${border} shadow-panel animate-fade-in`}
            >
              {icon}
              <span className="text-xs font-mono text-ink-200">{toast.message}</span>
            </div>
          );
        })}
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
