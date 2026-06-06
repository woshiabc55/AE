// 数据类型定义

export type WorkType =
  | 'anime'
  | 'movie'
  | 'manga'
  | 'novel'
  | 'stage'
  | 'figure'
  | 'goods'
  | 'ost'
  | 'mobile'
  | 'live';

export interface GameIP {
  id: string;
  name: string;
  nameEn: string;
  region: Region;
  genre: string;
  year: number;
  developer: string;
  popularity: number;
  color: string;
}

export type Region =
  | 'Japan' | 'USA' | 'China' | 'Korea' | 'Europe' | 'Global'
  | 'Sweden' | 'UK' | 'Poland' | 'France' | 'Czech' | 'Germany'
  | 'Ukraine' | 'Russia' | 'Taiwan' | 'Canada' | 'Australia'
  | 'Belgium' | 'Estonia' | 'Netherlands' | 'Finland' | 'Italy'
  | 'Spain' | 'Denmark' | 'Norway' | 'Brazil' | 'Mexico'
  | 'India' | 'Thailand' | 'Indonesia' | 'Other';

export interface DerivativeWork {
  id: string;
  title: string;
  ipId: string;
  ipName: string;
  type: WorkType;
  year: number;
  region: Region;
  platform: string;
  tags: string[];
  popularity: number;
  description: string;
  cover: string;
}

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  anime: 'TV 动画',
  movie: '剧场版 / 电影',
  manga: '漫画',
  novel: '小说',
  stage: '舞台剧',
  figure: '手办 / 模型',
  goods: '周边商品',
  ost: '音乐原声',
  mobile: '衍生游戏',
  live: '真人影视',
};

export const WORK_TYPE_LIST: WorkType[] = [
  'anime', 'movie', 'manga', 'novel', 'stage',
  'figure', 'goods', 'ost', 'mobile', 'live',
];

export const REGION_LIST: Region[] = [
  'Japan', 'USA', 'China', 'Korea', 'Europe', 'Global',
];
