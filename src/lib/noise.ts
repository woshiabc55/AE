// 简单 3D 噪声函数（基于哈希 + 插值），用于粒子系统中的微抖动
// 比完整 Simplex 噪声轻量，足够用于视觉抖动

function hash(x: number, y: number, z: number): number {
  let h = x * 374761393 + y * 668265263 + z * 1274126177
  h = (h ^ (h >> 13)) * 1274126177
  h = h ^ (h >> 16)
  return (h & 0x7fffffff) / 0x7fffffff
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

export function noise3D(x: number, y: number, z: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi
  const u = smoothstep(xf)
  const v = smoothstep(yf)
  const w = smoothstep(zf)

  const c000 = hash(xi, yi, zi)
  const c100 = hash(xi + 1, yi, zi)
  const c010 = hash(xi, yi + 1, zi)
  const c110 = hash(xi + 1, yi + 1, zi)
  const c001 = hash(xi, yi, zi + 1)
  const c101 = hash(xi + 1, yi, zi + 1)
  const c011 = hash(xi, yi + 1, zi + 1)
  const c111 = hash(xi + 1, yi + 1, zi + 1)

  const x00 = c000 * (1 - u) + c100 * u
  const x10 = c010 * (1 - u) + c110 * u
  const x01 = c001 * (1 - u) + c101 * u
  const x11 = c011 * (1 - u) + c111 * u
  const y0 = x00 * (1 - v) + x10 * v
  const y1 = x01 * (1 - v) + x11 * v
  return y0 * (1 - w) + y1 * w
}
