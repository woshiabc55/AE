/**
 * 种子随机数生成器（mulberry32）
 * 所有确定性随机源用种子，保证纯规则路径完全可复现。
 */
export function createRng(seed: number) {
  let state = seed >>> 0;
  return function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 从数组中按种子随机取一个元素 */
export function pickByRng<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** 概率判定 */
export function chance(rng: () => number, p: number): boolean {
  return rng() < p;
}
