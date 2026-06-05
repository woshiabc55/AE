import { create } from "zustand";
import { SKILLS, type ClassName, type Skill } from "@/data/skills";

interface UIState {
  classFilter: ClassName | "All";
  selectedSkillId: string | null;
  activatedIds: Set<string>;
  batchActivating: boolean;
  setFilter: (c: ClassName | "All") => void;
  selectSkill: (id: string | null) => void;
  activate: (id: string) => Promise<void>;
  batchActivate: () => Promise<void>;
  resetAll: () => void;
}

interface FXState {
  glowIntensity: number; // 0.2 - 1.5
  scanlineSpeed: number; // 0 - 2
  particleDensity: number; // 0 - 60
  particlesEnabled: boolean;
  scanlineEnabled: boolean;
  hexEnabled: boolean;
  setFX: (patch: Partial<FXState>) => void;
  resetFX: () => void;
}

const initialFX: Omit<FXState, "setFX" | "resetFX"> = {
  glowIntensity: 0.9,
  scanlineSpeed: 1,
  particleDensity: 28,
  particlesEnabled: true,
  scanlineEnabled: true,
  hexEnabled: true,
};

export const useUIStore = create<UIState>((set, get) => ({
  classFilter: "All",
  selectedSkillId: null,
  activatedIds: new Set<string>(),
  batchActivating: false,

  setFilter: (c) => set({ classFilter: c }),

  selectSkill: (id) => set({ selectedSkillId: id }),

  activate: async (id) => {
    set((s) => ({ activatedIds: new Set(s.activatedIds).add(id) }));
    await new Promise((r) => setTimeout(r, 1300));
    set((s) => {
      const next = new Set(s.activatedIds);
      next.delete(id);
      return { activatedIds: next };
    });
  },

  batchActivate: async () => {
    if (get().batchActivating) return;
    set({ batchActivating: true });
    const ids = SKILLS.map((s) => s.id);
    // 逐张分阶段触发
    for (let i = 0; i < ids.length; i++) {
      set((s) => ({ activatedIds: new Set(s.activatedIds).add(ids[i]) }));
      await new Promise((r) => setTimeout(r, 70));
    }
    await new Promise((r) => setTimeout(r, 1500));
    set({ activatedIds: new Set(), batchActivating: false });
  },

  resetAll: () => set({ activatedIds: new Set(), batchActivating: false }),
}));

export const useFXStore = create<FXState>((set) => ({
  ...initialFX,
  setFX: (patch) => set((s) => ({ ...s, ...patch })),
  resetFX: () => set({ ...initialFX }),
}));

export const selectVisibleSkills = (s: UIState): Skill[] => {
  if (s.classFilter === "All") return SKILLS;
  return SKILLS.filter((sk) => sk.className === s.classFilter);
};
