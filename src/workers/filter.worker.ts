// Web Worker: 大数据筛选/搜索
// 不阻塞主线程

import type { DerivativeWork, WorkType, Region } from '../data/types';

export interface WorkerRequest {
  type: 'filter' | 'stats' | 'index';
  id: number;
  payload: {
    works?: DerivativeWork[];
    filters?: {
      query: string;
      types: WorkType[];
      regions: Region[];
      ipIds: string[];
      yearRange: [number, number];
      tags: string[];
      sort: 'year' | 'popularity' | 'title';
      sortDesc: boolean;
    };
  };
}

export interface WorkerResponse {
  type: 'filter' | 'stats' | 'index';
  id: number;
  result: DerivativeWork[] | StatsResult | null;
  duration: number;
  error?: string;
}

export interface StatsResult {
  total: number;
  byType: Record<string, number>;
  byRegion: Record<string, number>;
  byYear: Record<number, number>;
  topIps: Array<{ id: string; name: string; count: number }>;
}

function applyFilter(works: DerivativeWork[], f: NonNullable<WorkerRequest['payload']['filters']>): DerivativeWork[] {
  const q = f.query.trim().toLowerCase();
  let out = works;
  if (q) {
    out = out.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.ipName.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (f.types.length) out = out.filter((w) => f.types.includes(w.type));
  if (f.regions.length) out = out.filter((w) => f.regions.includes(w.region));
  if (f.ipIds.length) out = out.filter((w) => f.ipIds.includes(w.ipId));
  if (f.tags.length) out = out.filter((w) => f.tags.some((t) => w.tags.includes(t)));
  out = out.filter((w) => w.year >= f.yearRange[0] && w.year <= f.yearRange[1]);

  const sorted = [...out];
  sorted.sort((a, b) => {
    let v = 0;
    if (f.sort === 'year') v = a.year - b.year;
    else if (f.sort === 'popularity') v = a.popularity - b.popularity;
    else v = a.title.localeCompare(b.title, 'zh');
    return f.sortDesc ? -v : v;
  });
  return sorted;
}

function computeStats(works: DerivativeWork[]): StatsResult {
  const byType: Record<string, number> = {};
  const byRegion: Record<string, number> = {};
  const byYear: Record<number, number> = {};
  const byIp: Record<string, { name: string; count: number }> = {};
  for (const w of works) {
    byType[w.type] = (byType[w.type] || 0) + 1;
    byRegion[w.region] = (byRegion[w.region] || 0) + 1;
    byYear[w.year] = (byYear[w.year] || 0) + 1;
    const e = byIp[w.ipId];
    if (e) e.count++;
    else byIp[w.ipId] = { name: w.ipName, count: 1 };
  }
  const topIps = Object.entries(byIp)
    .map(([id, v]) => ({ id, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  return { total: works.length, byType, byRegion, byYear, topIps };
}

self.addEventListener('message', (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  const t0 = performance.now();
  try {
    let result: WorkerResponse['result'] = null;
    if (req.type === 'filter') {
      const { works, filters } = req.payload;
      if (!works || !filters) throw new Error('Missing works/filters');
      result = applyFilter(works, filters);
    } else if (req.type === 'stats') {
      const { works } = req.payload;
      if (!works) throw new Error('Missing works');
      result = computeStats(works);
    } else if (req.type === 'index') {
      // 索引构建
      const { works } = req.payload;
      if (!works) throw new Error('Missing works');
      result = computeStats(works);
    }
    const resp: WorkerResponse = {
      type: req.type,
      id: req.id,
      result,
      duration: performance.now() - t0,
    };
    (self as unknown as Worker).postMessage(resp);
  } catch (err) {
    const resp: WorkerResponse = {
      type: req.type,
      id: req.id,
      result: null,
      duration: performance.now() - t0,
      error: (err as Error).message,
    };
    (self as unknown as Worker).postMessage(resp);
  }
});
