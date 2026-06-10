/**
 * 简化的 Zustand store，集中管理项目状态
 * 跨路由共享同一个项目对象
 * 支持两种源模式：pixel（像素画）和 svg（矢量）
 */
import { create } from "zustand";
import type {
  Project,
  Shape,
  ShapeGroup,
  Layer,
  MeshNode,
  AnimationClip,
  KeyFrame,
  HistoryState,
  AtlasResult,
  PixelCanvas,
} from "@/types";

export type PixelTool = "pencil" | "eraser" | "fill" | "eyedrop" | "line" | "rect";

interface ProjectState {
  project: Project;

  // 撤销/重做
  history: HistoryState[];
  historyIndex: number;

  // 像素画工具
  pixelTool: PixelTool;
  pixelZoom: number;
  showGrid: boolean;
  mirrorX: boolean;

  // SVG 工具（保留兼容）
  currentTool: "select" | "rect" | "ellipse" | "pen" | "brush" | "eraser";
  currentColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedShapeId: string | null;
  selectedGroupId: string | null;

  // === 动作 ===
  setPixelTool: (t: PixelTool) => void;
  setPixelZoom: (z: number) => void;
  setShowGrid: (v: boolean) => void;
  setMirrorX: (v: boolean) => void;
  setPixel: (pixel: PixelCanvas | null) => void;
  setPixelColor: (paletteIndex: number) => void;
  addPaletteColor: (color: string) => void;
  paintPixel: (x: number, y: number, colorIndex: number) => void;
  paintPixels: (cells: { x: number; y: number; ci: number }[]) => void;
  clearPixelCanvas: () => void;
  resizePixelCanvas: (w: number, h: number) => void;

