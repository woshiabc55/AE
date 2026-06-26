// 我的世界还原体验页

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
} from "lucide-react";
import { VoxelWorld, PLACEABLE_BLOCKS, BlockType, BLOCK_DEFS } from "@/engine/minecraft/VoxelWorld";
import { VoxelRenderer } from "@/engine/minecraft/VoxelRenderer";
import { FirstPersonControls } from "@/engine/minecraft/FirstPersonControls";
import { OrbitControls } from "@/engine/minecraft/OrbitControls";
import { IsoRenderer, isWebGLAvailable } from "@/engine/minecraft/IsoRenderer";

type RenderMode = "webgl" | "iso";
type CameraMode = "first" | "orbit";

interface WebGLEngine {
  type: "webgl";
  world: VoxelWorld;
  renderer: VoxelRenderer;
  controls: FirstPersonControls | OrbitControls;
  cameraMode: CameraMode;
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

  const rebuild = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.type === "webgl") {
      engine.renderer.rebuildMesh();
    }
    setBlockCount(engine.world.blocks.size);
  }, []);

  // 切换第一人称 / 第三人称
  const toggleCameraMode = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || engine.type !== "webgl") return;

    const newMode = engine.cameraMode === "first" ? "orbit" : "first";
    const renderer = engine.renderer;
    const world = engine.world;

    // 释放旧控制器
    engine.controls.dispose();

    if (newMode === "first") {
      // 从当前相机位置切换到第一人称，保持位置并提取当前朝向为 yaw/pitch
      const dir = new THREE.Vector3();
      renderer.camera.getWorldDirection(dir);
      const controls = new FirstPersonControls(renderer.camera, renderer.renderer.domElement, world);
      controls.onLockChange = (locked) => setIsLocked(locked);
      controls.yaw = Math.atan2(dir.x, dir.z);
      controls.pitch = Math.asin(Math.max(-1, Math.min(1, -dir.y)));
      controls.updateCameraRotation();
      engine.controls = controls;
    } else {
      // 从当前相机位置切换到第三人称环绕
      const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement, world);
      controls.target.copy(getCameraLookPoint(renderer.camera));
      controls.distance = 18;
      controls.updateCamera();
      engine.controls = controls;
    }

    engine.cameraMode = newMode;
    setCameraMode(newMode);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const world = new VoxelWorld();
    const webglOk = isWebGLAvailable();

    let cleanup = () => {};

    if (webglOk) {
      // WebGL 3D 模式
      setRenderMode("webgl");
      const renderer = new VoxelRenderer(container, world);

      // 初始相机：水平看向 -Z 方向，避免与 yaw=0/pitch=0 不一致
      renderer.camera.position.set(0, 14, 22);
      renderer.camera.lookAt(0, 14, 0);

      const controls = new FirstPersonControls(renderer.camera, renderer.renderer.domElement, world);
      controls.onLockChange = (locked) => setIsLocked(locked);
      // 同步四元数与水平视角
      controls.yaw = 0;
      controls.pitch = 0;
      controls.updateCameraRotation();

      engineRef.current = { type: "webgl", world, renderer, controls, cameraMode: "first" };
      setCameraMode("first");

      const canvas = renderer.renderer.domElement;

      const handleMouseDown = (e: MouseEvent) => {
        const ctrl = engineRef.current;
        if (!ctrl || ctrl.type !== "webgl") return;

        // 第一人称模式下必须锁定鼠标才能交互；第三人称模式下左键可拖拽视角，右键放置
        if (ctrl.cameraMode === "first" && !(ctrl.controls as FirstPersonControls).isLocked) {
          return;
        }

        const target = renderer.getTargetBlock();
        if (!target) return;

        if (e.button === 0) {
          world.removeBlock(target.block.x, target.block.y, target.block.z);
          rebuild();
        } else if (e.button === 2) {
          const nx = target.block.x + Math.round(target.normal.x);
          const ny = target.block.y + Math.round(target.normal.y);
          const nz = target.block.z + Math.round(target.normal.z);

          // 避免与相机/目标点重叠
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
          rebuild();
        }
      };

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("contextmenu", handleContextMenu);

      let lastTime = performance.now();
      const loop = (time: number) => {
        const engine = engineRef.current as WebGLEngine | null;
        if (!engine || engine.type !== "webgl") return;
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        engine.controls.update(delta);
        renderer.updateHighlight();
        renderer.render();

        if (engine.cameraMode === "first") {
          const cam = renderer.camera.position;
          setPosition({ x: Math.round(cam.x), y: Math.round(cam.y), z: Math.round(cam.z) });
        } else {
          const t = (engine.controls as OrbitControls).target;
          setPosition({ x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z) });
        }

        lastTime = time;
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("contextmenu", handleContextMenu);
        controls.dispose();
        renderer.destroy();
      };
    } else {
      // Canvas 2D 等距降级模式
      setRenderMode("iso");
      const renderer = new IsoRenderer(container, world);
      engineRef.current = { type: "iso", world, renderer };

      let lastTime = performance.now();
      const loop = (time: number) => {
        const engine = engineRef.current as IsoEngine | null;
        if (!engine || engine.type !== "iso") return;
        renderer.render();
        lastTime = time;
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
      const index = Number(e.key);
      if (index >= 1 && index <= PLACEABLE_BLOCKS.length) {
        setSelectedBlock(PLACEABLE_BLOCKS[index - 1]);
      }
      if (e.code === "KeyR") {
        world.generate();
        rebuild();
        const engine = engineRef.current;
        if (engine?.type === "webgl") {
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
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cleanup();
      engineRef.current = null;
    };
  }, [rebuild, toggleCameraMode]);

  const showOverlay = renderMode === "iso" || !isLocked;

  return (
    <div className="h-screen w-screen overflow-hidden bg-ink-900 relative">
      {/* 画布容器 */}
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />

      {/* 顶部导航与信息 */}
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
              左键破坏 / 右键放置
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>V 切换第三人称</span>
          </div>
        )}

        {renderMode === "webgl" && cameraMode === "orbit" && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
            <span className="flex items-center gap-1.5">
              <Move size={12} className="text-mint-400" />
              WASD 移动目标点
            </span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>空格上升 / Shift 下降</span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>拖拽旋转视角 · 滚轮缩放</span>
            <span className="w-px h-3 bg-ink-600/60" />
            <span>V 切换第一人称</span>
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
            <span className="w-px h-3 bg-ink-600/60" />
            <span>R 重新生成世界</span>
          </div>
        )}

        <div className="flex items-center gap-2 pointer-events-auto">
          {renderMode === "webgl" && (
            <button
              onClick={toggleCameraMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-200 hover:text-ember-400 hover:border-ember-500/40 transition-colors"
              title="V 键切换"
            >
              {cameraMode === "first" ? <User size={12} /> : <Video size={12} />}
              <span>{cameraMode === "first" ? "第一人称" : "第三人称"}</span>
            </button>
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

      {/* 准星（仅第一人称 3D 模式） */}
      {renderMode === "webgl" && cameraMode === "first" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/80 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/80 -translate-x-1/2" />
          </div>
        </div>
      )}

      {/* 覆盖提示层 */}
      {showOverlay && (
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

      {/* 底部快捷栏 */}
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

      {/* 移动端操作说明 */}
      <div className="sm:hidden absolute bottom-24 left-4 right-4 z-10 px-4 py-3 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-[10px] font-mono text-ink-300 space-y-1">
        {renderMode === "webgl" && cameraMode === "first" && (
          <>
            <div className="flex items-center gap-2">
              <Move size={10} className="text-mint-400" /> WASD 移动
            </div>
            <div>空格上升 · Shift 下降</div>
            <div className="flex items-center gap-2">
              <MousePointerClick size={10} className="text-ember-400" /> 左键破坏 / 右键放置
            </div>
          </>
        )}
        {renderMode === "webgl" && cameraMode === "orbit" && (
          <>
            <div className="flex items-center gap-2">
              <Move size={10} className="text-mint-400" /> WASD 移动目标点
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

// 计算相机前方不远处的一个点，用于模式切换时保持朝向
function getCameraLookPoint(camera: THREE.PerspectiveCamera) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  return camera.position.clone().add(dir.multiplyScalar(10));
}
