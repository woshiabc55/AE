// 视觉主题色板 - 现代化数字波风格
export type ThemeId = 'aurora' | 'cyan' | 'lava' | 'mono' | 'neon' | 'midnight';

export interface Theme {
  id: ThemeId;
  name: string;
  // 粒子三层颜色（低/中/高频）
  particleLow: string;
  particleMid: string;
  particleHigh: string;
  // 波形
  wave: string;
  // 频谱柱渐变 (上 -> 下)
  spectrumTop: string;
  spectrumBottom: string;
  // 中心辉光
  glowInner: string;
  glowOuter: string;
  // 背景
  background: string;
  // HUD 文字
  hud: string;
  // 网格
  grid: string;
}

export const themes: Record<ThemeId, Theme> = {
  aurora: {
    id: 'aurora',
    name: '极光',
    particleLow: '#7DF9FF',
    particleMid: '#9B5DE5',
    particleHigh: '#FF3CAC',
    wave: '#7DF9FF',
    spectrumTop: '#FF3CAC',
    spectrumBottom: '#7DF9FF',
    glowInner: 'rgba(155, 93, 229, 0.55)',
    glowOuter: 'rgba(125, 249, 255, 0.05)',
    background: '#05060B',
    hud: '#A4F6FF',
    grid: 'rgba(125, 249, 255, 0.07)',
  },
  cyan: {
    id: 'cyan',
    name: '青蓝',
    particleLow: '#0FF',
    particleMid: '#5BC0EB',
    particleHigh: '#FDE74C',
    wave: '#0FF',
    spectrumTop: '#FDE74C',
    spectrumBottom: '#0FF',
    glowInner: 'rgba(11, 132, 255, 0.55)',
    glowOuter: 'rgba(11, 255, 255, 0.05)',
    background: '#02060C',
    hud: '#9FF7FF',
    grid: 'rgba(11, 255, 255, 0.08)',
  },
  lava: {
    id: 'lava',
    name: '熔岩',
    particleLow: '#FFB347',
    particleMid: '#FF5E3A',
    particleHigh: '#FF003D',
    wave: '#FFD23F',
    spectrumTop: '#FF003D',
    spectrumBottom: '#FFB347',
    glowInner: 'rgba(255, 94, 58, 0.6)',
    glowOuter: 'rgba(255, 179, 71, 0.06)',
    background: '#0A0303',
    hud: '#FFC371',
    grid: 'rgba(255, 94, 58, 0.08)',
  },
  mono: {
    id: 'mono',
    name: '极简',
    particleLow: '#FFFFFF',
    particleMid: '#C8C8C8',
    particleHigh: '#7A7A7A',
    wave: '#FFFFFF',
    spectrumTop: '#FFFFFF',
    spectrumBottom: '#888888',
    glowInner: 'rgba(255, 255, 255, 0.35)',
    glowOuter: 'rgba(255, 255, 255, 0.04)',
    background: '#000000',
    hud: '#FFFFFF',
    grid: 'rgba(255, 255, 255, 0.05)',
  },
  neon: {
    id: 'neon',
    name: '霓虹',
    particleLow: '#FF10F0',
    particleMid: '#9D00FF',
    particleHigh: '#00F0FF',
    wave: '#39FF14',
    spectrumTop: '#00F0FF',
    spectrumBottom: '#FF10F0',
    glowInner: 'rgba(157, 0, 255, 0.55)',
    glowOuter: 'rgba(57, 255, 20, 0.05)',
    background: '#080014',
    hud: '#39FF14',
    grid: 'rgba(255, 16, 240, 0.07)',
  },
  midnight: {
    id: 'midnight',
    name: '暗夜',
    particleLow: '#4F8EF7',
    particleMid: '#A06CFE',
    particleHigh: '#E0AAFF',
    wave: '#4F8EF7',
    spectrumTop: '#E0AAFF',
    spectrumBottom: '#4F8EF7',
    glowInner: 'rgba(79, 142, 247, 0.45)',
    glowOuter: 'rgba(160, 108, 254, 0.05)',
    background: '#02030A',
    hud: '#BFD7FF',
    grid: 'rgba(79, 142, 247, 0.06)',
  },
};

export const themeList: Theme[] = Object.values(themes);
