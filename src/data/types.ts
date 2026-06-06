// 数据类型定义

export type WorkType =
  | 'anime'      // TV 动画
  | 'movie'      // 剧场版 / 电影
  | 'manga'      // 漫画
  | 'novel'      // 小说 / 轻小说
  | 'stage'      // 舞台剧 / 音乐剧
  | 'figure'     // 手办 / 模型
  | 'goods'      // 周边商品
  | 'ost'        // 音乐 / 原声碟
  | 'mobile'     // 手游 / 衍生游戏
  | 'live';      // 真人剧 / 真人电影

export interface GameIP {
  id: string;
  name: string;
  nameEn: string;
  region: Region;
  genre: string;     // 玩法类型
  year: number;      // 首款游戏年份
  developer: string;
  popularity: number; // 0-100
  color: string;     // 主题色
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
  ipName: string;     // 冗余存储便于显示
  type: WorkType;
  year: number;
  region: Region;
  platform: string;   // 载体具体描述
  tags: string[];
  popularity: number; // 0-100
  description: string;
  cover: string;      // 渐变色块
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

export const WORK_TYPE_ICONS: Record<WorkType, string> = {
  anime: 'Tv',
  movie: 'Film',
  manga: 'BookOpen',
  novel: 'Library',
  stage: 'Drama',
  figure: 'Box',
  goods: 'ShoppingBag',
  ost: 'Music',
  mobile: 'Gamepad2',
  live: 'Clapperboard',
};
