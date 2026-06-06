import { defineStore } from 'pinia';
import type { WorkType, Region } from '@/data/types';

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

export const useAppStore = defineStore('app', {
  state: () => ({
    ...initialFilters,
    selectedWorkId: null as string | null,
    drawerOpen: false,
  }),
  actions: {
    setQuery(q: string) { this.query = q; },
    toggleType(t: WorkType) {
      this.types = this.types.includes(t) ? this.types.filter((x) => x !== t) : [...this.types, t];
    },
    toggleRegion(r: Region) {
      this.regions = this.regions.includes(r) ? this.regions.filter((x) => x !== r) : [...this.regions, r];
    },
    toggleIp(id: string) {
      this.ipIds = this.ipIds.includes(id) ? this.ipIds.filter((x) => x !== id) : [...this.ipIds, id];
    },
    setYearRange(r: [number, number]) { this.yearRange = r; },
    toggleTag(tag: string) {
      this.tags = this.tags.includes(tag) ? this.tags.filter((x) => x !== tag) : [...this.tags, tag];
    },
    setView(v: ViewMode) { this.view = v; },
    setSort(k: SortKey) {
      if (this.sort === k) this.sortDesc = !this.sortDesc;
      else { this.sort = k; this.sortDesc = true; }
    },
    resetFilters() {
      Object.assign(this, initialFilters);
    },
    openDrawer(id: string) { this.selectedWorkId = id; this.drawerOpen = true; },
    closeDrawer() { this.drawerOpen = false; this.selectedWorkId = null; },
  },
  getters: {
    activeFilterCount(state): number {
      let n = 0;
      if (state.query) n++;
      if (state.types.length) n++;
      if (state.regions.length) n++;
      if (state.ipIds.length) n++;
      if (state.tags.length) n++;
      if (state.yearRange[0] !== 1985 || state.yearRange[1] !== 2026) n++;
      return n;
    },
  },
});
