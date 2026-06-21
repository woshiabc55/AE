// 工具状态管理

import { create } from "zustand";
import type { DrawTool } from "@/types";
import { DEFAULT_COLOR } from "@/utils/colors";

interface ToolState {
  tool: DrawTool;
  color: string;
  brushSize: number;
  mirror: boolean; // 是否启用半面镜像
  setTool: (tool: DrawTool) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  toggleMirror: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
  tool: "brush",
  color: DEFAULT_COLOR,
  brushSize: 1,
  mirror: true,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(4, size)) }),
  toggleMirror: () => set((s) => ({ mirror: !s.mirror })),
}));
