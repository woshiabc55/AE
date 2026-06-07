import { create } from 'zustand';

interface UIStore {
  // SVG 编辑器
  svgSelectedLayerId: string | null;
  svgSelectedKeyframeId: string | null;
  svgSelectedTrackId: string | null;
  svgPlayhead: number; // 秒
  svgPlaying: boolean;
  svgZoom: number;
  svgShowGrid: boolean;

  // Live2D
  live2dSelectedPartId: string | null;
  live2dSelectedParamId: string | null;
  live2dParamValues: Record<string, number>;
  live2dPlaying: boolean;
  live2dShowMesh: boolean;

  // 全局
  toasts: { id: string; type: 'info' | 'success' | 'error'; message: string }[];

  setSvgSelectedLayer: (id: string | null) => void;
  setSvgSelectedKeyframe: (id: string | null) => void;
  setSvgSelectedTrack: (id: string | null) => void;
  setSvgPlayhead: (t: number) => void;
  setSvgPlaying: (p: boolean) => void;
  setSvgZoom: (z: number) => void;
  toggleSvgGrid: () => void;

  setLive2dSelectedPart: (id: string | null) => void;
  setLive2dSelectedParam: (id: string | null) => void;
  setLive2dParam: (id: string, v: number) => void;
  setLive2dPlaying: (p: boolean) => void;
  toggleLive2dMesh: () => void;

  pushToast: (type: 'info' | 'success' | 'error', message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  svgSelectedLayerId: null,
  svgSelectedKeyframeId: null,
  svgSelectedTrackId: null,
  svgPlayhead: 0,
  svgPlaying: true,
  svgZoom: 1,
  svgShowGrid: true,

  live2dSelectedPartId: null,
  live2dSelectedParamId: null,
  live2dParamValues: {},
  live2dPlaying: true,
  live2dShowMesh: false,

  toasts: [],

  setSvgSelectedLayer: (id) => set({ svgSelectedLayerId: id }),
  setSvgSelectedKeyframe: (id) => set({ svgSelectedKeyframeId: id }),
  setSvgSelectedTrack: (id) => set({ svgSelectedTrackId: id }),
  setSvgPlayhead: (t) => set({ svgPlayhead: Math.max(0, t) }),
  setSvgPlaying: (p) => set({ svgPlaying: p }),
  setSvgZoom: (z) => set({ svgZoom: Math.max(0.25, Math.min(4, z)) }),
  toggleSvgGrid: () => set((s) => ({ svgShowGrid: !s.svgShowGrid })),

  setLive2dSelectedPart: (id) => set({ live2dSelectedPartId: id }),
  setLive2dSelectedParam: (id) => set({ live2dSelectedParamId: id }),
  setLive2dParam: (id, v) => set((s) => ({ live2dParamValues: { ...s.live2dParamValues, [id]: v } })),
  setLive2dPlaying: (p) => set({ live2dPlaying: p }),
  toggleLive2dMesh: () => set((s) => ({ live2dShowMesh: !s.live2dShowMesh })),

  pushToast: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      const t = get().toasts.find((x) => x.id === id);
      if (t) get().removeToast(id);
    }, 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