  // SVG 动作（保留）
  setTool: (tool: ProjectState["currentTool"]) => void;
  setColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (w: number) => void;
  addShape: (shape: Shape, groupId?: string) => void;
  updateShape: (id: string, patch: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  setSelectedGroup: (id: string | null) => void;
  addGroup: (group: ShapeGroup) => void;
  updateGroup: (id: string, patch: Partial<ShapeGroup>) => void;
  deleteGroup: (id: string) => void;
  setProjectName: (name: string) => void;
  setProject: (project: Project) => void;

  // 图层
  setLayers: (layers: Layer[]) => void;
  updateLayer: (id: string, patch: Partial<Layer>) => void;
  reorderLayers: (ids: string[]) => void;

  // 网格
  setNodes: (nodes: MeshNode[]) => void;
  updateNode: (id: string, patch: Partial<MeshNode>) => void;
  bindNodeToLayer: (nodeId: string, layerId: string | null) => void;

  // 动画
  setAnimations: (anims: AnimationClip[]) => void;
  addAnimation: (anim: AnimationClip) => void;
  updateKeyFrame: (animId: string, frame: KeyFrame) => void;
  addKeyFrame: (animId: string, frame: KeyFrame) => void;

  // atlas
  setAtlas: (atlas: AtlasResult | null) => void;

  // 历史
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // 模板
  newBlankProject: () => void;
  loadTemplate: (project: Project) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();

const DEFAULT_PALETTE = [
  "#00000000", // 0 = transparent
  "#0B0F1A", // 1 line / 描边
  "#FFE3EE", // 2 skin 皮肤
  "#FF7AB6", // 3 sakura 樱花粉
  "#FFD66B", // 4 butter 黄
  "#7CE3B5", // 5 leaf 绿
  "#7CC0FF", // 6 sky 蓝
  "#FF8B5C", // 7 flame 橙
  "#C7A8FF", // 8 purple 紫
  "#FFFFFF", // 9 white
  "#FFC7DD", // 10 pink-light
  "#252E47", // 11 ink-dark
];

const blankPixelCanvas = (w = 64, h = 96): PixelCanvas => ({
  width: w,
  height: h,
  palette: [...DEFAULT_PALETTE],
  data: new Array(w * h).fill(0),
  currentColor: 2,
});

const blankProject = (): Project => ({
  id: uid(),
  name: "未命名项目",
  sourceMode: "pixel",
  canvasWidth: 64,
  canvasHeight: 96,
  shapes: [],
  groups: [],
  layers: [],
  nodes: [],
  animations: [],
  pixel: blankPixelCanvas(),
  atlas: null,
  createdAt: now(),
  updatedAt: now(),
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: blankProject(),
  history: [],
  historyIndex: -1,

  pixelTool: "pencil",
  pixelZoom: 8,
  showGrid: true,
  mirrorX: true,

  currentTool: "select",
  currentColor: "#FF7AB6",
  strokeColor: "#0B0F1A",
  strokeWidth: 2,
  selectedShapeId: null,
  selectedGroupId: null,

  setPixelTool: (t) => set({ pixelTool: t }),
  setPixelZoom: (z) => set({ pixelZoom: Math.max(1, Math.min(24, z)) }),
  setShowGrid: (v) => set({ showGrid: v }),
  setMirrorX: (v) => set({ mirrorX: v }),

  setPixel: (pixel) =>
    set((state) => ({ project: { ...state.project, pixel, updatedAt: now() } })),

  setPixelColor: (paletteIndex) => {
    set((state) => {
      if (!state.project.pixel) return state;
      const next: PixelCanvas = { ...state.project.pixel, currentColor: paletteIndex };
      return { project: { ...state.project, pixel: next, updatedAt: now() } };
    });
  },

  addPaletteColor: (color) => {
    set((state) => {
      if (!state.project.pixel) return state;
      const pal = state.project.pixel.palette;
      if (pal.includes(color)) return state;
      const next: PixelCanvas = {
        ...state.project.pixel,
        palette: [...pal, color],
        currentColor: pal.length,
      };
      return { project: { ...state.project, pixel: next, updatedAt: now() } };
    });
  },

  paintPixel: (x, y, colorIndex) => {
    set((state) => {
      if (!state.project.pixel) return state;
      const p = state.project.pixel;
      if (x < 0 || y < 0 || x >= p.width || y >= p.height) return state;
      const idx = y * p.width + x;
      if (p.data[idx] === colorIndex) return state;
      const newData = [...p.data];
      newData[idx] = colorIndex;
      const next: PixelCanvas = { ...p, data: newData };
      return { project: { ...state.project, pixel: next, updatedAt: now() } };
    });
  },

  paintPixels: (cells) => {
    get().pushHistory();
    set((state) => {
      if (!state.project.pixel || cells.length === 0) return state;
      const p = state.project.pixel;
      const newData = [...p.data];
      for (const c of cells) {
        if (c.x < 0 || c.y < 0 || c.x >= p.width || c.y >= p.height) continue;
        newData[c.y * p.width + c.x] = c.ci;
      }
      const next: PixelCanvas = { ...p, data: newData };
      return { project: { ...state.project, pixel: next, updatedAt: now() } };
    });
  },

  clearPixelCanvas: () => {
    get().pushHistory();
    set((state) => {
      if (!state.project.pixel) return state;
      const p = state.project.pixel;
      const next: PixelCanvas = { ...p, data: new Array(p.width * p.height).fill(0) };
      return { project: { ...state.project, pixel: next, updatedAt: now() } };
    });
  },

  resizePixelCanvas: (w, h) => {
    set((state) => {
      if (!state.project.pixel) return state;
      const p = state.project.pixel;
      const newData = new Array(w * h).fill(0);
      const mw = Math.min(w, p.width);
      const mh = Math.min(h, p.height);
      for (let y = 0; y < mh; y++) {
        for (let x = 0; x < mw; x++) {
          newData[y * w + x] = p.data[y * p.width + x];
        }
      }
      const next: PixelCanvas = { ...p, width: w, height: h, data: newData };
      return {
        project: {
          ...state.project,
          pixel: next,
          canvasWidth: w,
          canvasHeight: h,
          updatedAt: now(),
        },
      };
    });
  },

  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),

  addShape: (shape, groupId) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      const newGroupId = groupId ?? null;
      if (newGroupId && !next.groups.find((g) => g.id === newGroupId)) {
        next.groups = [
          ...next.groups,
          { id: newGroupId, name: "新分组", parentId: null, color: "#FF7AB6", visible: true },
        ];
      }
      next.shapes = [...next.shapes, { ...shape, parentId: newGroupId ?? shape.parentId ?? null }];
      next.updatedAt = now();
      return { project: next, selectedShapeId: shape.id };
    });
  },

  updateShape: (id, patch) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      next.shapes = next.shapes.map((s) => (s.id === id ? { ...s, ...patch } : s));
      next.updatedAt = now();
      return { project: next };
    });
  },

  deleteShape: (id) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      next.shapes = next.shapes.filter((s) => s.id !== id);
      next.updatedAt = now();
      return { project: next, selectedShapeId: null };
    });
  },

  selectShape: (id) => set({ selectedShapeId: id }),
  setSelectedGroup: (id) => set({ selectedGroupId: id }),

  addGroup: (group) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      next.groups = [...next.groups, group];
      next.updatedAt = now();
      return { project: next, selectedGroupId: group.id };
    });
  },

  updateGroup: (id, patch) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      next.groups = next.groups.map((g) => (g.id === id ? { ...g, ...patch } : g));
      next.updatedAt = now();
      return { project: next };
    });
  },

  deleteGroup: (id) => {
    get().pushHistory();
    set((state) => {
      const next = { ...state.project };
      next.groups = next.groups.filter((g) => g.id !== id);
      next.shapes = next.shapes.map((s) => (s.parentId === id ? { ...s, parentId: null } : s));
      next.updatedAt = now();
      return { project: next, selectedGroupId: null };
    });
  },

  setProjectName: (name) =>
    set((state) => ({ project: { ...state.project, name, updatedAt: now() } })),

  setProject: (project) =>
    set({
      project,
      history: [],
      historyIndex: -1,
      selectedShapeId: null,
      selectedGroupId: null,
    }),

  setLayers: (layers) =>
    set((state) => ({ project: { ...state.project, layers, updatedAt: now() } })),

  updateLayer: (id, patch) =>
    set((state) => {
      const next = { ...state.project };
      next.layers = next.layers.map((l) => (l.id === id ? { ...l, ...patch } : l));
      next.updatedAt = now();
      return { project: next };
    }),

  reorderLayers: (ids) =>
    set((state) => {
      const map = new Map(state.project.layers.map((l) => [l.id, l]));
      const ordered = ids.map((id) => map.get(id)).filter(Boolean) as Layer[];
      const next = { ...state.project, layers: ordered, updatedAt: now() };
      return { project: next };
    }),

  setNodes: (nodes) =>
    set((state) => ({ project: { ...state.project, nodes, updatedAt: now() } })),

  updateNode: (id, patch) =>
    set((state) => {
      const next = { ...state.project };
      next.nodes = next.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
      next.updatedAt = now();
      return { project: next };
    }),

  bindNodeToLayer: (nodeId, layerId) =>
    set((state) => {
      const next = { ...state.project };
      next.nodes = next.nodes.map((n) => (n.id === nodeId ? { ...n, boundLayerId: layerId } : n));
      next.updatedAt = now();
      return { project: next };
    }),

  setAnimations: (animations) =>
    set((state) => ({ project: { ...state.project, animations, updatedAt: now() } })),

  addAnimation: (anim) =>
    set((state) => {
      const next = { ...state.project };
      next.animations = [...next.animations, anim];
      next.updatedAt = now();
      return { project: next };
    }),

  updateKeyFrame: (animId, frame) =>
    set((state) => {
      const next = { ...state.project };
      next.animations = next.animations.map((a) => {
        if (a.id !== animId) return a;
        const others = a.keyframes.filter((f) => f.id !== frame.id);
        return { ...a, keyframes: [...others, frame].sort((x, y) => x.time - y.time) };
      });
      next.updatedAt = now();
      return { project: next };
    }),

  addKeyFrame: (animId, frame) =>
    set((state) => {
      const next = { ...state.project };
      next.animations = next.animations.map((a) =>
        a.id === animId
          ? { ...a, keyframes: [...a.keyframes, frame].sort((x, y) => x.time - y.time) }
          : a
      );
      next.updatedAt = now();
      return { project: next };
    }),

  setAtlas: (atlas) =>
    set((state) => ({ project: { ...state.project, atlas, updatedAt: now() } })),

  pushHistory: () =>
    set((state) => {
      const snap: HistoryState = {
        shapes: JSON.parse(JSON.stringify(state.project.shapes)),
        groups: JSON.parse(JSON.stringify(state.project.groups)),
        pixel: state.project.pixel
          ? {
              width: state.project.pixel.width,
              height: state.project.pixel.height,
              palette: [...state.project.pixel.palette],
              data: [...state.project.pixel.data],
              currentColor: state.project.pixel.currentColor,
            }
          : null,
      };
      const trimmed = state.history.slice(0, state.historyIndex + 1);
      const next = [...trimmed, snap].slice(-30);
      return { history: next, historyIndex: next.length - 1 };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex < 0) return state;
      const snap = state.history[state.historyIndex];
      const next = { ...state.project };
      next.shapes = snap.shapes;
      next.groups = snap.groups;
      next.pixel = snap.pixel;
      next.updatedAt = now();
      return { project: next, historyIndex: state.historyIndex - 1 };
    }),

  redo: () => {
    return;
  },

  newBlankProject: () => {
    const p = blankProject();
    set({
      project: p,
      history: [],
      historyIndex: -1,
      selectedShapeId: null,
      selectedGroupId: null,
    });
  },

  loadTemplate: (project) => {
    set({
      project,
      history: [],
      historyIndex: -1,
      selectedShapeId: null,
      selectedGroupId: null,
    });
  },
}));

export { uid, DEFAULT_PALETTE };
