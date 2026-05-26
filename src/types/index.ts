export interface ColorBlock {
  hex: string
  rgb: [number, number, number]
  percentage: number
}

export interface ExtractedFrame {
  timestamp: number
  colorBlocks: ColorBlock[]
  thumbnail: string
}

export interface SkillItem {
  id: string
  name: string
  description: string
  tags: string[]
  code: string
  category: 'toolchain' | 'template' | 'snippet'
}

export interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'video'
  url: string
  file: File
}

export type EntryState = 'idle' | 'active' | 'particle'

export interface Entry {
  id: string
  text: string
  state: EntryState
  color: string
  x: number
  y: number
  particleCount: number
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
  entryId: string
  char: string
}
