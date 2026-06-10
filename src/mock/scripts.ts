import type { Script } from '@/types';

export const sampleScripts: Script[] = [
  {
    id: 'script-demo-1',
    title: '《消失的便利店》',
    templateId: 'tpl-short-story',
    variables: {
      setup: '深夜便利店里，女主撞见男友和闺蜜并排坐着',
      twist: '其实是闺蜜的生日惊喜，蛋糕就藏在购物袋里',
      emotion: '温暖反转',
    },
    scenes: [],
    tags: ['反转', '温暖', '已完成'],
    isPublic: true,
    updatedAt: '2026-06-08T10:23:00Z',
    createdAt: '2026-06-05T15:00:00Z',
  },
  {
    id: 'script-demo-2',
    title: '《30 天学会写作》',
    templateId: 'tpl-short-hook',
    variables: {
      topic: '一个普通人如何在 30 天内学会写作',
      audience: '职场新人',
      tone: '犀利直给',
    },
    scenes: [],
    tags: ['口播', '知识', '草稿'],
    isPublic: false,
    updatedAt: '2026-06-09T22:11:00Z',
    createdAt: '2026-06-09T20:00:00Z',
  },
  {
    id: 'script-demo-3',
    title: '山岚茶 TVC · 高山篇',
    templateId: 'tpl-ad-tvc',
    variables: {
      brand: '山岚茶',
      insight: '都市人渴望片刻的宁静',
      usp: '高山原叶，冷泡更好喝',
    },
    scenes: [],
    tags: ['TVC', '品牌', '审核中'],
    isPublic: false,
    updatedAt: '2026-06-07T09:45:00Z',
    createdAt: '2026-06-02T11:30:00Z',
  },
  {
    id: 'script-demo-4',
    title: '《雾港迷踪》RPG 第一章',
    templateId: 'tpl-game-rpg',
    variables: {
      setting: '蒸汽朋克与东方仙侠融合的近未来',
      goal: '护送神秘少女穿越危险废土',
      npcs: '失忆少女、赏金猎人、神秘老者',
    },
    scenes: [],
    tags: ['RPG', '废土', '已完成'],
    isPublic: true,
    updatedAt: '2026-06-06T18:00:00Z',
    createdAt: '2026-05-28T14:00:00Z',
  },
];
