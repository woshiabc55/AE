import type { Chapter } from './types';
import { ALL_SHOTS } from './scripts';

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '火 · 初生',
    subtitle: '9 镜 / 27 秒',
    intro: '窑火初燃，兄弟凝视，雨夜的火苗是命运的第一个暗示。',
    accent: 'kiln',
    shots: ALL_SHOTS.filter(s => s.chapter === 1),
  },
  {
    id: 2,
    title: '问 · 开片之魂',
    subtitle: '9 镜 / 27 秒',
    intro: '一碗水，一声问。胎与釉的争吵，是中国人对"完美"最古老的回答。',
    accent: 'celadon',
    shots: ALL_SHOTS.filter(s => s.chapter === 2),
  },
  {
    id: 3,
    title: '裂 · 山河碎',
    subtitle: '10 镜 / 30 秒',
    intro: '第一只碗的开片，是喜悦也是丧钟。北方的窑火熄了，父辈把火种塞进两只年轻的手。',
    accent: 'kiln',
    shots: ALL_SHOTS.filter(s => s.chapter === 3),
  },
  {
    id: 4,
    title: '别 · 兄弟歧路',
    subtitle: '9 镜 / 27 秒',
    intro: '火分两头。一头留下缝合裂痕，一头南迁，把裂纹带去更远的地方。',
    accent: 'ash',
    shots: ALL_SHOTS.filter(s => s.chapter === 4),
  },
  {
    id: 5,
    title: '迁 · 南迁护碗',
    subtitle: '9 镜 / 27 秒',
    intro: '风雪、岔路、破庙。一只裂纹碗贴着胸口，体温是唯一的窑火。',
    accent: 'ash',
    shots: ALL_SHOTS.filter(s => s.chapter === 5),
  },
  {
    id: 6,
    title: '燃 · 南方复窑',
    subtitle: '9 镜 / 27 秒',
    intro: '第一窑全碎，第十九窑终于开片。"那不是坏掉，是它活过了。"',
    accent: 'kiln',
    shots: ALL_SHOTS.filter(s => s.chapter === 6),
  },
  {
    id: 7,
    title: '渡 · 东渡与碎',
    subtitle: '9 镜 / 27 秒',
    intro: '海浪拍打船舷，裂纹碗抵达东瀛。茶人轻叹："疵……即美。"然后，碗从手中滑落。',
    accent: 'celadon',
    shots: ALL_SHOTS.filter(s => s.chapter === 7),
  },
  {
    id: 8,
    title: '绊 · 锔瓷与合',
    subtitle: '9 镜 / 27 秒',
    intro: '锔钉穿过裂痕，比原来更美。哥窑的灵魂是：在一个裂开的时代里，中国人找到了"完整"的另一种写法。',
    accent: 'gold',
    shots: ALL_SHOTS.filter(s => s.chapter === 8),
  },
  {
    id: 9,
    title: '致敬 · 掌纹',
    subtitle: '1 镜 / 12 秒',
    intro: '谨以此片，致敬所有在泥土与火焰中，留下掌纹的人。',
    accent: 'gold',
    shots: ALL_SHOTS.filter(s => s.chapter === 9),
  },
];

export const TOTAL_DURATION_MS = CHAPTERS.reduce(
  (sum, ch) => sum + ch.shots.reduce((s, sh) => s + sh.duration, 0),
  0,
);
