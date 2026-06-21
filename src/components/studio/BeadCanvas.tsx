import { useEffect, useRef, useCallback, useState } from "react";
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
import type { Pose } from "@/types";

interface Props {
  cellSize?: number;
}

export default function BeadCanvas({ cellSize = 22 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"paint" | "joint" | null>(null);
  const lastPaintRef = useRef<string>("");

  const {
    gridSize,
    palette,
    modules,
    skeleton,
    keyframes,
    tool,
    selectedJointId,
    currentFrame,
    showGrid,
    showHalfDivider,
    showSkeleton,
    isPlaying,
    paintBead,
    eraseBead,
    fillArea,
    pickColor,
    addJoint,
    selectJoint,
    dragJoint,
    connectJoints,
  } = useStudioStore();

  // 播放时的实时 poses
  const [playPoses, setPlayPoses] = useState<Pose[] | null>(null);

  // 播放循环
  useEffect(() => {
    if (!isPlaying || keyframes.length === 0) {
      setPlayPoses(null);
      return;
    }
    const fps = useStudioStore.getState().fps;
    const length = useStudioStore.getState().animLength;
    const loop = useStudioStore.getState().loop;
    let raf = 0;
    let start = performance.now();
    let lastFrame = -1;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      let frame = elapsed * fps;
      if (frame >= length) {
        if (loop) {
          frame = frame % length;
          start = now - (frame / fps) * 1000;
        } else {
          frame = length;
        }
      }
      const f = Math.floor(frame);
      if (f !== lastFrame) {
        lastFrame = f;
        const poses = interpolateFrame(keyframes, f, "linear");
        setPlayPoses(poses);
      }
      if (loop || frame < length) {
        raf = requestAnimationFrame(tick);
      } else {
        useStudioStore.getState().setPlaying(false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, keyframes, currentFrame]);

  // 渲染
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = gridSize * cellSize;
    canvas.width = size;
    canvas.height = size;

    // 合并两个半面的 beads
    const allBeads = modules.flatMap((m) => m.beads);

    // 计算当前帧的 poses
    const poses = playPoses ?? interpolateFrame(keyframes, currentFrame, "linear");
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
      showGrid,
      showHalfDivider,
      gridSize,
      jointOffsets,
      beadInfluences,
    };
    renderBeads(ctx, allBeads, opts);

    // 骨架叠加层
    if (showSkeleton && skeleton && skeleton.joints.length > 0) {
      const poseOffsets: Record<string, { x: number; y: number }> = {};
      for (const j of skeleton.joints) {
        const p = poses.find((pp) => pp.joint === j.id);
        poseOffsets[j.id] = { x: p?.x ?? j.x, y: p?.y ?? j.y };
      }
      renderSkeleton(
        ctx,
        skeleton.joints,
        skeleton.bones,
        cellSize,
        selectedJointId,
        poseOffsets,
      );
    }
  }, [
    gridSize,
    cellSize,
    palette,
    modules,
    skeleton,
    keyframes,
    currentFrame,
    showGrid,
    showHalfDivider,
    showSkeleton,
    selectedJointId,
    playPoses,
  ]);

  useEffect(() => {
    render();
  }, [render]);

  // 坐标转换
  const getCell = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * gridSize);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * gridSize);
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return null;
    return { x, y };
  };

  // 查找点击的关节
  const findJointAt = (cx: number, cy: number): string | null => {
    if (!skeleton) return null;
    const poses = interpolateFrame(keyframes, currentFrame, "linear");
    const radius = 1.2;
    for (const j of skeleton.joints) {
      const p = poses.find((pp) => pp.joint === j.id);
      const jx = p?.x ?? j.x;
      const jy = p?.y ?? j.y;
      if (Math.abs(jx - cx) <= radius && Math.abs(jy - cy) <= radius) {
        return j.id;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const cell = getCell(e);
    if (!cell) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    lastPaintRef.current = "";

    if (tool === "skeleton") {
      const hit = findJointAt(cell.x, cell.y);
      if (hit) {
        selectJoint(hit);
        setDragMode("joint");
        setIsDragging(true);
      } else {
        // 添加新关节
        addJoint(cell.x + 0.5, cell.y + 0.5, selectedJointId);
        setDragMode(null);
      }
      return;
    }

    if (tool === "select") {
      const hit = findJointAt(cell.x, cell.y);
      if (hit) {
        selectJoint(hit);
        setDragMode("joint");
        setIsDragging(true);
      }
      return;
    }

    // 绘制类工具
    setDragMode("paint");
    setIsDragging(true);
    applyTool(cell.x, cell.y);
  };

  const applyTool = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (key === lastPaintRef.current) return;
    lastPaintRef.current = key;
    if (tool === "brush") paintBead(x, y);
    else if (tool === "eraser") eraseBead(x, y);
    else if (tool === "fill") fillArea(x, y);
    else if (tool === "picker") pickColor(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const cell = getCell(e);
    if (!cell) return;
    if (dragMode === "paint") {
      applyTool(cell.x, cell.y);
    } else if (dragMode === "joint" && selectedJointId) {
      dragJoint(selectedJointId, cell.x + 0.5, cell.y + 0.5);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragMode(null);
    lastPaintRef.current = "";
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (tool !== "skeleton") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * gridSize);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * gridSize);
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (!skeleton) return;
    const hit = findJointAt(x, y);
    if (hit && selectedJointId && hit !== selectedJointId) {
      connectJoints(selectedJointId, hit);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* 装饰边框 */}
      <div className="absolute -inset-3 rounded-bead border border-ink-600 bg-ink-900/40" />
      <div className="absolute -inset-1 rounded-bead border-2 border-volt/30" />
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        className="relative cursor-crosshair touch-none rounded-bead shadow-2xl"
        style={{ imageRendering: "pixelated" }}
      />
      {/* 角标 */}
      <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-coral shadow-glow-coral" />
      <div className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-mint shadow-glow" />
      <div className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-volt" />
      <div className="absolute -bottom-2 -right-2 h-3 w-3 rounded-full bg-aqua" />
    </div>
  );
}
