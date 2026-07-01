// 时代定义 + 前置条件（不确定性锥：时代越往后，路径依赖越强）
import type { Era, EraDef } from '../types';

export const ERAS: Record<Era, EraDef> = {
  stone: { id: 'stone', name: '石器时代', order: 0, prereqs: [] },
  bronze: { id: 'bronze', name: '青铜时代', order: 1, prereqs: ['stone'] },
  iron: { id: 'iron', name: '铁器时代', order: 2, prereqs: ['bronze'] },
  classical: { id: 'classical', name: '古典时代', order: 3, prereqs: ['iron'] },
  medieval: { id: 'medieval', name: '中世纪', order: 4, prereqs: ['classical'] },
  gunpowder: { id: 'gunpowder', name: '火药时代', order: 5, prereqs: ['medieval'] },
  industrial: { id: 'industrial', name: '工业时代', order: 6, prereqs: ['gunpowder'] },
  modern: { id: 'modern', name: '近现代', order: 7, prereqs: ['industrial'] },
};

export const ERA_ORDER: Era[] = (
  ['stone', 'bronze', 'iron', 'classical', 'medieval', 'gunpowder', 'industrial', 'modern'] as Era[]
).sort((a, b) => ERAS[a].order - ERAS[b].order);

/** 时代是否可跃迁：必须满足前置，且不可倒退（硬规则） */
export function canAdvanceTo(current: Era, target: Era): boolean {
  if (ERAS[target].order <= ERAS[current].order) return false; // 不可倒退/同级
  for (const p of ERAS[target].prereqs) {
    if (ERAS[p].order > ERAS[current].order) return false; // 前置未达成
  }
  return true;
}

/** 卡牌时代是否可用：须为当前时代或更早（已掌握的文明成果） */
export function isEraUsable(cardEra: Era, currentEra: Era): boolean {
  return ERAS[cardEra].order <= ERAS[currentEra].order;
}
