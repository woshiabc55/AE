export type Split = 'left-color' | 'right-color' | 'full-color'
export type Pose = 'standing' | 'curious' | 'rest'
export type ViewId = 'front' | 'side' | 'back'

export interface CharacterView {
  id: ViewId
  label: string
  split: Split
  pose: Pose
  yawDeg: number
}

export interface MaterialParam {
  name: string
  value: string
}

export interface MaterialCard {
  id: string
  index: string
  title: string
  subtitle: string
  params: MaterialParam[]
  seed: number
}

export interface CharacterData {
  codename: string
  serial: string
  nationality: string
  classification: string
  buildVersion: string
  buildDate: string
  designer: string
  views: CharacterView[]
  materials: MaterialCard[]
  derivativeMark: string
  rigTags: string[]
}

export const character: CharacterData = {
  codename: 'AE // SUBJECT 014',
  serial: 'AE-014-CN',
  nationality: 'CN · 东',
  classification: 'DERIVATIVE · 二创角色',
  buildVersion: 'BUILD 0.6.2',
  buildDate: '2026-06-10',
  designer: 'AE STUDIO · PRIVATE PLATE',
  views: [
    { id: 'front', label: 'FRONT · 正面', split: 'left-color', pose: 'curious', yawDeg: -3 },
    { id: 'side',  label: 'SIDE · 侧面',  split: 'right-color', pose: 'standing', yawDeg: 28 },
    { id: 'back',  label: 'BACK · 背面',  split: 'full-color', pose: 'rest', yawDeg: 180 },
  ],
  materials: [
    {
      id: 'skin', index: '01',
      title: 'SKIN', subtitle: 'sub-surface scattering',
      params: [
        { name: 'roughness', value: '0.62' },
        { name: 'sss', value: '0.18' },
        { name: 'pore-density', value: '0.42 / mm²' },
      ],
      seed: 7,
    },
    {
      id: 'hair', index: '02',
      title: 'HAIR', subtitle: 'strand subdivision',
      params: [
        { name: 'strands', value: '14,302' },
        { name: 'specular', value: '0.34' },
        { name: 'anisotropy', value: '0.78' },
      ],
      seed: 23,
    },
    {
      id: 'cloth', index: '03',
      title: 'CLOTH', subtitle: 'woven weave',
      params: [
        { name: 'roughness', value: '0.78' },
        { name: 'thickness', value: '0.42 mm' },
        { name: 'tension', value: '0.31' },
      ],
      seed: 41,
    },
    {
      id: 'metal', index: '04',
      title: 'METAL', subtitle: 'cold brushed',
      params: [
        { name: 'roughness', value: '0.31' },
        { name: 'ior', value: '1.46' },
        { name: 'bump-scale', value: '0.18' },
      ],
      seed: 89,
    },
  ],
  derivativeMark: 'DERIVATIVE WORK · 二创展示',
  rigTags: ['# 好奇姿态', '# 自然站立', '# 非镜像', '# 半面色', '# 硬线描边', '# 5400K'],
}
