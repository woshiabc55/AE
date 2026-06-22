// 画布主面板 - 处理绘制、骨架、动画的所有交互

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { Point } from "@/types";

const CANVAS_DISPLAY_SIZE = 576;

export function CanvasPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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
  const addMirrorJoints = useArtworkStore((s) => s.addMirrorJoints);
  const moveJoint = useArtworkStore((s) => s.moveJoint);
  const moveJoints = useArtworkStore((s) => s.moveJoints);
  const addBone = useArtworkStore((s) => s.addBone);
  const assignCellsToBone = useArtworkStore((s) => s.assignCellsToBone);
  const setPose = useArtworkStore((s) => s.setPose);

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
  const selectedJointIds = useUIStore((s) => s.selectedJointIds);
  const selectJoint = useUIStore((s) => s.selectJoint);
  const selectBone = useUIStore((s) => s.selectBone);
  const toggleJointSelected = useUIStore((s) => s.toggleJointSelected);
  const clearSelection = useUIStore((s) => s.clearSelection);
  const selectMultipleJoints = useUIStore((s) => s.selectMultipleJoints);
  const snapToGrid = useUIStore((s) => s.snapToGrid);
  const mirrorSkeleton = useUIStore((s) => s.mirrorSkeleton);

  // 交互状态
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggingJointId, setDraggingJointId] = useState<string | null>(null);
  // 多关节拖拽时的偏移记录
  const dragOffsetsRef = useRef<Map<string, Point>>(new Map());
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [assigningBoneId, setAssigningBoneId] = useState<string | null>(null);
  const [assignStart, setAssignStart] = useState<Point | null>(null);
  const [assignEnd, setAssignEnd] = useState<Point | null>(null);
  // 框选关节
  const [selecting, setSelecting] = useState(false);
  const [selectStart, setSelectStart] = useState<Point | null>(null);
  const [selectEnd, setSelectEnd] = useState<Point | null>(null);

  const cellSize = CANVAS_DISPLAY_SIZE / gridSize;

  // 网格吸附函数：将浮点坐标对齐到网格中心
  const snapPoint = useCallback(
    (p: Point): Point => {
      if (!snapToGrid) return p;
      // 对齐到网格中心 (x.5, y.5)
      return {
        x: Math.round(p.x),
        y: Math.round(p.y),
      };
    },
    [snapToGrid],
  );

  // 原始姿态（关节定义位置）
  const originalPose = useMemo(() => getOriginalPose(joints), [joints]);

  // 变形后的格子位置
  const deformedCells = useMemo(() => {
    if (mode === "draw" || bones.length === 0) return undefined;
    return computeDeformedCells(pixels, joints, bones, originalPose, currentPose);
  }, [mode, pixels, joints, bones, originalPose, currentPose]);

  // 高亮选中骨骼的受影响格子
  const highlightedCells = useMemo(() => {
    if (!selectedBoneId) return undefined;
    const bone = bones.find((b) => b.id === selectedBoneId);
    if (!bone) return undefined;
    return new Set(bone.influencedCells);
  }, [selectedBoneId, bones]);

  // 渲染
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = CANVAS_DISPLAY_SIZE;
    canvas.height = CANVAS_DISPLAY_SIZE;

    renderCanvas(ctx, pixels, joints, bones, currentPose, {
      gridSize,
      cellSize,
      showGrid: true,
      showCenterLine: mode !== "animate" && (mirror || mirrorSkeleton),
      showSkeleton: mode !== "draw",
      selectedJointId,
      selectedBoneId,
      deformedCells,
      highlightedCells,
      selectedJointIds,
    });
  }, [
    pixels,
    joints,
    bones,
    currentPose,
    gridSize,
    cellSize,
    mode,
    mirror,
    mirrorSkeleton,
    selectedJointId,
    selectedBoneId,
    selectedJointIds,
    deformedCells,
    highlightedCells,
  ]);

  // 绘制选区覆盖（指派格子 / 框选关节）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 指派格子选区
    if (assignStart && assignEnd) {
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
    }

    // 框选关节选区
    if (selectStart && selectEnd && selecting) {
      const minX = Math.min(selectStart.x, selectEnd.x);
      const maxX = Math.max(selectStart.x, selectEnd.x);
      const minY = Math.min(selectStart.y, selectEnd.y);
      const maxY = Math.max(selectStart.y, selectEnd.y);
      ctx.fillStyle = "rgba(78,205,196,0.15)";
      ctx.strokeStyle = "#4ecdc4";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.setLineDash([]);
    }
  }, [assignStart, assignEnd, selectStart, selectEnd, selecting, cellSize]);

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

  // 屏幕坐标转画布像素坐标（用于框选）
  const toCanvasPixel = useCallback(
    (e: React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [],
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
          const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
          if (near) {
            selectJoint(near.id);
          } else {
            // 应用网格吸附
            const snapped = snapPoint(gridFloat);
            const cx = Math.max(0, Math.min(gridSize - 1, snapped.x));
            const cy = Math.max(0, Math.min(gridSize - 1, snapped.y));
            if (mirrorSkeleton) {
              const ids = addMirrorJoints(cx, cy, gridSize);
              selectJoint(ids[0]);
            } else {
              const id = addJoint(cx, cy);
              selectJoint(id);
            }
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
            // 如果有关节被多选，且点击的是其中之一，则一起拖拽
            if (selectedJointIds.length > 1 && selectedJointIds.includes(near.id)) {
              setDraggingJointId(near.id);
              dragOffsetsRef.current.clear();
              for (const jid of selectedJointIds) {
                const p = currentPose[jid] ?? { x: 0, y: 0 };
                dragOffsetsRef.current.set(jid, {
                  x: p.x - gridFloat.x,
                  y: p.y - gridFloat.y,
                });
              }
            } else {
              setDraggingJointId(near.id);
              selectJoint(near.id);
              dragOffsetsRef.current.clear();
              dragOffsetsRef.current.set(near.id, { x: 0, y: 0 });
            }
          } else {
            selectJoint(null);
          }
        } else if (rigTool === "select") {
          const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
          if (near) {
            if (e.shiftKey) {
              toggleJointSelected(near.id);
            } else if (selectedJointIds.includes(near.id) && selectedJointIds.length > 1) {
              // 已在多选中，不改变选择
            } else {
              selectJoint(near.id);
            }
          } else {
            // 开始框选
            if (!e.shiftKey) clearSelection();
            const canvasPx = toCanvasPixel(e);
            setSelecting(true);
            setSelectStart(canvasPx);
            setSelectEnd(canvasPx);
          }
        } else if (rigTool === "assign") {
          const nearBone = findNearestBone(bones, joints, currentPose, gridFloat, 0.8);
          if (nearBone) {
            selectBone(nearBone.id);
            setAssigningBoneId(nearBone.id);
            setAssignStart(grid);
            setAssignEnd(grid);
          } else {
            selectBone(null);
            setAssigningBoneId(null);
          }
        }
      } else if (mode === "animate") {
        const near = findNearestJoint(joints, currentPose, gridFloat, 0.8);
        if (near) {
          // 多选拖拽
          if (selectedJointIds.length > 1 && selectedJointIds.includes(near.id)) {
            setDraggingJointId(near.id);
            dragOffsetsRef.current.clear();
            for (const jid of selectedJointIds) {
              const p = currentPose[jid] ?? { x: 0, y: 0 };
              dragOffsetsRef.current.set(jid, {
                x: p.x - gridFloat.x,
                y: p.y - gridFloat.y,
              });
            }
          } else {
            setDraggingJointId(near.id);
            selectJoint(near.id);
            dragOffsetsRef.current.clear();
            dragOffsetsRef.current.set(near.id, { x: 0, y: 0 });
          }
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
      toCanvasPixel,
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
      addMirrorJoints,
      mirrorSkeleton,
      snapPoint,
      gridSize,
      connectFromId,
      addBone,
      selectedJointIds,
      toggleJointSelected,
      clearSelection,
      selectBone,
      bones,
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
        // 应用网格吸附
        const snapped = snapPoint(gridFloat);
        const cx = Math.max(0, Math.min(gridSize - 1, snapped.x));
        const cy = Math.max(0, Math.min(gridSize - 1, snapped.y));

        if (dragOffsetsRef.current.size > 1) {
          // 多关节拖拽
          const updates: Record<string, { x: number; y: number }> = {};
          for (const [jid, offset] of dragOffsetsRef.current.entries()) {
            let nx = gridFloat.x + offset.x;
            let ny = gridFloat.y + offset.y;
            if (snapToGrid) {
              nx = Math.round(nx);
              ny = Math.round(ny);
            }
            nx = Math.max(0, Math.min(gridSize - 1, nx));
            ny = Math.max(0, Math.min(gridSize - 1, ny));
            updates[jid] = { x: nx, y: ny };
          }
          if (mode === "rig") {
            moveJoints(updates);
          } else if (mode === "animate") {
            const newPose = { ...currentPose };
            for (const [jid, pos] of Object.entries(updates)) newPose[jid] = pos;
            setPose(newPose);
          }
        } else {
          // 单关节拖拽
          if (mode === "rig") {
            moveJoint(draggingJointId, cx, cy);
          } else if (mode === "animate") {
            setPose({ ...currentPose, [draggingJointId]: { x: cx, y: cy } });
          }
        }
      } else if (assigningBoneId && assignStart) {
        setAssignEnd(grid);
      } else if (selecting) {
        const canvasPx = toCanvasPixel(e);
        setSelectEnd(canvasPx);
      }
    },
    [
      mode,
      isDrawing,
      tool,
      draggingJointId,
      assigningBoneId,
      assignStart,
      selecting,
      toGrid,
      toGridFloat,
      toCanvasPixel,
      paintBrush,
      gridSize,
      snapPoint,
      snapToGrid,
      moveJoint,
      moveJoints,
      setPose,
      currentPose,
    ],
  );

  // 鼠标抬起
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setDraggingJointId(null);
    dragOffsetsRef.current.clear();

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

    // 完成框选
    if (selecting && selectStart && selectEnd) {
      const minX = Math.min(selectStart.x, selectEnd.x);
      const maxX = Math.max(selectStart.x, selectEnd.x);
      const minY = Math.min(selectStart.y, selectEnd.y);
      const maxY = Math.max(selectStart.y, selectEnd.y);
      const hitIds: string[] = [];
      for (const joint of joints) {
        const p = currentPose[joint.id] ?? { x: joint.x, y: joint.y };
        const px = p.x * cellSize + cellSize / 2;
        const py = p.y * cellSize + cellSize / 2;
        if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
          hitIds.push(joint.id);
        }
      }
      if (hitIds.length > 0) {
        if (useUIStore.getState().selectedJointIds.length > 0) {
          // 合并到现有选择
          const existing = new Set(useUIStore.getState().selectedJointIds);
          for (const id of hitIds) existing.add(id);
          selectMultipleJoints(Array.from(existing));
        } else {
          selectMultipleJoints(hitIds);
        }
      }
    }
    setSelecting(false);
    setSelectStart(null);
    setSelectEnd(null);
  }, [
    assigningBoneId,
    assignStart,
    assignEnd,
    pixels,
    assignCellsToBone,
    selecting,
    selectStart,
    selectEnd,
    joints,
    currentPose,
    cellSize,
    selectMultipleJoints,
  ]);

  // 鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setDraggingJointId(null);
    dragOffsetsRef.current.clear();
  }, []);

  // 光标样式
  const cursor = useMemo(() => {
    if (mode === "draw") {
      return "crosshair";
    }
    if (mode === "rig") {
      if (rigTool === "move") return "grab";
      if (rigTool === "select") return "default";
      if (rigTool === "assign") return "pointer";
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
          {snapToGrid && mode !== "draw" && (
            <span className="font-mono text-[9px] text-mint-400 bg-mint-500/10 px-1.5 py-0.5 rounded border border-mint-500/30">
              SNAP
            </span>
          )}
        </div>
        <div className="absolute -top-7 right-0 font-mono text-[10px] text-ink-300">
          {gridSize}×{gridSize}
          {selectedJointIds.length > 0 && (
            <span className="ml-2 text-mint-400">· {selectedJointIds.length} 选中</span>
          )}
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="border-2 border-ink-600 rounded-lg shadow-panel bg-ink-900"
          style={{
            width: CANVAS_DISPLAY_SIZE,
            height: CANVAS_DISPLAY_SIZE,
            cursor,
            imageRendering: "pixelated",
          }}
        />

        {/* 模式提示 */}
        <div className="absolute -bottom-7 left-0 right-0 flex items-center justify-between text-[10px] font-mono text-ink-300">
          <span>
            {mode === "draw" && `绘制模式 · ${tool === "brush" ? "画笔" : tool === "eraser" ? "橡皮" : tool === "fill" ? "填充" : "吸管"}`}
            {mode === "rig" && `骨架模式 · ${rigTool === "add" ? "添加关节" : rigTool === "connect" ? "连接骨骼" : rigTool === "move" ? "移动关节" : rigTool === "select" ? "选择点位" : "指派格子"}`}
            {mode === "animate" && "动画模式 · 拖拽关节摆姿势"}
          </span>
          {connectFromId && (
            <span className="text-sun-500">已选起点关节，点击终点关节完成连接</span>
          )}
          {rigTool === "select" && (
            <span className="text-mint-400">Shift 多选 · 拖拽框选</span>
          )}
        </div>
      </div>
    </div>
  );
}
