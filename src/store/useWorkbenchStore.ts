import { create } from "zustand";

type State = {
  activeActId: string;
  setActiveAct: (id: string) => void;
  copyState: Record<string, boolean>;
  markCopied: (key: string) => void;
};

export const useWorkbenchStore = create<State>((set) => ({
  activeActId: "act-0",
  setActiveAct: (id) => set({ activeActId: id }),
  copyState: {},
  markCopied: (key) =>
    set((s) => ({ copyState: { ...s.copyState, [key]: true } })),
}));
