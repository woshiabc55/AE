export interface EffectParam {
  name: string
  label: string
  type: 'range' | 'bool' | 'select'
  min?: number
  max?: number
  step?: number
  default: number | boolean | string
  options?: string[]
}

export interface EffectInfo {
  id: string
  name: string
  category: string
  params: EffectParam[]
}

export const EFFECTS: EffectInfo[] = [
  {
    id: 'pixelate', name: '像素化', category: 'basic',
    params: [
      { name: 'pixelSize', label: '像素尺寸', type: 'range', min: 2, max: 32, default: 8 },
      { name: 'gridShow', label: '网格线', type: 'bool', default: false },
    ],
  },
  {
    id: 'ionize', name: '离子化消散', category: 'particle',
    params: [
      { name: 'density', label: '密度', type: 'range', min: 0.01, max: 0.2, step: 0.01, default: 0.05 },
      { name: 'speed', label: '速度', type: 'range', min: 0.5, max: 5, default: 2 },
      { name: 'gravity', label: '重力', type: 'range', min: 0, max: 2, step: 0.1, default: 0.5 },
      { name: 'spread', label: '扩散', type: 'range', min: 0.5, max: 3, default: 1.5 },
    ],
  },
  {
    id: 'wave', name: '波浪纹线条', category: 'line',
    params: [
      { name: 'amplitude', label: '振幅', type: 'range', min: 1, max: 50, default: 15 },
      { name: 'frequency', label: '频率', type: 'range', min: 0.5, max: 10, step: 0.5, default: 3 },
      { name: 'speed', label: '速度', type: 'range', min: 0.1, max: 5, default: 1 },
      { name: 'lineMode', label: '波形', type: 'select', default: 'sine', options: ['sine', 'triangle', 'sawtooth'] },
    ],
  },
  {
    id: 'glitch', name: '故障偏移', category: 'distort',
    params: [
      { name: 'intensity', label: '强度', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5 },
      { name: 'bandCount', label: '故障带数', type: 'range', min: 1, max: 20, default: 5 },
      { name: 'channelShift', label: '通道偏移', type: 'range', min: 0, max: 30, default: 8 },
      { name: 'burstMode', label: '爆发模式', type: 'bool', default: false },
    ],
  },
  {
    id: 'chromatic', name: '色差', category: 'distort',
    params: [
      { name: 'offsetR', label: '红通道偏移', type: 'range', min: -20, max: 20, default: -4 },
      { name: 'offsetB', label: '蓝通道偏移', type: 'range', min: -20, max: 20, default: 4 },
      { name: 'radial', label: '径向模式', type: 'bool', default: true },
      { name: 'animate', label: '动画', type: 'bool', default: true },
    ],
  },
]

export function getDefaultParams(effectId: string): Record<string, number | boolean | string> {
  const effect = EFFECTS.find(e => e.id === effectId)
  if (!effect) return {}
  const params: Record<string, number | boolean | string> = {}
  for (const p of effect.params) {
    params[p.name] = p.default
  }
  return params
}
