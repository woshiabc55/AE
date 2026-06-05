export type Rarity = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

export interface SkillPack {
  id: string;          // SK-001
  code: string;        // HOK-7 "铁誓"
  name: string;        // 中文名
  rarity: Rarity;
  level: number;       // 1..90
  tags: string[];      // ['物理', '近战', '爆发']
  cost: number;        // 升级消耗
  locked: boolean;
  equipped: boolean;
  description: string;
}

export interface SkillGroup {
  id: string;          // GROP-A
  code: string;        // GROP A "破晓"
  name: string;        // 中文名
  capacity: number;    // 总槽位
  packs: SkillPack[];  // 包含的技能包
}

export interface TimelineEvent {
  id: string;
  code: string;
  ts: number;
  level: 'INFO' | 'WARN' | 'CRIT' | 'OK';
  message: string;
}
