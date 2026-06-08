/**
 * 卡牌库
 * 定义所有可用的卡牌数据
 */

export const RARITY = {
  COMMON: { name: '普通', color: '#d4d4d4', gem: 'common' },
  RARE: { name: '稀有', color: '#5fd1ff', gem: 'rare' },
  EPIC: { name: '史诗', color: '#c25fff', gem: 'epic' },
  LEGENDARY: { name: '传说', color: '#ffaa30', gem: 'legendary' },
};

export const CARD_TYPES = {
  MINION: 'minion',
  SPELL: 'spell',
};

/**
 * 全部卡牌库
 *  - type: minion | spell
 *  - cost: 法力消耗
 *  - attack / health: 仅随从
 *  - portrait: 对应 portraits.js 中的 key
 *  - text: 描述
 *  - rarity
 *  - effect: 特殊效果函数 onPlay(ctx, target?)
 */
export const CARDS = {
  // === 中立 ===
  n1: {
    id: 'n1', name: '霜狼步兵', type: 'minion', cost: 2, attack: 2, health: 2,
    portrait: 'wolf', text: '战吼：本回合你下一个英雄技能的法力消耗减 1。', rarity: 'COMMON',
  },
  n2: {
    id: 'n2', name: '奥术智慧', type: 'spell', cost: 3, portrait: 'arcane',
    text: '抽两张牌。', rarity: 'RARE',
    effect: (ctx) => ctx.drawCards(2),
  },
  n3: {
    id: 'n3', name: '火焰冲击', type: 'spell', cost: 1, portrait: 'flame',
    text: '对一个角色造成 3 点伤害。', rarity: 'COMMON',
    effect: (ctx, target) => ctx.dealDamage(target, 3),
  },
  n4: {
    id: 'n4', name: '冰霜新星', type: 'spell', cost: 3, portrait: 'frost',
    text: '对所有敌方随从造成 2 点伤害，并冻结它们。', rarity: 'RARE',
    effect: (ctx) => ctx.aoeDamage('opponent', 2, { freeze: true }),
  },

  // === 圣骑士 ===
  p1: {
    id: 'p1', name: '白银之手新兵', type: 'minion', cost: 1, attack: 1, health: 1,
    portrait: 'soldier', text: '', rarity: 'COMMON',
  },
  p2: {
    id: 'p2', name: '圣光审判', type: 'spell', cost: 4, portrait: 'holy',
    text: '对敌方英雄造成 5 点伤害。', rarity: 'EPIC',
    effect: (ctx) => ctx.dealDamage(ctx.opponent.hero, 5),
  },
  p3: {
    id: 'p3', name: '提里奥·弗丁', type: 'minion', cost: 8, attack: 6, health: 6,
    portrait: 'paladin', text: '圣盾。战吼：装备一把 5/3 的真银之剑。', rarity: 'LEGENDARY',
    keywords: ['divine_shield'],
  },

  // === 术士 ===
  w1: {
    id: 'w1', name: '虚空行者', type: 'minion', cost: 1, attack: 1, health: 3,
    portrait: 'voidwalker', text: '嘲讽。', rarity: 'COMMON', keywords: ['taunt'],
  },
  w2: {
    id: 'w2', name: '生命虹吸', type: 'spell', cost: 3, portrait: 'drain',
    text: '对一个随从造成 2 点伤害，为你的英雄回复 4 点生命。', rarity: 'RARE',
    effect: (ctx, target) => {
      ctx.dealDamage(target, 2);
      ctx.healHero(ctx.player, 4);
    },
  },
  w3: {
    id: 'w3', name: '末日守卫', type: 'minion', cost: 7, attack: 7, health: 7,
    portrait: 'doomguard', text: '战吼：你的英雄受到 2 点伤害。', rarity: 'EPIC',
    battlecry: (ctx) => ctx.dealDamage(ctx.player.hero, 2),
  },

  // === 德鲁伊 ===
  d1: {
    id: 'd1', name: '古树卫士', type: 'minion', cost: 4, attack: 3, health: 5,
    portrait: 'treant', text: '嘲讽。', rarity: 'COMMON', keywords: ['taunt'],
  },
  d2: {
    id: 'd2', name: '自然之力', type: 'spell', cost: 5, portrait: 'treant',
    text: '召唤三个 2/2 的树人。', rarity: 'EPIC',
    effect: (ctx) => {
      for (let i = 0; i < 3; i++) {
        ctx.summonToken({ attack: 2, health: 2, name: '树人' });
      }
    },
  },

  // === 法师 ===
  m1: {
    id: 'm1', name: '水元素', type: 'minion', cost: 4, attack: 3, health: 6,
    portrait: 'mage', text: '冻结任何受到该随从攻击的角色。', rarity: 'EPIC',
  },
  m2: {
    id: 'm2', name: '炎爆术', type: 'spell', cost: 7, portrait: 'flame',
    text: '对敌方英雄造成 10 点伤害。', rarity: 'LEGENDARY',
    effect: (ctx) => ctx.dealDamage(ctx.opponent.hero, 10),
  },
};

/**
 * 各职业的卡组构成
 * 每个职业 15 张牌，洗牌后作为起始牌库
 */
export const DECKS = {
  paladin: ['p1', 'p1', 'p1', 'p2', 'p3', 'n1', 'n1', 'n2', 'n2', 'n3', 'n4', 'p1', 'n1', 'n3', 'n4'],
  warlock: ['w1', 'w1', 'w1', 'w2', 'w3', 'n1', 'n1', 'n2', 'n2', 'n3', 'n4', 'w1', 'n1', 'n3', 'n2'],
  druid: ['d1', 'd1', 'd2', 'n1', 'n1', 'n2', 'n2', 'n3', 'n3', 'n4', 'n1', 'd1', 'n3', 'n2', 'n1'],
  mage: ['m1', 'm1', 'm2', 'n1', 'n1', 'n2', 'n2', 'n3', 'n3', 'n4', 'm1', 'n1', 'n3', 'n2', 'n4'],
};

export const CLASS_INFO = {
  paladin: {
    id: 'paladin',
    name: '圣骑士',
    label: 'Paladin',
    heroName: '乌瑟尔·光明使者',
    accent: '#ffd76b',
    accentDeep: '#8a6d1f',
    skillName: '援军',
    skillDesc: '召唤一个 1/1 的白银之手新兵。',
    skillCost: 2,
    skillIcon: 'shield',
  },
  warlock: {
    id: 'warlock',
    name: '术士',
    label: 'Warlock',
    heroName: '古尔丹',
    accent: '#a51c2e',
    accentDeep: '#5a0a14',
    skillName: '生命分流',
    skillDesc: '受到 2 点伤害，抽一张牌。',
    skillCost: 2,
    skillIcon: 'drain',
  },
  druid: {
    id: 'druid',
    name: '德鲁伊',
    label: 'Druid',
    heroName: '玛法里奥·怒风',
    accent: '#5a8a4a',
    accentDeep: '#2d6e4e',
    skillName: '变形',
    skillDesc: '本回合获得 +1 攻击。',
    skillCost: 1,
    skillIcon: 'claw',
  },
  mage: {
    id: 'mage',
    name: '法师',
    label: 'Mage',
    heroName: '吉安娜·普罗德摩尔',
    accent: '#5fd1ff',
    accentDeep: '#1a3a5a',
    skillName: '火焰冲击',
    skillDesc: '对任意角色造成 1 点伤害。',
    skillCost: 2,
    skillIcon: 'flame',
  },
};
