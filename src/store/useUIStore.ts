// UI 状态管理

import { create } from "zustand";
import type { ShapeTool, WorkMode } from "@/types";

export type RigTool = "add" | "connect" | "assign" | "move" | "select";
export type AnimateTool = "drag" | "select";

interface UIState {
  mode: WorkMode;
  // 动画播放
  isPlaying: boolean;
  currentTime: number; // 0~1
  loop: boolean;
  playbackSpeed: number; // 0.25 ~ 2
  // 选中
  selectedJointId: string | null;
  selectedBoneId: string | null;
  selectedShapeId: string | null;
  selectedPartId: string | null;
  // 多选（点位/区域选择）
  selectedJointIds: string[];
  // 骨架编辑模式
  rigTool: RigTool;
  // 动画模式工具
  animateTool: AnimateTool;
  // 图形编辑模式
  shapeTool: ShapeTool;
  // 网格吸附（确保整齐不偏差）
  snapToGrid: boolean;
  // 镜像骨架（对称添加关节）
  mirrorSkeleton: boolean;
  // 面板
  showGallery: boolean;

  setMode: (mode: WorkMode) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (t: number) => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: number) => void;
  selectJoint: (id: string | null) => void;
  selectBone: (id: string | null) => void;
  selectShape: (id: string | null) => void;
  selectPart: (id: string | null) => void;
  // 多选
  toggleJointSelected: (id: string) => void;
  clearSelection: () => void;
  selectMultipleJoints: (ids: string[]) => void;
  setRigTool: (tool: RigTool) => void;
  setAnimateTool: (tool: AnimateTool) => void;
  setShapeTool: (tool: ShapeTool) => void;
  toggleSnap: () => void;
  setSnap: (on: boolean) => void;
  toggleMirrorSkeleton: () => void;
  setShowGallery: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: "draw",
  isPlaying: false,
  currentTime: 0,
  loop: true,
  playbackSpeed: 1,
  selectedJointId: null,
  selectedBoneId: null,
  selectedShapeId: null,
  selectedPartId: null,
  selectedJointIds: [],
  rigTool: "add",
  animateTool: "drag",
  shapeTool: "select",
  snapToGrid: true,
  mirrorSkeleton: false,
  showGallery: false,

  setMode: (mode) =>
    set({
      mode,
      isPlaying: false,
      selectedJointId: null,
      selectedBoneId: null,
      selectedShapeId: null,
      selectedPartId: null,
      selectedJointIds: [],
    }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (t) => set({ currentTime: Math.max(0, Math.min(1, t)) }),
  toggleLoop: () => set((s) => ({ loop: !s.loop })),
  setPlaybackSpeed: (speed) =>
    set({ playbackSpeed: Math.max(0.25, Math.min(2, speed)) }),
  selectJoint: (id) =>
    set({
      selectedJointId: id,
      selectedBoneId: null,
      selectedJointIds: id ? [id] : [],
    }),
  selectBone: (id) =>
    set({ selectedBoneId: id, selectedJointId: null, selectedJointIds: [], selectedShapeId: null, selectedPartId: null }),
  selectShape: (id) =>
    set({ selectedShapeId: id, selectedJointId: null, selectedBoneId: null, selectedPartId: null, selectedJointIds: [] }),
  selectPart: (id) =>
    set({ selectedPartId: id, selectedJointId: null, selectedBoneId: null, selectedShapeId: null, selectedJointIds: [] }),
  toggleJointSelected: (id) =>
    set((s) => {
      const exists = s.selectedJointIds.includes(id);
      const next = exists
        ? s.selectedJointIds.filter((x) => x !== id)
        : [...s.selectedJointIds, id];
      return {
        selectedJointIds: next,
        selectedJointId: next[next.length - 1] ?? null,
        selectedBoneId: null,
      };
    }),
  clearSelection: () =>
    set({ selectedJointId: null, selectedBoneId: null, selectedShapeId: null, selectedPartId: null, selectedJointIds: [] }),
  selectMultipleJoints: (ids) =>
    set({
      selectedJointIds: ids,
      selectedJointId: ids[ids.length - 1] ?? null,
      selectedBoneId: null,
      selectedShapeId: null,
      selectedPartId: null,
    }),
  setRigTool: (tool) => set({ rigTool: tool }),
  setAnimateTool: (tool) => set({ animateTool: tool }),
  setShapeTool: (tool) => set({ shapeTool: tool }),
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setSnap: (on) => set({ snapToGrid: on }),
  toggleMirrorSkeleton: () => set((s) => ({ mirrorSkeleton: !s.mirrorSkeleton })),
  setShowGallery: (show) => set({ showGallery: show }),
}));
