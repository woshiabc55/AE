/**
 * 战斗 UI 控制器
 * 渲染战场、绑定交互
 */

import { store, pushLog, showToast } from '../game/state.js';
import { CARDS, CLASS_INFO } from '../cards/cards.js';
import { HERO_PORTRAITS, SKILL_ICONS } from '../heroes/heroes.js';
import { renderCardSVG, renderCardBackSVG } from '../cards/card-svg.js';
import { portraits } from '../cards/portraits.js';
import { createBattle, playCardFromHand, attack, useHeroSkill, endTurn, aiTurn, setBattleRef, makeContext, dealDamageToHero, drawCard, getClassSkillInfo } from '../game/battle.js';

let battle = null;
let stage = null;
let refreshScheduled = false;
let isAITurnRunning = false;

export function startBattle(playerClass, aiClass) {
  store.set({ screen: 'battle', logs: [], result: null });
  battle = createBattle(playerClass, aiClass);
  setBattleRef(battle);
  render(stage || document.getElementById('stage'));
  // 自动调度 AI（不开始，因为是 player 回合）
}

/**
 * 主渲染
 */
export function render(stageEl) {
  stage = stageEl;
  if (!stage) return;
  if (!battle) return;
  stage.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'battle-screen';
  screen.innerHTML = renderBattleHTML();
  stage.appendChild(screen);
  attachListeners(screen);
  // 渲染手牌（带入场动画延迟）
  renderHand(screen, battle.player.hand);
  // 渲染战场
  renderBoard(screen);
  // 渲染英雄区
  renderHeroZones(screen);
  // 渲染日志
  renderLog(screen);
  // 渲染中央信息
  renderBattleMid(screen);
  // AI 视觉
  renderAIBoard(screen);
}

function renderBattleHTML() {
  const playerClass = CLASS_INFO[battle.player.classKey];
  const aiClass = CLASS_INFO[battle.ai.classKey];
  return `
    <div class="board-bg">${renderBoardBackground()}</div>
    <div class="battle-top">
      ${renderOpponentHeroZone()}
      <div class="board-row" id="ai-board"></div>
    </div>
    <div class="battle-mid" id="battle-mid"></div>
    <div class="battle-bottom">
      <div class="board-row" id="player-board"></div>
      <div class="hand-area" id="hand-area"></div>
    </div>
    <div class="battle-log" id="battle-log"></div>
  `;
}

