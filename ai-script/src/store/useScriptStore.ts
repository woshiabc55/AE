import { create } from 'zustand';

interface ScriptState {
  // 当前激活的幕 id
  activeAct: string;
  setActiveAct: (id: string) => void;

  // 筛选
  query: string;
  setQuery: (q: string) => void;

  freeOnly: boolean;
  setFreeOnly: (v: boolean) => void;

  cnOnly: boolean;
  setCnOnly: (v: boolean) => void;

  // 滚动进度 (0-1)
  progress: number;
  setProgress: (n: number) => void;

  // 主题: film 电影 / parchment 羊皮
  theme: 'film' | 'parchment';
  setTheme: (t: 'film' | 'parchment') => void;

  // 当前滚到的幕（由 IntersectionObserver 更新）
  visibleAct: string;
  setVisibleAct: (id: string) => void;
}

export const useScriptStore = create<ScriptState>((set) => ({
  activeAct: 'word',
  setActiveAct: (id) => set({ activeAct: id }),

  query: '',
  setQuery: (q) => set({ query: q }),

  freeOnly: false,
  setFreeOnly: (v) => set({ freeOnly: v }),

  cnOnly: false,
  setCnOnly: (v) => set({ cnOnly: v }),

  progress: 0,
  setProgress: (n) => set({ progress: n }),

  theme: 'film',
  setTheme: (t) => set({ theme: t }),

  visibleAct: 'cover',
  setVisibleAct: (id) => set({ visibleAct: id }),
}));
