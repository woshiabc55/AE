import { useEffect, useRef, useState } from "react";
import { useStudioStore } from "@/stores/studioStore";
import {
  renderBeads,
  renderSkeleton,
  type RenderOptions,
} from "@/engine/beadRenderer";
import {
  computeBeadInfluences,
  computeJointOffsets,
} from "@/engine/skeletonEngine";
import { interpolateFrame } from "@/engine/animationEngine";
import { Play, Pause, Square } from "lucide-react";

interface Props {
  cellSize?: number;
}

export default function AnimationPreview({ cellSize = 20 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const rafRef = useRef(0);

  const gridSize = useStudioStore((s) => s.gridSize);
  const palette = useStudioStore((s) => s.palette);
  const modules = useStudioStore((s) => s.modules);
  const skeleton = useStudioStore((s) => s.skeleton);
  const keyframes = useStudioStore((s) => s.keyframes);
  const fps = useStudioStore((s) => s.fps);
  const animLength = useStudioStore((s) => s.animLength);
  const loop = useStudioStore((s) => s.loop);

  const allBeads = modules.flatMap((m) => m.beads);

  const render = (currentFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = gridSize * cellSize;
    canvas.width = size;
    canvas.height = size;

    const poses = interpolateFrame(keyframes, currentFrame, "linear");
    const jointOffsets = skeleton
      ? computeJointOffsets(skeleton.joints, poses)
      : {};
    const beadInfluences =
      skeleton && skeleton.joints.length > 0
        ? computeBeadInfluences(allBeads, skeleton.joints)
        : new Map<string, { joint: string; weight: number }[]>();

    const opts: RenderOptions = {
      cellSize,
      palette,
      showGrid: false,
      showHalfDivider: false,
      gridSize,
      jointOffsets,
      beadInfluences,
    };
    renderBeads(ctx, allBeads, opts);

    if (skeleton && skeleton.joints.length > 0) {
      const poseOffsets: Record<string, { x: number; y: number }> = {};
      for (const j of skeleton.joints) {
        const p = poses.find((pp) => pp.joint === j.id);
        poseOffsets[j.id] = { x: p?.x ?? j.x, y: p?.y ?? j.y };
      }
      renderSkeleton(ctx, skeleton.joints, skeleton.bones, cellSize, null, poseOffsets);
    }
  };

  // 播放循环
  useEffect(() => {
    if (!playing || keyframes.length < 2) return;
    let start = performance.now();
    let lastFrame = -1;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      let f = elapsed * fps;
      if (f >= animLength) {
        if (loop) {
          f = f % animLength;
          start = now - (f / fps) * 1000;
        } else {
          f = animLength;
          setPlaying(false);
        }
      }
      const fi = Math.floor(f);
      if (fi !== lastFrame) {
        lastFrame = fi;
        setFrame(fi);
        render(fi);
      }
      if (loop || f < animLength) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, keyframes, fps, animLength, loop]);

  // 初始渲染
  useEffect(() => {
    render(frame);
  }, [modules, skeleton, keyframes, gridSize, palette, cellSize, frame]);

  return (
    <div className="panel flex flex-col items-center p-4">
      <h3 className="title-pixel mb-3 self-start">ANIMATION PREVIEW</h3>
      <div className="relative">
        <div className="absolute -inset-2 rounded-bead border-2 border-volt/30" />
        <canvas
          ref={canvasRef}
          className="relative rounded-bead"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => {
            setFrame(0);
            render(0);
          }}
          className="tool-btn h-7 w-7"
          title="停止"
        >
          <Square className="h-3 w-3" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          disabled={keyframes.length < 2}
          className="btn-bead btn-bead-primary h-7 w-7 p-0"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <input
          type="range"
          min={0}
          max={animLength}
          value={frame}
          onChange={(e) => {
            const f = Number(e.target.value);
            setFrame(f);
            setPlaying(false);
            render(f);
          }}
          className="w-40 accent-volt"
        />
        <span className="font-mono text-[10px] text-ink-400">
          {frame}/{animLength}
        </span>
      </div>
      {keyframes.length < 2 && (
        <p className="mt-2 font-mono text-[10px] text-coral">
          需要至少 2 个关键帧才能播放动画
        </p>
      )}
    </div>
  );
}
