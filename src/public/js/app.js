// RHODES 终端 — 客户端控制器
// 维护: 选中集 selectedIds / 过滤 / 搜索 / 时钟同步
// 调用 API: batchAction / applyToAll / removePack

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---- 客户端 store ----
const store = {
  groupId: window.__GROUP_ID__,
  isObserver: window.__IS_OBSERVER__ === true,
  selectedIds: new Set(),
  packs: window.__PACKS__ || [],
  filter: 'ALL',
  keyword: '',
  clockTimer: null,
};

// 暴露给其它模块
window.RHODES = { store, $, $$ };

// ---- 时钟 ----
function tickClock() {
  const d = new Date();
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  const el = document.getElementById('utc-clock');
  if (el) el.textContent = `${h}:${m}:${s} UTC`;
}
function tickSync() {
  const elNum = document.getElementById('sync-value');
  const elBar = document.getElementById('sync-bar');
  if (!elNum || !elBar) return;
  const cur = parseFloat(elBar.style.width) || 0;
  const drift = (Math.random() - 0.5) * 0.4;
  const next = Math.max(70, Math.min(100, cur + drift));
  elBar.style.width = next.toFixed(1) + '%';
  elNum.textContent = next.toFixed(1) + '%';
}

// ---- Toast ----
export function toast(message, level = 'OK') {
  const host = document.getElementById('toast-host');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast is-${level.toLowerCase()}`;
  el.innerHTML = `
    <span class="toast__dot"></span>
    <span class="toast__msg"></span>
    <button type="button" class="toast__close">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="3" y1="3" x2="13" y2="13" /><line x1="13" y1="3" x2="3" y2="13" />
      </svg>
    </button>
  `;
  el.querySelector('.toast__msg').textContent = message;
  el.querySelector('.toast__close').onclick = () => el.remove();
  host.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}
window.toast = toast;

// ---- API ----
async function api(path, opts = {}) {
  const r = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.ok === false) {
    throw new Error(data.error || `HTTP ${r.status}`);
  }
  return data.data;
}

// HTML 转义（避免 description / message / code 中含特殊字符破坏模板）
function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// HEX -> RGBA
function hexToRgba(hex, alpha = 1) {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---- 渲染：选择状态 ----
function renderSelection() {
  // 卡片
  $$('.card').forEach((c) => {
    const id = c.dataset.packId;
    c.classList.toggle('is-selected', store.selectedIds.has(id));
  });
  // 顶部统计
  const sel = store.selectedIds.size;
  const sd = document.getElementById('selected-display');
  if (sd) sd.textContent = String(sel).padStart(2, '0');
  const sc = document.getElementById('selected-count');
  if (sc) sc.textContent = String(sel);
  // console stats
  const selectedPacks = store.packs.filter((p) => store.selectedIds.has(p.id));
  const avg = selectedPacks.length ? Math.round(selectedPacks.reduce((a, p) => a + p.level, 0) / selectedPacks.length) : 0;
  const t6 = selectedPacks.filter((p) => p.rarity === 'T6').length;
  const locked = selectedPacks.filter((p) => p.locked).length;
  const cost = selectedPacks.reduce((a, p) => a + p.cost, 0);
  $('#stat-avg').textContent = sel ? String(avg).padStart(2, '0') : '--';
  $('#stat-t6').textContent = sel ? String(t6).padStart(2, '0') : '--';
  $('#stat-lock').textContent = sel ? String(locked).padStart(2, '0') : '--';
  $('#total-cost').textContent = cost.toLocaleString();
  const costBar = $('#cost-bar');
  costBar.style.width = Math.min(100, (cost / 8000) * 100) + '%';
  const warn = cost > 5000;
  $('#total-cost').classList.toggle('is-warn', warn);
  costBar.classList.toggle('is-warn', warn);
  $('#cost-warn').classList.toggle('is-on', warn);
  // log armed
  $('#log-armed').textContent = sel ? `> armed: ${sel} targets` : '> idle';
  // 全选按钮
  const allBtn = $('#btn-select-all');
  const visible = filteredPacks();
  const allSel = visible.length > 0 && visible.every((p) => store.selectedIds.has(p.id));
  $('#select-all-label').textContent = allSel ? 'CLEAR' : 'SELECT ALL';
}

// ---- 过滤 ----
function filteredPacks() {
  return store.packs.filter((p) => {
    if (store.filter !== 'ALL' && p.rarity !== store.filter) return false;
    if (!store.keyword) return true;
    const k = store.keyword.toLowerCase();
    return p.code.toLowerCase().includes(k)
      || p.name.toLowerCase().includes(k)
      || p.id.toLowerCase().includes(k)
      || p.tags.some((t) => t.toLowerCase().includes(k));
  });
}
function applyFilter() {
  const visible = filteredPacks();
  const visibleIds = new Set(visible.map((p) => p.id));
  $$('.card').forEach((c) => {
    c.style.display = visibleIds.has(c.dataset.packId) ? '' : 'none';
  });
  $('#visible-count').textContent = visible.length;
}

// ---- 矩阵交互：框选 + 点击 ----
function setupMatrix() {
  const scroll = $('#matrix-scroll');
  const marquee = $('#marquee');
  let dragging = false;
  let start = null;
  scroll.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.card')) return;
    dragging = true;
    start = { x: e.clientX, y: e.clientY };
    marquee.classList.add('is-on');
    Object.assign(marquee.style, {
      left: e.clientX + 'px', top: e.clientY + 'px',
      width: '0px', height: '0px',
    });
  });
  scroll.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const x = Math.min(start.x, e.clientX);
    const y = Math.min(start.y, e.clientY);
    const w = Math.abs(e.clientX - start.x);
    const h = Math.abs(e.clientY - start.y);
    Object.assign(marquee.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  });
  scroll.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove('is-on');
    const x = Math.min(start.x, e.clientX);
    const y = Math.min(start.y, e.clientY);
    const w = Math.abs(e.clientX - start.x);
    const h = Math.abs(e.clientY - start.y);
    if (w < 4 && h < 4) {
      // 单击空白清空
      store.selectedIds.clear();
      renderSelection();
      return;
    }
    // 命中检测
    $$('.card').forEach((c) => {
      if (c.style.display === 'none') return;
      const r = c.getBoundingClientRect();
      const hit = !(r.right < x || r.left > x + w || r.bottom < y || r.top > y + h);
      if (hit) store.selectedIds.add(c.dataset.packId);
    });
    renderSelection();
  });
  scroll.addEventListener('mouseleave', () => { dragging = false; marquee.classList.remove('is-on'); });

  // 卡片点击
  scroll.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      toggleSelect(card.dataset.packId);
    } else {
      // 单击：选中并打开详情
      store.selectedIds.clear();
      store.selectedIds.add(card.dataset.packId);
      renderSelection();
      openInspector(card.dataset.packId);
    }
  });
}
function toggleSelect(id) {
  if (store.selectedIds.has(id)) store.selectedIds.delete(id);
  else store.selectedIds.add(id);
  renderSelection();
}

// ---- 过滤 / 搜索 ----
function setupFilters() {
  $$('#rarity-filter .matrix__filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#rarity-filter .matrix__filter').forEach((b) => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      store.filter = btn.dataset.rarity;
      applyFilter();
    });
  });
  const search = $('#search-input');
  let timer;
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      store.keyword = search.value;
      applyFilter();
    }, 120);
  });
}

// ---- 全选 / 反选 / 导出 ----
function setupActions() {
  $('#btn-select-all').addEventListener('click', () => {
    const visible = filteredPacks();
    const allSel = visible.length > 0 && visible.every((p) => store.selectedIds.has(p.id));
    if (allSel) {
      store.selectedIds.clear();
    } else {
      visible.forEach((p) => store.selectedIds.add(p.id));
    }
    renderSelection();
  });
  $('#btn-invert').addEventListener('click', () => {
    const visible = filteredPacks();
    const next = new Set();
    visible.forEach((p) => { if (!store.selectedIds.has(p.id)) next.add(p.id); });
    store.selectedIds = next;
    renderSelection();
  });
  $('#btn-export').addEventListener('click', () => {
    if (store.selectedIds.size === 0) {
      toast('未选中任何目标', 'WARN');
      return;
    }
    const payload = {
      group: store.groupId,
      ts: Date.now(),
      selectedIds: Array.from(store.selectedIds),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-ops-${store.groupId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`已导出配置 (${store.selectedIds.size} 项)`, 'OK');
  });
}

// ---- 操作台按钮 ----
function setupConsole() {
  $$('.action-btn[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (store.selectedIds.size === 0) {
        toast('未选中任何目标', 'WARN');
        return;
      }
      const action = btn.dataset.action;
      try {
        const result = await api(`/api/groups/${store.groupId}/batch`, {
          method: 'POST',
          body: { action, packIds: Array.from(store.selectedIds) },
        });
        const labelMap = { upgrade: '批量升级', equip: '批量装配', unlock: '解除锁定', lock: '批量锁定' };
        const levelMap = { upgrade: 'OK', equip: 'OK', unlock: 'WARN', lock: 'CRIT' };
        toast(`${labelMap[action]} ${result.changed} 个目标`, levelMap[action] || 'OK');
        // 重拉当前组数据
        await refreshGroup();
      } catch (e) {
        toast(`操作失败：${e.message}`, 'CRIT');
      }
    });
  });
}

// ---- 详情浮层 ----
async function openInspector(packId) {
  const pack = store.packs.find((p) => p.id === packId);
  if (!pack) return;
  const ins = $('#inspector');
  $('#insp-code').textContent = pack.code;
  const body = $('#insp-body');
  body.innerHTML = `
    <div class="inspector__lv">
      <div class="inspector__lv-sub">CURRENT LEVEL</div>
      <div style="display:flex;align-items:baseline;gap:8px;">
        <span class="inspector__lv-num">${String(pack.level).padStart(2, '0')}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--line-strong)">/ 90</span>
      </div>
      <div class="inspector__lv-bar"><div class="inspector__lv-bar-fill" style="width: ${(pack.level/90*100).toFixed(0)}%"></div></div>
      <div class="inspector__lv-meta">
        <span style="color:var(--line-strong)">RARITY</span>
        <span class="rarity-${escHtml(pack.rarity.toLowerCase())}" style="font-weight:700;color:var(--rarity-${escHtml(pack.rarity.toLowerCase())})">${escHtml(pack.rarity)}</span>
        <span style="color:var(--line-strong)">COST</span>
        <span style="color:var(--cyan)">${pack.cost}</span>
      </div>
    </div>
    <div>
      <div class="inspector__section-title">// TAGS</div>
      <div class="inspector__tags">
        ${pack.tags.map((t) => `<span class="inspector__tag">${escHtml(t)}</span>`).join('')}
      </div>
    </div>
    <div>
      <div class="inspector__section-title">// DESCRIPTION</div>
      <div class="inspector__desc">${escHtml(pack.description)}</div>
    </div>
    <div class="inspector__stats">
      <div class="inspector__stat ${pack.equipped ? 'is-on' : ''}">
        <div class="inspector__stat-label">EQUIPPED</div>
        <div class="inspector__stat-val">${pack.equipped ? 'YES' : 'NO'}</div>
      </div>
      <div class="inspector__stat ${pack.locked ? 'is-danger' : 'is-ok'}">
        <div class="inspector__stat-label">LOCKED</div>
        <div class="inspector__stat-val">${pack.locked ? 'YES' : 'NO'}</div>
      </div>
    </div>
  `;
  ins.classList.add('is-on');
  ins.hidden = false;

  $('#insp-apply-all').onclick = async () => {
    try {
      const r = await api(`/api/inspector/${pack.id}/apply-all`, { method: 'POST' });
      toast(`${pack.code} 已应用至全组，等级 +2`, 'OK');
      closeInspector();
      await refreshGroup();
    } catch (e) { toast(e.message, 'CRIT'); }
  };
  $('#insp-remove').onclick = async () => {
    try {
      await api(`/api/packs/${pack.id}`, { method: 'DELETE' });
      toast(`移除技能包 ${pack.id}`, 'INFO');
      closeInspector();
      await refreshGroup();
    } catch (e) { toast(e.message, 'CRIT'); }
  };
}
function closeInspector() {
  const ins = $('#inspector');
  ins.classList.remove('is-on');
  setTimeout(() => { ins.hidden = true; }, 200);
}
window.openInspector = openInspector;
window.closeInspector = closeInspector;

// 关闭
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) {
    closeInspector();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const ins = document.getElementById('inspector');
    if (ins && !ins.hidden) closeInspector();
  }
});

// ---- 刷新当前组 ----
async function refreshGroup() {
  try {
    const g = await api(`/api/groups/${store.groupId}`);
    store.packs = g.packs;
    // 重新渲染卡片内容
    const grid = $('#grid-cards');
    grid.innerHTML = g.packs.map((p, i) => cardHtml(p, i)).join('');
    applyFilter();
    renderSelection();
  } catch (e) { toast(`同步失败：${e.message}`, 'CRIT'); }
}

// 简单卡片 HTML 模板（与服务端 _skillCard.ejs 同步）
function cardHtml(p, i) {
  const RARITY_COLOR = { T1: '#7e8a96', T2: '#4dd0ff', T3: '#7cffb2', T4: '#ffb547', T5: '#ff7eb6', T6: '#ff4d5e' };
  const color = RARITY_COLOR[p.rarity] || '#7e8a96';
  const delay = Math.min(i * 18, 540);
  return `
    <button type="button" class="card ${p.locked ? 'is-locked' : ''} ${p.equipped ? 'is-equipped' : ''}"
            data-pack-id="${escHtml(p.id)}" data-rarity="${escHtml(p.rarity)}" data-level="${p.level}"
            style="--card-rarity: ${color}; animation-delay: ${delay}ms;">
      <span class="card__corner card__corner--tl"></span>
      <span class="card__corner card__corner--br"></span>
      <div class="card__top">
        <span class="card__rarity" style="color: ${color};">${escHtml(p.rarity)}</span>
        <div class="card__top-right">
          ${p.equipped ? '<span class="card__zap" title="已装备"><svg viewBox="0 0 16 16" width="9" height="9" fill="currentColor"><path d="M9 1 L3 9 L7 9 L6 15 L13 6 L9 6 Z" /></svg></span>' : ''}
          ${p.locked ? '<svg class="card__lock" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#ff4d5e" stroke-width="1.5"><rect x="3" y="7" width="10" height="7" /><path d="M5 7 L5 5 C5 3 6 1 8 1 C10 1 11 3 11 5 L11 7" /></svg>' : ''}
        </div>
      </div>
      <div class="card__code-id">${escHtml(p.id)}</div>
      <div class="card__code" title="${escHtml(p.code)}">${escHtml(p.code)}</div>
      <div class="card__bottom">
        <div class="card__lv">
          <span class="card__lv-num">${String(p.level).padStart(2, '0')}</span>
          <span class="card__lv-max">/ 90</span>
        </div>
        <div class="card__lv-bar"><div class="card__lv-bar-fill" style="width: ${(p.level/90*100).toFixed(0)}%; background: ${color};"></div></div>
      </div>
      ${p.locked ? '<div class="card__lock-overlay"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ff4d5e" stroke-width="1.5" opacity="0.4"><rect x="5" y="11" width="14" height="9" /><path d="M8 11 L8 8 C8 5.5 10 4 12 4 C14 4 16 5.5 16 8 L16 11" /></svg></div>' : ''}
    </button>
  `;
}

// ---- 时间轴轮询 ----
async function refreshTimeline() {
  try {
    const list = await api('/api/timeline');
    const wrap = $('#timeline-scroll');
    if (!wrap) return;
    wrap.innerHTML = list.map((e, i) => {
      const colorMap = { OK: '#7cffb2', INFO: '#4dd0ff', WARN: '#ffb547', CRIT: '#ff4d5e' };
      const c = colorMap[e.level] || '#4dd0ff';
      const border = hexToRgba(c, 0.4);
      const t = Math.floor((Date.now() - e.ts) / 1000);
      const ago = t < 60 ? t + 's 前' : t < 3600 ? Math.floor(t/60) + 'm 前' : Math.floor(t/3600) + 'h 前';
      return `
        <div class="timeline__item" style="animation-delay: ${i*40}ms; --ev-color: ${c}; --ev-border: ${border};">
          <span class="timeline__dot ${e.level !== 'INFO' ? 'is-pulse' : ''}"></span>
          <div class="timeline__item-head">
            <span class="timeline__item-code">${escHtml(e.code)}</span>
            <span class="timeline__item-time" style="color: ${c};">${ago}</span>
          </div>
          <div class="timeline__item-msg" style="color: ${c};">${escHtml(e.message)}</div>
          <div class="timeline__item-foot">
            <span class="timeline__item-dot" style="background: ${c}; ${e.level === 'CRIT' ? 'animation: pulseGlow 1.6s ease-in-out infinite;' : ''}"></span>
            <span class="timeline__item-level" style="color: ${c};">${escHtml(e.level)}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) { /* 静默 */ }
}

// ---- 启动 ----
let initialized = false;
function boot() {
  if (initialized) return;
  initialized = true;
  tickClock();
  if (store.clockTimer) clearInterval(store.clockTimer);
  store.clockTimer = setInterval(tickClock, 1000);
  setInterval(tickSync, 1500);
  setInterval(refreshTimeline, 5000);
  setupMatrix();
  setupFilters();
  setupActions();
  setupConsole();
  renderSelection();
  applyFilter();
  // 初始 toast
  setTimeout(() => toast('RHODES 终端已上线 · 操作员 DR-091', 'OK'), 600);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
