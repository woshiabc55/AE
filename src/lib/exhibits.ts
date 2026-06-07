export type ExhibitId =
  | 'overture'
  | 'starmap'
  | 'glyphsea'
  | 'crystal'
  | 'pulse'
  | 'specimens'
  | 'echo'
  | 'chroma'
  | 'dataforest'
  | 'sandbox'
  | 'manifesto'
  | 'coda'

export type ThemeId = 'mist' | 'flame' | 'aurora' | 'polar-night'

export interface Exhibit {
  id: ExhibitId
  index: string
  title: string
  titleEn: string
  elementCount: number
  theme: ThemeId
  blurb: string
}

export const EXHIBITS: Exhibit[] = [
  { id: 'overture',  index: '00', title: '序厅',     titleEn: 'Overture',     elementCount: 1_200,  theme: 'mist',        blurb: '字符倾泻的入场仪式。' },
  { id: 'starmap',   index: '01', title: '星图',     titleEn: 'Stellar Map',  elementCount: 100_000, theme: 'polar-night', blurb: '十万颗悬停可查的星点。' },
  { id: 'glyphsea',  index: '02', title: '字海',     titleEn: 'Glyph Sea',    elementCount: 4_096,  theme: 'mist',        blurb: '可拖拽的字符方块诗阵。' },
  { id: 'crystal',   index: '03', title: '晶阵',     titleEn: 'Crystal',      elementCount: 8_000,  theme: 'aurora',      blurb: '引力场弯曲的晶柱森林。' },
  { id: 'pulse',     index: '04', title: '脉搏',     titleEn: 'Pulse',        elementCount: 960,    theme: 'flame',       blurb: '声音与波形同呼吸。' },
  { id: 'specimens', index: '05', title: '样本柜',   titleEn: 'Specimens',    elementCount: 10_000, theme: 'mist',        blurb: '一万枚 UI 切片。' },
  { id: 'echo',      index: '06', title: '回声廊',   titleEn: 'Echo Hall',    elementCount: 200,    theme: 'polar-night', blurb: '无限镜像的长廊。' },
  { id: 'chroma',    index: '07', title: '色谱',     titleEn: 'Chroma',       elementCount: 1_800,  theme: 'aurora',      blurb: '刮出色相下藏的图案。' },
  { id: 'dataforest',index: '08', title: '数据林',   titleEn: 'Data Forest',  elementCount: 3_200,  theme: 'mist',        blurb: 'KPI 长成的森林。' },
  { id: 'sandbox',   index: '09', title: '沙盘',     titleEn: 'Sandbox',      elementCount: 1_024,  theme: 'flame',       blurb: '九种效果自由叠加。' },
  { id: 'manifesto', index: '10', title: '宣言',     titleEn: 'Manifesto',    elementCount: 12_000, theme: 'mist',        blurb: '逐字点亮的可朗读长卷。' },
  { id: 'coda',      index: '11', title: '尾声',     titleEn: 'Coda',         elementCount: 1_000,  theme: 'polar-night', blurb: '一千个呼吸光点。' },
]

export const TOTAL_ELEMENTS = EXHIBITS.reduce((s, e) => s + e.elementCount, 0)
