// 作品状态管理

import { create } from "zustand";
import type {
  ArtworkRecord,
  Bone,
  Joint,
  JointPositions,
  Keyframe,
  Layer,
  PixelCell,
  Point,
  SkeletonData,
  StretchRegion,
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

const DEFAULT_GRID_SIZE = 32;

function emptySkeleton(): SkeletonData {
  return { joints: [], bones: [] };
}

/** 历史快照（用于 undo/redo） */
interface HistorySnapshot {
  layers: Layer[];
  activeLayerId: string;
  skeleton: SkeletonData;
  stretchRegions: StretchRegion[];
  currentPose: JointPositions;
}

const MAX_HISTORY = 50;

function defaultPose(joints: Joint[]): JointPositions {
  const pose: JointPositions = {};
  for (const j of joints) pose[j.id] = { x: j.x, y: j.y };
  return pose;
}

/** 合并所有可见图层为扁平化像素 */
function flattenLayers(layers: Layer[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const layer of layers) {
    if (!layer.visible) continue;
    for (const key in layer.pixels) {
      result[key] = layer.pixels[key];
    }
  }
  return result;
}

/** 创建默认图层 */
function defaultLayer(name = "图层 1"): Layer {
  return {
    id: uuid(),
    name,
    visible: true,
    locked: false,
    opacity: 1,
    pixels: {},
  };
}

interface ArtworkState {
  // 作品元数据
  id: string;
  name: string;
  gridSize: number;
  // 拼豆数据：键 "x,y" -> 颜色（扁平化所有可见图层）
  pixels: Record<string, string>;
  // 图层系统
  layers: Layer[];
  activeLayerId: string;
  // 骨架
  skeleton: SkeletonData;
  // 关键帧
  keyframes: Keyframe[];
  // 拉伸区域
  stretchRegions: StretchRegion[];
  // 当前姿态（关节位置）—— 用于动画播放与拖拽
  currentPose: JointPositions;
  // 是否有未保存修改
  dirty: boolean;
  // 撤销历史
  history: HistorySnapshot[];
  future: HistorySnapshot[];
  canUndo: boolean;
  canRedo: boolean;

  // === 绘制动作 ===
  paintCell: (x: number, y: number, color: string, mirror: boolean) => void;
  eraseCell: (x: number, y: number, mirror: boolean) => void;
  fillArea: (x: number, y: number, color: string, mirror: boolean) => void;
  clearGrid: () => void;
  setGridSize: (size: number) => void;
  setName: (name: string) => void;

  // === 图层动作 ===
  addLayer: (name?: string) => string;
  removeLayer: (id: string) => void;
  setLayerVisible: (id: string, visible: boolean) => void;
  setLayerLocked: (id: string, locked: boolean) => void;
  setLayerName: (id: string, name: string) => void;
  setActiveLayer: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  mergeLayerDown: (id: string) => void;
  duplicateLayer: (id: string) => void;

  // === 骨架动作 ===
  addJoint: (x: number, y: number, name?: string) => string;
  removeJoint: (id: string) => void;
  moveJoint: (id: string, x: number, y: number) => void;
  addBone: (fromId: string, toId: string) => string | null;
  removeBone: (id: string) => void;
  assignCellsToBone: (boneId: string, cellKeys: string[]) => void;
  clearSkeleton: () => void;

  // === 拉伸区域动作 ===
  addStretchRegion: (corner1: Point, corner2: Point) => string;
  removeStretchRegion: (id: string) => void;
  transformStretchRegion: (id: string, offset: Point, scale: Point) => void;
  resetStretchRegion: (id: string) => void;

  // === 姿态动作 ===
  setPose: (pose: JointPositions) => void;
  resetPose: () => void;

  // === 关键帧动作 ===
  addKeyframeAt: (time: number) => void;
  removeKeyframe: (id: string) => void;
  updateKeyframeTime: (id: string, time: number) => void;

  // === 作品管理 ===
  newArtwork: () => void;
  loadArtwork: (record: ArtworkRecord) => void;
  toRecord: (thumbnail: string) => ArtworkRecord;
  markSaved: () => void;
  // === 撤销/重做 ===
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useArtworkStore = create<ArtworkState>((set, get) => {
  const initLayer = defaultLayer();
  return {
  id: newArtworkId(),
  name: "未命名作品",
  gridSize: DEFAULT_GRID_SIZE,
  pixels: {},
  layers: [initLayer],
  activeLayerId: initLayer.id,
  skeleton: emptySkeleton(),
  keyframes: [],
  stretchRegions: [],
  currentPose: {},
  dirty: false,
  history: [],
  future: [],
  canUndo: false,
  canRedo: false,

  paintCell: (x, y, color, mirror) =>
    set((state) => {
      const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
      if (!activeLayer || activeLayer.locked) return state;
      const layerPixels = { ...activeLayer.pixels };
      layerPixels[cellKey(x, y)] = color;
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        layerPixels[cellKey(mx, y)] = color;
      }
      const layers = state.layers.map((l) =>
        l.id === state.activeLayerId ? { ...l, pixels: layerPixels } : l,
      );
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  eraseCell: (x, y, mirror) =>
    set((state) => {
      const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
      if (!activeLayer || activeLayer.locked) return state;
      const layerPixels = { ...activeLayer.pixels };
      delete layerPixels[cellKey(x, y)];
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        delete layerPixels[cellKey(mx, y)];
      }
      const layers = state.layers.map((l) =>
        l.id === state.activeLayerId ? { ...l, pixels: layerPixels } : l,
      );
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  fillArea: (x, y, color, mirror) =>
    set((state) => {
      const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
      if (!activeLayer || activeLayer.locked) return state;
      let next = floodFill(activeLayer.pixels, x, y, state.gridSize, color);
      if (mirror) {
        const mx = mirrorX(x, state.gridSize);
        next = floodFill(next, mx, y, state.gridSize, color);
      }
      const layers = state.layers.map((l) =>
        l.id === state.activeLayerId ? { ...l, pixels: next } : l,
      );
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  clearGrid: () =>
    set((state) => {
      const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
      if (!activeLayer || activeLayer.locked) return state;
      const layers = state.layers.map((l) =>
        l.id === state.activeLayerId ? { ...l, pixels: {} } : l,
      );
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  setGridSize: (size) =>
    set(() => {
      const initLayer = defaultLayer();
      return {
        gridSize: size,
        pixels: {},
        layers: [initLayer],
        activeLayerId: initLayer.id,
        skeleton: emptySkeleton(),
        keyframes: [],
        stretchRegions: [],
        currentPose: {},
        dirty: true,
      };
    }),

  setName: (name) => set({ name, dirty: true }),

  // === 图层动作 ===
  addLayer: (name) => {
    const layer = defaultLayer(name ?? `图层 ${get().layers.length + 1}`);
    set((state) => ({
      layers: [...state.layers, layer],
      activeLayerId: layer.id,
      dirty: true,
    }));
    return layer.id;
  },

  removeLayer: (id) =>
    set((state) => {
      if (state.layers.length <= 1) return state;
      const layers = state.layers.filter((l) => l.id !== id);
      const activeLayerId =
        state.activeLayerId === id ? layers[layers.length - 1].id : state.activeLayerId;
      return { layers, activeLayerId, pixels: flattenLayers(layers), dirty: true };
    }),

  setLayerVisible: (id, visible) =>
    set((state) => {
      const layers = state.layers.map((l) =>
        l.id === id ? { ...l, visible } : l,
      );
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  setLayerLocked: (id, locked) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, locked } : l,
      ),
      dirty: true,
    })),

  setLayerName: (id, name) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, name } : l,
      ),
      dirty: true,
    })),

  setActiveLayer: (id) => set({ activeLayerId: id }),

  moveLayerUp: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const layers = [...state.layers];
      [layers[idx - 1], layers[idx]] = [layers[idx], layers[idx - 1]];
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  moveLayerDown: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx < 0 || idx >= state.layers.length - 1) return state;
      const layers = [...state.layers];
      [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  mergeLayerDown: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const upper = state.layers[idx];
      const lower = state.layers[idx - 1];
      const merged = { ...lower.pixels, ...upper.pixels };
      const layers = state.layers
        .filter((l) => l.id !== id)
        .map((l) => (l.id === lower.id ? { ...l, pixels: merged } : l));
      return { layers, pixels: flattenLayers(layers), dirty: true };
    }),

  duplicateLayer: (id) =>
    set((state) => {
      const src = state.layers.find((l) => l.id === id);
      if (!src) return state;
      const dup: Layer = {
        ...src,
        id: uuid(),
        name: `${src.name} 副本`,
        pixels: { ...src.pixels },
      };
      const idx = state.layers.findIndex((l) => l.id === id);
      const layers = [...state.layers];
      layers.splice(idx + 1, 0, dup);
      return { layers, activeLayerId: dup.id, pixels: flattenLayers(layers), dirty: true };
    }),

  // === 骨架动作 ===
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

  // === 拉伸区域动作 ===
  addStretchRegion: (corner1, corner2) => {
    const id = uuid();
    const region: StretchRegion = {
      id,
      name: `拉伸区 ${get().stretchRegions.length + 1}`,
      corner1,
      corner2,
      offset: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
    };
    set((state) => ({
      stretchRegions: [...state.stretchRegions, region],
      dirty: true,
    }));
    return id;
  },

  removeStretchRegion: (id) =>
    set((state) => ({
      stretchRegions: state.stretchRegions.filter((r) => r.id !== id),
      dirty: true,
    })),

  transformStretchRegion: (id, offset, scale) =>
    set((state) => ({
      stretchRegions: state.stretchRegions.map((r) =>
        r.id === id ? { ...r, offset, scale } : r,
      ),
      dirty: true,
    })),

  resetStretchRegion: (id) =>
    set((state) => ({
      stretchRegions: state.stretchRegions.map((r) =>
        r.id === id ? { ...r, offset: { x: 0, y: 0 }, scale: { x: 1, y: 1 } } : r,
      ),
      dirty: true,
    })),

  // === 姿态动作 ===
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

  newArtwork: () => {
    const initLayer = defaultLayer();
    set({
      id: newArtworkId(),
      name: "未命名作品",
      gridSize: DEFAULT_GRID_SIZE,
      pixels: {},
      layers: [initLayer],
      activeLayerId: initLayer.id,
      skeleton: emptySkeleton(),
      keyframes: [],
      stretchRegions: [],
      currentPose: {},
      dirty: false,
    });
  },

  loadArtwork: (record) => {
    // 空值保护：防止导入/旧数据缺失字段导致崩溃
    const safeSkeleton =
      record.skeleton && Array.isArray(record.skeleton.joints)
        ? record.skeleton
        : emptySkeleton();
    const safeKeyframes = Array.isArray(record.keyframes) ? record.keyframes : [];
    const safeLayers: Layer[] = Array.isArray(record.layers) && record.layers.length > 0
      ? record.layers
      : [{ ...defaultLayer(), pixels: record.pixels ? cellsToRecord(record.pixels) : {} }];
    const safeRegions: StretchRegion[] = Array.isArray(record.stretchRegions) ? record.stretchRegions : [];
    const safePixels = flattenLayers(safeLayers);
    set({
      id: record.id,
      name: record.name ?? "未命名作品",
      gridSize: record.gridSize ?? DEFAULT_GRID_SIZE,
      pixels: safePixels,
      layers: safeLayers,
      activeLayerId: safeLayers[0].id,
      skeleton: safeSkeleton,
      keyframes: safeKeyframes,
      stretchRegions: safeRegions,
      currentPose: defaultPose(safeSkeleton.joints),
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
      layers: state.layers,
      skeleton: state.skeleton,
      keyframes: state.keyframes,
      stretchRegions: state.stretchRegions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return record;
  },

  markSaved: () => set({ dirty: false }),

  // === 撤销/重做 ===
  pushHistory: () => {
    const state = get();
    const snapshot: HistorySnapshot = {
      layers: state.layers.map((l) => ({ ...l, pixels: { ...l.pixels } })),
      activeLayerId: state.activeLayerId,
      skeleton: {
        joints: state.skeleton.joints.map((j) => ({ ...j })),
        bones: state.skeleton.bones.map((b) => ({ ...b, influencedCells: [...b.influencedCells] })),
      },
      stretchRegions: state.stretchRegions.map((r) => ({ ...r })),
      currentPose: { ...state.currentPose },
    };
    set({
      history: [...state.history.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
      canUndo: true,
      canRedo: false,
    });
  },

  undo: () => {
    const state = get();
    if (state.history.length === 0) return;
    const prev = state.history[state.history.length - 1];
    // 保存当前状态到 future
    const current: HistorySnapshot = {
      layers: state.layers.map((l) => ({ ...l, pixels: { ...l.pixels } })),
      activeLayerId: state.activeLayerId,
      skeleton: {
        joints: state.skeleton.joints.map((j) => ({ ...j })),
        bones: state.skeleton.bones.map((b) => ({ ...b, influencedCells: [...b.influencedCells] })),
      },
      stretchRegions: state.stretchRegions.map((r) => ({ ...r })),
      currentPose: { ...state.currentPose },
    };
    set({
      layers: prev.layers,
      activeLayerId: prev.activeLayerId,
      skeleton: prev.skeleton,
      stretchRegions: prev.stretchRegions,
      currentPose: prev.currentPose,
      pixels: flattenLayers(prev.layers),
      history: state.history.slice(0, -1),
      future: [current, ...state.future],
      canUndo: state.history.length > 1,
      canRedo: true,
      dirty: true,
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const current: HistorySnapshot = {
      layers: state.layers.map((l) => ({ ...l, pixels: { ...l.pixels } })),
      activeLayerId: state.activeLayerId,
      skeleton: {
        joints: state.skeleton.joints.map((j) => ({ ...j })),
        bones: state.skeleton.bones.map((b) => ({ ...b, influencedCells: [...b.influencedCells] })),
      },
      stretchRegions: state.stretchRegions.map((r) => ({ ...r })),
      currentPose: { ...state.currentPose },
    };
    set({
      layers: next.layers,
      activeLayerId: next.activeLayerId,
      skeleton: next.skeleton,
      stretchRegions: next.stretchRegions,
      currentPose: next.currentPose,
      pixels: flattenLayers(next.layers),
      history: [...state.history, current],
      future: state.future.slice(1),
      canUndo: true,
      canRedo: state.future.length > 1,
      dirty: true,
    });
  },
  };
});
