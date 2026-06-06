import { create } from 'zustand';
import type { WorkType, Region } from '../data/types';

export type ViewMode = 'grid' | 'list';
export type SortKey = 'year' | 'popularity' | 'title';

export interface FilterState {
  query: string;
  types: WorkType[];
  regions: Region[];
  ipIds: string[];
  yearRange: [number, number];
  tags: string[];
  view: ViewMode;
  sort: SortKey;
  sortDesc: boolean;
}

interface UIState {
  selectedWorkId: string | null;
  drawerOpen: boolean;
}

interface AppState extends FilterState, UIState {
  setQuery: (q: string) => void;
  toggleType: (t: WorkType) => void;
  toggleRegion: (r: Region) => void;
  toggleIp: (id: string) => void;
  setYearRange: (r: [number, number]) => void;
  toggleTag: (tag: string) => void;
  setView: (v: ViewMode) => void;
  setSort: (k: SortKey) => void;
  resetFilters: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
}

const initialFilters: FilterState = {
  query: '',
  types: [],
  regions: [],
  ipIds: [],
  yearRange: [1985, 2026],
  tags: [],
  view: 'grid',
  sort: 'popularity',
  sortDesc: true,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialFilters,
  selectedWorkId: null,
  drawerOpen: false,

  setQuery: (q) => set({ query: q }),
  toggleType: (t) => set((s) => ({
    types: s.types.includes(t) ? s.types.filter((x) => x !== t) : [...s.types, t],
  })),
  toggleRegion: (r) => set((s) => ({
    regions: s.regions.includes(r) ? s.regions.filter((x) => x !== r) : [...s.regions, r],
  })),
  toggleIp: (id) => set((s) => ({
    ipIds: s.ipIds.includes(id) ? s.ipIds.filter((x) => x !== id) : [...s.ipIds, id],
  })),
  setYearRange: (r) => set({ yearRange: r }),
  toggleTag: (tag) => set((s) => ({
    tags: s.tags.includes(tag) ? s.tags.filter((x) => x !== tag) : [...s.tags, tag],
  })),
  setView: (v) => set({ view: v }),
  setSort: (k) => set((s) => ({
    sort: k,
    sortDesc: s.sort === k ? !s.sortDesc : true,
  })),
  resetFilters: () => set({ ...initialFilters }),

  openDrawer: (id) => set({ selectedWorkId: id, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));
