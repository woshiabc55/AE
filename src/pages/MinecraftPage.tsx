// 我的世界还原体验页

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MousePointerClick, Move, Box, Trash2 } from "lucide-react";
import { VoxelWorld, PLACEABLE_BLOCKS, BlockType, BLOCK_DEFS } from "@/engine/minecraft/VoxelWorld";
import { VoxelRenderer } from "@/engine/minecraft/VoxelRenderer";
import { FirstPersonControls } from "@/engine/minecraft/FirstPersonControls";

export default function MinecraftPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<{
    world: VoxelWorld;
    renderer: VoxelRenderer;
    controls: FirstPersonControls;
    raf: number;
    lastTime: number;
  } | null>(null);

  const [selectedBlock, setSelectedBlock] = useState<BlockType>("grass");
  const selectedBlockRef = useRef<BlockType>("grass");
  selectedBlockRef.current = selectedBlock;

  const [isLocked, setIsLocked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [blockCount, setBlockCount] = useState(0);

  const rebuild = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.renderer.rebuildMesh();
    setBlockCount(engine.world.blocks.size);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const world = new VoxelWorld();
    const renderer = new VoxelRenderer(containerRef.current, world);
    const controls = new FirstPersonControls(renderer.camera, renderer.renderer.domElement, world);

    controls.onLockChange = (locked) => setIsLocked(locked);

    // 左键破坏 / 右键放置
    const canvas = renderer.renderer.domElement;
    const handleMouseDown = (e: MouseEvent) => {
      if (!controls.isLocked) return;

      const target = renderer.getTargetBlock();
      if (!target) return;

      if (e.button === 0) {
        // 破坏
        world.removeBlock(target.block.x, target.block.y, target.block.z);
        rebuild();
      } else if (e.button === 2) {
        // 放置
        const nx = target.block.x + Math.round(target.normal.x);
        const ny = target.block.y + Math.round(target.normal.y);
        const nz = target.block.z + Math.round(target.normal.z);

        // 避免与相机位置重叠
        const cx = Math.round(renderer.camera.position.x);
        const cy = Math.round(renderer.camera.position.y);
        const cz = Math.round(renderer.camera.position.z);
        if (nx === cx && ny === cy && nz === cz) return;

        world.setBlock(nx, ny, nz, selectedBlockRef.current);
        rebuild();
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      const index = Number(e.key);
      if (index >= 1 && index <= PLACEABLE_BLOCKS.length) {
        setSelectedBlock(PLACEABLE_BLOCKS[index - 1]);
      }
      if (e.code === "KeyR") {
        world.generate();
        renderer.camera.position.set(0, 12, 18);
        renderer.camera.lookAt(0, 0, 0);
        controls.yaw = 0;
        controls.pitch = 0;
        controls.updateCameraRotation();
        rebuild();
      }
    };

    const handleResize = () => renderer.resize();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    engineRef.current = { world, renderer, controls, raf: 0, lastTime: performance.now() };

    const loop = (time: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      const delta = Math.min((time - engine.lastTime) / 1000, 0.1);
      controls.update(delta);
      renderer.updateHighlight();
      renderer.render();

      setPosition({
        x: Math.round(renderer.camera.position.x),
        y: Math.round(renderer.camera.position.y),
        z: Math.round(renderer.camera.position.z),
      });

      engine.lastTime = time;
      engine.raf = requestAnimationFrame(loop);
    };
    setBlockCount(world.blocks.size);

    const raf = requestAnimationFrame(loop);
    engineRef.current.raf = raf;

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.destroy();
    };
  }, [rebuild]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-ink-900 relative">
      {/* 3D 画布容器 */}
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
          <span>R 重新生成世界</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-xs font-mono text-ink-300">
          <Box size={12} className="text-sun-400" />
          <span>方块: {blockCount}</span>
          <span className="w-px h-3 bg-ink-600/60" />
          <span>
            X:{position.x} Y:{position.y} Z:{position.z}
          </span>
        </div>
      </div>

      {/* 准星 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/80 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/80 -translate-x-1/2" />
        </div>
      </div>

      {/* 未锁定提示 */}
      {!isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="font-pixel text-2xl text-ember-400 text-glow-ember">MINECRAFT 3D</div>
            <div className="text-sm font-mono text-ink-200">点击画面开始探索方块世界</div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-400">
              <span className="px-2 py-1 rounded bg-ink-800 border border-ink-600/60">ESC</span>
              <span>释放鼠标</span>
            </div>
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

      {/* 操作说明（移动端） */}
      <div className="sm:hidden absolute bottom-24 left-4 right-4 z-10 px-4 py-3 rounded-lg bg-ink-800/80 backdrop-blur border border-ink-600/60 text-[10px] font-mono text-ink-300 space-y-1">
        <div className="flex items-center gap-2">
          <Move size={10} className="text-mint-400" /> WASD 移动
        </div>
        <div>空格上升 · Shift 下降</div>
        <div className="flex items-center gap-2">
          <MousePointerClick size={10} className="text-ember-400" /> 左键破坏 / 右键放置
        </div>
        <div className="flex items-center gap-2">
          <Trash2 size={10} className="text-ink-400" /> R 重新生成世界
        </div>
      </div>
    </div>
  );
}
