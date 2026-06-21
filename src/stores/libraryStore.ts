import { create } from "zustand";
import type { Project } from "@/types";
import { listProjects, deleteProject, db } from "@/db/db";
import { useStudioStore } from "./studioStore";
import { HALF_TEMPLATES, getTemplateBeads, getTemplateMirrorBeads } from "@/utils/templates";
import { uid } from "@/db/db";

interface LibraryState {
  projects: Project[];
  loading: boolean;
  search: string;
  refresh: () => Promise<void>;
  setSearch: (s: string) => void;
  removeProject: (id: string) => Promise<void>;
  newFromTemplate: (templateId: string, name: string) => Promise<string>;
  newBlank: (name: string, gridSize: number) => Promise<string>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  projects: [],
  loading: false,
  search: "",

  refresh: async () => {
    set({ loading: true });
    const projects = await listProjects();
    set({ projects, loading: false });
  },

  setSearch: (s) => set({ search: s }),

  removeProject: async (id) => {
    await deleteProject(id);
    await get().refresh();
  },

  newBlank: async (name, gridSize) => {
    const studio = useStudioStore.getState();
    studio.newProject(name, gridSize);
    await studio.saveProject();
    await get().refresh();
    return studio.projectId!;
  },

  newFromTemplate: async (templateId, name) => {
    const t = HALF_TEMPLATES.find((x) => x.id === templateId);
    if (!t) return "";
    const studio = useStudioStore.getState();
    studio.newProject(name, t.gridSize);
    // 套用模板：左半面用模板，右半面用镜像
    const leftBeads = getTemplateBeads(templateId);
    const rightBeads = getTemplateMirrorBeads(templateId);
    const pid = studio.projectId!;
    await db.halfModules.where("projectId").equals(pid).delete();
    await db.halfModules.bulkPut([
      {
        id: uid("mod"),
        projectId: pid,
        side: "left",
        label: "左半面",
        beads: leftBeads,
      },
      {
        id: uid("mod"),
        projectId: pid,
        side: "right",
        label: "右半面",
        beads: rightBeads,
      },
    ]);
    // 重新加载
    await studio.loadProject(pid);
    await get().refresh();
    return pid;
  },
}));
