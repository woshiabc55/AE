import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Panel, Project, ProjectType, SaveState, Theme } from '@/lib/types';
import { PROJECT_TYPE_COLORS } from '@/lib/types';
import { uid } from '@/lib/utils';

const DEFAULT_STATE: SaveState = {
  version: 1,
  projects: [],
  activeProjectId: null,
  theme: 'cream',
};

type CreateProjectInput = {
  title: string;
  type: ProjectType;
  description?: string;
  color?: string;
};

type Store = SaveState & {
  // 项目操作
  createProject: (input: CreateProjectInput) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => string;
  setActiveProject: (id: string | null) => void;

  // 分镜操作
  addPanel: (projectId: string) => string;
  updatePanel: (projectId: string, panelId: string, patch: Partial<Panel>) => void;
  deletePanel: (projectId: string, panelId: string) => void;
  reorderPanels: (projectId: string, fromIndex: number, toIndex: number) => void;
  duplicatePanel: (projectId: string, panelId: string) => void;

  // 导入导出
  importFromJson: (data: SaveState) => void;
  exportToJson: (projectId?: string) => string;
  resetAll: () => void;

  // 主题
  setTheme: (theme: Theme) => void;
};

function touch<T extends Project>(p: T): T {
  p.updatedAt = Date.now();
  return p;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      createProject: (input) => {
        const id = uid();
        const now = Date.now();
        const project: Project = {
          id,
          title: input.title || '未命名项目',
          type: input.type,
          description: input.description || '',
          color: input.color || PROJECT_TYPE_COLORS[input.type],
          panels: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ projects: [project, ...s.projects], activeProjectId: id }));
        return id;
      },

      updateProject: (id, patch) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? touch({ ...p, ...patch }) : p)),
        }));
      },

      deleteProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        }));
      },

      duplicateProject: (id) => {
        const src = get().projects.find((p) => p.id === id);
        if (!src) return '';
        const newId = uid();
        const now = Date.now();
        const copy: Project = {
          ...src,
          id: newId,
          title: `${src.title} 副本`,
          createdAt: now,
          updatedAt: now,
          panels: src.panels.map((pnl) => ({ ...pnl, id: uid() })),
        };
        set((s) => ({ projects: [copy, ...s.projects] }));
        return newId;
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      addPanel: (projectId) => {
        const id = uid();
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? touch({
                  ...p,
                  panels: [
                    ...p.panels,
                    {
                      id,
                      shotType: 'MS',
                      cameraMove: 'static',
                      duration: 3,
                      description: '',
                      dialogue: '',
                      sound: '',
                      imageUrl: '',
                    },
                  ],
                })
              : p
          ),
        }));
        return id;
      },

      updatePanel: (projectId, panelId, patch) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? touch({
                  ...p,
                  panels: p.panels.map((pnl) => (pnl.id === panelId ? { ...pnl, ...patch } : pnl)),
                })
              : p
          ),
        }));
      },

      deletePanel: (projectId, panelId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? touch({ ...p, panels: p.panels.filter((pnl) => pnl.id !== panelId) })
              : p
          ),
        }));
      },

      reorderPanels: (projectId, fromIndex, toIndex) => {
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p;
            const next = [...p.panels];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return touch({ ...p, panels: next });
          }),
        }));
      },

      duplicatePanel: (projectId, panelId) => {
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p;
            const idx = p.panels.findIndex((pnl) => pnl.id === panelId);
            if (idx < 0) return p;
            const copy = { ...p.panels[idx], id: uid() };
            const next = [...p.panels];
            next.splice(idx + 1, 0, copy);
            return touch({ ...p, panels: next });
          }),
        }));
      },

      importFromJson: (data) => {
        if (!data || data.version !== 1) return;
        set(() => ({
          version: 1,
          projects: data.projects || [],
          activeProjectId: data.activeProjectId ?? null,
          theme: data.theme ?? 'cream',
        }));
      },

      exportToJson: (projectId) => {
        const s = get();
        const payload: SaveState = {
          version: 1,
          projects: projectId ? s.projects.filter((p) => p.id === projectId) : s.projects,
          activeProjectId: s.activeProjectId,
          theme: s.theme,
        };
        return JSON.stringify(payload, null, 2);
      },

      resetAll: () => set({ ...DEFAULT_STATE }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'storyboarder-projects-v1',
      version: 1,
    }
  )
);
