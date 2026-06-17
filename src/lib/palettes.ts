// 调色板配置 - 每种调色板提供四个关键颜色：主色、副色、强调色、底色
import * as THREE from "three"

export type PaletteId = "aurora" | "cyber" | "twilight" | "mono" | "inferno"

export interface Palette {
  id: PaletteId
  name: string
  zh: string
  colors: THREE.Color[] // 4 colors
  background: string // canvas 渐变背景
}

export const PALETTES: Record<PaletteId, Palette> = {
  aurora: {
    id: "aurora",
    name: "AURORA",
    zh: "极光",
    colors: [
      new THREE.Color("#00F5A0"),
      new THREE.Color("#00D9F5"),
      new THREE.Color("#7B61FF"),
      new THREE.Color("#FF61D8"),
    ],
    background: "radial-gradient(ellipse at 30% 20%, #0F2E3A 0%, #06070C 60%)",
  },
  cyber: {
    id: "cyber",
    name: "CYBER",
    zh: "赛博",
    colors: [
      new THREE.Color("#FF006E"),
      new THREE.Color("#8338EC"),
      new THREE.Color("#3A86FF"),
      new THREE.Color("#06FFA5"),
    ],
    background: "radial-gradient(ellipse at 70% 30%, #2A0B3A 0%, #06070C 60%)",
  },
  twilight: {
    id: "twilight",
    name: "TWILIGHT",
    zh: "暮光",
    colors: [
      new THREE.Color("#FFD60A"),
      new THREE.Color("#FF8500"),
      new THREE.Color("#FF006E"),
      new THREE.Color("#3A0CA3"),
    ],
    background: "radial-gradient(ellipse at 50% 80%, #3A1A0A 0%, #06070C 60%)",
  },
  mono: {
    id: "mono",
    name: "MONO",
    zh: "纯白",
    colors: [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#D6D6E7"),
      new THREE.Color("#9A9AB0"),
      new THREE.Color("#3D3D55"),
    ],
    background: "radial-gradient(ellipse at 50% 50%, #14141C 0%, #06070C 60%)",
  },
  inferno: {
    id: "inferno",
    name: "INFERNO",
    zh: "烈焰",
    colors: [
      new THREE.Color("#FFEA00"),
      new THREE.Color("#FF8500"),
      new THREE.Color("#FF0066"),
      new THREE.Color("#7A00CC"),
    ],
    background: "radial-gradient(ellipse at 50% 50%, #3A0A1A 0%, #06070C 60%)",
  },
}

export const PALETTE_ORDER: PaletteId[] = [
  "aurora",
  "cyber",
  "twilight",
  "inferno",
  "mono",
]

// 颜色辅助：基于粒子索引与音频特征获取颜色
export function sampleColor(
  palette: Palette,
  t: number,
  audioBoost: number
): THREE.Color {
  const colors = palette.colors
  const n = colors.length - 1
  const scaled = ((t + audioBoost * 0.15) % 1 + 1) % 1
  const idx = scaled * n
  const i0 = Math.floor(idx)
  const i1 = Math.min(i0 + 1, n)
  const f = idx - i0
  const out = new THREE.Color()
  out.copy(colors[i0]).lerp(colors[i1], f)
  return out
}
