/**
 * 战斗引擎
 * 处理游戏状态、出牌、攻击、回合切换、胜负判定
 */

import { CARDS, DECKS } from '../cards/cards.js';
import { pushLog } from './state.js';

const STARTING_HP = 30;
const STARTING_HAND = 4;
const MAX_MANA = 10;

let nextEntityId = 1;
function uid() {
  return `e${nextEntityId++}`;
}

/**
 * 创建一份完整游戏状态
 */
export function createBattle(playerClass, aiClass) {
  const playerDeck = shuffle(buildDeck(DECKS[playerClass]));
  const aiDeck = shuffle(buildDeck(DECKS[aiClass]));

  const player = createPlayer('player', playerClass, playerDeck);
  const ai = createPlayer('ai', aiClass, aiDeck);

  // 让 player 先手
  const battle = {
    turn: 1,
    active: 'player', // player | ai
    player,
    ai,
    selectedCard: null,
    targeting: null, // { from: 'hand'|'board', source: ent, targets: 'minion'|'hero'|'any' }
    gameOver: false,
    winner: null,
  };

  // 抽起始手牌
  for (let i = 0; i < STARTING_HAND; i++) {
    drawCard(player);
    drawCard(ai);
  }

  // 第一回合 player 法力
  player.mana = 1;
  player.maxMana = 1;
  ai.mana = 0;
  ai.maxMana = 0;

  pushLog(`战斗开始！${player.heroName} vs ${ai.heroName}`, 'info');
  return battle;
}

function createPlayer(side, classKey, deck) {
  const info = CARDS; // alias
  void info;
  return {
    side, // 'player' | 'ai'
    classKey,
    heroName: classKey === 'paladin' ? '乌瑟尔·光明使者' :
              classKey === 'warlock' ? '古尔丹' :
              classKey === 'druid' ? '玛法里奥·怒风' : '吉安娜·普罗德摩尔',
    hero: { id: uid(), maxHp: STARTING_HP, hp: STARTING_HP, attackBuff: 0, frozen: false },
    deck, // 牌库（卡牌 id 列表）
    hand: [], // 卡牌对象 { instanceId, cardId, cost, ... }
    board: [], // 随从 { instanceId, cardId, attack, health, maxHealth, canAttack, keywords }
    graveyard: [],
    mana: 0,
    maxMana: 0,
    fatigue: 0,
    skillUsed: false, // 本回合是否已使用技能
  };
}

