import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'short-video',
    name: '短视频',
    description: '抖音 / 视频号 / 小红书爆款脚本',
    icon: 'Smartphone',
    count: 8,
  },
  {
    id: 'feature',
    name: '影视长片',
    description: '院线电影 / 短片 / 剧情片',
    icon: 'Film',
    count: 5,
  },
  {
    id: 'ad',
    name: '商业广告',
    description: '品牌 TVC / 电商 / 营销',
    icon: 'Megaphone',
    count: 6,
  },
  {
    id: 'podcast',
    name: '播客 / 有声',
    description: '访谈 / 单人独白 / 故事',
    icon: 'Mic',
    count: 4,
  },
  {
    id: 'game',
    name: '游戏剧情',
    description: 'RPG / 视觉小说 / 互动叙事',
    icon: 'Gamepad2',
    count: 5,
  },
];
