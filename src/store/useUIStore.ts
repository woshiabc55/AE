// UI 状态管理

import { create } from "zustand";
import type { WorkMode } from "@/types";

interface UIState {
  mode: WorkMode;
  // 动画播放
  isPlaying: boolean;
  currentTime: number; // 0~1
  loop: boolean;
  playbackSpeed: number;
  // 选中
  selectedJointId: string | null;
  selectedBoneId: string | null;
  // 骨架编辑模式
  rigTool: "add" | "connect" | "assign" | "move" | "stretch";
  // 面板
  showGallery: boolean;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;

  setMode: (mode: WorkMode) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (t: number) => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: number) => void;
  selectJoint: (id: string | null) => void;
  selectBone: (id: string | null) => void;
  setRigTool: (tool: UIState["rigTool"]) => void;
  setShowGallery: (show: boolean) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: "draw",
  isPlaying: false,
  currentTime: 0,
  loop: true,
  playbackSpeed: 1,
  selectedJointId: null,
  selectedBoneId: null,
  rigTool: "add",
  showGallery: false,
  leftPanelOpen: true,
  rightPanelOpen: true,

  setMode: (mode) =>
    set({ mode, isPlaying: false, selectedJointId: null, selectedBoneId: null }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (t) => set({ currentTime: Math.max(0, Math.min(1, t)) }),
  toggleLoop: () => set((s) => ({ loop: !s.loop })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  selectJoint: (id) => set({ selectedJointId: id, selectedBoneId: null }),
  selectBone: (id) => set({ selectedBoneId: id, selectedJointId: null }),
  setRigTool: (tool) => set({ rigTool: tool }),
  setShowGallery: (show) => set({ showGallery: show }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
}));
