import { defineStore } from 'pinia'
import storyboard from '@/data/storyboard.json'

export interface ShotRow {
  time: string
  action: string
  camera: string
  visual: string
  content: string
  fx: string
}
export interface CameraMove {
  label: string
  icon: string
}
export interface Shot {
  id: 'one' | 'two' | 'three' | 'four'
  index: string
  title: string
  range: [number, number]
  timeLabel: string
  beatShape: string
  motionAxis: string
  visualGuide: string
  particleTrail: string
  bus: string
  color: string
  rows: ShotRow[]
  cameraMoves: CameraMove[]
  prompt: string
}
export interface ParticleMeta {
  id: string
  name: string
  spec: string
  trail: string
}

export const useStoryboardStore = defineStore('storyboard', {
  state: () => ({
    project: storyboard.project as { title: string; subtitle: string; total: number; label: string },
    shots: storyboard.shots as Shot[],
    particles: storyboard.particles as ParticleMeta[]
  }),
  getters: {
    shotById: (state) => (id: string): Shot | undefined =>
      state.shots.find((s) => s.id === id)
  }
})
