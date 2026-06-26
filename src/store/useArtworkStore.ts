// 作品状态管理

import { create } from "zustand";
import type {
  ArtworkRecord,
  Bone,
  Joint,
  JointPositions,
  Keyframe,
  OffsetKeyframe,
  Part,
  PixelCell,
  Shape,
  ShapeType,
  SkeletonData,
  Transform2D,
} from "@/types";
import { uuid } from "@/utils/colors";
import {
  cellKey,
  cellsToRecord,
  floodFill,
  mirrorX,
  newArtworkId,
  recordToCells,
} from "@/engine/gridUtils";
import { newKeyframeId } from "@/engine/animation";
import { createPart, createShape, DEFAULT_TRANSFORM } from "@/engine/shapeUtils";

const DEFAULT_GRID_SIZE = 32;

function emptySkeleton(): SkeletonData {
  return { joints: [], bones: [] };
}

function defaultPose(joints: Joint[]): JointPositions {
  const pose: JointPositions = {};
  for (const j of joints) pose[j.id] = { x: j.x, y: j.y };
  return pose;
}

interface ArtworkState {
  // 作品元数据
  id: string;
  name: string;
  gridSize: number;
  // 拼豆数据：键 "x,y" -> 颜色
  pixels: Record<string, string>;
  // 骨架
  skeleton: SkeletonData;
  // 关键帧
  keyframes: Keyframe[];
  // 当前姿态（关节位置）—— 用于动画播放与拖拽
  currentPose: JointPositions;
  // 图形与部件
  shapes: Shape[];
  parts: Part[];
  // 是否有未保存修改
  dirty: boolean;

  // === 绘制动作 ===
  paintCell: (x: number, y: number, color: string, mirror: boolean) => void;
  eraseCell: (x: number, y: number, mirror: boolean) => void;
  fillArea: (x: number, y: number, color: string, mirror: boolean) => void;
  clearGrid: () => void;
  setGridSize: (size: number) => void;
  setName: (name: string) => void;

  // === 骨架动作 ===
  addJoint: (x: number, y: number, name?: string) => string;
  addMirrorJoints: (x: number, y: number, gridSize: number, name?: string) => string[];
  removeJoint: (id: string) => void;
  moveJoint: (id: string, x: number, y: number) => void;
  moveJoints: (updates: Record<string, { x: number; y: number }>) => void;
  addBone: (fromId: string, toId: string) => string | null;
  removeBone: (id: string) => void;
  assignCellsToBone: (boneId: string, cellKeys: string[]) => void;
  clearSkeleton: () => void;

  // === 姿态动作 ===
  setPose: (pose: JointPositions) => void;
  resetPose: () => void;

  // === 关键帧动作 ===
  addKeyframeAt: (time: number) => void;
  removeKeyframe: (id: string) => void;
  updateKeyframeTime: (id: string, time: number) => void;

  // === 图形动作 ===
  addShape: (type: ShapeType, x?: number, y?: number, fill?: string) => string;
  removeShape: (id: string) => void;
  updateShape: (id: string, patch: Partial<Shape>) => void;
  reorderShapes: (shapes: Shape[]) => void;

  // === 部件动作 ===
  addPart: (name?: string) => string;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<Part>) => void;
  assignShapeToPart: (shapeId: string, partId: string | null) => void;

  // === 动画偏移动作 ===
  addOffsetKeyframe: (partId: string, time: number, offset?: Transform2D) => void;
  removeOffsetKeyframe: (partId: string, kfId: string) => void;
  updateOffsetKeyframe: (partId: string, kfId: string, patch: Partial<OffsetKeyframe>) => void;

  // === 作品管理 ===
  newArtwork: () => void;
  loadArtwork: (record: ArtworkRecord) => void;
  toRecord: (thumbnail: string) => ArtworkRecord;
  markSaved: () => void;
}

