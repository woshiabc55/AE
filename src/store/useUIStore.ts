import { create } from 'zustand';
import type { PanelTab } from '../types';

interface UIState {
  leftPanelWidth: number;
  rightPanelWidth: number;
  timelineHeight: number;
  activeRightTab: PanelTab;
  canvasZoom: number;
  canvasPanX: number;
  canvasPanY: number;
  showGrid: boolean;

  setLeftPanelWidth: (w: number) => void;
  setRightPanelWidth: (w: number) => void;
  setTimelineHeight: (h: number) => void;
  setActiveRightTab: (tab: PanelTab) => void;
  setCanvasZoom: (z: number) => void;
  setCanvasPan: (x: number, y: number) => void;
  toggleGrid: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  leftPanelWidth: 220,
  rightPanelWidth: 260,
  timelineHeight: 220,
  activeRightTab: 'properties',
  canvasZoom: 1,
  canvasPanX: 0,
  canvasPanY: 0,
  showGrid: true,

  setLeftPanelWidth: (w) => set({ leftPanelWidth: w }),
  setRightPanelWidth: (w) => set({ rightPanelWidth: w }),
  setTimelineHeight: (h) => set({ timelineHeight: h }),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  setCanvasZoom: (z) => set({ canvasZoom: Math.max(0.1, Math.min(5, z)) }),
  setCanvasPan: (x, y) => set({ canvasPanX: x, canvasPanY: y }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
}));
