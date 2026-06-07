// 员工逻辑：恐慌、属性成长、状态转换

import type { Employee, EmployeeStatus } from '../store/gameStore';

const NAME_POOL = [
  '文昭', '仲明', '子谦', '青鸢', '白槐', '流萤', '寒川', '北辰', '云岫', '夜舟',
  '长庚', '稚野', '砚秋', '白川', '棠序', '砚青', '穆野', '令辞', '西洲', '云栖',
];

const SURNAME_POOL = [
  '崔', '洛', '池', '段', '裴', '厉', '阎', '冷', '商', '凤',
];

const COLOR_POOL = [
  '#e8e6df', '#4a8ac1', '#c14a4a', '#7ac14a', '#c19a4a', '#c08aff', '#4ac1a0',
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateEmployee(): Employee {
  return {
    id: 'emp-' + Math.random().toString(36).slice(2, 9),
    name: rand(SURNAME_POOL) + rand(NAME_POOL),
    color: rand(COLOR_POOL),
    fortitude: 30 + Math.floor(Math.random() * 30),  // 30-60
    prudence: 30 + Math.floor(Math.random() * 30),
    temperance: 30 + Math.floor(Math.random() * 30),
    justice: 30 + Math.floor(Math.random() * 30),
    status: 'NORMAL',
    equippedWeapon: null,
    equippedArmor: null,
  };
}

// 员工最大属性
export const MAX_ATTR = 120;

// 员工工作后属性提升（对应该工作类型）
export function growAttribute(emp: Employee, attr: keyof Omit<Employee, 'id' | 'name' | 'color' | 'status' | 'equippedWeapon' | 'equippedArmor' | 'kills'>): number {
  return Math.min(MAX_ATTR, emp[attr] + 2 + Math.floor(Math.random() * 3));
}

// 计算恐慌行为
export type PanicBehavior = 'ATTACK' | 'SUICIDE' | 'BREAK' | 'FLEE';

export function panicBehavior(emp: Employee): PanicBehavior {
  const stats = {
    ATTACK: emp.fortitude,
    SUICIDE: emp.prudence,
    BREAK: emp.temperance,
    FLEE: emp.justice,
  };
  let best: PanicBehavior = 'ATTACK';
  let bestVal = -1;
  for (const [b, v] of Object.entries(stats) as [PanicBehavior, number][]) {
    if (v > bestVal) { bestVal = v; best = b; }
  }
  return best;
}

export const panicBehaviorLabel = (b: PanicBehavior) => {
  const map = {
    ATTACK: '不分敌我攻击',
    SUICIDE: '原地自裁',
    BREAK: '破坏收容单元',
    FLEE: '四处乱跑',
  };
  return map[b];
};

export const panicBehaviorColor = (b: PanicBehavior) => {
  const map = {
    ATTACK: '#ff0033',
    SUICIDE: '#c19a4a',
    BREAK: '#c08aff',
    FLEE: '#4ac1a0',
  };
  return map[b];
};

export const statusColor = (s: EmployeeStatus): string => {
  const map: Record<EmployeeStatus, string> = {
    NORMAL: '#4dff88',
    PANIC: '#ff0033',
    DEAD: '#5a5a5a',
    CORPSE: '#3a3a3a',
  };
  return map[s];
};

export const statusLabel = (s: EmployeeStatus): string => {
  const map: Record<EmployeeStatus, string> = {
    NORMAL: '正常',
    PANIC: '恐慌',
    DEAD: '死亡',
    CORPSE: '失联',
  };
  return map[s];
};
