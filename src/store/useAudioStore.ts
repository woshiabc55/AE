// Zustand 状态管理 - 音乐粒子应用核心 store
import { create } from "zustand"
import type { PresetId } from "@/lib/presets"
import type { PaletteId } from "@/lib/palettes"

export type AudioSource = "none" | "file" | "mic"

export interface AudioStore {
  // 音源
  source: AudioSource
  audioBuffer: AudioBuffer | null
  fileName: string | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number

  // 频谱特征（每帧更新）
  frequencyData: Uint8Array
  bassLevel: number
  midLevel: number
  trebleLevel: number
  beatPulse: number // 0-1 节拍衰减包络

  // 可视化参数
  preset: PresetId
  palette: PaletteId
  density: number
  speed: number
  glow: number
  depth: number

  // 提示
  hint: string | null

  // 动作
  setSource: (s: AudioSource) => void
  setAudioBuffer: (buf: AudioBuffer | null, name?: string | null) => void
  setIsPlaying: (v: boolean) => void
  setVolume: (v: number) => void
  setCurrentTime: (t: number) => void
  setDuration: (d: number) => void
  setFrequencyData: (d: Uint8Array, bass: number, mid: number, treble: number) => void
  setBeatPulse: (v: number) => void
  setPreset: (p: PresetId) => void
  setPalette: (p: PaletteId) => void
  setDensity: (v: number) => void
  setSpeed: (v: number) => void
  setGlow: (v: number) => void
  setDepth: (v: number) => void
  setHint: (h: string | null) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  source: "none",
  audioBuffer: null,
  fileName: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,

  frequencyData: new Uint8Array(32),
  bassLevel: 0,
  midLevel: 0,
  trebleLevel: 0,
  beatPulse: 0,

  preset: "galaxy",
  palette: "aurora",
  density: 0.55,
  speed: 1.0,
  glow: 0.8,
  depth: 0.35,

  hint: null,

  setSource: (s) => set({ source: s }),
  setAudioBuffer: (buf, name = null) =>
    set({ audioBuffer: buf, fileName: name, duration: buf ? buf.duration : 0 }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setFrequencyData: (d, bass, mid, treble) =>
    set({ frequencyData: d, bassLevel: bass, midLevel: mid, trebleLevel: treble }),
  setBeatPulse: (v) => set({ beatPulse: v }),
  setPreset: (p) => set({ preset: p }),
  setPalette: (p) => set({ palette: p }),
  setDensity: (v) => set({ density: v }),
  setSpeed: (v) => set({ speed: v }),
  setGlow: (v) => set({ glow: v }),
  setDepth: (v) => set({ depth: v }),
  setHint: (h) => set({ hint: h }),
}))

// 根据 density 计算实际粒子数
export function countFromDensity(density: number): number {
  return Math.floor(5000 + density * 25000)
}
