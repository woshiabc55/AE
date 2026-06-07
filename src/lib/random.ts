// Deterministic PRNG: mulberry32
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number

export function rngRange(rng: Rng, min: number, max: number) {
  return min + (max - min) * rng()
}

export function rngInt(rng: Rng, min: number, max: number) {
  return Math.floor(rngRange(rng, min, max + 1))
}

export function rngPick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}
