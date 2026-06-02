export interface Shape {
  id: string
  type: 'rect' | 'circle' | 'ellipse' | 'line' | 'polygon' | 'path'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface Animation {
  id: string
  shapeId: string
  type: 'translate' | 'rotate' | 'scale' | 'opacity'
  duration: number
  startValue: string
  endValue: string
}

export interface Keyframe {
  id: string
  animationId: string
  time: number
  value: string
}

export interface Tutorial {
  id: number
  title: string
  description: string
  steps: TutorialStep[]
}

export interface TutorialStep {
  title: string
  content: string
  code: string
}

export type Language = 'en' | 'zh' | 'ja' | 'ko'