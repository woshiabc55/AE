/**
 * 主题内存存储（单例）
 * 生产可平滑替换为 SQLite / PostgreSQL
 */
import type { Theme, AppState } from '../types.js';

const defaultTheme: Theme = {
  id: 'default',
  palette: {
    ink: '#0a0a0c',
    paper: '#f3f1ea',
    rust: '#ff5b1f',
    volt: '#3aa9ff',
    lime: '#a8ff5b',
  },
  font: {
    titleSize: 1.0,        // 0.6 ~ 1.4
    weight: 900,
    family: '"Noto Sans SC", sans-serif',
  },
  ring: {
    speed: 1.0,            // 0.4 ~ 2.0
    thickness: 18,         // px
  },
  panel: {
    gridCols: '1.4fr 1fr',
    gridRows: '1fr 1fr',
  },
};

const noirTheme: Theme = {
  ...defaultTheme,
  id: 'noir',
  palette: {
    ...defaultTheme.palette,
    rust: '#222226',
    volt: '#3a3a3f',
    paper: '#dadad2',
  },
};

const sunsetTheme: Theme = {
  ...defaultTheme,
  id: 'sunset',
  palette: {
    ink: '#1a0e2a',
    paper: '#ffe5c2',
    rust: '#ff7849',
    volt: '#ffb547',
    lime: '#a8ff5b',
  },
};

const themes: Map<string, Theme> = new Map([
  ['default', defaultTheme],
  ['noir', noirTheme],
  ['sunset', sunsetTheme],
]);

const state: AppState = {
  intensity: 0.5,
  mode: 'live',
  lastWheelAt: 0,
};

let currentThemeId = 'default';

export const themeStore = {
  /** 获取当前主题（深拷贝避免外部修改） */
  getTheme(): Theme {
    const t = themes.get(currentThemeId) ?? defaultTheme;
    return JSON.parse(JSON.stringify(t));
  },

  /** 列出所有主题 id */
  listThemes(): string[] {
    return Array.from(themes.keys());
  },

  /** 应用部分字段更新 */
  updateTheme(patch: Partial<Theme> & { id?: string }): Theme {
    if (patch.id && themes.has(patch.id)) {
      currentThemeId = patch.id;
    }
    const cur = themes.get(currentThemeId) ?? defaultTheme;
    const next: Theme = {
      ...cur,
      ...patch,
      palette: { ...cur.palette, ...(patch.palette ?? {}) },
      font: { ...cur.font, ...(patch.font ?? {}) },
      ring: { ...cur.ring, ...(patch.ring ?? {}) },
      panel: { ...cur.panel, ...(patch.panel ?? {}) },
    };
    themes.set(currentThemeId, next);
    return JSON.parse(JSON.stringify(next));
  },

  /** 全局状态 */
  getState(): AppState {
    return { ...state };
  },
  setIntensity(v: number): AppState {
    state.intensity = Math.max(0, Math.min(1, v));
    state.lastWheelAt = Date.now();
    return { ...state };
  },
};
