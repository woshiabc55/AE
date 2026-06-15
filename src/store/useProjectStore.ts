import { create } from "zustand";
import type { Annotation, Chapter, Project, ThemeConfig } from "@/types";
import { DEFAULT_THEME } from "@/types";
import { uid } from "@/utils/id";
import { loadVideoFile, type VideoMeta } from "@/engine/video";

type Tool = "select" | "bone" | "facial" | "chapter" | "compare";

type CompareRange = { a: [number, number]; b: [number, number] } | null;

type State = {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  tool: Tool;
  selectedAnnotationId: string | null;
  selectedChapterId: string | null;
  isExporting: boolean;
  showExportDialog: boolean;
  compareRange: CompareRange;
  history: { past: Project[]; future: Project[] };
};

type Actions = {
  setProjectName: (name: string) => void;
  loadVideoFromFile: (file: File) => Promise<void>;
  loadVideoMeta: (meta: VideoMeta) => void;
  setCurrentTime: (t: number) => void;
  setIsPlaying: (p: boolean) => void;
  setTool: (t: Tool) => void;
  selectAnnotation: (id: string | null) => void;
  selectChapter: (id: string | null) => void;
  addAnnotation: (a: Annotation) => void;
  updateAnnotation: (id: string, patch: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  addChapter: (c?: Partial<Chapter>) => Chapter;
  updateChapter: (id: string, patch: Partial<Chapter>) => void;
  removeChapter: (id: string) => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
  setShowExportDialog: (b: boolean) => void;
  setIsExporting: (b: boolean) => void;
  setCompareRange: (r: CompareRange) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  hydrate: (p: Project) => void;
};

const initialProject = (): Project => ({
  id: uid("proj"),
  name: "未命名工程",
  video: {
    src: "",
    fileName: undefined,
    mime: undefined,
    duration: 0,
    width: 1280,
    height: 720,
    fps: 30,
  },
  chapters: [],
  annotations: [],
  theme: { ...DEFAULT_THEME },
  updatedAt: Date.now(),
});

const snapshot = (p: Project) => JSON.parse(JSON.stringify(p)) as Project;

const chapterColor = (i: number) =>
  ["#7CFFB2", "#FF5DA2", "#FFC857", "#7CC8FF", "#C792EA", "#FF8E72"][i % 6];

export const useProjectStore = create<State & Actions>((set, get) => ({
  project: initialProject(),
  currentTime: 0,
  isPlaying: false,
  tool: "select",
  selectedAnnotationId: null,
  selectedChapterId: null,
  isExporting: false,
  showExportDialog: false,
  compareRange: null,
  history: { past: [], future: [] },

  setProjectName: (name) =>
    set((s) => pushHistory(s, { ...s.project, name, updatedAt: Date.now() })),

  loadVideoFromFile: async (file) => {
    const meta = await loadVideoFile(file);
    get().loadVideoMeta(meta);
  },

  loadVideoMeta: (meta) => {
    set((s) => {
      const p = snapshot(s.project);
      p.video = {
        src: meta.src,
        fileName: meta.fileName,
        mime: meta.mime,
        duration: meta.duration,
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
      };
      // 自动建一个全视频章节
      p.chapters = [
        {
          id: uid("ch"),
          title: "整段",
          start: 0,
          end: meta.duration,
          color: chapterColor(0),
        },
      ];
      p.annotations = [];
      p.updatedAt = Date.now();
      return { project: p, currentTime: 0, isPlaying: false, history: { past: [], future: [] } };
    });
  },

  setCurrentTime: (t) => set({ currentTime: t }),
  setIsPlaying: (p) => set({ isPlaying: p }),
  setTool: (t) => set({ tool: t, selectedAnnotationId: null }),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  selectChapter: (id) => set({ selectedChapterId: id }),

  addAnnotation: (a) =>
    set((s) =>
      pushHistory(s, {
        ...s.project,
        annotations: [...s.project.annotations, a],
        updatedAt: Date.now(),
      })
    ),

  updateAnnotation: (id, patch) =>
    set((s) =>
      pushHistory(s, {
        ...s.project,
        annotations: s.project.annotations.map((a) =>
          a.id === id ? ({ ...a, ...patch } as Annotation) : a
        ),
        updatedAt: Date.now(),
      })
    ),

  removeAnnotation: (id) =>
    set((s) => ({
      ...pushHistory(s, {
        ...s.project,
        annotations: s.project.annotations.filter((a) => a.id !== id),
        updatedAt: Date.now(),
      }),
      selectedAnnotationId: null,
    })),

  addChapter: (c) => {
    const ch: Chapter = {
      id: uid("ch"),
      title: c?.title ?? "新章节",
      start: c?.start ?? get().currentTime,
      end: c?.end ?? Math.min(get().currentTime + 10, get().project.video.duration || 10),
      color: c?.color ?? chapterColor(get().project.chapters.length),
    };
    set((s) =>
      pushHistory(s, {
        ...s.project,
        chapters: [...s.project.chapters, ch],
        updatedAt: Date.now(),
      })
    );
    return ch;
  },

  updateChapter: (id, patch) =>
    set((s) =>
      pushHistory(s, {
        ...s.project,
        chapters: s.project.chapters.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
        updatedAt: Date.now(),
      })
    ),

  removeChapter: (id) =>
    set((s) => ({
      ...pushHistory(s, {
        ...s.project,
        chapters: s.project.chapters.filter((c) => c.id !== id),
        updatedAt: Date.now(),
      }),
      selectedChapterId: null,
    })),

  setTheme: (patch) =>
    set((s) => ({
      project: { ...s.project, theme: { ...s.project.theme, ...patch }, updatedAt: Date.now() },
    })),

  setShowExportDialog: (b) => set({ showExportDialog: b }),
  setIsExporting: (b) => set({ isExporting: b }),
  setCompareRange: (r) => set({ compareRange: r }),

  undo: () =>
    set((s) => {
      if (!s.history.past.length) return s;
      const prev = s.history.past[s.history.past.length - 1];
      return {
        project: prev,
        history: {
          past: s.history.past.slice(0, -1),
          future: [snapshot(s.project), ...s.history.future].slice(0, 50),
        },
      };
    }),

  redo: () =>
    set((s) => {
      if (!s.history.future.length) return s;
      const next = s.history.future[0];
      return {
        project: next,
        history: {
          past: [...s.history.past, snapshot(s.project)].slice(-50),
          future: s.history.future.slice(1),
        },
      };
    }),

  reset: () =>
    set({
      project: initialProject(),
      currentTime: 0,
      isPlaying: false,
      tool: "select",
      selectedAnnotationId: null,
      selectedChapterId: null,
      isExporting: false,
      showExportDialog: false,
      compareRange: null,
      history: { past: [], future: [] },
    }),

  hydrate: (p) => set({ project: p, currentTime: 0, history: { past: [], future: [] } }),
}));

function pushHistory(state: State, project: Project): Partial<State> {
  return {
    project,
    history: {
      past: [...state.history.past, snapshot(state.project)].slice(-50),
      future: [],
    },
  };
}
