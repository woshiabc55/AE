import { create } from 'zustand';

const STORAGE_KEY = 'ai-script-state-v1';

interface PersistedState {
  reel: string[];
  annotations: Record<string, string>;
}

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

  // ── 片集合 (Reel) ──────────────────────────────────────
  reel: string[];                         // 收藏的工具 id 列表（按收藏顺序）
  inReel: (id: string) => boolean;
  toggleReel: (id: string) => void;
  removeFromReel: (id: string) => void;
  clearReel: () => void;

  // ── 文档标注 (Annotations) ─────────────────────────────
  annotations: Record<string, string>;     // 工具 id → 标注文本
  annotationOf: (id: string) => string;
  setAnnotation: (id: string, text: string) => void;
  removeAnnotation: (id: string) => void;

  // ── UI 状态 ────────────────────────────────────────────
  reelOpen: boolean;                      // Reel 侧栏是否打开
  setReelOpen: (b: boolean) => void;
  toggleReelOpen: () => void;
  annotatingFor: string | null;           // 正在编辑标注的工具 id
  setAnnotatingFor: (id: string | null) => void;
  highlightReelId: string | null;         // Reel 跳转后高亮的目标 id
  setHighlightReelId: (id: string | null) => void;
}

function loadPersisted(): PersistedState {
  if (typeof window === 'undefined') return { reel: [], annotations: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { reel: [], annotations: {} };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      reel: Array.isArray(parsed.reel) ? parsed.reel : [],
      annotations:
        parsed.annotations && typeof parsed.annotations === 'object'
          ? parsed.annotations
          : {},
    };
  } catch {
    return { reel: [], annotations: {} };
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded / private mode — 静默忽略
  }
}

const initial = loadPersisted();

export const useScriptStore = create<ScriptState>((set, get) => ({
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

  // ── Reel ───────────────────────────────────────────────
  reel: initial.reel,
  inReel: (id) => get().reel.includes(id),
  toggleReel: (id) => {
    const cur = get().reel;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    set({ reel: next });
    savePersisted({ reel: next, annotations: get().annotations });
  },
  removeFromReel: (id) => {
    const next = get().reel.filter((x) => x !== id);
    set({ reel: next });
    savePersisted({ reel: next, annotations: get().annotations });
  },
  clearReel: () => {
    set({ reel: [] });
    savePersisted({ reel: [], annotations: get().annotations });
  },

  // ── Annotations ────────────────────────────────────────
  annotations: initial.annotations,
  annotationOf: (id) => get().annotations[id] ?? '',
  setAnnotation: (id, text) => {
    const next = { ...get().annotations };
    if (text.trim()) {
      next[id] = text;
    } else {
      delete next[id];
    }
    set({ annotations: next });
    savePersisted({ reel: get().reel, annotations: next });
  },
  removeAnnotation: (id) => {
    const next = { ...get().annotations };
    delete next[id];
    set({ annotations: next });
    savePersisted({ reel: get().reel, annotations: next });
  },

  // ── UI ─────────────────────────────────────────────────
  reelOpen: false,
  setReelOpen: (b) => set({ reelOpen: b }),
  toggleReelOpen: () => set({ reelOpen: !get().reelOpen }),
  annotatingFor: null,
  setAnnotatingFor: (id) => set({ annotatingFor: id }),
  highlightReelId: null,
  setHighlightReelId: (id) => set({ highlightReelId: id }),
}));

// 派生：reel 中的标注数量
export function selectReelAnnotationCount(state: ScriptState): number {
  let n = 0;
  for (const id of state.reel) {
    if (state.annotations[id] && state.annotations[id].trim()) n++;
  }
  return n;
}
