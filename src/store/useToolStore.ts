import { create } from 'zustand';
import type { ToolType } from '../types';

interface ToolState {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  setStrokeColor: (c: string) => void;
  setFillColor: (c: string) => void;
  setStrokeWidth: (w: number) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),
  strokeColor: '#ffffff',
  fillColor: '#00e5ff',
  strokeWidth: 2,
  setStrokeColor: (c) => set({ strokeColor: c }),
  setFillColor: (c) => set({ fillColor: c }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),
}));