export const useArtworkStore = create<ArtworkState>((set, get) => ({
  id: newArtworkId(),
  name: "未命名作品",
  gridSize: DEFAULT_GRID_SIZE,
  pixels: {},
  skeleton: emptySkeleton(),
  keyframes: [],
  currentPose: {},
  shapes: [],
  parts: [],
  dirty: false,

  paintCell: (x, y, color, mirror) =>
    set((state) => {
      const next = { ...state.pixels };
      next[cellKey(x, y)] = color;
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        next[cellKey(mx, y)] = color;
      }
      return { pixels: next, dirty: true };
    }),

  eraseCell: (x, y, mirror) =>
    set((state) => {
      const next = { ...state.pixels };
      delete next[cellKey(x, y)];
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        delete next[cellKey(mx, y)];
      }
      return { pixels: next, dirty: true };
    }),

  fillArea: (x, y, color, mirror) =>
    set((state) => {
      let next = floodFill(state.pixels, x, y, state.gridSize, color);
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        next = floodFill(next, mx, y, state.gridSize, color);
      }
      return { pixels: next, dirty: true };
    }),

  clearGrid: () => set({ pixels: {}, dirty: true }),

  setGridSize: (size) =>
    set({
      gridSize: size,
      pixels: {},
      skeleton: emptySkeleton(),
      keyframes: [],
      currentPose: {},
      shapes: [],
      parts: [],
      dirty: true,
    }),

  setName: (name) => set({ name, dirty: true }),

  addJoint: (x, y, name) => {
    const id = uuid();
    const joint: Joint = { id, x, y, name: name ?? `关节${get().skeleton.joints.length + 1}` };
    set((state) => ({
      skeleton: {
        joints: [...state.skeleton.joints, joint],
        bones: state.skeleton.bones,
      },
      currentPose: { ...state.currentPose, [id]: { x, y } },
      dirty: true,
    }));
    return id;
  },

  // 添加镜像关节对（半面对称骨架）
  addMirrorJoints: (x, y, gridSize, name) => {
    const id1 = uuid();
    const id2 = uuid();
    const baseName = name ?? `关节${get().skeleton.joints.length + 1}`;
    const joint1: Joint = { id: id1, x, y, name: `${baseName}·L` };
    const mx = mirrorX(x, gridSize);
    const joint2: Joint = { id: id2, x: mx, y, name: `${baseName}·R` };
    set((state) => ({
      skeleton: {
        joints: [...state.skeleton.joints, joint1, joint2],
        bones: state.skeleton.bones,
      },
      currentPose: {
        ...state.currentPose,
        [id1]: { x, y },
        [id2]: { x: mx, y },
      },
      dirty: true,
    }));
    return [id1, id2];
  },

  // 批量移动多个关节（保持相对位置）
  moveJoints: (updates: Record<string, { x: number; y: number }>) =>
    set((state) => {
      const jointMap = new Map(state.skeleton.joints.map((j) => [j.id, j]));
      const newJoints = state.skeleton.joints.map((j) =>
        updates[j.id] ? { ...j, x: updates[j.id].x, y: updates[j.id].y } : j,
      );
      const newPose = { ...state.currentPose };
      for (const [id, pos] of Object.entries(updates)) {
        if (jointMap.has(id)) newPose[id] = pos;
      }
      return {
        skeleton: { joints: newJoints, bones: state.skeleton.bones },
        currentPose: newPose,
        dirty: true,
      };
    }),

  removeJoint: (id) =>
    set((state) => {
      const joints = state.skeleton.joints.filter((j) => j.id !== id);
      const bones = state.skeleton.bones.filter(
        (b) => b.fromJointId !== id && b.toJointId !== id,
      );
      const pose = { ...state.currentPose };
      delete pose[id];
      return { skeleton: { joints, bones }, currentPose: pose, dirty: true };
    }),

  moveJoint: (id, x, y) =>
    set((state) => ({
      skeleton: {
        joints: state.skeleton.joints.map((j) => (j.id === id ? { ...j, x, y } : j)),
        bones: state.skeleton.bones,
      },
      currentPose: { ...state.currentPose, [id]: { x, y } },
      dirty: true,
    })),

  addBone: (fromId, toId) => {
    const state = get();
    if (fromId === toId) return null;
    const exists = state.skeleton.bones.some(
      (b) =>
        (b.fromJointId === fromId && b.toJointId === toId) ||
        (b.fromJointId === toId && b.toJointId === fromId),
    );
    if (exists) return null;
    const id = uuid();
    const bone: Bone = { id, fromJointId: fromId, toJointId: toId, influencedCells: [] };
    set({
      skeleton: {
        joints: state.skeleton.joints,
        bones: [...state.skeleton.bones, bone],
      },
      dirty: true,
    });
    return id;
  },

  removeBone: (id) =>
    set((state) => ({
      skeleton: {
        joints: state.skeleton.joints,
        bones: state.skeleton.bones.filter((b) => b.id !== id),
      },
      dirty: true,
    })),

  assignCellsToBone: (boneId, cellKeys) =>
    set((state) => ({
      skeleton: {
        joints: state.skeleton.joints,
        bones: state.skeleton.bones.map((b) =>
          b.id === boneId ? { ...b, influencedCells: cellKeys } : b,
        ),
      },
      dirty: true,
    })),

  clearSkeleton: () =>
    set({
      skeleton: emptySkeleton(),
      currentPose: defaultPose([]),
      keyframes: [],
      dirty: true,
    }),

  setPose: (pose) => set({ currentPose: pose }),

  resetPose: () =>
    set((state) => ({ currentPose: defaultPose(state.skeleton.joints) })),

  addKeyframeAt: (time) =>
    set((state) => {
      const kf: Keyframe = {
        id: newKeyframeId(),
        time: Math.max(0, Math.min(1, time)),
        jointPositions: { ...state.currentPose },
      };
      // 移除同一时间的关键帧
      const filtered = state.keyframes.filter((k) => Math.abs(k.time - kf.time) > 0.001);
      return { keyframes: [...filtered, kf], dirty: true };
    }),

  removeKeyframe: (id) =>
    set((state) => ({
      keyframes: state.keyframes.filter((k) => k.id !== id),
      dirty: true,
    })),

  updateKeyframeTime: (id, time) =>
    set((state) => ({
      keyframes: state.keyframes.map((k) =>
        k.id === id ? { ...k, time: Math.max(0, Math.min(1, time)) } : k,
      ),
      dirty: true,
    })),

  // === 图形动作 ===
  addShape: (type, x = 0, y = 0, fill = "#ff6b35") => {
    const shape = createShape(type, x, y, fill);
    set((state) => ({ shapes: [...state.shapes, shape], dirty: true }));
    return shape.id;
  },

  removeShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
      parts: state.parts.map((p) => ({
        ...p,
        shapeIds: p.shapeIds.filter((sid) => sid !== id),
      })),
      dirty: true,
    })),

  updateShape: (id, patch) =>
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      dirty: true,
    })),

  reorderShapes: (shapes) => set({ shapes, dirty: true }),

  // === 部件动作 ===
  addPart: (name) => {
    const part = createPart(name ?? `部件${get().parts.length + 1}`);
    set((state) => ({ parts: [...state.parts, part], dirty: true }));
    return part.id;
  },

  removePart: (id) =>
    set((state) => ({
      parts: state.parts.filter((p) => p.id !== id),
      dirty: true,
    })),

  updatePart: (id, patch) =>
    set((state) => ({
      parts: state.parts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      dirty: true,
    })),

  assignShapeToPart: (shapeId, partId) =>
    set((state) => {
      // 先从所有部件中移除
      const parts = state.parts.map((p) => ({
        ...p,
        shapeIds: p.shapeIds.filter((sid) => sid !== shapeId),
      }));
      // 再添加到目标部件
      if (partId) {
        return {
          parts: parts.map((p) =>
            p.id === partId ? { ...p, shapeIds: [...p.shapeIds, shapeId] } : p,
          ),
          dirty: true,
        };
      }
      return { parts, dirty: true };
    }),

  // === 动画偏移动作 ===
  addOffsetKeyframe: (partId, time, offset = { ...DEFAULT_TRANSFORM }) => {
    set((state) => {
      const kf: OffsetKeyframe = {
        id: `ok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        time: Math.max(0, Math.min(1, time)),
        offset: { ...offset },
      };
      return {
        parts: state.parts.map((p) =>
          p.id === partId
            ? {
                ...p,
                offsetKeyframes: [...p.offsetKeyframes.filter((k) => Math.abs(k.time - kf.time) > 0.001), kf],
              }
            : p,
        ),
        dirty: true,
      };
    });
  },

  removeOffsetKeyframe: (partId, kfId) =>
    set((state) => ({
      parts: state.parts.map((p) =>
        p.id === partId
          ? { ...p, offsetKeyframes: p.offsetKeyframes.filter((k) => k.id !== kfId) }
          : p,
      ),
      dirty: true,
    })),

  updateOffsetKeyframe: (partId, kfId, patch) =>
    set((state) => ({
      parts: state.parts.map((p) =>
        p.id === partId
          ? {
              ...p,
              offsetKeyframes: p.offsetKeyframes.map((k) =>
                k.id === kfId
                  ? {
                      ...k,
                      ...patch,
                      time: patch.time !== undefined ? Math.max(0, Math.min(1, patch.time)) : k.time,
                      offset: patch.offset ? { ...patch.offset } : k.offset,
                    }
                  : k,
              ),
            }
          : p,
      ),
      dirty: true,
    })),

  newArtwork: () =>
    set({
      id: newArtworkId(),
      name: "未命名作品",
      gridSize: DEFAULT_GRID_SIZE,
      pixels: {},
      skeleton: emptySkeleton(),
      keyframes: [],
      currentPose: {},
      shapes: [],
      parts: [],
      dirty: false,
    }),

  loadArtwork: (record) => {
    // 空值保护：防止导入/旧数据缺失字段导致崩溃
    const safeSkeleton =
      record.skeleton && Array.isArray(record.skeleton.joints)
        ? record.skeleton
        : emptySkeleton();
    const safeKeyframes = Array.isArray(record.keyframes) ? record.keyframes : [];
    const safePixels = record.pixels ? cellsToRecord(record.pixels) : {};
    const safeShapes = Array.isArray(record.shapes) ? record.shapes : [];
    const safeParts = Array.isArray(record.parts) ? record.parts : [];
    set({
      id: record.id,
      name: record.name ?? "未命名作品",
      gridSize: record.gridSize ?? DEFAULT_GRID_SIZE,
      pixels: safePixels,
      skeleton: safeSkeleton,
      keyframes: safeKeyframes,
      currentPose: defaultPose(safeSkeleton.joints),
      shapes: safeShapes,
      parts: safeParts,
      dirty: false,
    });
  },

  toRecord: (thumbnail) => {
    const state = get();
    const cells: PixelCell[] = recordToCells(state.pixels);
    const record: ArtworkRecord = {
      id: state.id,
      name: state.name,
      thumbnail,
      gridSize: state.gridSize,
      pixels: cells,
      skeleton: state.skeleton,
      keyframes: state.keyframes,
      shapes: state.shapes,
      parts: state.parts,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return record;
  },

  markSaved: () => set({ dirty: false }),
}));
