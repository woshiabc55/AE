import { create } from "zustand";
import type { TerminalLine } from "@/types";

interface TerminalStore {
  lines: TerminalLine[];
  isVisible: boolean;
  addLine: (line: TerminalLine) => void;
  clearLines: () => void;
  toggleVisibility: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  lines: [
    {
      id: "init-1",
      content: "NexusCode Terminal v1.0.0",
      type: "info",
      timestamp: Date.now(),
    },
    {
      id: "init-2",
      content: "AI 诊断引擎已就绪 ✓",
      type: "info",
      timestamp: Date.now(),
    },
  ],
  isVisible: true,
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  clearLines: () => set({ lines: [] }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