function buildDeck(deckIds) {
  return deckIds.map((id) => ({ instanceId: uid(), cardId: id }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 抽一张牌
 */
export function drawCard(player, n = 1) {
  for (let i = 0; i < n; i++) {
    if (player.deck.length === 0) {
      player.fatigue += 1;
      dealDamageToHero(player, player.fatigue, { silent: true });
      pushLog(`${player.heroName} 因疲劳受到 ${player.fatigue} 点伤害`, 'damage');
      continue;
    }
    const inst = player.deck.shift();
    player.hand.push(inst);
  }
}

/**
 * 切换到对方回合
 */
export function endTurn(battle) {
  if (battle.gameOver) return;
  const cur = battle[battle.active];
  // 重置本回合标记
  cur.skillUsed = false;
  cur.hero.attackBuff = 0;
  cur.board.forEach((m) => (m.canAttack = true));

  // 切换
  battle.active = battle.active === 'player' ? 'ai' : 'player';
  battle.turn += 0; // 同一回合
  const next = battle[battle.active];

  // 增长法力（每轮两个玩家各 +1）
  if (next.maxMana < MAX_MANA) next.maxMana += 1;
  next.mana = next.maxMana;

  // 抽一张
  drawCard(next);

  pushLog(`—— ${next.heroName} 的回合 ——`, 'turn');
  battle.targeting = null;
  battle.selectedCard = null;
}

function dealDamageToHero(player, amount, opts = {}) {
  const hero = player.hero;
  if (hero.frozen) {
    // 冻结只阻止攻击，不阻止受伤
  }
  hero.hp = Math.max(0, hero.hp - amount);
  if (!opts.silent) {
    pushLog(`${player.heroName} 受到 ${amount} 点伤害 (${hero.hp}/${hero.maxHp})`, 'damage');
  }
  return amount;
}

function healHero(player, amount) {
  const hero = player.hero;
  const old = hero.hp;
  hero.hp = Math.min(hero.maxHp, hero.hp + amount);
  const real = hero.hp - old;
  if (real > 0) pushLog(`${player.heroName} 恢复了 ${real} 点生命 (${hero.hp}/${hero.maxHp})`, 'heal');
  return real;
}

function isDead(entity) {
  if (!entity) return true;
  if (entity.hp !== undefined) return entity.hp <= 0;
  if (entity.health !== undefined) return entity.health <= 0;
  return false;
}

/**
 * 检查胜负
 */
export function checkGameOver(battle) {
  if (battle.gameOver) return;
  if (battle.player.hero.hp <= 0) {
    battle.gameOver = true;
    battle.winner = 'ai';
    pushLog(`你被击败了……`, 'damage');
  } else if (battle.ai.hero.hp <= 0) {
    battle.gameOver = true;
    battle.winner = 'player';
    pushLog(`胜利！敌方英雄倒下了。`, 'heal');
  }
}

/**
 * 从手牌打出卡牌
 *  - onChooseTarget: 需先选目标的回调（返回 Promise）
 */
export function playCardFromHand(battle, instanceId, targetResolver) {
  if (battle.gameOver) return;
  if (battle.active !== 'player') return;
  const player = battle.player;
  const idx = player.hand.findIndex((c) => c.instanceId === instanceId);
  if (idx < 0) return;
  const inst = player.hand[idx];
  const card = CARDS[inst.cardId];
  if (!card) return;
  if (player.mana < card.cost) {
    return { error: 'mana' };
  }
  // 法术需要先选目标
  if (card.type === 'spell' && card.effect) {
    // 简化：法术效果如果是单体伤害或治疗，需要目标
    const needsTarget = card.text.includes('对一个') || card.text.includes('对敌方英雄') || card.text.includes('对任意');
    if (needsTarget && !targetResolver) {
      return { needTarget: true, card, instance: inst };
    }
  }

  // 扣费
  player.mana -= card.cost;
  // 移出到手牌
  player.hand.splice(idx, 1);
  player.graveyard.push(inst);

  // 召唤随从 / 施法
  if (card.type === 'minion') {
    summonMinion(player, card, inst);
  } else if (card.type === 'spell' && card.effect) {
    castSpell(battle, card, targetResolver, inst);
  }

  checkGameOver(battle);
  return { ok: true };
}

function summonMinion(player, card, inst) {
  const minion = {
    instanceId: inst.instanceId,
    cardId: card.id,
    name: card.name,
    attack: card.attack,
    health: card.health,
    maxHealth: card.health,
    canAttack: false, // 刚召唤不能立即攻击
    keywords: card.keywords || [],
    frozen: false,
  };
  if (player.board.length >= 7) {
    pushLog(`战场已满，${card.name} 被丢弃`, 'info');
    return;
  }
  player.board.push(minion);
  pushLog(`召唤了 ${card.name} (${card.attack}/${card.health})`, 'summon');
  if (card.battlecry) {
    const ctx = makeContext(player, battleRef);
    card.battlecry(ctx);
  }
}

let battleRef = null;
export function setBattleRef(b) { battleRef = b; }

function castSpell(battle, card, target, inst) {
  pushLog(`施放法术：${card.name}`, 'spell');
  const ctx = makeContext(battle[battle.active], battle);
  if (card.effect) {
    if (target) card.effect(ctx, target);
    else card.effect(ctx);
  }
}

/**
 * 出牌上下文：暴露给 effect 的接口
 */
function makeContext(player, battle) {
  const opponent = player.side === 'player' ? battle.ai : battle.player;
  return {
    player,
    opponent,
    battle,
    drawCards: (n) => drawCard(player, n),
    dealDamage: (target, amount) => {
      if (!target) return;
      if (target.hero) return dealDamageToHero(target, amount);
      if (target.health !== undefined) {
        target.health -= amount;
        pushLog(`${target.name} 受到 ${amount} 点伤害 (${Math.max(0,target.health)}/${target.maxHealth})`, 'damage');
        if (target.health <= 0) killMinion(target, player, battle);
      }
    },
    healHero: (who, amount) => healHero(who, amount),
    summonToken: (opts) => {
      if (player.board.length >= 7) return;
      const tok = {
        instanceId: uid(),
        cardId: 'token',
        name: opts.name || '随从',
        attack: opts.attack,
        health: opts.health,
        maxHealth: opts.health,
        canAttack: false,
        keywords: [],
        frozen: false,
      };
      player.board.push(tok);
      pushLog(`召唤了 ${opts.name || '随从'} (${opts.attack}/${opts.health})`, 'summon');
    },
    aoeDamage: (side, amount, opts = {}) => {
      const target = side === 'player' ? battle.player : battle.ai;
      target.board.forEach((m) => {
        m.health -= amount;
        if (opts.freeze) m.frozen = true;
        pushLog(`${m.name} 受到 ${amount} 点伤害`, 'damage');
        if (m.health <= 0) killMinion(m, target, battle);
      });
    },
  };
}

/**
 * 移除死亡的随从
 */
function killMinion(minion, owner, battle) {
  const idx = owner.board.findIndex((m) => m.instanceId === minion.instanceId);
  if (idx >= 0) {
    owner.board.splice(idx, 1);
    owner.graveyard.push({ instanceId: minion.instanceId, cardId: minion.cardId });
    pushLog(`${minion.name} 阵亡了`, 'damage');
  }
}

/**
 * 攻击：随从 A 攻击 目标
 */
export function attack(battle, attackerInstId, target) {
  if (battle.gameOver) return { error: 'gameover' };
  if (battle.active !== 'player') return { error: 'noturn' };
  const player = battle.player;
  const opponent = battle.ai;
  const attacker = player.board.find((m) => m.instanceId === attackerInstId);
  if (!attacker) return { error: 'noattacker' };
  if (!attacker.canAttack) return { error: 'sleepy' };
  if (attacker.frozen) return { error: 'frozen' };
  // 检查嘲讽
  if (target.minion) {
    const taunts = opponent.board.filter((m) => m.keywords && m.keywords.includes('taunt') && m.health > 0);
    if (taunts.length > 0 && !taunts.find((m) => m.instanceId === target.minion.instanceId)) {
      return { error: 'taunt' };
    }
  } else if (target.hero) {
    const taunts = opponent.board.filter((m) => m.keywords && m.keywords.includes('taunt') && m.health > 0);
    if (taunts.length > 0) {
      return { error: 'taunt' };
    }
  }

  const atkPower = attacker.attack + (player.hero.attackBuff || 0);
  attacker.canAttack = false;

  if (target.minion) {
    // 互殴
    const def = opponent.board.find((m) => m.instanceId === target.minion.instanceId);
    if (!def) return { error: 'notarget' };
    pushLog(`${attacker.name} 攻击 ${def.name}`, 'info');
    def.health -= atkPower;
    attacker.health -= def.attack;
    if (def.health <= 0) killMinion(def, opponent, battle);
    if (attacker.health <= 0) killMinion(attacker, player, battle);
  } else if (target.hero) {
    pushLog(`${attacker.name} 攻击敌方英雄`, 'damage');
    dealDamageToHero(opponent, atkPower);
  }
  checkGameOver(battle);
  return { ok: true };
}

/**
 * 使用英雄技能
 */
export function useHeroSkill(battle) {
  if (battle.gameOver) return { error: 'gameover' };
  if (battle.active !== 'player') return { error: 'noturn' };
  const player = battle.player;
  if (player.skillUsed) return { error: 'used' };
  const info = getClassSkillInfo(player.classKey);
  if (!info) return { error: 'noskill' };
  if (player.mana < info.cost) return { error: 'mana' };
  player.mana -= info.cost;
  player.skillUsed = true;
  pushLog(`使用英雄技能：${info.name}`, 'spell');

  switch (player.classKey) {
    case 'paladin':
      // 召唤 1/1
      if (player.board.length < 7) {
        const tok = {
          instanceId: uid(), cardId: 'token', name: '白银之手新兵',
          attack: 1, health: 1, maxHealth: 1, canAttack: false, keywords: [], frozen: false,
        };
        player.board.push(tok);
        pushLog(`召唤了 白银之手新兵 (1/1)`, 'summon');
      }
      break;
    case 'warlock':
      dealDamageToHero(player, 2);
      drawCard(player, 1);
      break;
    case 'druid':
      player.hero.attackBuff = (player.hero.attackBuff || 0) + 1;
      pushLog(`英雄获得 +1 攻击力`, 'spell');
      break;
    case 'mage':
      // 火焰冲击：需要目标
      return { needTarget: true };
  }
  checkGameOver(battle);
  return { ok: true };
}

function getClassSkillInfo(classKey) {
  const map = {
    paladin: { name: '援军', cost: 2 },
    warlock: { name: '生命分流', cost: 2 },
    druid: { name: '变形', cost: 1 },
    mage: { name: '火焰冲击', cost: 2 },
  };
  return map[classKey];
}

/**
 * AI 决策回合
 */
export async function aiTurn(battle, onAction) {
  if (battle.gameOver) return;
  const ai = battle.ai;
  if (battle.active !== 'ai') return;

  // 简单 AI：
  // 1. 尽可能出最高费的牌（直到法力耗尽或战场满）
  // 2. 全部能攻击的随从攻击对方英雄（除非有嘲讽）
  await delay(700);
  onAction && onAction({ type: 'thinking' });

  // 出牌循环
  let safety = 30;
  while (safety-- > 0) {
    // 找到能打出的牌
    const playable = ai.hand
      .map((c) => ({ inst: c, card: CARDS[c.cardId] }))
      .filter((x) => x.card && ai.mana >= x.card.cost);
    if (playable.length === 0) break;
    // 优先出随从
    playable.sort((a, b) => {
      if (a.card.type !== b.card.type) return a.card.type === 'minion' ? -1 : 1;
      return b.card.cost - a.card.cost;
    });
    const pick = playable[0];
    if (pick.card.type === 'minion') {
      if (ai.board.length >= 7) break;
      ai.mana -= pick.card.cost;
      const idx = ai.hand.findIndex((c) => c.instanceId === pick.inst.instanceId);
      ai.hand.splice(idx, 1);
      ai.graveyard.push(pick.inst);
      const minion = {
        instanceId: pick.inst.instanceId,
        cardId: pick.card.id,
        name: pick.card.name,
        attack: pick.card.attack,
        health: pick.card.health,
        maxHealth: pick.card.health,
        canAttack: false,
        keywords: pick.card.keywords || [],
        frozen: false,
      };
      ai.board.push(minion);
      pushLog(`敌方召唤了 ${pick.card.name} (${pick.card.attack}/${pick.card.health})`, 'summon');
      onAction && onAction({ type: 'summon', who: 'ai' });
      await delay(500);
      if (pick.card.battlecry) {
        const ctx = makeContext(ai, battle);
        pick.card.battlecry(ctx);
        onAction && onAction({ type: 'summon', who: 'ai' });
        await delay(400);
      }
    } else {
      // 法术
      ai.mana -= pick.card.cost;
      const idx = ai.hand.findIndex((c) => c.instanceId === pick.inst.instanceId);
      ai.hand.splice(idx, 1);
      ai.graveyard.push(pick.inst);
      pushLog(`敌方施放：${pick.card.name}`, 'spell');
      const ctx = makeContext(ai, battle);
      if (pick.card.effect) pick.card.effect(ctx);
      onAction && onAction({ type: 'spell', who: 'ai' });
      await delay(500);
    }
    checkGameOver(battle);
    if (battle.gameOver) return;
  }

  // 攻击循环
  safety = 30;
  while (safety-- > 0) {
    const ready = ai.board.find((m) => m.canAttack && !m.frozen && m.attack > 0);
    if (!ready) break;
    // 优先攻击嘲讽随从
    const playerTaunts = battle.player.board.filter((m) => m.keywords && m.keywords.includes('taunt') && m.health > 0);
    let target;
    if (playerTaunts.length > 0) {
      // 选血最少嘲讽
      playerTaunts.sort((a, b) => a.health - b.health);
      target = { minion: playerTaunts[0] };
    } else if (battle.player.board.length > 0 && Math.random() < 0.5) {
      // 50% 概率攻击随从
      const candidates = [...battle.player.board].sort((a, b) => a.attack - b.attack);
      target = { minion: candidates[0] };
    } else {
      target = { hero: true };
    }

    // 执行攻击
    const atkPower = ready.attack + (ai.hero.attackBuff || 0);
    ready.canAttack = false;
    if (target.minion) {
      pushLog(`敌方 ${ready.name} 攻击 你的 ${target.minion.name}`, 'info');
      target.minion.health -= atkPower;
      ready.health -= target.minion.attack;
      if (target.minion.health <= 0) killMinion(target.minion, battle.player, battle);
      if (ready.health <= 0) killMinion(ready, ai, battle);
    } else {
      pushLog(`敌方 ${ready.name} 攻击 你的英雄`, 'damage');
      dealDamageToHero(battle.player, atkPower);
    }
    onAction && onAction({ type: 'attack', who: 'ai' });
    await delay(500);
    checkGameOver(battle);
    if (battle.gameOver) return;
  }

  // 可能使用技能
  const skill = getClassSkillInfo(ai.classKey);
  if (skill && ai.mana >= skill.cost && !ai.skillUsed && Math.random() < 0.5) {
    ai.mana -= skill.cost;
    ai.skillUsed = true;
    pushLog(`敌方使用了英雄技能：${skill.name}`, 'spell');
    switch (ai.classKey) {
      case 'paladin':
        if (ai.board.length < 7) {
          ai.board.push({
            instanceId: uid(), cardId: 'token', name: '白银之手新兵',
            attack: 1, health: 1, maxHealth: 1, canAttack: false, keywords: [], frozen: false,
          });
        }
        break;
      case 'warlock':
        dealDamageToHero(ai, 2);
        drawCard(ai, 1);
        break;
      case 'druid':
        ai.hero.attackBuff = (ai.hero.attackBuff || 0) + 1;
        break;
      case 'mage':
        // AI 法师：直接对玩家英雄造成 1 点伤害
        dealDamageToHero(battle.player, 1);
        break;
    }
    onAction && onAction({ type: 'skill', who: 'ai' });
    await delay(500);
    checkGameOver(battle);
  }

  // 结束回合
  await delay(400);
  endTurn(battle);
  onAction && onAction({ type: 'endturn' });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export { uid, dealDamageToHero, healHero, makeContext, getClassSkillInfo };
