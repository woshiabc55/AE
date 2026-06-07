import { create } from 'zustand';
import type { Project, SvgProjectData, SvgLayer, SvgTrack, SvgKeyframe } from '@/types';
import { uid } from '@/lib/utils';
import { listProjects, saveProject, deleteProject, loadProject } from '@/lib/storage';

interface ProjectStore {
  projects: Project[];
  current: Project | null;
  isDirty: boolean;
  lastSavedAt: number;
  init: () => Promise<void>;
  createSvgProject: (name?: string) => Promise<Project>;
  createLive2DProject: (name?: string) => Promise<Project>;
  openProject: (id: string) => Promise<Project | null>;
  closeProject: () => void;
  saveCurrent: () => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project | null>;
  // svg 编辑
  addSvgLayer: (layer: SvgLayer, index?: number) => void;
  updateSvgLayer: (id: string, patch: Partial<SvgLayer>) => void;
  removeSvgLayer: (id: string) => void;
  reorderSvgLayers: (sourceId: string, targetId: string) => void;
  addSvgTrack: (track: SvgTrack) => void;
  updateSvgTrack: (id: string, patch: Partial<SvgTrack>) => void;
  addSvgKeyframe: (trackId: string, keyframe: SvgKeyframe) => void;
  updateSvgKeyframe: (trackId: string, kfId: string, patch: Partial<SvgKeyframe>) => void;
  removeSvgKeyframe: (trackId: string, kfId: string) => void;
  setSvgDuration: (duration: number) => void;
  setCurrentName: (name: string) => void;
  updateSvgData: (patch: Partial<SvgProjectData>) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  current: null,
  isDirty: false,
  lastSavedAt: 0,

  init: async () => {
    const projects = await listProjects();
    set({ projects });
  },

  createSvgProject: async (name) => {
    const p: Project = {
      id: uid('proj'),
      name: name || '未命名 SVG 动画',
      type: 'svg',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {
        width: 800,
        height: 500,
        background: '#0B0B12',
        duration: 3,
        fps: 60,
        layers: [],
        tracks: [],
      } satisfies SvgProjectData,
    };
    await saveProject(p);
    const projects = await listProjects();
    set({ projects, current: p, isDirty: false, lastSavedAt: Date.now() });
    return p;
  },

  createLive2DProject: async (name) => {
    const p: Project = {
      id: uid('proj'),
      name: name || '未命名 Live2D 角色',
      type: 'live2d',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {
        canvas: { width: 600, height: 720 },
        background: '#10101C',
        parts: [],
        parameters: [],
        motions: [],
        expressions: [],
      },
    };
    await saveProject(p);
    const projects = await listProjects();
    set({ projects, current: p, isDirty: false, lastSavedAt: Date.now() });
    return p;
  },

  openProject: async (id) => {
    const p = await loadProject(id);
    if (p) set({ current: p, isDirty: false });
    return p ?? null;
  },

  closeProject: () => set({ current: null, isDirty: false }),

  saveCurrent: async () => {
    const cur = get().current;
    if (!cur) return;
    const updated: Project = { ...cur, updatedAt: Date.now() };
    await saveProject(updated);
    const projects = await listProjects();
    set({ current: updated, projects, isDirty: false, lastSavedAt: Date.now() });
  },

  removeProject: async (id) => {
    await deleteProject(id);
    const projects = await listProjects();
    const cur = get().current;
    set({ projects, current: cur?.id === id ? null : cur });
  },

  duplicateProject: async (id) => {
    const src = await loadProject(id);
    if (!src) return null;
    const copy: Project = {
      ...src,
      id: uid('proj'),
      name: src.name + ' 副本',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProject(copy);
    const projects = await listProjects();
    set({ projects });
    return copy;
  },

  addSvgLayer: (layer, index) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const layers = [...data.layers];
    if (typeof index === 'number') layers.splice(index, 0, layer);
    else layers.push(layer);
    set({ current: { ...cur, data: { ...data, layers } }, isDirty: true });
  },

  updateSvgLayer: (id, patch) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const layers = data.layers.map((l) => (l.id === id ? { ...l, ...patch } : l));
    set({ current: { ...cur, data: { ...data, layers } }, isDirty: true });
  },

  removeSvgLayer: (id) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const layers = data.layers.filter((l) => l.id !== id);
    const tracks = data.tracks.filter((t) => t.layerId !== id);
    set({ current: { ...cur, data: { ...data, layers, tracks } }, isDirty: true });
  },

  reorderSvgLayers: (sourceId, targetId) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const layers = [...data.layers];
    const sIdx = layers.findIndex((l) => l.id === sourceId);
    const tIdx = layers.findIndex((l) => l.id === targetId);
    if (sIdx < 0 || tIdx < 0) return;
    const [moved] = layers.splice(sIdx, 1);
    layers.splice(tIdx, 0, moved);
    set({ current: { ...cur, data: { ...data, layers } }, isDirty: true });
  },

  addSvgTrack: (track) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    set({ current: { ...cur, data: { ...data, tracks: [...data.tracks, track] } }, isDirty: true });
  },

  updateSvgTrack: (id, patch) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const tracks = data.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    set({ current: { ...cur, data: { ...data, tracks } }, isDirty: true });
  },

  addSvgKeyframe: (trackId, keyframe) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const tracks = data.tracks.map((t) =>
      t.id === trackId ? { ...t, keyframes: [...t.keyframes, keyframe].sort((a, b) => a.time - b.time) } : t,
    );
    set({ current: { ...cur, data: { ...data, tracks } }, isDirty: true });
  },

  updateSvgKeyframe: (trackId, kfId, patch) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const tracks = data.tracks.map((t) =>
      t.id === trackId
        ? { ...t, keyframes: t.keyframes.map((k) => (k.id === kfId ? { ...k, ...patch } : k)) }
        : t,
    );
    set({ current: { ...cur, data: { ...data, tracks } }, isDirty: true });
  },

  removeSvgKeyframe: (trackId, kfId) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    const tracks = data.tracks.map((t) =>
      t.id === trackId ? { ...t, keyframes: t.keyframes.filter((k) => k.id !== kfId) } : t,
    );
    set({ current: { ...cur, data: { ...data, tracks } }, isDirty: true });
  },

  setSvgDuration: (duration) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    set({ current: { ...cur, data: { ...data, duration } }, isDirty: true });
  },

  setCurrentName: (name) => {
    const cur = get().current;
    if (!cur) return;
    set({ current: { ...cur, name }, isDirty: true });
  },

  updateSvgData: (patch) => {
    const cur = get().current;
    if (!cur || cur.type !== 'svg') return;
    const data = cur.data as SvgProjectData;
    set({ current: { ...cur, data: { ...data, ...patch } }, isDirty: true });
  },
}));
