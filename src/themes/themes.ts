// NEON HORIZON 视觉主题色板
// 6 套主色 - 每套覆盖天空 / 日盘 / 地平线 / 网格 / 粒子 / 波形 / 频谱 / 中央球 / 后期
export type ThemeId = 'aurora' | 'cyan' | 'lava' | 'mono' | 'neon' | 'midnight';

export interface Theme {
  id: ThemeId;
  name: string;
  // 天空渐变 (顶 -> 底)
  skyTop: string;
  skyBottom: string;
  // 远星
  star: string;
  // 日盘
  sunTop: string;
  sunMid: string;
  sunBottom: string;
  sunLine: string;
  // 地平线
  horizon: string;
  mountain: string;
  // 透视网格
  grid: string;
  gridGlow: string;
  // 粒子三层
  particleLow: string;
  particleMid: string;
  particleHigh: string;
  // 波形带
  waveTop: string;
  waveBottom: string;
  // 频谱柱
  spectrumTop: string;
  spectrumBottom: string;
  // 中央球
  orbCore: string;
  orbEdge: string;
  orbRay: string;
  // 后期
  vignette: number; // 0..1
  scanline: number; // 0..1
  chromatic: number; // 0..1
  grain: number; // 0..1
  bloom: number; // 0..1
  // HUD
  hud: string;
}

