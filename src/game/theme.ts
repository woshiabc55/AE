// 关卡主题色配置
export type LevelTheme = {
  id: number;
  name: string;
  primary: string;     // 主色 (玩家球 / 描边)
  accent: string;       // 辅色 (敌人 / 装饰)
  glow: string;         // 辉光色
  background: string;   // 背景色
  grid: string;         // 网格线
};

export const THEMES: LevelTheme[] = [
  { id: 1,  name: '青曜序章',  primary: '#22D3EE', accent: '#A855F7', glow: '#22D3EE', background: '#0A0A14', grid: '#1E1B4B' },
  { id: 2,  name: '紫曜迷局',  primary: '#A855F7', accent: '#22D3EE', glow: '#A855F7', background: '#0B0918', grid: '#241B45' },
  { id: 3,  name: '薄暮警戒',  primary: '#F472B6', accent: '#FBBF24', glow: '#F472B6', background: '#100A14', grid: '#3A1B45' },
  { id: 4,  name: '赤潮涌动',  primary: '#F43F5E', accent: '#22D3EE', glow: '#F43F5E', background: '#14080C', grid: '#451B2A' },
  { id: 5,  name: '琥珀风暴',  primary: '#FBBF24', accent: '#F43F5E', glow: '#FBBF24', background: '#140C08', grid: '#453A1B' },
  { id: 6,  name: '森绿夜巡',  primary: '#34D399', accent: '#A855F7', glow: '#34D399', background: '#08140C', grid: '#1B4530' },
  { id: 7,  name: '幽蓝深渊',  primary: '#60A5FA', accent: '#34D399', glow: '#60A5FA', background: '#080C14', grid: '#1B2A45' },
  { id: 8,  name: '双生镜域',  primary: '#E879F9', accent: '#22D3EE', glow: '#E879F9', background: '#140814', grid: '#451B45' },
  { id: 9,  name: '熔金炼狱',  primary: '#FB923C', accent: '#F43F5E', glow: '#FB923C', background: '#140C08', grid: '#452A1B' },
  { id: 10, name: '终焉裂空',  primary: '#FFFFFF', accent: '#A855F7', glow: '#FFFFFF', background: '#08080F', grid: '#45455A' },
];

export function getTheme(id: number): LevelTheme {
  return THEMES[Math.min(Math.max(id - 1, 0), THEMES.length - 1)];
}

export const TOTAL_LEVELS = 10;
