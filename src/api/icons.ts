// 聚合图标数据源，提供统一查询接口
import type { IconItem, IconSource, IconCategory } from './types';
import { LUCIDE_ICONS } from '@/data/lucide';
import { HEROICONS_ICONS } from '@/data/heroicons';
import { TABLER_ICONS } from '@/data/tabler';
import { PHOSPHOR_ICONS } from '@/data/phosphor';
import { ICONPARK_ICONS } from '@/data/iconpark';
import { MATERIAL_ICONS } from '@/data/material';
import { ICONFONT_ICONS } from '@/data/iconfont';
import { EXTRA_LINE_ICONS, EXTRA_FILLED_ICONS } from '@/data/extra';

type IconDefinition = {
  name: string;
  displayName: string;
  category: IconCategory;
  tags: string[];
  d: string;
};

const wrapStroke = (d: string): string =>
  `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

const wrapFilled = (d: string): string => `<path d="${d}" fill="currentColor"/>`;

// 不同源的渲染风格：0=line, 1=filled, 2=duotone
const STYLE_MAP: Record<IconSource, 0 | 1 | 2> = {
  lucide: 0,
  heroicons: 0,
  tabler: 0,
  phosphor: 0,
  iconpark: 0,
  material: 1,
  iconfont: 1,
};

function buildItems(
  source: IconSource,
  data: IconDefinition[],
  style: 0 | 1 | 2,
  prefix: string,
): IconItem[] {
  return data.map((it) => ({
    id: `${prefix}_${it.name}`,
    name: it.name,
    displayName: it.displayName,
    source,
    category: it.category,
    tags: it.tags,
    style,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${style === 0 ? wrapStroke(it.d) : wrapFilled(it.d)}</svg>`,
  }));
}

export const ALL_ICONS: IconItem[] = [
  ...buildItems('lucide', LUCIDE_ICONS, STYLE_MAP.lucide, 'lc'),
  ...buildItems('heroicons', HEROICONS_ICONS, STYLE_MAP.heroicons, 'hi'),
  ...buildItems('tabler', TABLER_ICONS, STYLE_MAP.tabler, 'tb'),
  ...buildItems('phosphor', PHOSPHOR_ICONS, STYLE_MAP.phosphor, 'ph'),
  ...buildItems('iconpark', ICONPARK_ICONS, STYLE_MAP.iconpark, 'ip'),
  ...buildItems('material', MATERIAL_ICONS, STYLE_MAP.material, 'mt'),
  ...buildItems('iconfont', ICONFONT_ICONS, STYLE_MAP.iconfont, 'if'),
  // 追加扩展图标（与基础数据同源同风格，总量 ~750+）
  ...buildItems('lucide', EXTRA_LINE_ICONS, 0, 'lc'),
  ...buildItems('heroicons', EXTRA_LINE_ICONS, 0, 'hi'),
  ...buildItems('tabler', EXTRA_LINE_ICONS, 0, 'tb'),
  ...buildItems('phosphor', EXTRA_LINE_ICONS, 0, 'ph'),
  ...buildItems('iconpark', EXTRA_LINE_ICONS, 0, 'ip'),
  ...buildItems('material', EXTRA_FILLED_ICONS, 1, 'mt'),
  ...buildItems('iconfont', EXTRA_FILLED_ICONS, 1, 'if'),
];

// 计数（按源）
export const SOURCE_COUNT: Record<IconSource, number> = ALL_ICONS.reduce(
  (acc, icon) => {
    acc[icon.source] = (acc[icon.source] || 0) + 1;
    return acc;
  },
  {} as Record<IconSource, number>,
);

// 计数（按分类）
export const CATEGORY_COUNT: Record<IconCategory, number> = ALL_ICONS.reduce(
  (acc, icon) => {
    acc[icon.category] = (acc[icon.category] || 0) + 1;
    return acc;
  },
  {} as Record<IconCategory, number>,
);

/** 字符串归一化用于模糊搜索（去除空格、转小写） */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_-]+/g, '');
}

/** 搜索/过滤 */
export function queryIcons(opts: {
  source?: IconSource | 'all';
  category?: IconCategory | 'all';
  keyword?: string;
}): IconItem[] {
  const { source = 'all', category = 'all', keyword = '' } = opts;
  const k = normalize(keyword);
  return ALL_ICONS.filter((it) => {
    if (source !== 'all' && it.source !== source) return false;
    if (category !== 'all' && it.category !== category) return false;
    if (k) {
      const hay = normalize(`${it.name} ${it.displayName} ${it.tags.join(' ')}`);
      if (!hay.includes(k)) return false;
    }
    return true;
  });
}

/** 跨源对比：同关键词在多源的结果 */
export function compareAcrossSources(keyword: string, sources: IconSource[]): Record<IconSource, IconItem[]> {
  const out = {} as Record<IconSource, IconItem[]>;
  for (const src of sources) {
    out[src] = queryIcons({ source: src, keyword });
  }
  return out;
}

/** 单个查询（按 id） */
export function getIcon(id: string): IconItem | undefined {
  return ALL_ICONS.find((i) => i.id === id);
}

/** 随机一个图标（可选按源过滤） */
export function getRandomIcon(source?: IconSource | 'all'): IconItem {
  const pool =
    source && source !== 'all' ? ALL_ICONS.filter((i) => i.source === source) : ALL_ICONS;
  if (pool.length === 0) return ALL_ICONS[0];
  return pool[Math.floor(Math.random() * pool.length)];
}
