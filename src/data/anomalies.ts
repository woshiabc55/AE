// 异想体（Abnormality）静态数据
// 危险等级、恐惧等级、最佳工作类型、产出与风险

export type RiskClass = 'ZAYIN' | 'TETH' | 'HE' | 'WAW' | 'ALEPH';
export type WorkType =
  | 'INSTINCT'
  | 'INSIGHT'
  | 'COMMUNICATION'
  | 'OPPRESSION'
  | 'SUPPRESSION'
  | 'CONTAINMENT';

export interface WorkResult {
  // 概率权重（数字越大概率越高）
  peBox: number; // 成功产能源
  black: number; // 吞噬能源
  whiteDamage: number; // 精神伤害
  redDamage: number; // 物理伤害
  break: number; // 突破收容
}

export interface Anomaly {
  id: string;
  name: string;
  riskClass: RiskClass;
  fearLevel: 0 | 1 | 2 | 3 | 4 | 5;
  description: string;
  lore: string;
  preferredWork: WorkType[]; // 高成功率的类型
  badWork: WorkType[]; // 低成功率的类型
  workResults: Record<WorkType, WorkResult>;
  baseEnergyYield: number;
  baseResearchYield: number;
  counterThreshold: number; // 熔毁阈值
  peColor: string; // 像素主色
  shape: 'blob' | 'spike' | 'ring' | 'cross' | 'pillar' | 'box' | 'gear';
}

