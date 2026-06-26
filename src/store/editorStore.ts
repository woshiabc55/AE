import { create } from 'zustand';
import * as pc from 'playcanvas';

export type ToolType = 'select' | 'translate' | 'rotate' | 'scale';

export interface TransformData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface MaterialData {
  baseColor: string;
  metalness: number;
  roughness: number;
  emissiveColor: string;
  emissiveIntensity: number;
}

export interface SceneObject {
  id: string;
  name: string;
  visible: boolean;
  type: 'model' | 'light' | 'camera' | 'primitive';
  transform: TransformData;
  material: MaterialData;
  children: string[];
  parent: string | null;
}

interface HistoryEntry {
  objects: SceneObject[];
  selectedObjectId: string | null;
}

let pcApp: pc.Application | null = null;
const entityMap = new Map<string, pc.Entity>();

export const setPcApp = (app: pc.Application) => {
  pcApp = app;
};

export const getPcApp = () => pcApp;

export const registerEntity = (id: string, entity: pc.Entity) => {
  entityMap.set(id, entity);
};

export const unregisterEntity = (id: string) => {
  entityMap.delete(id);
};

export const getEntity = (id: string): pc.Entity | undefined => {
  return entityMap.get(id);
};

const MAX_HISTORY = 50;

interface EditorState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  activeTool: ToolType;
  ambientIntensity: number;
  directionalLightDir: [number, number, number];
  directionalLightColor: string;
  directionalLightIntensity: number;
  history: HistoryEntry[];
  historyIndex: number;

  setActiveTool: (tool: ToolType) => void;
  selectObject: (id: string | null) => void;
  addObject: (obj: SceneObject) => void;
  removeObject: (id: string) => void;
  updateTransform: (id: string, transform: Partial<TransformData>) => void;
  updateMaterial: (id: string, material: Partial<MaterialData>) => void;
  toggleVisibility: (id: string) => void;
  renameObject: (id: string, name: string) => void;
  setAmbientIntensity: (intensity: number) => void;
  setDirectionalLightDir: (dir: [number, number, number]) => void;
  setDirectionalLightColor: (color: string) => void;
  setDirectionalLightIntensity: (intensity: number) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

