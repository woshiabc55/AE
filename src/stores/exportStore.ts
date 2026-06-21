import { create } from "zustand";
import type { GiderFile, Pose, Bead, Joint } from "@/types";
import { serializeGider } from "@/utils/giderFormat";
import { useStudioStore } from "./studioStore";
import { unfoldMask, type UnfoldedMask } from "@/engine/maskUnfolder";

interface ExportState {
  giderFile: GiderFile | null;
  mask: UnfoldedMask | null;
  playing: boolean;
  speed: number;
  currentPoses: Pose[];
  buildFromStudio: () => void;
  setPlaying: (p: boolean) => void;
  setSpeed: (s: number) => void;
  setCurrentPoses: (p: Pose[]) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  giderFile: null,
  mask: null,
  playing: false,
  speed: 1,
  currentPoses: [],

  buildFromStudio: () => {
    const s = useStudioStore.getState();
    if (!s.projectId || !s.skeleton || !s.animation) {
      set({ giderFile: null, mask: null });
      return;
    }
    const allBeads: Bead[] = s.modules.flatMap((m) => m.beads);
    const joints: Joint[] = s.skeleton.joints;
    const file = serializeGider({
      project: {
        id: s.projectId,
        name: s.projectName,
        gridSize: s.gridSize,
        palette: s.palette,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      modules: s.modules,
      skeleton: s.skeleton,
      keyframes: s.keyframes,
      animation: s.animation,
    });
    const mask = unfoldMask(allBeads, joints);
    set({ giderFile: file, mask });
  },

  setPlaying: (p) => set({ playing: p }),
  setSpeed: (sp) => set({ speed: sp }),
  setCurrentPoses: (p) => set({ currentPoses: p }),
}));
