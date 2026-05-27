import { create } from 'zustand';

interface AppState {
  activeNodeId: string | null;
  detailPanelOpen: boolean;
  expandedDimensions: Set<string>;
  editContent: string;
  isDirty: boolean;
  lastSaved: string | null;

  setActiveNode: (nodeId: string | null) => void;
  openDetailPanel: (nodeId: string) => void;
  closeDetailPanel: () => void;
  toggleDimension: (dimId: string) => void;
  setEditContent: (content: string) => void;
  markSaved: () => void;
  resetEdit: () => void;
}

const loadSavedContent = (nodeId: string): string | null => {
  try {
    const saved = localStorage.getItem(`weiyang-edit-${nodeId}`);
    return saved;
  } catch {
    return null;
  }
};

export const saveContent = (nodeId: string, content: string) => {
  try {
    localStorage.setItem(`weiyang-edit-${nodeId}`, content);
  } catch {
    // silently fail
  }
};

export const getSavedContent = (nodeId: string): string | null => {
  return loadSavedContent(nodeId);
};

export const useAppStore = create<AppState>((set) => ({
  activeNodeId: null,
  detailPanelOpen: false,
  expandedDimensions: new Set<string>(),
  editContent: '',
  isDirty: false,
  lastSaved: null,

  setActiveNode: (nodeId) => set({ activeNodeId: nodeId }),

  openDetailPanel: (nodeId) => set({ activeNodeId: nodeId, detailPanelOpen: true }),

  closeDetailPanel: () => set({ detailPanelOpen: false, activeNodeId: null }),

  toggleDimension: (dimId) =>
    set((state) => {
      const next = new Set(state.expandedDimensions);
      if (next.has(dimId)) {
        next.delete(dimId);
      } else {
        next.add(dimId);
      }
      return { expandedDimensions: next };
    }),

  setEditContent: (content) => set({ editContent: content, isDirty: true }),

  markSaved: () => set({ isDirty: false, lastSaved: new Date().toISOString() }),

  resetEdit: () => set({ editContent: '', isDirty: false, lastSaved: null }),
}));
