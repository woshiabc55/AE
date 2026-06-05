import type { Rarity, SkillGroup, SkillPack, TimelineEvent } from './types';

// 战术代号库（科幻 + 武器感）
const ADJECTIVES = ['铁誓', '荒狼', '凛风', '寂灭', '鸣钟', '残阳', '夜枭', '雪鸮', '裂空', '寒潮', '黑潮', '赤潮', '朔风', '雷鸣', '银棘', '碎影', '苍蓝', '灰烬', '幽冥', '霜鳞', '铳鸣', '伏羲', '夸父', '刑天', '烛龙', '共工', '后羿', '白泽', '玄武', '朱雀', '青龙', '白虎', '麒麟'];
const CLASS_CODES = ['HOK', 'BLD', 'FNG', 'GRD', 'STM', 'ARC', 'MED', 'SUP', 'SPC', 'DEF', 'SNP', 'RFT', 'BSK'];
const TAG_POOL = ['物理', '法术', '近战', '远程', '单体', '群体', '爆发', '持续', '治疗', '护盾', '减速', '眩晕', '沉默', '真实伤害', '位移', '召唤', '支援', '控场'];
const DESCRIPTIONS = [
  '激活后对最近敌人发射一枚贯穿弹，造成 280% 物理伤害并使目标防御下降 25%。',
  '召唤电磁立场 6 秒，每秒对周围敌人造成 95% 法术伤害并使其移速降低 30%。',
  '切换至强化姿态：攻速 +60%，持续 12 秒，自身受到的伤害提高 20%。',
  '消耗 4 点技力，对十字范围内所有友方单位施加可吸收 800 伤害的护盾。',
  '持续 8 秒，攻击附加 35% 法术伤害并减速 15%，叠加 4 层后冻结目标 1.5 秒。',
  '自身获得 50% 减伤，攻击附带治疗自身 4% 已损失生命。',
  '向指定方向射出光矛，命中后引爆并造成 320% 真实伤害，击退 3 米。',
  '部署一个 12 秒的力场发生器，提升场内友方单位 18% 攻击速度。',
  '在脚下生成 3 次 5 连击，每次造成 60% 物理伤害，命中削弱目标 5% 防御。',
  '对目标施加 8 秒的脆弱状态，期间受到的所有伤害 +30%。',
];

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildPack(groupIdx: number, packIdx: number): SkillPack {
  const r = rand(groupIdx * 1000 + packIdx * 31 + 7);
  const idNum = String(groupIdx * 100 + packIdx + 1).padStart(3, '0');
  const classCode = CLASS_CODES[Math.floor(r() * CLASS_CODES.length)];
  const adj = ADJECTIVES[Math.floor(r() * ADJECTIVES.length)];
  const code = `${classCode}-${Math.floor(r() * 9) + 1} "${adj}"`;
  const name = `${adj}·${classCode}-${Math.floor(r() * 90) + 1}`;
  // 越靠后组 T5/T6 概率越高
  const rarityRoll = r();
  let rarity: Rarity;
  if (rarityRoll > 0.985) rarity = 'T6';
  else if (rarityRoll > 0.9) rarity = 'T5';
  else if (rarityRoll > 0.72) rarity = 'T4';
  else if (rarityRoll > 0.5) rarity = 'T3';
  else if (rarityRoll > 0.25) rarity = 'T2';
  else rarity = 'T1';

  const level = Math.max(1, Math.floor(r() * (groupIdx + 1) * 14) + Math.floor(r() * 30));
  const tagCount = 2 + Math.floor(r() * 2);
  const tags: string[] = [];
  for (let i = 0; i < tagCount; i++) {
    const t = TAG_POOL[Math.floor(r() * TAG_POOL.length)];
    if (!tags.includes(t)) tags.push(t);
  }
  const cost = Math.floor(((rarityIndex(rarity) + 1) ** 1.8) * (level * 4 + 30));
  const locked = r() > 0.92;
  const equipped = r() > 0.85;
  const description = DESCRIPTIONS[Math.floor(r() * DESCRIPTIONS.length)];
  return {
    id: `SK-${idNum}`,
    code,
    name,
    rarity,
    level: Math.min(90, level),
    tags,
    cost,
    locked,
    equipped,
    description,
  };
}

function rarityIndex(r: Rarity): number {
  return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].indexOf(r);
}

const GROUP_DEFS: Array<{ code: string; name: string; capacity: number; count: number }> = [
  { code: 'GROP A', name: '破晓', capacity: 30, count: 30 },
  { code: 'GROP B', name: '夜航', capacity: 28, count: 28 },
  { code: 'GROP C', name: '长暮', capacity: 26, count: 26 },
  { code: 'GROP D', name: '寒铸', capacity: 24, count: 24 },
  { code: 'GROP E', name: '雷陨', capacity: 22, count: 22 },
  { code: 'GROP F', name: '寂鸣', capacity: 20, count: 20 },
  { code: 'GROP G', name: '天烬', capacity: 30, count: 30 },
];

export const groups: SkillGroup[] = GROUP_DEFS.map((g, gi) => ({
  id: `GROP-${String.fromCharCode(65 + gi)}`,
  code: g.code,
  name: g.name,
  capacity: g.capacity,
  packs: Array.from({ length: g.count }, (_, pi) => buildPack(gi, pi)),
}));

export const initialEvents: TimelineEvent[] = [
  { id: 'evt-0', code: 'EVT-001', ts: Date.now() - 320000, level: 'OK',   message: 'GROP A 已编入主战序列，载弹 100%' },
  { id: 'evt-1', code: 'EVT-002', ts: Date.now() - 280000, level: 'INFO', message: '检测到 12 个新可升级目标，等级阈值 E2' },
  { id: 'evt-2', code: 'EVT-003', ts: Date.now() - 240000, level: 'WARN', message: 'SK-018 "裂空" 进入锁定态，需手动解锁' },
  { id: 'evt-3', code: 'EVT-004', ts: Date.now() - 180000, level: 'INFO', message: '指挥官 [DR-091] 上线，权限 Lv.4' },
  { id: 'evt-4', code: 'EVT-005', ts: Date.now() - 90000,  level: 'CRIT', message: '神经同步率跌至 87%，请检查终端链路' },
  { id: 'evt-5', code: 'EVT-006', ts: Date.now() - 12000,  level: 'OK',   message: '批量写入配置成功，生成 EVT 回执 #6F2A' },
];
