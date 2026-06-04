// 江湖典籍 mock 数据
export interface Classic {
  id: string
  title: string
  dynasty: string
  author: string
  kind: '经' | '史' | '谱' | '帖'
  blurb: string
  chapters: string[]
  swatch: string
}

export const classics: Classic[] = [
  {
    id: 'c01',
    title: '《剑器近》',
    dynasty: '唐',
    author: '公孙大娘传',
    kind: '谱',
    blurb: '昔有佳人公孙氏，一舞剑器动四方。观者如山色沮丧，天地为之久低昂。',
    chapters: ['起势 · 提剑', '中段 · 劈挂', '收势 · 还剑入鞘'],
    swatch: '#A22B1F',
  },
  {
    id: 'c02',
    title: '《武林旧事》',
    dynasty: '宋',
    author: '周密',
    kind: '史',
    blurb: '南渡以来，江湖诸派之兴衰、刀客剑侣之名录，悉载于此。',
    chapters: ['卷一 · 武林宗谱', '卷二 · 名剑录', '卷三 · 义士列传'],
    swatch: '#C9A14A',
  },
  {
    id: 'c03',
    title: '《兰亭序·拓本》',
    dynasty: '东晋',
    author: '王羲之',
    kind: '帖',
    blurb: '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭。',
    chapters: ['第一楔 · 饮酒赋诗', '第二楔 · 流觞曲水', '墨韵二十八行'],
    swatch: '#1B1A18',
  },
  {
    id: 'c04',
    title: '《黄帝内经·素问》',
    dynasty: '上古',
    author: '岐伯 · 黄帝',
    kind: '经',
    blurb: '上古天真论：昔在黄帝，生而神灵，弱而能言，幼而徇齐，长而敦敏。',
    chapters: ['上古天真论', '四气调神大论', '阴阳应象大论'],
    swatch: '#3D5A5A',
  },
]