// 简化版 12 个异想体（覆盖五大危险等级）
export const anomalies: Anomaly[] = [
  // === ZAYIN ===
  {
    id: 'F-01-01',
    name: '可爱的鸟',
    riskClass: 'ZAYIN',
    fearLevel: 0,
    description: '一只会在设施内唱歌的鸟。它喜欢听员工跟着哼唱。',
    lore: '音调准确时，它会安心地蹲下；音调错乱时，它会开始尖叫。',
    preferredWork: ['COMMUNICATION', 'INSTINCT'],
    badWork: ['OPPRESSION'],
    workResults: {
      INSTINCT: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 2, black: 4, whiteDamage: 2, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 6,
    baseResearchYield: 1,
    counterThreshold: 3,
    peColor: '#9ad19a',
    shape: 'blob',
  },
  {
    id: 'O-01-04',
    name: '小帮手',
    riskClass: 'ZAYIN',
    fearLevel: 0,
    description: '一只能说话的小型生物。它喜欢协助员工。',
    lore: '当听到赞美时，它会变得勤快；被忽视时则会陷入沮丧。',
    preferredWork: ['COMMUNICATION', 'INSTINCT'],
    badWork: ['OPPRESSION'],
    workResults: {
      INSTINCT: { peBox: 7, black: 1, whiteDamage: 0, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 3, black: 3, whiteDamage: 2, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 5,
    baseResearchYield: 1,
    counterThreshold: 3,
    peColor: '#c08aff',
    shape: 'blob',
  },
  // === TETH ===
  {
    id: 'F-02-49',
    name: '焦化少女',
    riskClass: 'TETH',
    fearLevel: 2,
    description: '一尊由焦油凝固成的人形。它偶尔会发出低声的呜咽。',
    lore: '它想被拥抱，又害怕温暖。强光会让它蒸发。',
    preferredWork: ['COMMUNICATION', 'INSIGHT'],
    badWork: ['OPPRESSION'],
    workResults: {
      INSTINCT: { peBox: 5, black: 2, whiteDamage: 2, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 1, black: 6, whiteDamage: 2, redDamage: 0, break: 2 },
      SUPPRESSION: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 9,
    baseResearchYield: 2,
    counterThreshold: 4,
    peColor: '#2a2a35',
    shape: 'pillar',
  },
  {
    id: 'O-02-62',
    name: '我们之间的壁虎',
    riskClass: 'TETH',
    fearLevel: 2,
    description: '一只会在墙面上游走的壁虎。它会观察所有员工。',
    lore: '它记录着设施中发生的一切，并以未知的方式"回应"员工。',
    preferredWork: ['SUPPRESSION', 'INSTINCT'],
    badWork: ['COMMUNICATION'],
    workResults: {
      INSTINCT: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 2, black: 4, whiteDamage: 2, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 8,
    baseResearchYield: 2,
    counterThreshold: 4,
    peColor: '#7a8a6a',
    shape: 'spike',
  },
  {
    id: 'F-03-22',
    name: '一無所有',
    riskClass: 'TETH',
    fearLevel: 3,
    description: '一团没有形体的漆黑。它只会在被观察时显现。',
    lore: '据说被它注视过的员工，会在余生感到被"剥空"。',
    preferredWork: ['INSIGHT', 'OPPRESSION'],
    badWork: ['INSTINCT', 'COMMUNICATION'],
    workResults: {
      INSTINCT: { peBox: 2, black: 4, whiteDamage: 2, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 2, black: 4, whiteDamage: 2, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 11,
    baseResearchYield: 3,
    counterThreshold: 4,
    peColor: '#0a0a0a',
    shape: 'ring',
  },
  // === HE ===
  {
    id: 'F-04-83',
    name: '红舞鞋',
    riskClass: 'HE',
    fearLevel: 3,
    description: '一双精美的红色舞鞋。它会在没有舞者时自行起舞。',
    lore: '被它的节奏吸引的员工，将无法停止舞步，直至倒下。',
    preferredWork: ['SUPPRESSION', 'INSTINCT'],
    badWork: ['COMMUNICATION'],
    workResults: {
      INSTINCT: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 2, black: 4, whiteDamage: 2, redDamage: 0, break: 2 },
      OPPRESSION: { peBox: 5, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 14,
    baseResearchYield: 4,
    counterThreshold: 5,
    peColor: '#c8143a',
    shape: 'spike',
  },
  {
    id: 'O-04-13',
    name: '悲恸之母',
    riskClass: 'HE',
    fearLevel: 4,
    description: '一具抱着空摇篮的女性雕像。她的泪水是不竭的。',
    lore: '她已经数千年没有停止哭泣，并将这种悲恸"赐予"每个靠近的人。',
    preferredWork: ['INSIGHT', 'COMMUNICATION'],
    badWork: ['OPPRESSION'],
    workResults: {
      INSTINCT: { peBox: 4, black: 2, whiteDamage: 2, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 8, black: 0, whiteDamage: 1, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 7, black: 0, whiteDamage: 1, redDamage: 0, break: 1 },
      OPPRESSION: { peBox: 1, black: 5, whiteDamage: 3, redDamage: 0, break: 2 },
      SUPPRESSION: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 17,
    baseResearchYield: 5,
    counterThreshold: 5,
    peColor: '#4a4a6a',
    shape: 'pillar',
  },
  // === WAW ===
  {
    id: 'F-05-29',
    name: '雪白的鹿',
    riskClass: 'WAW',
    fearLevel: 4,
    description: '一只有着雪白毛皮和扭曲鹿角的鹿。它在走廊游荡。',
    lore: '直视它的人会瞬间陷入疯狂。它只在灰光中显现。',
    preferredWork: ['SUPPRESSION', 'OPPRESSION'],
    badWork: ['COMMUNICATION', 'INSIGHT'],
    workResults: {
      INSTINCT: { peBox: 4, black: 2, whiteDamage: 2, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 2, black: 3, whiteDamage: 2, redDamage: 0, break: 2 },
      COMMUNICATION: { peBox: 1, black: 4, whiteDamage: 3, redDamage: 0, break: 2 },
      OPPRESSION: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 8, black: 0, whiteDamage: 0, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 24,
    baseResearchYield: 7,
    counterThreshold: 6,
    peColor: '#e8e6df',
    shape: 'spike',
  },
  {
    id: 'O-05-07',
    name: '永生之轮',
    riskClass: 'WAW',
    fearLevel: 5,
    description: '一具不断旋转的金属轮。靠近它的人将永远循环于此刻。',
    lore: '被它捕获者，不会死亡，但会失去"时间"的感知。',
    preferredWork: ['OPPRESSION', 'SUPPRESSION'],
    badWork: ['COMMUNICATION'],
    workResults: {
      INSTINCT: { peBox: 3, black: 3, whiteDamage: 2, redDamage: 0, break: 1 },
      INSIGHT: { peBox: 3, black: 3, whiteDamage: 2, redDamage: 0, break: 1 },
      COMMUNICATION: { peBox: 1, black: 5, whiteDamage: 3, redDamage: 0, break: 2 },
      OPPRESSION: { peBox: 7, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 6, black: 1, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 4, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 26,
    baseResearchYield: 8,
    counterThreshold: 6,
    peColor: '#9a8a4a',
    shape: 'gear',
  },
  // === ALEPH ===
  {
    id: 'F-06-32',
    name: '白夜',
    riskClass: 'ALEPH',
    fearLevel: 5,
    description: '一团凝聚成人形的光。它只在最深的黑夜里显现。',
    lore: '它带着令人窒息的神圣感。在它面前，所有的恐惧都变成了敬畏。',
    preferredWork: ['SUPPRESSION', 'OPPRESSION'],
    badWork: ['COMMUNICATION', 'INSIGHT', 'INSTINCT'],
    workResults: {
      INSTINCT: { peBox: 1, black: 4, whiteDamage: 3, redDamage: 0, break: 2 },
      INSIGHT: { peBox: 1, black: 4, whiteDamage: 3, redDamage: 0, break: 2 },
      COMMUNICATION: { peBox: 1, black: 5, whiteDamage: 3, redDamage: 0, break: 3 },
      OPPRESSION: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 6, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 3, black: 3, whiteDamage: 2, redDamage: 0, break: 1 },
    },
    baseEnergyYield: 35,
    baseResearchYield: 12,
    counterThreshold: 7,
    peColor: '#f5f5f0',
    shape: 'cross',
  },
  {
    id: 'O-06-17',
    name: '沉默的君王',
    riskClass: 'ALEPH',
    fearLevel: 5,
    description: '一个坐在王座上的剪影。没有人见过它的脸。',
    lore: '它不发声，却能让所有生物下跪。它的命令会被无意识地执行。',
    preferredWork: ['SUPPRESSION', 'OPPRESSION'],
    badWork: ['COMMUNICATION', 'INSIGHT', 'INSTINCT'],
    workResults: {
      INSTINCT: { peBox: 0, black: 5, whiteDamage: 3, redDamage: 0, break: 3 },
      INSIGHT: { peBox: 0, black: 5, whiteDamage: 3, redDamage: 0, break: 3 },
      COMMUNICATION: { peBox: 0, black: 6, whiteDamage: 4, redDamage: 0, break: 3 },
      OPPRESSION: { peBox: 4, black: 2, whiteDamage: 2, redDamage: 0, break: 1 },
      SUPPRESSION: { peBox: 5, black: 2, whiteDamage: 1, redDamage: 0, break: 1 },
      CONTAINMENT: { peBox: 2, black: 3, whiteDamage: 2, redDamage: 0, break: 2 },
    },
    baseEnergyYield: 40,
    baseResearchYield: 14,
    counterThreshold: 8,
    peColor: '#0a0a0a',
    shape: 'pillar',
  },
];

export const anomaliesById = (id: string) => anomalies.find((a) => a.id === id);
