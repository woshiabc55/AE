// 5 种粒子形态预设 - 每种提供基础位置计算与运动扰动
import * as THREE from "three"

export type PresetId = "galaxy" | "vortex" | "grid" | "firework" | "noiseField"

export interface PresetConfig {
  id: PresetId
  name: string
  zh: string
  description: string
}

export const PRESETS: PresetConfig[] = [
  { id: "galaxy", name: "GALAXY", zh: "银河", description: "螺旋星云" },
  { id: "vortex", name: "VORTEX", zh: "漩涡", description: "双层反向旋转" },
  { id: "grid", name: "GRID", zh: "网格", description: "立方点阵" },
  { id: "firework", name: "FIREWORK", zh: "烟花", description: "节拍放射" },
  { id: "noiseField", name: "NOISE", zh: "噪声场", description: "流体涌动" },
]

/**
 * 计算粒子的基础位置（在单位球面内归一化到半径 1）
 * index: 粒子索引
 * total: 粒子总数
 * out: 输出的 THREE.Vector3
 */
export function basePosition(
  preset: PresetId,
  index: number,
  total: number,
  out: THREE.Vector3
): void {
  const i = index
  const t = i / Math.max(1, total - 1)
  switch (preset) {
    case "galaxy": {
      // 螺旋星系：角度 = 黄金角分布, 半径 = 平方根
      const armCount = 4
      const arm = i % armCount
      const tArm = Math.floor(i / armCount) / Math.floor(total / armCount)
      const angle = tArm * Math.PI * 12 + (arm * Math.PI * 2) / armCount
      const radius = Math.pow(tArm, 0.55) * 2.4
      const height = (Math.sin(angle * 3) * 0.18 + (Math.random() - 0.5) * 0.05) * tArm
      out.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      break
    }
    case "vortex": {
      // 双层反向漩涡
      const layer = i % 2
      const tIn = Math.floor(i / 2) / Math.floor(total / 2)
      const angle = tIn * Math.PI * 20 * (layer === 0 ? 1 : -1)
      const radius = 0.4 + tIn * 2.2
      const y = Math.sin(tIn * Math.PI * 6 + angle * 0.5) * 0.6 * (1 - tIn)
      out.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      )
      break
    }
    case "grid": {
      // 立方网格 - 随机扰动
      const n = Math.ceil(Math.cbrt(total))
      const ix = i % n
      const iy = Math.floor(i / n) % n
      const iz = Math.floor(i / (n * n))
      const span = 5
      const step = span / n
      const ox = -span / 2 + ix * step
      const oy = -span / 2 + iy * step
      const oz = -span / 2 + iz * step
      out.set(ox, oy, oz)
      break
    }
    case "firework": {
      // 球面均匀分布
      const phi = Math.acos(1 - 2 * t)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 1.8 + (i % 7) * 0.05
      out.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
      break
    }
    case "noiseField": {
      // 噪声场：使用多个正弦叠加模拟
      const u = t * 8
      const v = i * 0.137
      const x = Math.sin(u + Math.cos(v * 3)) * 2.4
      const y = Math.cos(u * 0.7 + Math.sin(v * 2)) * 1.6
      const z = Math.sin(u * 0.5 + Math.cos(v * 1.7)) * 2.4
      out.set(x, y, z)
      break
    }
  }
}

/**
 * 动态偏移 - 由音频和动画时间驱动
 */
export function dynamicOffset(
  preset: PresetId,
  index: number,
  time: number,
  freq: number, // 当前粒子频段强度 0-1
  bass: number, // 全局低频 0-1
  beat: number, // 节拍强度 0-1 (瞬时)
  speed: number,
  out: THREE.Vector3
): void {
  const i = index
  const t = i * 0.013
  switch (preset) {
    case "galaxy": {
      // 缓慢自转 + 径向脉冲
      const rot = time * 0.18 * speed
      const cR = Math.cos(rot)
      const sR = Math.sin(rot)
      const x = out.x
      const z = out.z
      out.x = x * cR - z * sR
      out.z = x * sR + z * cR
      const radial = bass * 0.25 + beat * 0.6
      out.multiplyScalar(1 + radial)
      out.y += Math.sin(time * 1.5 + t * 10) * 0.05 * (1 + freq)
      break
    }
    case "vortex": {
      // 持续旋转 + 垂直波动
      const rot = time * 0.4 * speed
      const x = out.x
      const z = out.z
      out.x = x * Math.cos(rot) - z * Math.sin(rot)
      out.z = x * Math.sin(rot) + z * Math.cos(rot)
      out.y += Math.sin(time * 2 + t * 6) * 0.08 * (1 + freq)
      const radial = beat * 0.5
      out.multiplyScalar(1 + radial)
      break
    }
    case "grid": {
      // 立方网格呼吸 + 噪声位移
      const breath = 1 + Math.sin(time * 0.6) * 0.05 + bass * 0.18
      out.x *= breath
      out.y *= breath
      out.z *= breath
      // 每个粒子的微抖动
      out.x += Math.sin(time * 2 + t * 18) * 0.05 * freq
      out.y += Math.cos(time * 2.3 + t * 21) * 0.05 * freq
      out.z += Math.sin(time * 1.7 + t * 13) * 0.05 * freq
      if (beat > 0.4) {
        out.multiplyScalar(1 + (beat - 0.4) * 0.8)
      }
      break
    }
    case "firework": {
      // 节拍爆发 + 持续扩张/收缩
      const pulse = 1 + beat * 1.4 + bass * 0.3
      out.multiplyScalar(pulse)
      // 漂移
      out.x += Math.sin(time + t * 5) * 0.05
      out.y += Math.cos(time * 1.3 + t * 4) * 0.05
      out.z += Math.sin(time * 0.7 + t * 3) * 0.05
      break
    }
    case "noiseField": {
      // 流体涌动
      out.x += Math.sin(time * 0.8 + t * 7) * 0.4 * freq
      out.y += Math.cos(time * 0.9 + t * 8) * 0.4 * freq
      out.z += Math.sin(time * 1.1 + t * 9) * 0.4 * freq
      // 整体形变
      const s = 1 + bass * 0.4 + beat * 0.6
      out.multiplyScalar(s)
      break
    }
  }
}
