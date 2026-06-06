import type { DerivativeWork } from '../data/types';

export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function topNByIpCount(works: DerivativeWork[], n: number) {
  const m = new Map<string, { name: string; count: number }>();
  for (const w of works) {
    const e = m.get(w.ipId);
    if (e) e.count++;
    else m.set(w.ipId, { name: w.ipName, count: 1 });
  }
  return Array.from(m.entries())
    .map(([id, v]) => ({ id, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function countBy<T extends string | number>(arr: DerivativeWork[], key: (w: DerivativeWork) => T) {
  const m = new Map<T, number>();
  for (const w of arr) {
    const k = key(w);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return Array.from(m.entries());
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