function renderBoardBackground() {
  return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="table-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#3a1f0a"/>
          <stop offset="50%" stop-color="#5a3a1a"/>
          <stop offset="100%" stop-color="#2a1808"/>
        </linearGradient>
        <pattern id="wood-pattern" patternUnits="userSpaceOnUse" width="200" height="40">
          <rect width="200" height="40" fill="url(#table-grad)"/>
          <path d="M0 0 L200 0 M0 20 L200 20 M0 40 L200 40" stroke="#1a0a04" stroke-width="0.5" opacity="0.4"/>
          <path d="M0 10 L200 10" stroke="#8a6d1f" stroke-width="0.3" opacity="0.2"/>
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="80%" stop-color="#000" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.8"/>
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#wood-pattern)"/>
      <rect width="1600" height="900" fill="url(#vignette)"/>
      <!-- 桌布装饰边 -->
      <rect x="0" y="0" width="1600" height="30" fill="#1a0a04" opacity="0.6"/>
      <rect x="0" y="870" width="1600" height="30" fill="#1a0a04" opacity="0.6"/>
      <g stroke="#d4af37" stroke-width="1" fill="none" opacity="0.4">
        <line x1="0" y1="30" x2="1600" y2="30"/>
        <line x1="0" y1="870" x2="1600" y2="870"/>
      </g>
      <!-- 中心法阵 -->
      <g transform="translate(800, 450)" opacity="0.18" stroke="#d4af37" fill="none" stroke-width="0.6">
        <circle r="120"/>
        <circle r="90"/>
        <circle r="60"/>
        <path d="M0 -120 L8 -100 L-8 -100 Z" fill="#d4af37"/>
        <path d="M0 120 L8 100 L-8 100 Z" fill="#d4af37"/>
        <path d="M-120 0 L-100 8 L-100 -8 Z" fill="#d4af37"/>
        <path d="M120 0 L100 8 L100 -8 Z" fill="#d4af37"/>
        <path d="M-85 -85 L-72 -78 M-78 -72 L-72 -78" stroke-width="1.5"/>
        <path d="M85 -85 L72 -78 M78 -72 L72 -78" stroke-width="1.5"/>
        <path d="M-85 85 L-72 78 M-78 72 L-72 78" stroke-width="1.5"/>
        <path d="M85 85 L72 78 M78 72 L72 78" stroke-width="1.5"/>
      </g>
    </svg>
  `;
}

function renderOpponentHeroZone() {
  const aiClass = CLASS_INFO[battle.ai.classKey];
  return `
    <div class="hero-zone opponent" id="opponent-hero-zone">
      <div class="hero-info" style="align-items: flex-end;">
        <div class="hero-name">${battle.ai.heroName}</div>
        <div class="hero-stats">
          <div class="mana-bar">
            <div class="mana-text">${battle.ai.mana}/${battle.ai.maxMana}</div>
            ${Array.from({ length: battle.ai.maxMana }).map((_, i) => `
              <svg class="mana-crystal ${i < battle.ai.mana ? '' : 'empty'}" viewBox="0 0 20 24">
                <polygon points="10,1 19,7 19,17 10,23 1,17 1,7" fill="#3a8acc" stroke="#bce8ff" stroke-width="1"/>
                <polygon points="10,4 16,8 16,16 10,20 4,16 4,8" fill="#5fd1ff"/>
              </svg>
            `).join('')}
          </div>
          <div class="health-bar" id="ai-health">
            <span class="hp-text">${battle.ai.hero.hp}</span>
            <svg class="hp-icon" viewBox="0 0 24 24"><path d="M12 21 L4 13 Q0 9 4 5 Q8 1 12 5 Q16 1 20 5 Q24 9 20 13 Z" fill="#ff4040" stroke="#fff" stroke-width="0.8"/></svg>
          </div>
        </div>
      </div>
      <div class="hero-portrait" data-target="ai-hero" id="opponent-hero-portrait">
        ${HERO_PORTRAITS[aiClass.id]()}
      </div>
      <div class="deck-pile" title="对手牌库">
        ${renderCardBackSVG({ width: 70, height: 100 })}
        <div class="count">剩 ${battle.ai.deck.length}</div>
      </div>
    </div>
  `;
}

function renderHeroZones() {
  // 已在 renderOpponentHeroZone 中渲染
  // 玩家英雄区在 bottom 区域
  const screen = stage.querySelector('.battle-screen');
  if (!screen) return;
  const playerClass = CLASS_INFO[battle.player.classKey];
  const playerHeroZone = document.createElement('div');
  playerHeroZone.className = 'hero-zone player';
  playerHeroZone.innerHTML = `
    <div class="deck-pile" title="你的牌库">
      ${renderCardBackSVG({ width: 70, height: 100 })}
      <div class="count">剩 ${battle.player.deck.length}</div>
    </div>
    <div class="hero-portrait" id="player-hero-portrait">
      ${HERO_PORTRAITS[playerClass.id]()}
    </div>
    <div class="hero-info">
      <div class="hero-name">${battle.player.heroName}</div>
      <div class="hero-stats">
        <div class="health-bar" id="player-health">
          <span class="hp-text">${battle.player.hero.hp}</span>
          <svg class="hp-icon" viewBox="0 0 24 24"><path d="M12 21 L4 13 Q0 9 4 5 Q8 1 12 5 Q16 1 20 5 Q24 9 20 13 Z" fill="#ff4040" stroke="#fff" stroke-width="0.8"/></svg>
        </div>
        <div class="mana-bar">
          ${Array.from({ length: battle.player.maxMana }).map((_, i) => `
            <svg class="mana-crystal ${i < battle.player.mana ? '' : 'empty'}" viewBox="0 0 20 24">
              <polygon points="10,1 19,7 19,17 10,23 1,17 1,7" fill="#3a8acc" stroke="#bce8ff" stroke-width="1"/>
              <polygon points="10,4 16,8 16,16 10,20 4,16 4,8" fill="#5fd1ff"/>
            </svg>
          `).join('')}
          <div class="mana-text">${battle.player.mana}/${battle.player.maxMana}</div>
        </div>
        <button class="skill-btn" id="skill-btn" data-skill="${playerClass.skillName}">
          <div class="skill-icon">${SKILL_ICONS[playerClass.skillIcon](playerClass.accent)}</div>
          <span>${playerClass.skillName}</span>
          <div class="skill-cost">${playerClass.skillCost}</div>
        </button>
      </div>
    </div>
  `;
  // 插入到 .battle-bottom 顶部，board-row 之前
  const bottom = screen.querySelector('.battle-bottom');
  bottom.insertBefore(playerHeroZone, bottom.firstChild);
  // 绑定技能
  playerHeroZone.querySelector('#skill-btn').addEventListener('click', () => onSkillClick());
}

function renderHand(screen, hand) {
  const handArea = screen.querySelector('#hand-area');
  if (!handArea) return;
  handArea.innerHTML = '';
  hand.forEach((inst, i) => {
    const card = CARDS[inst.cardId];
    if (!card) return;
    const wrap = document.createElement('div');
    wrap.className = 'hand-card-wrap card-enter';
    wrap.dataset.instanceId = inst.instanceId;
    wrap.style.zIndex = String(10 + i);
    wrap.style.animationDelay = `${i * 80}ms`;

    const affordable = battle.player.mana >= card.cost;
    if (affordable) wrap.classList.add('affordable');
    else wrap.classList.add('unaffordable');

    wrap.innerHTML = `<div class="card-base">${renderCardSVG(card)}</div>`;
    wrap.addEventListener('click', () => onHandCardClick(inst.instanceId, wrap));
    handArea.appendChild(wrap);
  });
}

function renderBoard(screen) {
  // 玩家战场
  const playerBoard = screen.querySelector('#player-board');
  if (playerBoard) {
    playerBoard.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const slot = document.createElement('div');
      slot.className = 'minion-slot';
      slot.dataset.slot = i;
      playerBoard.appendChild(slot);
    }
    battle.player.board.forEach((m) => {
      const slot = playerBoard.children[m.slotIndex ?? 0];
      // 找到第一个空 slot
      let targetSlot = null;
      for (let s of playerBoard.children) {
        if (s.children.length === 0) { targetSlot = s; break; }
      }
      if (!targetSlot) return;
      const el = renderMinionEl(m, 'player');
      targetSlot.appendChild(el);
    });
  }
}

function renderAIBoard(screen) {
  const aiBoard = screen.querySelector('#ai-board');
  if (!aiBoard) return;
  aiBoard.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const slot = document.createElement('div');
    slot.className = 'minion-slot';
    slot.dataset.slot = i;
    aiBoard.appendChild(slot);
  }
  battle.ai.board.forEach((m, idx) => {
    // 放到中间
    const offset = Math.floor((7 - battle.ai.board.length) / 2);
    const slot = aiBoard.children[offset + idx];
    if (slot) {
      slot.appendChild(renderMinionEl(m, 'ai'));
    }
  });
}

function renderMinionEl(minion, side) {
  const card = CARDS[minion.cardId] || { name: minion.name, portrait: 'default', cost: 0 };
  const wrap = document.createElement('div');
  wrap.className = 'minion-wrap';
  wrap.dataset.instanceId = minion.instanceId;
  wrap.style.cssText = 'position: relative; width: 100px; height: 140px; cursor: pointer;';
  wrap.innerHTML = `
    <div class="card-base" style="border-radius: 6px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
      <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" width="100" height="140">
        <defs>
          <linearGradient id="mf-${minion.instanceId}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#1a2a5a"/>
            <stop offset="100%" stop-color="#0a1a3a"/>
          </linearGradient>
          <radialGradient id="mp-${minion.instanceId}" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#5a4a8a"/>
            <stop offset="100%" stop-color="#0a0420"/>
          </radialGradient>
        </defs>
        <rect x="1" y="1" width="98" height="138" rx="4" fill="#d4af37"/>
        <rect x="3" y="3" width="94" height="134" rx="3" fill="url(#mf-${minion.instanceId})"/>
        <rect x="6" y="6" width="88" height="92" rx="2" fill="url(#mp-${minion.instanceId})"/>
        <svg x="6" y="6" width="88" height="92" viewBox="0 0 100 100">${(portraits_inline(minion.cardId))}</svg>
        <!-- 名字 -->
        <rect x="6" y="100" width="88" height="14" fill="#0a0420" stroke="#d4af37" stroke-width="0.3"/>
        <text x="50" y="110" text-anchor="middle" font-family="Cinzel, serif" font-size="8" font-weight="600" fill="#ffd76b">${minion.name}</text>
        <!-- 攻水晶 -->
        <g transform="translate(2, 114)">
          <polygon points="14,0 28,6 28,18 14,24 0,18 0,6" fill="#3a0a0a" stroke="#ffaa30" stroke-width="1.5"/>
          <polygon points="14,3 24,7 24,17 14,21 4,17 4,7" fill="#d4af37"/>
          <text x="14" y="17" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="800" fill="#fff" stroke="#1a0a0a" stroke-width="0.3">${minion.attack}</text>
        </g>
        <!-- 血水晶 -->
        <g transform="translate(70, 114)">
          <polygon points="14,0 28,6 28,18 14,24 0,18 0,6" fill="#0a3a0a" stroke="#a0ff60" stroke-width="1.5"/>
          <polygon points="14,3 24,7 24,17 14,21 4,17 4,7" fill="#3a8a3a"/>
          <text x="14" y="17" text-anchor="middle" font-family="Cinzel, serif" font-size="12" font-weight="800" fill="#fff" stroke="#0a1a0a" stroke-width="0.3">${minion.health}</text>
        </g>
        ${minion.keywords && minion.keywords.includes('taunt') ? `
          <g transform="translate(36, 60)">
            <path d="M0 -8 L-10 -2 L-10 6 L0 10 L10 6 L10 -2 Z" fill="#8a6d1f" stroke="#ffd76b" stroke-width="1"/>
            <path d="M-4 -1 L-1 2 L4 -3" stroke="#ffd76b" stroke-width="1.2" fill="none"/>
          </g>
        ` : ''}
        ${minion.keywords && minion.keywords.includes('divine_shield') ? `
          <g transform="translate(50, 40)">
            <circle r="7" fill="none" stroke="#ffd76b" stroke-width="1.5"/>
            <circle r="3" fill="#ffd76b" opacity="0.5"/>
          </g>
        ` : ''}
        ${minion.frozen ? `
          <g transform="translate(50, 50)">
            <circle r="16" fill="#5fd1ff" opacity="0.4"/>
            <g stroke="#fff" stroke-width="1" fill="none">
              <line x1="0" y1="-12" x2="0" y2="12"/>
              <line x1="-12" y1="0" x2="12" y2="0"/>
              <line x1="-8" y1="-8" x2="8" y2="8"/>
              <line x1="8" y1="-8" x2="-8" y2="8"/>
            </g>
          </g>
        ` : ''}
        ${side === 'player' && minion.canAttack ? `
          <g transform="translate(50, 0)">
            <polygon points="0,0 -8,-8 8,-8" fill="#80ff80" opacity="0.8"/>
            <polygon points="0,4 -4,0 4,0" fill="#80ff80" opacity="0.8"/>
          </g>
        ` : ''}
        ${!minion.canAttack && side === 'player' ? `
          <rect x="6" y="6" width="88" height="92" fill="#000" opacity="0.4"/>
        ` : ''}
      </svg>
    </div>
  `;
  if (side === 'player') {
    wrap.addEventListener('click', () => onMinionClick(minion.instanceId));
  } else {
    wrap.addEventListener('click', () => onEnemyMinionClick(minion.instanceId));
  }
  return wrap;
}

// 简化版肖像（无需全功能）
function portraits_inline(cardId) {
  const card = CARDS[cardId];
  if (!card) return '';
  const fn = portraits[card.portrait] || portraits.default;
  // 仅返回 svg 内部
  return fn().replace(/<svg[^>]*>|<\/svg>/g, '');
}

function renderLog(screen) {
  const logEl = screen.querySelector('#battle-log');
  if (!logEl) return;
  const logs = store.get().logs || [];
  logEl.innerHTML = `
    <div class="log-title">— 战斗记录 —</div>
    ${logs.slice(-12).map((l) => `<div class="log-entry ${l.type}">${l.text}</div>`).join('')}
  `;
  logEl.scrollTop = logEl.scrollHeight;
}

function renderBattleMid(screen) {
  const mid = screen.querySelector('#battle-mid');
  if (!mid) return;
  const isPlayerTurn = battle.active === 'player';
  mid.innerHTML = `
    <div class="turn-info">
      <div class="turn-text">${isPlayerTurn ? '你的回合' : '对手回合'}</div>
      <button class="turn-btn" id="end-turn-btn" ${isPlayerTurn && !battle.gameOver ? '' : 'disabled'}>结束回合</button>
    </div>
  `;
  const btn = mid.querySelector('#end-turn-btn');
  btn.addEventListener('click', () => onEndTurnClick());
}

/**
 * 绑定监听
 */
function attachListeners(screen) {
  // 全屏点击
  const portrait = screen.querySelector('#opponent-hero-portrait');
  if (portrait) {
    portrait.addEventListener('click', () => onEnemyHeroClick());
  }
}

/**
 * 手牌点击
 */
function onHandCardClick(instanceId, wrap) {
  if (battle.gameOver) return;
  if (battle.active !== 'player') return;
  if (isAITurnRunning) return;
  const idx = battle.player.hand.findIndex((c) => c.instanceId === instanceId);
  if (idx < 0) return;
  const inst = battle.player.hand[idx];
  const card = CARDS[inst.cardId];
  if (!card) return;
  if (battle.player.mana < card.cost) {
    showToast('法力不足');
    return;
  }

  // 取消之前的选中
  const handArea = stage.querySelector('#hand-area');
  handArea.querySelectorAll('.hand-card-wrap').forEach((w) => w.classList.remove('selected'));

  // 随从：尝试直接上场（7 格子满则报错）
  if (card.type === 'minion') {
    if (battle.player.board.length >= 7) {
      showToast('战场已满 (7)');
      return;
    }
    const result = playCardFromHand(battle, instanceId);
    if (result && result.ok) refreshAfter();
    return;
  }

  // 法术：先尝试直接打，看是否需要选目标
  const result = playCardFromHand(battle, instanceId);
  if (!result) return;
  if (result.error === 'mana') {
    showToast('法力不足');
    return;
  }
  if (result.needTarget) {
    battle.targeting = { kind: 'spell', card, instance: inst };
    wrap.classList.add('selected');
    highlightTargets(card);
    return;
  }
  if (result.ok) refreshAfter();
}

/**
 * 敌方随从点击（作为攻击目标）
 */
function onEnemyMinionClick(instanceId) {
  if (battle.gameOver || isAITurnRunning) return;
  if (battle.active !== 'player') return;
  if (battle.targeting && battle.targeting.kind === 'spell') {
    // 法术目标
    const target = battle.ai.board.find((m) => m.instanceId === instanceId);
    if (!target) return;
    const result = playCardFromHand(battle, battle.targeting.instance.instanceId, target);
    if (result && result.ok) {
      battle.targeting = null;
      refreshAfter();
    }
    return;
  }
  // 攻击敌方随从
  const attacker = battle.player.board.find((m) => m.canAttack && !m.frozen);
  if (!attacker) {
    showToast('没有可攻击的随从');
    return;
  }
  const target = battle.ai.board.find((m) => m.instanceId === instanceId);
  if (!target) return;
  const r = attack(battle, attacker.instanceId, { minion: target });
  if (r.error) {
    if (r.error === 'taunt') showToast('必须先攻击嘲讽随从');
    else if (r.error === 'sleepy') showToast('该随从本回合不能攻击');
    else if (r.error === 'frozen') showToast('该随从被冻结');
    return;
  }
  flashAttack(attacker.instanceId);
  refreshAfter();
}

function onEnemyHeroClick() {
  if (battle.gameOver || isAITurnRunning) return;
  if (battle.active !== 'player') return;
  if (battle.targeting && battle.targeting.kind === 'spell') {
    const result = playCardFromHand(battle, battle.targeting.instance.instanceId, { hero: true });
    if (result && result.ok) {
      battle.targeting = null;
      refreshAfter();
    }
    return;
  }
  // 攻击敌方英雄
  const attacker = battle.player.board.find((m) => m.canAttack && !m.frozen);
  if (!attacker) {
    showToast('没有可攻击的随从');
    return;
  }
  const r = attack(battle, attacker.instanceId, { hero: true });
  if (r.error) {
    if (r.error === 'taunt') showToast('必须先攻击嘲讽随从');
    return;
  }
  flashAttack(attacker.instanceId);
  refreshAfter();
}

function onMinionClick(instanceId) {
  if (battle.gameOver || isAITurnRunning) return;
  if (battle.active !== 'player') return;
  // 暂无随从指向性技能
}

function onSkillClick() {
  if (battle.gameOver || isAITurnRunning) return;
  if (battle.active !== 'player') return;
  const r = useHeroSkill(battle);
  if (r.error) {
    if (r.error === 'mana') showToast('法力不足');
    else if (r.error === 'used') showToast('本回合已使用技能');
    return;
  }
  if (r.needTarget) {
    battle.targeting = { kind: 'skill' };
    highlightSkillTargets();
    return;
  }
  refreshAfter();
}

function onEndTurnClick() {
  if (battle.gameOver || isAITurnRunning) return;
  endTurn(battle);
  refreshAfter();
  if (battle.active === 'ai' && !battle.gameOver) {
    isAITurnRunning = true;
    setTimeout(async () => {
      await aiTurn(battle, () => scheduleRefresh());
      isAITurnRunning = false;
      scheduleRefresh();
      if (battle.gameOver) {
        showGameOverModal();
      }
    }, 600);
  }
}

function highlightTargets(card) {
  clearTargetHighlight();
  // 高亮敌方英雄
  const ph = stage.querySelector('#opponent-hero-portrait');
  if (ph) ph.classList.add('targetable');
  // 高亮敌方随从
  if (card.text.includes('对一个') || card.text.includes('对敌方英雄') || card.text.includes('对所有')) {
    // 高亮敌方随从
    const board = stage.querySelector('#ai-board');
    if (board) {
      board.querySelectorAll('.minion-wrap').forEach((w) => {
        w.classList.add('targeting-highlight');
      });
    }
  }
}

function highlightSkillTargets() {
  clearTargetHighlight();
  const ph = stage.querySelector('#opponent-hero-portrait');
  if (ph) ph.classList.add('targetable');
  const board = stage.querySelector('#ai-board');
  if (board) {
    board.querySelectorAll('.minion-wrap').forEach((w) => {
      w.classList.add('targeting-highlight');
    });
  }
}

function clearTargetHighlight() {
  if (!stage) return;
  stage.querySelectorAll('.targetable').forEach((e) => e.classList.remove('targetable'));
  stage.querySelectorAll('.targeting-highlight').forEach((e) => e.classList.remove('targeting-highlight'));
}

function flashAttack(instanceId) {
  if (!stage) return;
  const el = stage.querySelector(`.minion-wrap[data-instance-id="${instanceId}"]`);
  if (el) {
    el.classList.add('attack-flash');
    setTimeout(() => el.classList.remove('attack-flash'), 500);
  }
}

function refreshAfter() {
  scheduleRefresh();
  if (battle.gameOver) {
    setTimeout(showGameOverModal, 800);
  }
}

function scheduleRefresh() {
  if (refreshScheduled) return;
  refreshScheduled = true;
  requestAnimationFrame(() => {
    refreshScheduled = false;
    render(stage);
    if (isAITurnRunning) {
      // 重新高亮不可点击
      stage.querySelectorAll('.hand-card-wrap, .turn-btn, .skill-btn').forEach((el) => {
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.5';
      });
    }
  });
}

function showGameOverModal() {
  const isVictory = battle.winner === 'player';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box ${isVictory ? 'victory' : 'defeat'}">
      <h2>${isVictory ? '胜  利' : '失  败'}</h2>
      <p>${isVictory ? '你的英雄荣光加冕，黑暗在你的剑下退散。' : '你的英雄倒下了，阴影吞噬了最后的光芒……'}</p>
      <div style="display:flex; gap:16px; justify-content:center;">
        <button class="btn" id="btn-back">返回主菜单</button>
        <button class="btn btn-primary" id="btn-again">再战一场</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#btn-back').addEventListener('click', () => {
    overlay.remove();
    backToMenu();
  });
  overlay.querySelector('#btn-again').addEventListener('click', () => {
    overlay.remove();
    const newAi = ['paladin', 'warlock', 'druid', 'mage'].filter((c) => c !== battle.player.classKey);
    const aiClass = newAi[Math.floor(Math.random() * newAi.length)];
    startBattle(battle.player.classKey, aiClass);
  });
}

function backToMenu() {
  import('./menu.js').then(({ renderMenu }) => {
    renderMenu(stage);
  });
  store.set({ screen: 'menu' });
}
