// 画布主面板 - 处理绘制、骨架、动画的所有交互

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useToolStore } from "@/store/useToolStore";
import { useUIStore } from "@/store/useUIStore";
import { renderCanvas } from "@/engine/renderer";
import {
  computeDeformedCells,
  findNearestBone,
  findNearestJoint,
  getOriginalPose,
} from "@/engine/skeleton";
import { cellKey } from "@/engine/gridUtils";
import { computeStretchDeform } from "@/engine/stretchDeform";
import type { Point } from "@/types";

const MIN_CANVAS_SIZE = 320;
const MAX_CANVAS_SIZE = 1024;

export const CanvasPanel = memo(function CanvasPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(576);

  // 作品状态
  const gridSize = useArtworkStore((s) => s.gridSize);
  const pixels = useArtworkStore((s) => s.pixels);
  const joints = useArtworkStore((s) => s.skeleton.joints);
  const bones = useArtworkStore((s) => s.skeleton.bones);
  const currentPose = useArtworkStore((s) => s.currentPose);
  const paintCell = useArtworkStore((s) => s.paintCell);
  const eraseCell = useArtworkStore((s) => s.eraseCell);
  const fillArea = useArtworkStore((s) => s.fillArea);
  const addJoint = useArtworkStore((s) => s.addJoint);
  const moveJoint = useArtworkStore((s) => s.moveJoint);
  const addBone = useArtworkStore((s) => s.addBone);
  const assignCellsToBone = useArtworkStore((s) => s.assignCellsToBone);
  const setPose = useArtworkStore((s) => s.setPose);
  const pushHistory = useArtworkStore((s) => s.pushHistory);
  const stretchRegions = useArtworkStore((s) => s.stretchRegions);
  const addStretchRegion = useArtworkStore((s) => s.addStretchRegion);
  const transformStretchRegion = useArtworkStore((s) => s.transformStretchRegion);

  // 工具状态
  const tool = useToolStore((s) => s.tool);
  const color = useToolStore((s) => s.color);
  const brushSize = useToolStore((s) => s.brushSize);
  const mirror = useToolStore((s) => s.mirror);
  const setColor = useToolStore((s) => s.setColor);

  // UI 状态
  const mode = useUIStore((s) => s.mode);
  const rigTool = useUIStore((s) => s.rigTool);
  const selectedJointId = useUIStore((s) => s.selectedJointId);
  const selectedBoneId = useUIStore((s) => s.selectedBoneId);
  const selectJoint = useUIStore((s) => s.selectJoint);
  const selectBone = useUIStore((s) => s.selectBone);

  // 交互状态
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggingJointId, setDraggingJointId] = useState<string | null>(null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [assigningBoneId, setAssigningBoneId] = useState<string | null>(null);
  const [assignStart, setAssignStart] = useState<Point | null>(null);
  const [assignEnd, setAssignEnd] = useState<Point | null>(null);
  // 拉伸区域交互
  const [stretchCorner1, setStretchCorner1] = useState<Point | null>(null);
  const [draggingStretchId, setDraggingStretchId] = useState<string | null>(null);

  const cellSize = canvasSize / gridSize;

  // 画布响应式缩放：监听容器尺寸变化
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      const padding = 48; // p-6 = 24px * 2
      const available = Math.min(rect.width - padding, rect.height - padding);
      // 对齐到 gridSize 的倍数，保证格子像素完美
      const size = Math.max(MIN_CANVAS_SIZE, Math.min(MAX_CANVAS_SIZE, Math.floor(available / gridSize) * gridSize));
      setCanvasSize(size);
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [gridSize]);

  // 原始姿态（关节定义位置）
  const originalPose = useMemo(() => getOriginalPose(joints), [joints]);

  // 变形后的格子位置（骨骼 + 拉伸区域）
  const deformedCells = useMemo(() => {
    const result = new Map<string, Point>();
    // 骨骼变形
    if (mode !== "draw" && bones.length > 0) {
      const boneDeforms = computeDeformedCells(pixels, joints, bones, originalPose, currentPose);
      for (const [key, pt] of boneDeforms) result.set(key, pt);
    }
    // 拉伸区域变形
    if (mode === "rig" && stretchRegions.length > 0) {
      for (const region of stretchRegions) {
        if (region.offset.x === 0 && region.offset.y === 0 && region.scale.x === 1 && region.scale.y === 1) continue;
        for (const key in pixels) {
          const pt = computeStretchDeform(key, region);
          if (pt) result.set(key, pt);
        }
      }
    }
    return result.size > 0 ? result : undefined;
  }, [mode, pixels, joints, bones, originalPose, currentPose, stretchRegions]);

  // 高亮选中骨骼的受影响格子
  const highlightedCells = useMemo(() => {
    if (!selectedBoneId) return undefined;
    const bone = bones.find((b) => b.id === selectedBoneId);
    if (!bone) return undefined;
    return new Set(bone.influencedCells);
  }, [selectedBoneId, bones]);

  // 渲染 — 使用 rAF 批处理，减少高频更新时的重复绘制
  const rafIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      renderCanvas(ctx, pixels, joints, bones, currentPose, {
        gridSize,
        cellSize,
        showGrid: true,
        showCenterLine: mode === "draw" && mirror,
        showSkeleton: mode !== "draw",
        selectedJointId,
        selectedBoneId,
        selectedStretchId: draggingStretchId,
        deformedCells,
        highlightedCells,
        stretchRegions: mode === "rig" ? stretchRegions : undefined,
      });
    });
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [
    pixels,
    joints,
    bones,
    currentPose,
    canvasSize,
    cellSize,
    mode,
    mirror,
    selectedJointId,
    selectedBoneId,
    deformedCells,
    highlightedCells,
    stretchRegions,
    draggingStretchId,
  ]);

  // 绘制选区覆盖（指派格子时）
  useEffect(() => {
    if (!assignStart || !assignEnd) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const minX = Math.min(assignStart.x, assignEnd.x);
    const maxX = Math.max(assignStart.x, assignEnd.x);
    const minY = Math.min(assignStart.y, assignEnd.y);
    const maxY = Math.max(assignStart.y, assignEnd.y);
    ctx.fillStyle = "rgba(255,210,63,0.2)";
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2;
    ctx.fillRect(
      minX * cellSize,
      minY * cellSize,
      (maxX - minX + 1) * cellSize,
      (maxY - minY + 1) * cellSize,
    );
    ctx.strokeRect(
      minX * cellSize,
      minY * cellSize,
      (maxX - minX + 1) * cellSize,
      (maxY - minY + 1) * cellSize,
    );
  }, [assignStart, assignEnd, cellSize]);

  // 屏幕坐标转网格坐标
  const toGrid = useCallback(
    (e: React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;
      return {
        x: Math.floor(px / cellSize),
        y: Math.floor(py / cellSize),
      };
    },
    [cellSize],
  );

  // 浮点网格坐标（用于关节拖拽）
  const toGridFloat = useCallback(
    (e: React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;
      return {
        x: px / cellSize - 0.5,
        y: py / cellSize - 0.5,
      };
    },
    [cellSize],
  );

  // 绘制：画笔涂抹
  const paintBrush = useCallback(
    (gx: number, gy: number) => {
      const half = Math.floor(brushSize / 2);
      for (let dy = 0; dy < brushSize; dy++) {
        for (let dx = 0; dx < brushSize; dx++) {
          const x = gx + dx - half;
          const y = gy + dy - half;
          if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
          if (tool === "brush") paintCell(x, y, color, mirror);
          else if (tool === "eraser") eraseCell(x, y, mirror);
        }
      }
    },
    [brushSize, gridSize, tool, color, mirror, paintCell, eraseCell],
  );

  // 鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      pushHistory();
      const grid = toGrid(e);
      const gridFloat = toGridFloat(e);

      if (mode === "draw") {
        if (tool === "fill") {
          fillArea(grid.x, grid.y, color, mirror);
          return;
        }
        if (tool === "picker") {
          const c = pixels[cellKey(grid.x, grid.y)];
          if (c) setColor(c);
          return;
        }
        setIsDrawing(true);
        paintBrush(grid.x, grid.y);
      } else if (mode === "rig") {
        if (rigTool === "add") {
          // 点击空白处添加关节；点击已有关节则选中
          const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
          if (near) {
            selectJoint(near.id);
          } else {
            const id = addJoint(gridFloat.x, gridFloat.y);
            selectJoint(id);
          }
        } else if (rigTool === "connect") {
          const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
          if (near) {
            if (!connectFromId) {
              setConnectFromId(near.id);
              selectJoint(near.id);
            } else {
              if (connectFromId !== near.id) {
                addBone(connectFromId, near.id);
              }
              setConnectFromId(null);
              selectJoint(near.id);
            }
          }
        } else if (rigTool === "move") {
          const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
          if (near) {
            setDraggingJointId(near.id);
            selectJoint(near.id);
          } else {
            selectJoint(null);
          }
        } else if (rigTool === "assign") {
          // 点击骨骼选中，然后拖拽选区指派格子
          const nearBone = findNearestBone(joints.length ? bones : [], joints, currentPose, gridFloat, 0.8);
          if (nearBone) {
            selectBone(nearBone.id);
            setAssigningBoneId(nearBone.id);
            setAssignStart(grid);
            setAssignEnd(grid);
          } else {
            selectBone(null);
            setAssigningBoneId(null);
          }
        } else if (rigTool === "stretch") {
          // 点击两个角点确定拉伸区域，或拖拽已有区域角点
          setConnectFromId(null);
          if (!stretchCorner1) {
            setStretchCorner1(grid);
          } else {
            // 第二个角点 → 创建拉伸区域
            const id = addStretchRegion(stretchCorner1, grid);
            setStretchCorner1(null);
            setDraggingStretchId(id);
          }
        }
      } else if (mode === "animate") {
        // 拖拽关节改变姿态
        const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
        if (near) {
          setDraggingJointId(near.id);
          selectJoint(near.id);
        } else {
          selectJoint(null);
        }
      }
    },
    [
      mode,
      tool,
      rigTool,
      toGrid,
      toGridFloat,
      fillArea,
      color,
      mirror,
      pixels,
      setColor,
      paintBrush,
      joints,
      currentPose,
      selectJoint,
      addJoint,
      connectFromId,
      addBone,
      selectBone,
      bones,
      stretchCorner1,
      addStretchRegion,
      setDraggingStretchId,
      pushHistory,
    ],
  );

  // 鼠标移动
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const grid = toGrid(e);
      const gridFloat = toGridFloat(e);

      if (mode === "draw" && isDrawing) {
        if (tool === "brush" || tool === "eraser") {
          paintBrush(grid.x, grid.y);
        }
      } else if (draggingJointId) {
        const cx = Math.max(0, Math.min(gridSize - 1, gridFloat.x));
        const cy = Math.max(0, Math.min(gridSize - 1, gridFloat.y));
        if (mode === "rig") {
          moveJoint(draggingJointId, cx, cy);
        } else if (mode === "animate") {
          setPose({ ...currentPose, [draggingJointId]: { x: cx, y: cy } });
        }
      } else if (assigningBoneId && assignStart) {
        setAssignEnd(grid);
      } else if (draggingStretchId) {
        const region = stretchRegions.find((r) => r.id === draggingStretchId);
        if (region) {
          const minX = Math.min(region.corner1.x, region.corner2.x);
          const minY = Math.min(region.corner1.y, region.corner2.y);
          const offset = { x: gridFloat.x - minX, y: gridFloat.y - minY };
          const scale = { x: 1, y: 1 };
          transformStretchRegion(draggingStretchId, offset, scale);
        }
      }
    },
    [
      mode,
      isDrawing,
      tool,
      draggingJointId,
      assigningBoneId,
      assignStart,
      toGrid,
      toGridFloat,
      paintBrush,
      gridSize,
      moveJoint,
      setPose,
      currentPose,
      draggingStretchId,
      stretchRegions,
      transformStretchRegion,
    ],
  );

  // 鼠标抬起
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setDraggingJointId(null);
    setDraggingStretchId(null);
    // 完成指派
    if (assigningBoneId && assignStart && assignEnd) {
      const minX = Math.min(assignStart.x, assignEnd.x);
      const maxX = Math.max(assignStart.x, assignEnd.x);
      const minY = Math.min(assignStart.y, assignEnd.y);
      const maxY = Math.max(assignStart.y, assignEnd.y);
      const keys: string[] = [];
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const k = cellKey(x, y);
          if (pixels[k]) keys.push(k);
        }
      }
      if (keys.length > 0) {
        assignCellsToBone(assigningBoneId, keys);
      }
    }
    setAssigningBoneId(null);
    setAssignStart(null);
    setAssignEnd(null);
  }, [assigningBoneId, assignStart, assignEnd, pixels, assignCellsToBone]);

  // 鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setDraggingJointId(null);
  }, []);

  // 光标样式
  const cursor = useMemo(() => {
    if (mode === "draw") {
      return tool === "picker" ? "crosshair" : "crosshair";
    }
    if (mode === "rig") {
      if (rigTool === "move" || rigTool === "assign") return "pointer";
      if (rigTool === "stretch") return "crosshair";
      return "crosshair";
    }
    return "grab";
  }, [mode, tool, rigTool]);

  return (
    <div
      ref={wrapRef}
      className="flex-1 flex items-center justify-center p-6 min-h-0 bg-ink-900 bg-bead-grid relative overflow-hidden"
    >
      {/* 装饰光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ember-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* 角标 */}
        <div className="absolute -top-7 left-0 flex items-center gap-2">
          <span className="font-pixel text-[9px] text-ember-400 text-glow-ember">
            PERLER BEAD STUDIO
          </span>
        </div>
        <div className="absolute -top-7 right-0 font-mono text-[10px] text-ink-300">
          {gridSize}×{gridSize}
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="border-2 border-ink-600 rounded-lg shadow-panel bg-ink-900"
          style={{
            width: canvasSize,
            height: canvasSize,
            cursor,
            imageRendering: "pixelated",
          }}
        />

        {/* 模式提示 */}
        <div className="absolute -bottom-7 left-0 right-0 flex items-center justify-between text-[10px] font-mono text-ink-300">
          <span>
            {mode === "draw" && `绘制模式 · ${tool === "brush" ? "画笔" : tool === "eraser" ? "橡皮" : tool === "fill" ? "填充" : "吸管"}`}
            {mode === "rig" && `骨架模式 · ${rigTool === "add" ? "添加关节" : rigTool === "connect" ? "连接骨骼" : rigTool === "move" ? "移动关节" : rigTool === "assign" ? "指派格子" : "拉伸区域"}`}
            {mode === "animate" && "动画模式 · 拖拽关节摆姿势"}
          </span>
          {connectFromId && (
            <span className="text-sun-500">已选起点关节，点击终点关节完成连接</span>
          )}
        </div>
      </div>
    </div>
  );
});
