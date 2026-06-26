import { create } from 'zustand';
import type {
  Project, Layer, SVGElement, Keyframe, Scene, Transform,
  FillStyle, StrokeStyle, Variable, EventBinding,
} from '../types';
import { defaultTransform, defaultFill, defaultStroke, defaultEasing, defaultTransition, LAYER_COLORS } from '../types';

interface ProjectState {
  project: Project;
  selectedElementId: string | null;
  selectedLayerId: string | null;

  // 项目
  setProjectName: (name: string) => void;
  setCanvasSize: (w: number, h: number) => void;
  setFps: (fps: number) => void;
  setDuration: (d: number) => void;
  setBackgroundColor: (c: string) => void;

  // 元素
  addElement: (type: SVGElement['type'], attrs?: Record<string, number | string>) => SVGElement;
  updateElement: (id: string, updates: Partial<SVGElement>) => void;
  removeElement: (id: string) => void;
  updateElementTransform: (id: string, transform: Partial<Transform>) => void;
  updateElementFill: (id: string, fill: Partial<FillStyle>) => void;
  updateElementStroke: (id: string, stroke: Partial<StrokeStyle>) => void;
  selectElement: (id: string | null) => void;

  // 图层
  addLayer: (name: string, type?: Layer['type']) => Layer;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  reorderLayer: (id: string, newOrder: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  selectLayer: (id: string | null) => void;

  // 关键帧
  addKeyframe: (kf: Keyframe) => void;
  removeKeyframe: (id: string) => void;
  updateKeyframe: (id: string, updates: Partial<Keyframe>) => void;

  // 场景
  addScene: (name: string) => Scene;
  removeScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;

  // 变量
  addVariable: (v: Variable) => void;
  removeVariable: (id: string) => void;

  // 事件
  addEventBinding: (eb: EventBinding) => void;
  removeEventBinding: (id: string) => void;

  getSelectedElement: () => SVGElement | undefined;
  getSelectedLayer: () => Layer | undefined;
}

function createDefaultProject(): Project {
  return {
    id: `proj-${Date.now()}`,
    name: '未命名项目',
    width: 800,
    height: 600,
    fps: 60,
    duration: 3,
    backgroundColor: '#0f1117',
    scenes: [{
      id: 'scene-1',
      name: '场景 1',
      order: 0,
      startFrame: 0,
      endFrame: 180,
      transition: { ...defaultTransition },
      thumbnail: '',
    }],
    layers: [],
    elements: [],
    keyframes: [],
    variables: [],
    eventBindings: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createDefaultProject(),
  selectedElementId: null,
  selectedLayerId: null,

  setProjectName: (name) => set((s) => ({ project: { ...s.project, name, updatedAt: Date.now() } })),
  setCanvasSize: (w, h) => set((s) => ({ project: { ...s.project, width: w, height: h, updatedAt: Date.now() } })),
  setFps: (fps) => set((s) => ({ project: { ...s.project, fps, updatedAt: Date.now() } })),
  setDuration: (d) => set((s) => ({ project: { ...s.project, duration: d, updatedAt: Date.now() } })),
  setBackgroundColor: (c) => set((s) => ({ project: { ...s.project, backgroundColor: c, updatedAt: Date.now() } })),

  addElement: (type, attrs = {}) => {
    const id = `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const state = get();
    let layerId = state.selectedLayerId;

    if (!layerId) {
      const layer = get().addLayer(`${type}-${Date.now().toString(36)}`, 'shape');
      layerId = layer.id;
    }

    const defaults: Record<string, Record<string, number | string>> = {
      rect: { x: 100, y: 100, width: 120, height: 80, rx: 0 },
      circle: { cx: 200, cy: 200, r: 50 },
      ellipse: { cx: 200, cy: 200, rx: 70, ry: 40 },
      line: { x1: 100, y1: 100, x2: 200, y2: 200 },
      path: { d: '' },
      text: { x: 150, y: 150, fontSize: 24, textContent: '文字' },
      g: {},
      image: { x: 100, y: 100, width: 200, height: 150, href: '' },
    };

    const element: SVGElement = {
      id,
      layerId: layerId!,
      type,
      attrs: { ...(defaults[type] || {}), ...attrs },
      transform: { ...defaultTransform },
      fill: { ...defaultFill },
      stroke: { ...defaultStroke },
    };

    set((s) => {
      const layers = s.project.layers.map((l) =>
        l.id === layerId ? { ...l, elementIds: [...l.elementIds, id] } : l
      );
      return {
        selectedElementId: id,
        project: { ...s.project, elements: [...s.project.elements, element], layers, updatedAt: Date.now() },
      };
    });
    return element;
  },

  updateElement: (id, updates) => set((s) => ({
    project: {
      ...s.project,
      elements: s.project.elements.map((e) => e.id === id ? { ...e, ...updates } : e),
      updatedAt: Date.now(),
    },
  })),

  removeElement: (id) => set((s) => {
    const el = s.project.elements.find((e) => e.id === id);
    if (!el) return s;
    return {
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
      project: {
        ...s.project,
        elements: s.project.elements.filter((e) => e.id !== id),
        keyframes: s.project.keyframes.filter((kf) => kf.elementId !== id),
        layers: s.project.layers.map((l) =>
          l.id === el.layerId ? { ...l, elementIds: l.elementIds.filter((eid) => eid !== id) } : l
        ),
        updatedAt: Date.now(),
      },
    };
  }),

  updateElementTransform: (id, transform) => set((s) => ({
    project: {
      ...s.project,
      elements: s.project.elements.map((e) =>
        e.id === id ? { ...e, transform: { ...e.transform, ...transform } } : e
      ),
      updatedAt: Date.now(),
    },
  })),

  updateElementFill: (id, fill) => set((s) => ({
    project: {
      ...s.project,
      elements: s.project.elements.map((e) =>
        e.id === id ? { ...e, fill: { ...e.fill, ...fill } } : e
      ),
      updatedAt: Date.now(),
    },
  })),

  updateElementStroke: (id, stroke) => set((s) => ({
    project: {
      ...s.project,
      elements: s.project.elements.map((e) =>
        e.id === id ? { ...e, stroke: { ...e.stroke, ...stroke } } : e
      ),
      updatedAt: Date.now(),
    },
  })),

  selectElement: (id) => set({ selectedElementId: id }),

  addLayer: (name, type = 'shape') => {
    const id = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const state = get();
    const colorIndex = state.project.layers.length % LAYER_COLORS.length;
    const layer: Layer = {
      id,
      name,
      type,
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      parentId: null,
      order: state.project.layers.length,
      colorTag: LAYER_COLORS[colorIndex],
      elementIds: [],
      expanded: true,
    };
    set((s) => ({
      project: { ...s.project, layers: [...s.project.layers, layer], updatedAt: Date.now() },
    }));
    return layer;
  },

  removeLayer: (id) => set((s) => ({
    selectedLayerId: s.selectedLayerId === id ? null : s.selectedLayerId,
    project: {
      ...s.project,
      layers: s.project.layers.filter((l) => l.id !== id),
      elements: s.project.elements.filter((e) => e.layerId !== id),
      keyframes: s.project.keyframes.filter((kf) => kf.layerId !== id),
      updatedAt: Date.now(),
    },
  })),

  updateLayer: (id, updates) => set((s) => ({
    project: {
      ...s.project,
      layers: s.project.layers.map((l) => l.id === id ? { ...l, ...updates } : l),
      updatedAt: Date.now(),
    },
  })),

  reorderLayer: (id, newOrder) => set((s) => {
    const layers = [...s.project.layers].sort((a, b) => a.order - b.order);
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return s;
    const [layer] = layers.splice(idx, 1);
    layers.splice(newOrder, 0, layer);
    return {
      project: {
        ...s.project,
        layers: layers.map((l, i) => ({ ...l, order: i })),
        updatedAt: Date.now(),
      },
    };
  }),

  toggleLayerVisibility: (id) => set((s) => ({
    project: {
      ...s.project,
      layers: s.project.layers.map((l) => l.id === id ? { ...l, visible: !l.visible } : l),
      updatedAt: Date.now(),
    },
  })),

  toggleLayerLock: (id) => set((s) => ({
    project: {
      ...s.project,
      layers: s.project.layers.map((l) => l.id === id ? { ...l, locked: !l.locked } : l),
      updatedAt: Date.now(),
    },
  })),

  selectLayer: (id) => set({ selectedLayerId: id }),

  addKeyframe: (kf) => set((s) => ({
    project: { ...s.project, keyframes: [...s.project.keyframes, kf], updatedAt: Date.now() },
  })),

  removeKeyframe: (id) => set((s) => ({
    project: { ...s.project, keyframes: s.project.keyframes.filter((kf) => kf.id !== id), updatedAt: Date.now() },
  })),

  updateKeyframe: (id, updates) => set((s) => ({
    project: {
      ...s.project,
      keyframes: s.project.keyframes.map((kf) => kf.id === id ? { ...kf, ...updates } : kf),
      updatedAt: Date.now(),
    },
  })),

  addScene: (name) => {
    const id = `scene-${Date.now()}`;
    const state = get();
    const scene: Scene = {
      id,
      name,
      order: state.project.scenes.length,
      startFrame: state.project.scenes.length * 180,
      endFrame: (state.project.scenes.length + 1) * 180,
      transition: { ...defaultTransition },
      thumbnail: '',
    };
    set((s) => ({
      project: { ...s.project, scenes: [...s.project.scenes, scene], updatedAt: Date.now() },
    }));
    return scene;
  },

  removeScene: (id) => set((s) => ({
    project: {
      ...s.project,
      scenes: s.project.scenes.filter((sc) => sc.id !== id).map((sc, i) => ({ ...sc, order: i })),
      updatedAt: Date.now(),
    },
  })),

  updateScene: (id, updates) => set((s) => ({
    project: {
      ...s.project,
      scenes: s.project.scenes.map((sc) => sc.id === id ? { ...sc, ...updates } : sc),
      updatedAt: Date.now(),
    },
  })),

  addVariable: (v) => set((s) => ({
    project: { ...s.project, variables: [...s.project.variables, v], updatedAt: Date.now() },
  })),

  removeVariable: (id) => set((s) => ({
    project: { ...s.project, variables: s.project.variables.filter((v) => v.id !== id), updatedAt: Date.now() },
  })),

  addEventBinding: (eb) => set((s) => ({
    project: { ...s.project, eventBindings: [...s.project.eventBindings, eb], updatedAt: Date.now() },
  })),

  removeEventBinding: (id) => set((s) => ({
    project: { ...s.project, eventBindings: s.project.eventBindings.filter((eb) => eb.id !== id), updatedAt: Date.now() },
  })),

  getSelectedElement: () => {
    const s = get();
    return s.project.elements.find((e) => e.id === s.selectedElementId);
  },

  getSelectedLayer: () => {
    const s = get();
    return s.project.layers.find((l) => l.id === s.selectedLayerId);
  },
}));
