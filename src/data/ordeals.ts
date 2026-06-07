// 考验（Ordeal）数据 - 4 时段 × 4 颜色

export type OrdealTier = 'DAWN' | 'NOON' | 'DUSK' | 'MIDNIGHT';
export type OrdealColor = 'RED' | 'GREEN' | 'PURPLE' | 'AMBER';

export interface Ordeal {
  id: string;
  name: string;
  tier: OrdealTier;
  color: OrdealColor;
  description: string;
  rewardPercent: number; // 镇压后获得能量百分比
  penalty: string;
}

export const ordeals: Ordeal[] = [
  // 黎明 (10%)
  { id: 'dawn-red',    name: '红色黎明',   tier: 'DAWN',    color: 'RED',    description: '走廊布满小丑。',                 rewardPercent: 10, penalty: '不镇压则异想体计数器减少。' },
  { id: 'dawn-green',  name: '绿色黎明',   tier: 'DAWN',    color: 'GREEN',  description: '设施恢复效率提升。',             rewardPercent: 10, penalty: '效率下降。' },
  { id: 'dawn-purple', name: '紫色黎明',   tier: 'DAWN',    color: 'PURPLE', description: '员工获得临时勇气加成。',         rewardPercent: 10, penalty: '员工恐慌率上升。' },
  { id: 'dawn-amber',  name: '琥珀黎明',   tier: 'DAWN',    color: 'AMBER',  description: '能源产出增加。',                 rewardPercent: 10, penalty: '能源产出减少。' },

  // 正午 (15%)
  { id: 'noon-red',    name: '红色正午',   tier: 'NOON',    color: 'RED',    description: '警报潮。',                       rewardPercent: 15, penalty: '多组异想体工作计数 -1。' },
  { id: 'noon-green',  name: '绿色正午',   tier: 'NOON',    color: 'GREEN',  description: '研究点数激增。',                 rewardPercent: 15, penalty: '无法获得研究点数。' },
  { id: 'noon-purple', name: '紫色正午',   tier: 'NOON',    color: 'PURPLE', description: '员工洞察力临时提升。',           rewardPercent: 15, penalty: '员工精神下降。' },
  { id: 'noon-amber',  name: '琥珀正午',   tier: 'NOON',    color: 'AMBER',  description: '新异想体立即解锁。',             rewardPercent: 15, penalty: '新异想体威胁等级 +1。' },

  // 黄昏 (20%)
  { id: 'dusk-red',    name: '红色黄昏',   tier: 'DUSK',    color: 'RED',    description: '走廊出现强大敌人。',             rewardPercent: 20, penalty: '需要镇压，否则熔毁倒计时 -30s。' },
  { id: 'dusk-green',  name: '绿色黄昏',   tier: 'DUSK',    color: 'GREEN',  description: '全员恢复少量精神值。',           rewardPercent: 20, penalty: '全员精神值 -5。' },
  { id: 'dusk-purple', name: '紫色黄昏',   tier: 'DUSK',    color: 'PURPLE', description: '员工自律提升。',                 rewardPercent: 20, penalty: '员工恐惧抵抗 -1。' },
  { id: 'dusk-amber',  name: '琥珀黄昏',   tier: 'DUSK',    color: 'AMBER',  description: 'E.G.O 装备效率提升。',           rewardPercent: 20, penalty: 'E.G.O 装备耐久下降。' },

  // 午夜 (25%)
  { id: 'mid-red',     name: '红色午夜',   tier: 'MIDNIGHT', color: 'RED',    description: '走廊小丑化。',                   rewardPercent: 25, penalty: '必须镇压否则设施崩溃。' },
  { id: 'mid-green',   name: '绿色午夜',   tier: 'MIDNIGHT', color: 'GREEN',  description: '全员临时属性大幅提升。',         rewardPercent: 25, penalty: '全员永久 -1 最大属性。' },
  { id: 'mid-purple',  name: '紫色午夜',   tier: 'MIDNIGHT', color: 'PURPLE', description: '异想体工作成功率提升。',         rewardPercent: 25, penalty: '异想体突破概率 ×2。' },
  { id: 'mid-amber',   name: '琥珀午夜',   tier: 'MIDNIGHT', color: 'AMBER',  description: '能源产出 ×2。',                  rewardPercent: 25, penalty: '能源产出 /2。' },
];

export const ordealsById = (id: string) => ordeals.find((o) => o.id === id);
export const ordealsByTier = (tier: OrdealTier) => ordeals.filter(o => o.tier === tier);
