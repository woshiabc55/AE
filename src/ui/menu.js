/**
 * 主菜单 - 职业选择
 */
import { store } from '../game/state.js';
import { CLASS_INFO } from '../cards/cards.js';
import { CLASS_PORTRAITS } from '../heroes/heroes.js';
import { startBattle } from './battle-ui.js';

const CLASS_ORDER = ['paladin', 'warlock', 'druid', 'mage'];

export function renderMenu(stage) {
  stage.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'menu-screen';
  screen.innerHTML = `
    <div class="menu-title">
      <h1>暗影编年史</h1>
      <div class="subtitle">Shadow Chronicle</div>
    </div>
    <div class="menu-divider"></div>
    <div class="class-pick" id="class-pick"></div>
    <div class="menu-actions">
      <button class="btn" id="btn-help">玩法</button>
      <button class="btn btn-primary" id="btn-start" disabled>开始对决</button>
    </div>
    <div class="menu-footer" style="margin-top:32px; font-family: var(--font-body); font-style: italic; color: var(--color-parchment-dim); letter-spacing: 0.2em; font-size: 13px;">
      选择你的职业 · 命运之轮已经转动
    </div>
  `;
  stage.appendChild(screen);

  const pickContainer = screen.querySelector('#class-pick');
  let selected = null;
  CLASS_ORDER.forEach((id) => {
    const info = CLASS_INFO[id];
    const card = document.createElement('div');
    card.className = 'class-card';
    card.dataset.classId = id;
    card.innerHTML = `
      <div class="class-glow" style="background: radial-gradient(circle, ${info.accent} 0%, transparent 70%);"></div>
      <div class="class-svg">${CLASS_PORTRAITS[id]()}</div>
      <div class="class-label">${info.label}</div>
      <div class="class-name">${info.name}</div>
    `;
    card.addEventListener('click', () => {
      pickContainer.querySelectorAll('.class-card').forEach((c) => c.classList.remove('selected-pick'));
      card.classList.add('selected-pick');
      selected = id;
      screen.querySelector('#btn-start').disabled = false;
      screen.querySelector('#btn-start').textContent = `以 ${info.name} 参战`;
    });
    pickContainer.appendChild(card);
  });

  screen.querySelector('#btn-start').addEventListener('click', () => {
    if (!selected) return;
    // 随机 AI 职业
    const aiPool = CLASS_ORDER.filter((c) => c !== selected);
    const aiClass = aiPool[Math.floor(Math.random() * aiPool.length)];
    startBattle(selected, aiClass);
  });

  screen.querySelector('#btn-help').addEventListener('click', () => {
    showHelp();
  });
}

function showHelp() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width: 700px; text-align: left; padding: 36px 48px;">
      <h2 style="font-size: 36px; text-align: center; margin-bottom: 18px;">玩法指南</h2>
      <div style="font-family: var(--font-body); color: var(--color-parchment); line-height: 1.8; font-size: 16px;">
        <p style="margin-bottom: 14px;"><b style="color: var(--color-gold-bright);">目标</b>　率先将敌方英雄的生命值降至 0。</p>
        <p style="margin-bottom: 14px;"><b style="color: var(--color-gold-bright);">资源</b>　每回合法力水晶 +1（上限 10），使用卡牌与技能需消耗法力。</p>
        <p style="margin-bottom: 14px;"><b style="color: var(--color-gold-bright);">卡牌</b>　<b style="color: #5fd1ff;">随从</b>召唤上场攻击对方，<b style="color: #ff8a8a;">法术</b>立即生效。</p>
        <p style="margin-bottom: 14px;"><b style="color: var(--color-gold-bright);">攻击</b>　点击己方随从 → 红色目标高亮敌方角色 → 完成攻击。</p>
        <p style="margin-bottom: 14px;"><b style="color: var(--color-gold-bright);">关键词</b>　<b style="color: #d4af37;">嘲讽</b>：必须先击杀；<b style="color: #ffd76b;">圣盾</b>：免疫一次伤害。</p>
        <p><b style="color: var(--color-gold-bright);">技能</b>　每位英雄每回合可使用一次专属技能。</p>
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <button class="btn btn-primary" id="btn-close-help">了然于胸</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#btn-close-help').addEventListener('click', () => overlay.remove());
}
