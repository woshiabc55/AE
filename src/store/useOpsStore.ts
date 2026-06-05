import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { groups as initialGroups, initialEvents } from '@/data/groups';
import type { SkillGroup, TimelineEvent } from '@/data/types';

interface OpsState {
  groups: SkillGroup[];
  activeGroupId: string;
  selectedIds: Set<string>;
  filterRarity: 'ALL' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  searchKeyword: string;
  events: TimelineEvent[];
  hud: {
    sync: number;        // 神经同步率 0~100
    operator: string;    // 操作员
    security: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    power: number;       // 0~100
  };
  // 动作
  setActiveGroup: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  invertSelection: () => void;
  setFilterRarity: (r: OpsState['filterRarity']) => void;
  setSearchKeyword: (kw: string) => void;
  batchUpgrade: () => void;
  batchEquip: () => void;
  batchUnlock: () => void;
  batchLock: () => void;
  applyToAll: (id: string) => void;
  removePack: (id: string) => void;
  pushEvent: (ev: Omit<TimelineEvent, 'id' | 'ts'>) => void;
  updateHud: (patch: Partial<OpsState['hud']>) => void;
}

const buildId = () => 'evt-' + Math.random().toString(36).slice(2, 8);

export const useOpsStore = create<OpsState>()(
  persist(
    (set, get) => ({
      groups: initialGroups,
      activeGroupId: initialGroups[0].id,
      selectedIds: new Set(),
      filterRarity: 'ALL',
      searchKeyword: '',
      events: initialEvents,
      hud: {
        sync: 91.4,
        operator: 'DR-091 · 博士',
        security: 'L4',
        power: 78,
      },
      setActiveGroup: (id) => set({ activeGroupId: id, selectedIds: new Set() }),
      toggleSelect: (id) => {
        const next = new Set(get().selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ selectedIds: next });
      },
      selectAll: () => {
        const g = get().groups.find((g) => g.id === get().activeGroupId);
        if (!g) return;
        set({ selectedIds: new Set(g.packs.map((p) => p.id)) });
      },
      clearSelection: () => set({ selectedIds: new Set() }),
      invertSelection: () => {
        const g = get().groups.find((g) => g.id === get().activeGroupId);
        if (!g) return;
        const next = new Set<string>();
        for (const p of g.packs) if (!get().selectedIds.has(p.id)) next.add(p.id);
        set({ selectedIds: next });
      },
      setFilterRarity: (r) => set({ filterRarity: r }),
      setSearchKeyword: (kw) => set({ searchKeyword: kw }),
      batchUpgrade: () => {
        const sel = get().selectedIds;
        if (sel.size === 0) return;
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.map((p) => {
            if (!sel.has(p.id) || p.locked) return p;
            return { ...p, level: Math.min(90, p.level + 1), cost: p.cost + 8 };
          }),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'OK', message: `批量升级 ${sel.size} 个目标，等级 +1` });
        get().updateHud({ sync: Math.min(100, get().hud.sync + 0.6) });
      },
      batchEquip: () => {
        const sel = get().selectedIds;
        if (sel.size === 0) return;
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.map((p) => (sel.has(p.id) ? { ...p, equipped: true } : p)),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'OK', message: `批量装配 ${sel.size} 个目标` });
      },
      batchUnlock: () => {
        const sel = get().selectedIds;
        if (sel.size === 0) return;
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.map((p) => (sel.has(p.id) ? { ...p, locked: false } : p)),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'WARN', message: `解除 ${sel.size} 个目标的锁定态` });
      },
      batchLock: () => {
        const sel = get().selectedIds;
        if (sel.size === 0) return;
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.map((p) => (sel.has(p.id) ? { ...p, locked: true } : p)),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'CRIT', message: `锁定 ${sel.size} 个目标，权限校验 L4` });
      },
      applyToAll: (id) => {
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.map((p) => (p.id === id ? { ...p, level: Math.min(90, p.level + 2) } : p)),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'OK', message: `${id} 已应用至全组，等级 +2` });
      },
      removePack: (id) => {
        const groups = get().groups.map((g) => ({
          ...g,
          packs: g.packs.filter((p) => p.id !== id),
        }));
        set({ groups });
        get().pushEvent({ code: 'EVT-' + String(get().events.length + 1).padStart(3, '0'), level: 'INFO', message: `移除技能包 ${id}` });
      },
      pushEvent: (ev) => {
        const full: TimelineEvent = { ...ev, id: buildId(), ts: Date.now() };
        set({ events: [full, ...get().events].slice(0, 24) });
      },
      updateHud: (patch) => set({ hud: { ...get().hud, ...patch } }),
    }),
    {
      name: 'rhodes.batchOps.v1',
      partialize: (s) => ({ groups: s.groups, hud: s.hud }),
    },
  ),
);