export const themes: Record<ThemeId, Theme> = {
  aurora: {
    id: 'aurora',
    name: '极光',
    skyTop: '#0A0420',
    skyBottom: '#3A1464',
    star: '#FFFFFF',
    sunTop: '#FF3CAC',
    sunMid: '#9B5DE5',
    sunBottom: '#7DF9FF',
    sunLine: 'rgba(255,255,255,0.55)',
    horizon: '#7DF9FF',
    mountain: '#1A0533',
    grid: '#FF3CAC',
    gridGlow: 'rgba(125, 249, 255, 0.6)',
    particleLow: '#7DF9FF',
    particleMid: '#9B5DE5',
    particleHigh: '#FF3CAC',
    waveTop: '#FFFFFF',
    waveBottom: '#FF3CAC',
    spectrumTop: '#FF3CAC',
    spectrumBottom: '#7DF9FF',
    orbCore: '#FFFFFF',
    orbEdge: '#7DF9FF',
    orbRay: '#9B5DE5',
    vignette: 0.55,
    scanline: 0.18,
    chromatic: 0.55,
    grain: 0.12,
    bloom: 0.9,
    hud: '#A4F6FF',
  },
  cyan: {
    id: 'cyan',
    name: '青蓝',
    skyTop: '#02050C',
    skyBottom: '#04304A',
    star: '#E0F7FF',
    sunTop: '#FDE74C',
    sunMid: '#5BC0EB',
    sunBottom: '#0FF',
    sunLine: 'rgba(255,255,255,0.45)',
    horizon: '#0FF',
    mountain: '#011220',
    grid: '#0FF',
    gridGlow: 'rgba(11, 255, 255, 0.55)',
    particleLow: '#0FF',
    particleMid: '#5BC0EB',
    particleHigh: '#FDE74C',
    waveTop: '#FFFFFF',
    waveBottom: '#0FF',
    spectrumTop: '#FDE74C',
    spectrumBottom: '#0FF',
    orbCore: '#FFFFFF',
    orbEdge: '#FDE74C',
    orbRay: '#5BC0EB',
    vignette: 0.6,
    scanline: 0.16,
    chromatic: 0.5,
    grain: 0.1,
    bloom: 0.85,
    hud: '#9FF7FF',
  },
  lava: {
    id: 'lava',
    name: '熔岩',
    skyTop: '#0A0303',
    skyBottom: '#3A0A05',
    star: '#FFE0B0',
    sunTop: '#FFB347',
    sunMid: '#FF5E3A',
    sunBottom: '#FF003D',
    sunLine: 'rgba(255,255,255,0.45)',
    horizon: '#FFB347',
    mountain: '#1A0303',
    grid: '#FF5E3A',
    gridGlow: 'rgba(255, 179, 71, 0.55)',
    particleLow: '#FFB347',
    particleMid: '#FF5E3A',
    particleHigh: '#FF003D',
    waveTop: '#FFE3A3',
    waveBottom: '#FF003D',
    spectrumTop: '#FF003D',
    spectrumBottom: '#FFB347',
    orbCore: '#FFE3A3',
    orbEdge: '#FFB347',
    orbRay: '#FF5E3A',
    vignette: 0.65,
    scanline: 0.2,
    chromatic: 0.6,
    grain: 0.14,
    bloom: 1.0,
    hud: '#FFC371',
  },
  mono: {
    id: 'mono',
    name: '极简',
    skyTop: '#000000',
    skyBottom: '#0E0E0E',
    star: '#FFFFFF',
    sunTop: '#FFFFFF',
    sunMid: '#C8C8C8',
    sunBottom: '#7A7A7A',
    sunLine: 'rgba(255,255,255,0.4)',
    horizon: '#FFFFFF',
    mountain: '#050505',
    grid: '#FFFFFF',
    gridGlow: 'rgba(255, 255, 255, 0.4)',
    particleLow: '#FFFFFF',
    particleMid: '#C8C8C8',
    particleHigh: '#7A7A7A',
    waveTop: '#FFFFFF',
    waveBottom: '#888888',
    spectrumTop: '#FFFFFF',
    spectrumBottom: '#888888',
    orbCore: '#FFFFFF',
    orbEdge: '#C8C8C8',
    orbRay: '#888888',
    vignette: 0.55,
    scanline: 0.14,
    chromatic: 0.0,
    grain: 0.1,
    bloom: 0.8,
    hud: '#FFFFFF',
  },
  neon: {
    id: 'neon',
    name: '霓虹',
    skyTop: '#080014',
    skyBottom: '#1A0033',
    star: '#FFFFFF',
    sunTop: '#39FF14',
    sunMid: '#9D00FF',
    sunBottom: '#00F0FF',
    sunLine: 'rgba(255,255,255,0.55)',
    horizon: '#FF10F0',
    mountain: '#0A001A',
    grid: '#00F0FF',
    gridGlow: 'rgba(255, 16, 240, 0.55)',
    particleLow: '#FF10F0',
    particleMid: '#9D00FF',
    particleHigh: '#00F0FF',
    waveTop: '#39FF14',
    waveBottom: '#FF10F0',
    spectrumTop: '#00F0FF',
    spectrumBottom: '#FF10F0',
    orbCore: '#FFFFFF',
    orbEdge: '#39FF14',
    orbRay: '#00F0FF',
    vignette: 0.55,
    scanline: 0.2,
    chromatic: 0.7,
    grain: 0.14,
    bloom: 1.0,
    hud: '#39FF14',
  },
  midnight: {
    id: 'midnight',
    name: '暗夜',
    skyTop: '#02030A',
    skyBottom: '#0A1240',
    star: '#E0E8FF',
    sunTop: '#E0AAFF',
    sunMid: '#A06CFE',
    sunBottom: '#4F8EF7',
    sunLine: 'rgba(255,255,255,0.5)',
    horizon: '#A06CFE',
    mountain: '#020414',
    grid: '#A06CFE',
    gridGlow: 'rgba(79, 142, 247, 0.55)',
    particleLow: '#4F8EF7',
    particleMid: '#A06CFE',
    particleHigh: '#E0AAFF',
    waveTop: '#FFFFFF',
    waveBottom: '#A06CFE',
    spectrumTop: '#E0AAFF',
    spectrumBottom: '#4F8EF7',
    orbCore: '#FFFFFF',
    orbEdge: '#E0AAFF',
    orbRay: '#A06CFE',
    vignette: 0.55,
    scanline: 0.15,
    chromatic: 0.45,
    grain: 0.1,
    bloom: 0.85,
    hud: '#BFD7FF',
  },
};

export const themeList: Theme[] = Object.values(themes);
