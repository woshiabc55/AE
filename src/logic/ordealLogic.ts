// 考验系统逻辑

import type { Ordeal, OrdealTier, OrdealColor } from '../data/ordeals';
import { ordealsByTier } from '../data/ordeals';

export const tierLabel: Record<OrdealTier, string> = {
  DAWN: '黎明',
  NOON: '正午',
  DUSK: '黄昏',
  MIDNIGHT: '午夜',
};

export const tierBonus: Record<OrdealTier, number> = {
  DAWN: 10,
  NOON: 15,
  DUSK: 20,
  MIDNIGHT: 25,
};

export const tierOrder: OrdealTier[] = ['DAWN', 'NOON', 'DUSK', 'MIDNIGHT'];

export const colorLabel: Record<OrdealColor, string> = {
  RED: '红色',
  GREEN: '绿色',
  PURPLE: '紫色',
  AMBER: '琥珀色',
};

export const colorHex: Record<OrdealColor, string> = {
  RED: '#ff0033',
  GREEN: '#4dff88',
  PURPLE: '#c08aff',
  AMBER: '#d9c14a',
};

export function pickRandomOrdeal(tier: OrdealTier, seed: number): Ordeal {
  const pool = ordealsByTier(tier);
  return pool[seed % pool.length];
}
