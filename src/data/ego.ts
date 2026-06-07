// E.G.O 装备数据

import type { Anomaly } from './anomalies';

export type EGOSlot = 'WEAPON' | 'ARMOR';

export interface EGOEquipment {
  id: string;
  anomalyId: string;
  name: string;
  slot: EGOSlot;
  researchCost: number;
  // 属性加成
  fortitudeBonus: number;
  prudenceBonus: number;
  temperanceBonus: number;
  justiceBonus: number;
  // 副作用（部分武器）
  selfDamage: boolean;
  // 视觉
  icon: string;
  color: string;
}

export const egoEquipment: EGOEquipment[] = [
  // 可爱的鸟
  { id: 'ego-bird-w', anomalyId: 'F-01-01', name: '鸟羽刃',   slot: 'WEAPON', researchCost: 3,  fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 2, justiceBonus: 3, selfDamage: false, icon: 'wing', color: '#9ad19a' },
  { id: 'ego-bird-a', anomalyId: 'F-01-01', name: '羽织',     slot: 'ARMOR',  researchCost: 2,  fortitudeBonus: 1, prudenceBonus: 2, temperanceBonus: 1, justiceBonus: 0, selfDamage: false, icon: 'cloak', color: '#9ad19a' },
  // 小帮手
  { id: 'ego-helper-w', anomalyId: 'O-01-04', name: '协助指环', slot: 'WEAPON', researchCost: 3, fortitudeBonus: 0, prudenceBonus: 1, temperanceBonus: 3, justiceBonus: 1, selfDamage: false, icon: 'ring', color: '#c08aff' },
  // 焦化少女
  { id: 'ego-girl-w', anomalyId: 'F-02-49', name: '焦油钉', slot: 'WEAPON', researchCost: 5, fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 2, justiceBonus: 4, selfDamage: true, icon: 'nail', color: '#2a2a35' },
  { id: 'ego-girl-a', anomalyId: 'F-02-49', name: '焦化护胸', slot: 'ARMOR', researchCost: 4, fortitudeBonus: 3, prudenceBonus: 2, temperanceBonus: 0, justiceBonus: 0, selfDamage: false, icon: 'cuirass', color: '#2a2a35' },
  // 壁虎
  { id: 'ego-lizard-w', anomalyId: 'O-02-62', name: '尾刺', slot: 'WEAPON', researchCost: 5, fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 1, justiceBonus: 5, selfDamage: false, icon: 'tail', color: '#7a8a6a' },
  // 一無所有
  { id: 'ego-void-w', anomalyId: 'F-03-22', name: '虚空短刃', slot: 'WEAPON', researchCost: 6, fortitudeBonus: 0, prudenceBonus: 2, temperanceBonus: 0, justiceBonus: 5, selfDamage: true, icon: 'blade', color: '#0a0a0a' },
  // 红舞鞋
  { id: 'ego-shoes-w', anomalyId: 'F-04-83', name: '红舞鞋', slot: 'WEAPON', researchCost: 8, fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 0, justiceBonus: 7, selfDamage: true, icon: 'heel', color: '#c8143a' },
  { id: 'ego-shoes-a', anomalyId: 'F-04-83', name: '红舞裙', slot: 'ARMOR', researchCost: 7, fortitudeBonus: 1, prudenceBonus: 2, temperanceBonus: 3, justiceBonus: 2, selfDamage: false, icon: 'dress', color: '#c8143a' },
  // 悲恸之母
  { id: 'ego-mother-w', anomalyId: 'O-04-13', name: '泪之杖', slot: 'WEAPON', researchCost: 9, fortitudeBonus: 1, prudenceBonus: 3, temperanceBonus: 3, justiceBonus: 0, selfDamage: false, icon: 'staff', color: '#4a4a6a' },
  { id: 'ego-mother-a', anomalyId: 'O-04-13', name: '摇篮护符', slot: 'ARMOR', researchCost: 8, fortitudeBonus: 2, prudenceBonus: 4, temperanceBonus: 1, justiceBonus: 0, selfDamage: false, icon: 'amulet', color: '#4a4a6a' },
  // 雪白的鹿
  { id: 'ego-deer-w', anomalyId: 'F-05-29', name: '白角', slot: 'WEAPON', researchCost: 14, fortitudeBonus: 2, prudenceBonus: 0, temperanceBonus: 0, justiceBonus: 8, selfDamage: false, icon: 'antler', color: '#e8e6df' },
  // 永生之轮
  { id: 'ego-wheel-w', anomalyId: 'O-05-07', name: '永动链', slot: 'WEAPON', researchCost: 16, fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 4, justiceBonus: 7, selfDamage: false, icon: 'chain', color: '#9a8a4a' },
  // 白夜
  { id: 'ego-white-w', anomalyId: 'F-06-32', name: '白夜圣剑', slot: 'WEAPON', researchCost: 22, fortitudeBonus: 3, prudenceBonus: 0, temperanceBonus: 0, justiceBonus: 10, selfDamage: false, icon: 'sword', color: '#f5f5f0' },
  { id: 'ego-white-a', anomalyId: 'F-06-32', name: '白夜长袍', slot: 'ARMOR', researchCost: 20, fortitudeBonus: 5, prudenceBonus: 5, temperanceBonus: 3, justiceBonus: 2, selfDamage: false, icon: 'robe', color: '#f5f5f0' },
  // 沉默的君王
  { id: 'ego-king-w', anomalyId: 'O-06-17', name: '王之敕令', slot: 'WEAPON', researchCost: 26, fortitudeBonus: 0, prudenceBonus: 0, temperanceBonus: 5, justiceBonus: 10, selfDamage: true, icon: 'scepter', color: '#0a0a0a' },
  { id: 'ego-king-a', anomalyId: 'O-06-17', name: '君王披风', slot: 'ARMOR', researchCost: 24, fortitudeBonus: 6, prudenceBonus: 4, temperanceBonus: 4, justiceBonus: 0, selfDamage: false, icon: 'cape', color: '#0a0a0a' },
];

export const egoByAnomaly = (anomalyId: string): EGOEquipment[] =>
  egoEquipment.filter(e => e.anomalyId === anomalyId);

export const egoById = (id: string) => egoEquipment.find(e => e.id === id);

export const egoName = (a: Anomaly, slot: EGOSlot): string => {
  const eq = egoEquipment.find(e => e.anomalyId === a.id && e.slot === slot);
  return eq ? eq.name : `${a.name}的${slot === 'WEAPON' ? '武器' : '护甲'}`;
};
