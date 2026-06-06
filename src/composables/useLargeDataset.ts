// 生成模拟 10 万级数据的工具
// 当实际数据不足时，外推填充到目标规模
import { WORKS } from '@/data/works';
import type { DerivativeWork, WorkType, Region } from '@/data/types';
import { GAME_IPS } from '@/data/ips';

const TYPE_ZH: Record<WorkType, string> = {
  anime: '动画', movie: '电影', manga: '漫画', novel: '小说',
  stage: '舞台剧', figure: '手办', goods: '周边', ost: '音乐',
  mobile: '手游', live: '真人剧',
};

const THEMES = [
  '主角成长', '伙伴羁绊', '世界观扩展', '前传起源', '后传故事',
  '日常喜剧', '黑暗史诗', '异世界穿越', '宿敌对决', '寻找真相',
  '救赎之旅', '家族温情', '英雄起源', '黑暗冒险', '羁绊与牺牲',
];

const REGIONS: Region[] = [
  'Japan', 'USA', 'China', 'Korea', 'Europe', 'Global',
  'Sweden', 'UK', 'Poland', 'France', 'Czech', 'Germany',
];

const PLATFORMS: Record<WorkType, string[]> = {
  anime: ['TV', 'Web', 'OVA', 'OAD'],
  movie: ['剧场版', '总集篇', '完全新作', '真人电影', 'IMAX'],
  manga: ['周刊连载', '月刊连载', '单行本', 'Web 连载'],
  novel: ['轻小说', '正传', '外传', '短篇集'],
  stage: ['2.5 次元', '音乐剧', '舞台剧'],
  figure: ['1/7 比例', '粘土人', '景品', '雕像'],
  goods: ['亚克力周边', '徽章套装', '色纸套装'],
  ost: ['原声碟', '角色歌', '印象曲'],
  mobile: ['衍生手游', '联动手游', '放置手游'],
  live: ['真人剧集', '真人电影', '网络剧'],
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 生成 10 万级数据
 * 真实数据 4200 条 + 外推填充到 100,000 条
 */
export function generateLargeDataset(target = 100_000): DerivativeWork[] {
  if (WORKS.length >= target) return WORKS;
  const baseLen = WORKS.length;
  const need = target - baseLen;
  const result: DerivativeWork[] = WORKS.slice();
  const rng = mulberry32(20260608);
  const types: WorkType[] = ['anime', 'movie', 'manga', 'novel', 'stage', 'figure', 'goods', 'ost', 'mobile', 'live'];
  let counter = baseLen + 1;

  for (let i = 0; i < need; i++) {
    const ip = GAME_IPS[Math.floor(rng() * GAME_IPS.length)];
    const type = types[Math.floor(rng() * types.length)];
    const theme = THEMES[Math.floor(rng() * THEMES.length)];
    const platforms = PLATFORMS[type];
    const platform = platforms[Math.floor(rng() * platforms.length)];
    const year = 1990 + Math.floor(rng() * 37);
    const region: Region = REGIONS[Math.floor(rng() * REGIONS.length)];
    const popularity = Math.max(20, Math.min(99, Math.floor(ip.popularity * (0.4 + rng() * 0.6))));

    result.push({
      id: `wx-${String(counter++).padStart(6, '0')}`,
      title: `${ip.name} ${TYPE_ZH[type]}衍生 #${i + 1}`,
      ipId: ip.id,
      ipName: ip.name,
      type,
      year,
      region,
      platform,
      tags: [theme],
      popularity,
      description: `${ip.name} 系列的${TYPE_ZH[type]}衍生作品，主题：${theme}。`,
      cover: ip.color,
    });
  }
  return result;
}

export const TARGET_DATASET_SIZE = 100_000;
