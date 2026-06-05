// ====================================================================
// ThemeProvider — 6 主题切换系统
// 通过 [data-theme] 属性控制全站 CSS 变量
// 持久化到 localStorage，支持 prefers-color-scheme 检测
// ====================================================================
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeId = 'forge' | 'paper' | 'neon' | 'mono' | 'vapor' | 'matrix';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  cn: string;
  desc: string;
  preview: { bg: string; fg: string; accent: string };
  font: string;
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  forge:  { id: 'forge',  name: 'FORGE',   cn: '工坊',   desc: '默认·高对比·电黄玫粉青',   preview: { bg: '#0a0a0a', fg: '#f5f1e8', accent: '#f0ff00' }, font: 'Fraunces + Inter Tight + JetBrains Mono' },
  paper:  { id: 'paper',  name: 'PAPER',   cn: '纸张',   desc: '米白·衬线·低密度',         preview: { bg: '#f1ead7', fg: '#1a1410', accent: '#d63b1f' }, font: 'Georgia + Georgia + Courier' },
  neon:   { id: 'neon',   name: 'NEON',    cn: '霓虹',   desc: '深紫底·电气绿粉青·全等宽', preview: { bg: '#050018', fg: '#f0f0ff', accent: '#b4ff00' }, font: 'JetBrains Mono' },
  mono:   { id: 'mono',   name: 'MONO',    cn: '单色',   desc: '纯灰阶·零强调·极简',       preview: { bg: '#181818', fg: '#d8d8d8', accent: '#ffffff' }, font: 'Inter Tight' },
  vapor:  { id: 'vapor',  name: 'VAPOR',   cn: '蒸汽',   desc: '粉紫青渐变·合成波',         preview: { bg: '#1a0033', fg: '#fff0ff', accent: '#ff71ce' }, font: 'Inter Tight' },
  matrix: { id: 'matrix', name: 'MATRIX',  cn: '矩阵',   desc: '黑底·荧光绿·终端风',       preview: { bg: '#000000', fg: '#00ff66', accent: '#00ff66' }, font: 'JetBrains Mono' },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeId[];

const STORAGE_KEY = 'skill-forge.theme';

interface Ctx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  cycle: () => void;
}

const ThemeContext = createContext<Ctx | null>(null);

function detectInitial(): ThemeId {
  if (typeof window === 'undefined') return 'forge';
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (stored && THEMES[stored]) return stored;
  return 'forge';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(detectInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('theme-switching');
    const t = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-switching');
    }, 400);
    return () => window.clearTimeout(t);
  }, [theme]);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
  };

  const cycle = () => {
    const i = THEME_KEYS.indexOf(theme);
    setTheme(THEME_KEYS[(i + 1) % THEME_KEYS.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
