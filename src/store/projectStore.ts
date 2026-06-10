/**
 * 简化的 Zustand store，集中管理项目状态
 * 跨路由共享同一个项目对象
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
} from "@/types";

interface ProjectState {
  project: Project;
  // 撤销/重做
  history: HistoryState[];
  historyIndex: number;
  // 当前激活的工具/状态
  currentTool: "select" | "rect" | "ellipse" | "pen" | "brush" | "eraser";
  currentColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedShapeId: string | null;
  selectedGroupId: string | null;
  // 动作
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
  // 历史
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  // 工具
  newBlankProject: () => void;
  loadTemplate: (project: Project) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();

const blankProject = (): Project => ({
  id: uid(),
  name: "未命名项目",
  canvasWidth: 600,
  canvasHeight: 800,
  shapes: [],
  groups: [],
  layers: [],
  nodes: [],
  animations: [],
  createdAt: now(),
  updatedAt: now(),
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: blankProject(),
  history: [],
  historyIndex: -1,
  currentTool: "select",
  currentColor: "#FF7AB6",
  strokeColor: "#0B0F1A",
  strokeWidth: 2,
  selectedShapeId: null,
  selectedGroupId: null,

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
      next.shapes = [
        ...next.shapes,
        { ...shape, parentId: newGroupId ?? shape.parentId ?? null },
      ];
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
    set({ project, history: [], historyIndex: -1, selectedShapeId: null, selectedGroupId: null }),

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

  pushHistory: () =>
    set((state) => {
      const snap: HistoryState = {
        shapes: JSON.parse(JSON.stringify(state.project.shapes)),
        groups: JSON.parse(JSON.stringify(state.project.groups)),
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
      next.updatedAt = now();
      return { project: next, historyIndex: state.historyIndex - 1 };
    }),

  redo: () => {
    // 简化：重做用 snap-based 不实现，提示用户重新操作
    return;
  },

  newBlankProject: () => {
    const p = blankProject();
    set({ project: p, history: [], historyIndex: -1, selectedShapeId: null, selectedGroupId: null });
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

export { uid };