function applyEntityTransforms(objects: SceneObject[]) {
  for (const obj of objects) {
    const entity = entityMap.get(obj.id);
    if (!entity) continue;
    entity.setPosition(obj.transform.position[0], obj.transform.position[1], obj.transform.position[2]);
    entity.setEulerAngles(obj.transform.rotation[0], obj.transform.rotation[1], obj.transform.rotation[2]);
    entity.setLocalScale(obj.transform.scale[0], obj.transform.scale[1], obj.transform.scale[2]);
    entity.enabled = obj.visible;
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  objects: [],
  selectedObjectId: null,
  activeTool: 'select',
  ambientIntensity: 0.5,
  directionalLightDir: [45, 30, 0],
  directionalLightColor: '#ffffff',
  directionalLightIntensity: 1.0,
  history: [{ objects: [], selectedObjectId: null }],
  historyIndex: 0,

  pushHistory: () => {
    const { objects, selectedObjectId, history, historyIndex } = get();
    const snapshot: HistoryEntry = {
      objects: JSON.parse(JSON.stringify(objects)),
      selectedObjectId,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    set({
      objects: JSON.parse(JSON.stringify(entry.objects)),
      selectedObjectId: entry.selectedObjectId,
      historyIndex: newIndex,
    });
    applyEntityTransforms(get().objects);
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    set({
      objects: JSON.parse(JSON.stringify(entry.objects)),
      selectedObjectId: entry.selectedObjectId,
      historyIndex: newIndex,
    });
    applyEntityTransforms(get().objects);
  },

  setActiveTool: (tool) => set({ activeTool: tool }),

  selectObject: (id) => set({ selectedObjectId: id }),

  addObject: (obj) => {
    set((state) => ({ objects: [...state.objects, obj] }));
    get().pushHistory();
  },

  removeObject: (id) => {
    const entity = entityMap.get(id);
    if (entity && pcApp) {
      entity.destroy();
      entityMap.delete(id);
    }
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    }));
    get().pushHistory();
  },

  updateTransform: (id, transform) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, transform: { ...obj.transform, ...transform } } : obj
      ),
    }));
    const entity = entityMap.get(id);
    if (entity) {
      const current = get().objects.find((o) => o.id === id);
      if (!current) return;
      const t = { ...current.transform, ...transform };
      entity.setPosition(t.position[0], t.position[1], t.position[2]);
      entity.setEulerAngles(t.rotation[0], t.rotation[1], t.rotation[2]);
      entity.setLocalScale(t.scale[0], t.scale[1], t.scale[2]);
    }
    get().pushHistory();
  },

  updateMaterial: (id, material) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, material: { ...obj.material, ...material } } : obj
      ),
    }));
    const entity = entityMap.get(id);
    if (entity && pcApp) {
      const current = get().objects.find((o) => o.id === id);
      if (!current) return;
      const m = { ...current.material, ...material };
      const meshInstances: pc.MeshInstance[] = [];
      const renderComp = entity.findComponent('render');
      if (renderComp && (renderComp as any).meshInstances) {
        meshInstances.push(...(renderComp as any).meshInstances);
      }
      for (const child of entity.children) {
        if (child instanceof pc.Entity) {
          const childRender = child.findComponent('render');
          if (childRender && (childRender as any).meshInstances) {
            meshInstances.push(...(childRender as any).meshInstances);
          }
        }
      }
      meshInstances.forEach((mi) => {
        const mat = mi.material;
        if (mat && mat instanceof pc.StandardMaterial) {
          const hex = m.baseColor.replace('#', '');
          mat.diffuse.set(
            parseInt(hex.substring(0, 2), 16) / 255,
            parseInt(hex.substring(2, 4), 16) / 255,
            parseInt(hex.substring(4, 6), 16) / 255
          );
          mat.useMetalness = true;
          mat.metalness = m.metalness;
          mat.gloss = 1 - m.roughness;
          const eHex = m.emissiveColor.replace('#', '');
          mat.emissive.set(
            parseInt(eHex.substring(0, 2), 16) / 255,
            parseInt(eHex.substring(2, 4), 16) / 255,
            parseInt(eHex.substring(4, 6), 16) / 255
          );
          mat.emissiveIntensity = m.emissiveIntensity;
          mat.update();
        }
      });
    }
    get().pushHistory();
  },

  toggleVisibility: (id) => {
    const entity = entityMap.get(id);
    if (entity) {
      const obj = get().objects.find((o) => o.id === id);
      if (obj) {
        entity.enabled = !obj.visible;
      }
    }
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      ),
    }));
    get().pushHistory();
  },

  renameObject: (id, name) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, name } : obj)),
    })),

  setAmbientIntensity: (intensity) => {
    set({ ambientIntensity: intensity });
    if (pcApp) {
      pcApp.scene.ambientLight = new pc.Color(intensity, intensity, intensity);
    }
  },

  setDirectionalLightDir: (dir) => {
    set({ directionalLightDir: dir });
    const entity = entityMap.get('__directionalLight__');
    if (entity) {
      entity.setEulerAngles(dir[0], dir[1], dir[2]);
    }
  },

  setDirectionalLightColor: (color) => {
    set({ directionalLightColor: color });
    const entity = entityMap.get('__directionalLight__');
    if (entity) {
      const light = entity.light;
      if (light) {
        const hex = color.replace('#', '');
        light.color.set(
          parseInt(hex.substring(0, 2), 16) / 255,
          parseInt(hex.substring(2, 4), 16) / 255,
          parseInt(hex.substring(4, 6), 16) / 255
        );
      }
    }
  },

  setDirectionalLightIntensity: (intensity) => {
    set({ directionalLightIntensity: intensity });
    const entity = entityMap.get('__directionalLight__');
    if (entity) {
      const light = entity.light;
      if (light) {
        light.intensity = intensity;
      }
    }
  },
}));
