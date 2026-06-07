// 异想体工作逻辑

import type { Anomaly, WorkType, WorkResult } from '../data/anomalies';

export type WorkOutcome = 'PE_BOX' | 'BLACK' | 'WHITE_DAMAGE' | 'RED_DAMAGE' | 'BREAK';

// 根据员工属性和异想体偏好计算工作结果
export function performWork(
  anomaly: Anomaly,
  workType: WorkType,
  employeeStats: {
    fortitude: number;
    prudence: number;
    temperance: number;
    justice: number;
  }
): { outcome: WorkOutcome; energyDelta: number; damage: number } {
  const result = anomaly.workResults[workType];
  const attrKey: Record<WorkType, keyof typeof employeeStats> = {
    INSTINCT: 'fortitude',
    INSIGHT: 'prudence',
    COMMUNICATION: 'temperance',
    OPPRESSION: 'justice',
    SUPPRESSION: 'fortitude',
    CONTAINMENT: 'prudence',
  };
  const employeeAttr = employeeStats[attrKey[workType]];

  // 成功率修正：员工属性对首选工作加成，对厌恶工作减益
  let modifier = 1.0;
  if (anomaly.preferredWork.includes(workType)) {
    modifier += (employeeAttr - 50) * 0.015; // 高属性员工对偏好工作加成
  } else if (anomaly.badWork.includes(workType)) {
    modifier -= Math.max(0, 0.25 - employeeAttr * 0.002);
  }

  // 恐惧等级影响：等级越高越难成功
  modifier -= anomaly.fearLevel * 0.04;

  // 加权随机
  const weights: Record<WorkOutcome, number> = {
    PE_BOX: result.peBox * modifier,
    BLACK: result.black,
    WHITE_DAMAGE: result.whiteDamage,
    RED_DAMAGE: result.redDamage,
    BREAK: result.break * (1 - Math.max(0, employeeAttr - 30) * 0.005),
  };
  const total = Object.values(weights).reduce((a, b) => a + Math.max(0.01, b), 0);
  let r = Math.random() * total;
  let outcome: WorkOutcome = 'PE_BOX';
  for (const [k, w] of Object.entries(weights) as [WorkOutcome, number][]) {
    r -= Math.max(0.01, w);
    if (r <= 0) {
      outcome = k;
      break;
    }
  }

  // 能量变化
  let energyDelta = 0;
  let damage = 0;
  switch (outcome) {
    case 'PE_BOX':
      energyDelta = anomaly.baseEnergyYield + Math.floor(Math.random() * 4);
      break;
    case 'BLACK':
      energyDelta = -Math.floor(anomaly.baseEnergyYield / 2 + Math.random() * 3);
      break;
    case 'WHITE_DAMAGE':
      damage = 8 + anomaly.fearLevel * 3;
      energyDelta = 1;
      break;
    case 'RED_DAMAGE':
      damage = 15 + anomaly.fearLevel * 4;
      energyDelta = 0;
      break;
    case 'BREAK':
      energyDelta = 0;
      damage = 25;
      break;
  }
  return { outcome, energyDelta, damage };
}

export const workTypeLabel = (wt: WorkType): string => {
  const map: Record<WorkType, string> = {
    INSTINCT: '本能',
    INSIGHT: '洞察',
    COMMUNICATION: '沟通',
    OPPRESSION: '压迫',
    SUPPRESSION: '抑制',
    CONTAINMENT: '收容',
  };
  return map[wt];
};

export const workTypeColor = (wt: WorkType): string => {
  const map: Record<WorkType, string> = {
    INSTINCT: '#c14a4a',
    INSIGHT: '#4a8ac1',
    COMMUNICATION: '#7ac14a',
    OPPRESSION: '#c19a4a',
    SUPPRESSION: '#8a4ac1',
    CONTAINMENT: '#4ac1a0',
  };
  return map[wt];
};

export const workTypeAttrKey = (wt: WorkType): 'fortitude' | 'prudence' | 'temperance' | 'justice' => {
  const map = {
    INSTINCT: 'fortitude',
    INSIGHT: 'prudence',
    COMMUNICATION: 'temperance',
    OPPRESSION: 'justice',
    SUPPRESSION: 'fortitude',
    CONTAINMENT: 'prudence',
  } as const;
  return map[wt];
};
