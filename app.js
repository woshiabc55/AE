/* ============================================================
   IP.ARC // 游戏IP衍生作品资料库
   ============================================================ */

(function() {
'use strict';

const DATA = window.DATA || [];
const COLORS = ['#ff2e88', '#00f0ff', '#a259ff', '#facc15', '#6ef7c8', '#ff8a3d', '#4d9bff', '#ff4d6d', '#8eff7c', '#ff66e1', '#ffb84d', '#74faff'];

// 工具函数
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const el = (tag, props = {}, children = []) => {
  const e = document.createElement(tag);
  // dataset is a read-only getter on Element; handle it specially
  for (const key in props) {
    if (key === 'dataset') {
      const d = props[key];
      if (d) for (const k in d) e.dataset[k] = d[k];
    } else {
      try { e[key] = props[key]; } catch (_) { /* read-only */ }
    }
  }
  if (typeof children === 'string') e.textContent = children;
  else children.forEach(c => c && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
};
const debounce = (fn, ms) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};
const formatNumber = (n) => n.toLocaleString('en-US');
const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// 状态
const state = {
  view: 'home',
  search: '',
  filters: {
    types: new Set(),
    status: new Set(),
    regions: new Set(),
    years: new Set(),
    ips: new Set(),
  },
  ratingMin: 0,
  sort: 'rating_desc',
  page: 1,
  pageSize: 48,
  viewMode: 'grid',
};

// 主题色生成（基于字符串 hash）
function colorFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return COLORS[Math.abs(h) % COLORS.length];
}

function gradientFor(s) {
  const c = colorFromString(s);
  const c2 = COLORS[(Math.abs(s.length * 7) + 3) % COLORS.length];
  return `linear-gradient(135deg, ${c}, ${c2})`;
}

// 状态映射
const STATUS_CLASS = {
  '已发行': 'status-released',
  '已完结': 'status-已完结',
  '连载中': 'status-连载中',
  '制作中': 'status-制作中',
  '计划中': 'status-计划中',
  '限定': 'status-限定',
  '已下架': 'status-已下架',
  '重制中': 'status-重制中',
};

// 路由
function navigate(route) {
  const r = (route || location.hash || '#/').replace(/^#/, '');
  if (r === '/' || r === '') {
    showView('home');
  } else if (r.startsWith('/library')) {
    showView('library');
  } else if (r.startsWith('/trends')) {
    showView('trends');
  } else if (r.startsWith('/about')) {
    showView('about');
  } else {
    showView('home');
  }
  updateTopnav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showView(name) {
  state.view = name;
  $$('.view').forEach(v => v.hidden = true);
  const target = $('#view-' + name);
  if (target) target.hidden = false;
  if (name === 'library') renderLibrary();
  if (name === 'trends') renderTrends();
  if (name === 'home') renderHome();
}

function updateTopnav() {
  const map = { 'home': '#/', 'library': '#/library', 'trends': '#/trends', 'about': '#/about' };
  $$('.topnav__item').forEach(btn => {
    const isActive = btn.dataset.route === map[state.view];
    btn.classList.toggle('topnav__item--active', isActive);
  });
}

// 工具：聚合统计
function getStats() {
  const ips = new Set();
  const types = new Set();
  const regions = new Set();
  const byStatus = {};
  const byYear = {};
  const byIp = {};
  const byType = {};
  const byRegion = {};
  const ratings = [];
  for (const w of DATA) {
    ips.add(w.ip);
    types.add(w.type);
    regions.add(w.region);
    byStatus[w.status] = (byStatus[w.status] || 0) + 1;
    byYear[w.year] = (byYear[w.year] || 0) + 1;
    byIp[w.ip] = (byIp[w.ip] || 0) + 1;
    byType[w.type] = (byType[w.type] || 0) + 1;
    byRegion[w.region] = (byRegion[w.region] || 0) + 1;
    ratings.push(w.rating);
  }
  return { ips, types, regions, byStatus, byYear, byIp, byType, byRegion, ratings };
}

// Home 渲染
function renderHome() {
  renderStats();
  renderTopIPs();
  renderCharts();
  renderFeatured();
}

function renderStats() {
  const s = getStats();
  const stats = [
    ['total', DATA.length],
    ['ips', s.ips.size],
    ['types', s.types.size],
    ['regions', s.regions.size],
    ['released', (s.byStatus['已发行'] || 0) + (s.byStatus['已完结'] || 0)],
    ['ongoing', (s.byStatus['连载中'] || 0) + (s.byStatus['制作中'] || 0)],
    ['planned', s.byStatus['计划中'] || 0],
    ['limited', (s.byStatus['限定'] || 0) + (s.byStatus['已下架'] || 0) + (s.byStatus['重制中'] || 0)],
  ];
  stats.forEach(([key, val]) => {
    const el = $(`[data-stat="${key}"] [data-countup]`);
    if (el) el.dataset.countup = val;
  });
  initCountUp();
  // 更新页脚
  $('#footerTotal').textContent = formatNumber(DATA.length);
  $('#footerIps').textContent = s.ips.size;
  $('#footerTypes').textContent = s.types.size;
}

function initCountUp() {
  $$('[data-countup]').forEach(el => {
    const target = parseFloat(el.dataset.countup);
    const duration = 1200;
    const start = performance.now();
    const startVal = 0;
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = formatNumber(val);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  });
}

function renderTopIPs() {
  const s = getStats();
  const top = Object.entries(s.byIp).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const rail = $('#topipRail');
  rail.innerHTML = '';
  top.forEach(([ipName, count], i) => {
    const c = colorFromString(ipName);
    const c2 = COLORS[(i * 3 + 4) % COLORS.length];
    const card = el('div', { className: 'topip-card', dataset: { ip: ipName } });
    card.style.setProperty('--topip-bg', `linear-gradient(135deg, ${c}, ${c2})`);
    card.style.setProperty('--topip-glow', c + '66');
    card.innerHTML = `
      <div class="topip-card__rank">${String(i + 1).padStart(2, '0')}</div>
      <div class="topip-card__name">${escapeHtml(ipName)}</div>
      <div class="topip-card__count"><strong>${count}</strong> 款衍生作品</div>
    `;
    card.addEventListener('click', () => {
      location.hash = '#/library';
      setTimeout(() => {
        state.filters.ips = new Set([ipName]);
        state.page = 1;
        renderLibrary();
      }, 50);
    });
    rail.appendChild(card);
  });
}

// Charts（自绘 Canvas）
function drawDonut(canvas, data, total) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.4;
  const innerR = R * 0.62;

  let start = -Math.PI / 2;
  data.forEach(([label, value], i) => {
    const angle = (value / total) * Math.PI * 2;
    const c = COLORS[i % COLORS.length];
    ctx.beginPath();
    ctx.arc(cx, cy, R, start, start + angle);
    ctx.arc(cx, cy, innerR, start + angle, start, true);
    ctx.closePath();
    ctx.fillStyle = c + 'cc';
    ctx.fill();
    ctx.strokeStyle = '#0e0a1c';
    ctx.lineWidth = 1;
    ctx.stroke();
    start += angle;
  });

  // 中心文字
  ctx.fillStyle = '#f5f3ff';
  ctx.font = 'bold 32px Orbitron, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatNumber(total), cx, cy - 8);
  ctx.fillStyle = '#a89cc8';
  ctx.font = '11px "JetBrains Mono"';
  ctx.fillText('TOTAL', cx, cy + 18);

  // 图例
  const legend = data.slice(0, 8);
  const lh = 22;
  let lx = 16, ly = 16;
  ctx.font = '11px "JetBrains Mono"';
  legend.forEach(([label, value], i) => {
    if (ly + lh > H - 16) return;
    const c = COLORS[i % COLORS.length];
    ctx.fillStyle = c;
    ctx.fillRect(lx, ly, 10, 10);
    ctx.fillStyle = '#f5f3ff';
    ctx.textAlign = 'left';
    ctx.fillText(label + ' · ' + value, lx + 14, ly + 8);
    ly += lh;
  });
}

function drawBars(canvas, labels, values, options = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = options.padR || 20, padT = 20, padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...values, 1);

  // 网格
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = '#6e6489';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max * i) / 4), padL - 6, y + 3);
  }

  // 柱
  const slot = innerW / values.length;
  const barW = Math.min(slot * 0.7, 24);
  values.forEach((v, i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const h = (v / max) * innerH;
    const y = padT + innerH - h;
    const c = options.colors ? options.colors[i] : (COLORS[i % COLORS.length]);
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, c);
    grad.addColorStop(1, c + '44');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, h);
    // 顶部高亮
    ctx.fillStyle = c;
    ctx.fillRect(x, y, barW, 2);
    // 标签
    if (labels[i] != null) {
      ctx.fillStyle = '#a89cc8';
      ctx.font = options.font || '10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, H - padB + 16);
    }
  });
}

function drawLine(canvas, labels, values) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = 20, padT = 20, padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...values, 1);

  // 网格
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = '#6e6489';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max * i) / 4), padL - 6, y + 3);
  }

  const step = innerW / Math.max(1, values.length - 1);
  const points = values.map((v, i) => ({
    x: padL + step * i,
    y: padT + innerH - (v / max) * innerH,
    v,
  }));

  // 填充
  const grad = ctx.createLinearGradient(0, padT, 0, padT + innerH);
  grad.addColorStop(0, '#ff2e8844');
  grad.addColorStop(1, '#ff2e8800');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, padT + innerH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padT + innerH);
  ctx.closePath();
  ctx.fill();

  // 线
  ctx.strokeStyle = '#ff2e88';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // 点
  points.forEach(p => {
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0e0a1c';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 标签
  ctx.fillStyle = '#a89cc8';
  ctx.font = '10px "JetBrains Mono"';
  ctx.textAlign = 'center';
  const step2 = Math.ceil(values.length / 12);
  points.forEach((p, i) => {
    if (i % step2 === 0) ctx.fillText(labels[i], p.x, H - padB + 16);
  });
}

function drawHorizontalBars(canvas, items) {
  // items: [[label, value, color]]
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 110, padR = 50, padT = 12, padB = 12;
  const rowH = (H - padT - padB) / items.length;
  const max = Math.max(...items.map(x => x[1]), 1);

  ctx.font = '11px "JetBrains Mono"';
  items.forEach(([label, value, color], i) => {
    const y = padT + rowH * i + rowH / 2;
    // 标签
    ctx.fillStyle = '#d6cef0';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const truncated = label.length > 14 ? label.slice(0, 13) + '…' : label;
    ctx.fillText(truncated, padL - 8, y);
    // 柱
    const w = (value / max) * (W - padL - padR);
    const grad = ctx.createLinearGradient(padL, 0, padL + w, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '44');
    ctx.fillStyle = grad;
    ctx.fillRect(padL, y - 8, w, 16);
    // 数值
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'left';
    ctx.fillText(value, padL + w + 4, y);
  });
}

function drawHistogram(canvas, buckets) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = 20, padT = 20, padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...buckets.map(b => b[1]), 1);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = '#6e6489';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max * i) / 4), padL - 6, y + 3);
  }

  const slot = innerW / buckets.length;
  const barW = slot * 0.7;
  buckets.forEach(([label, value], i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const h = (value / max) * innerH;
    const y = padT + innerH - h;
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(1, '#a259ff88');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, h);
    ctx.fillStyle = '#a89cc8';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barW / 2, H - padB + 16);
  });
}

function drawStackedBars(canvas, labels, series) {
  // series: [{name, values: [], color}]
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = 140, padT = 20, padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const totals = labels.map((_, i) => series.reduce((s, sr) => s + sr.values[i], 0));
  const max = Math.max(...totals, 1);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH * i) / 4;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = '#6e6489';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max * i) / 4), padL - 6, y + 3);
  }

  const slot = innerW / labels.length;
  labels.forEach((label, i) => {
    const x = padL + slot * i + slot * 0.15;
    const w = slot * 0.7;
    let y0 = padT + innerH;
    series.forEach(sr => {
      const v = sr.values[i];
      const h = (v / max) * innerH;
      y0 -= h;
      ctx.fillStyle = sr.color;
      ctx.fillRect(x, y0, w, h);
    });
    ctx.fillStyle = '#a89cc8';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, H - padB + 16);
  });

  // 图例
  let ly = padT;
  series.slice(0, 10).forEach(sr => {
    ctx.fillStyle = sr.color;
    ctx.fillRect(W - padR + 8, ly, 10, 10);
    ctx.fillStyle = '#d6cef0';
    ctx.font = '10px "JetBrains Mono"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const txt = sr.name.length > 10 ? sr.name.slice(0, 9) + '…' : sr.name;
    ctx.fillText(txt, W - padR + 22, ly + 5);
    ly += 16;
  });
}

function renderCharts() {
  const s = getStats();

  // 类型分布 - 选 top 12
  const typeTop = Object.entries(s.byType).sort((a, b) => b[1] - a[1]).slice(0, 12);
  drawDonut($('#typeChart'), typeTop, s.byType ? Object.values(s.byType).reduce((a, b) => a + b, 0) : DATA.length);

  // 趋势 - 近 9 年
  const years = [];
  for (let y = 2018; y <= 2026; y++) years.push(y);
  const trendVals = years.map(y => s.byYear[y] || 0);
  drawLine($('#trendChart'), years.map(String), trendVals);
}

function renderFeatured() {
  const grid = $('#featuredGrid');
  if (!grid) return;
  const featured = DATA.filter(w => w.rating >= 8.5).slice(0, 12);
  grid.innerHTML = '';
  featured.forEach(w => {
    const c = colorFromString(w.ip);
    const c2 = COLORS[(w.id * 3) % COLORS.length];
    const card = el('div', { className: 'feature-card' });
    card.style.setProperty('--card-bg', `linear-gradient(135deg, ${c}, ${c2})`);
    card.style.setProperty('--card-glow', c);
    card.innerHTML = `
      <div>
        <div class="feature-card__type">${escapeHtml(w.type)}</div>
        <div class="feature-card__name">${escapeHtml(w.name)}</div>
        <div class="feature-card__ip">${escapeHtml(w.ip)}</div>
      </div>
      <div class="feature-card__meta">
        <span>${w.year} · ${escapeHtml(w.region)}</span>
        <span class="feature-card__rating">${w.rating}</span>
      </div>
    `;
    card.addEventListener('click', () => openDrawer(w));
    grid.appendChild(card);
  });
}

// 资料库
function getFiltered() {
  const search = state.search.toLowerCase().trim();
  const tokens = search ? search.split(/\s+/) : [];
  return DATA.filter(w => {
    if (state.filters.types.size && !state.filters.types.has(w.type)) return false;
    if (state.filters.status.size && !state.filters.status.has(w.status)) return false;
    if (state.filters.regions.size && !state.filters.regions.has(w.region)) return false;
    if (state.filters.years.size && !state.filters.years.has(String(w.year))) return false;
    if (state.filters.ips.size && !state.filters.ips.has(w.ip)) return false;
    if (w.rating < state.ratingMin) return false;
    if (tokens.length) {
      const haystack = (w.name + ' ' + w.ip + ' ' + w.type + ' ' + w.region + ' ' + w.publisher + ' ' + w.description).toLowerCase();
      if (!tokens.every(t => haystack.includes(t))) return false;
    }
    return true;
  });
}

function getSorted(items) {
  const arr = items.slice();
  switch (state.sort) {
    case 'rating_desc': arr.sort((a, b) => b.rating - a.rating); break;
    case 'rating_asc': arr.sort((a, b) => a.rating - b.rating); break;
    case 'year_desc': arr.sort((a, b) => b.year - a.year); break;
    case 'year_asc': arr.sort((a, b) => a.year - b.year); break;
    case 'name_asc': arr.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN')); break;
    case 'name_desc': arr.sort((a, b) => b.name.localeCompare(a.name, 'zh-Hans-CN')); break;
  }
  return arr;
}

function renderLibrary() {
  // 首次渲染：构建侧栏
  if (!$('#filterTypes').children.length) buildFilters();
  const filtered = getFiltered();
  const sorted = getSorted(filtered);
  const totalPages = Math.max(1, Math.ceil(sorted.length / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;
  const start = (state.page - 1) * state.pageSize;
  const pageItems = sorted.slice(start, start + state.pageSize);
  $('#resultCount').textContent = formatNumber(sorted.length);
  const view = $('#libraryView');
  view.innerHTML = '';
  if (!pageItems.length) {
    view.innerHTML = '<div class="empty"><div class="empty__title">未找到匹配的作品</div><div>尝试调整筛选条件或清空搜索</div></div>';
  } else if (state.viewMode === 'grid') {
    view.appendChild(renderGrid(pageItems));
  } else if (state.viewMode === 'list') {
    view.appendChild(renderList(pageItems));
  } else {
    view.appendChild(renderTable(pageItems));
  }
  renderPager(totalPages);
}

function renderGrid(items) {
  const grid = el('div', { className: 'cards-grid' });
  items.forEach((w, i) => {
    const c = colorFromString(w.ip);
    const c2 = COLORS[(w.id * 5 + 2) % COLORS.length];
    const card = el('div', { className: 'work-card fade-up' });
    card.style.setProperty('--card-bg', `linear-gradient(135deg, ${c}22, ${c2}11)`);
    card.style.setProperty('--card-accent', c);
    card.style.animationDelay = (i * 30) + 'ms';
    card.innerHTML = `
      <div class="work-card__cover">
        <div class="work-card__cover-mark">${escapeHtml(w.name.slice(0, 2))}</div>
        <div class="work-card__type-tag">${escapeHtml(w.type)}</div>
        <div class="work-card__rating">${w.rating}</div>
      </div>
      <div class="work-card__body">
        <div class="work-card__ip">${escapeHtml(w.ip)}</div>
        <div class="work-card__name">${escapeHtml(w.name)}</div>
        <div class="work-card__meta">
          <span class="work-card__year">${w.year} · ${escapeHtml(w.region)}</span>
          <span class="work-card__status ${STATUS_CLASS[w.status] || ''}">${escapeHtml(w.status)}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openDrawer(w));
    grid.appendChild(card);
  });
  return grid;
}

function renderList(items) {
  const list = el('div', { className: 'cards-list' });
  items.forEach(w => {
    const row = el('div', { className: 'work-row' });
    row.innerHTML = `
      <div class="work-row__id">#${String(w.id).padStart(4, '0')}</div>
      <div class="work-row__name">${escapeHtml(w.name)}</div>
      <div class="work-row__ip">${escapeHtml(w.ip)}</div>
      <div class="work-row__type">${escapeHtml(w.type)}</div>
      <div class="work-row__year">${w.year}</div>
      <div class="work-row__region">${escapeHtml(w.region)}</div>
      <div class="work-row__status ${STATUS_CLASS[w.status] || ''}">${escapeHtml(w.status)}</div>
      <div class="work-row__rating">${w.rating}</div>
    `;
    row.addEventListener('click', () => openDrawer(w));
    list.appendChild(row);
  });
  return list;
}

function renderTable(items) {
  const wrap = el('div', { className: 'cards-table' });
  wrap.innerHTML = `
    <div class="cards-table__head">
      <div class="cards-table__cell cards-table__cell--id">ID</div>
      <div class="cards-table__cell cards-table__cell--name">名称</div>
      <div class="cards-table__cell cards-table__cell--ip">所属 IP</div>
      <div class="cards-table__cell cards-table__cell--type">类型</div>
      <div class="cards-table__cell cards-table__cell--year">年份</div>
      <div class="cards-table__cell cards-table__cell--region">地区</div>
      <div class="cards-table__cell cards-table__cell--status">状态</div>
      <div class="cards-table__cell cards-table__cell--rating">评分</div>
      <div></div>
    </div>
    <div class="cards-table__body"></div>
  `;
  const body = wrap.querySelector('.cards-table__body');
  items.forEach(w => {
    const row = el('div', { className: 'cards-table__row' });
    row.innerHTML = `
      <div class="cards-table__cell cards-table__cell--id">#${w.id}</div>
      <div class="cards-table__cell cards-table__cell--name">${escapeHtml(w.name)}</div>
      <div class="cards-table__cell cards-table__cell--ip">${escapeHtml(w.ip)}</div>
      <div class="cards-table__cell cards-table__cell--type">${escapeHtml(w.type)}</div>
      <div class="cards-table__cell cards-table__cell--year">${w.year}</div>
      <div class="cards-table__cell cards-table__cell--region">${escapeHtml(w.region)}</div>
      <div class="cards-table__cell"><span class="cards-table__cell--status ${STATUS_CLASS[w.status] || ''}">${escapeHtml(w.status)}</span></div>
      <div class="cards-table__cell cards-table__cell--rating">${w.rating}</div>
      <div></div>
    `;
    row.addEventListener('click', () => openDrawer(w));
    body.appendChild(row);
  });
  return wrap;
}

function renderPager(totalPages) {
  const pager = $('#pager');
  const pages = $('#pagerPages');
  pages.innerHTML = '';
  // 显示 ±2 页
  const cur = state.page;
  const list = [];
  list.push(1);
  for (let i = cur - 2; i <= cur + 2; i++) {
    if (i > 1 && i < totalPages) list.push(i);
  }
  if (totalPages > 1) list.push(totalPages);
  // 去重 + 排序
  const uniq = Array.from(new Set(list)).sort((a, b) => a - b);
  let prev = 0;
  uniq.forEach(p => {
    if (p - prev > 1) {
      const dots = el('span', { className: 'pager__btn', textContent: '…' });
      pages.appendChild(dots);
    }
    const btn = el('button', { className: 'pager__btn' + (p === cur ? ' pager__btn--active' : ''), textContent: p });
    btn.addEventListener('click', () => { state.page = p; renderLibrary(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    pages.appendChild(btn);
    prev = p;
  });
  pager.querySelector('[data-pager="first"]').disabled = cur === 1;
  pager.querySelector('[data-pager="prev"]').disabled = cur === 1;
  pager.querySelector('[data-pager="next"]').disabled = cur === totalPages;
  pager.querySelector('[data-pager="last"]').disabled = cur === totalPages;
}

function buildFilters() {
  const s = getStats();
  const typeEntries = Object.entries(s.byType).sort((a, b) => b[1] - a[1]);
  const statusEntries = Object.entries(s.byStatus).sort((a, b) => b[1] - a[1]);
  const regionEntries = Object.entries(s.byRegion).sort((a, b) => b[1] - a[1]);
  const yearEntries = Object.entries(s.byYear).sort((a, b) => b[0].localeCompare(a[0]));

  const fillList = (id, entries, set, limit) => {
    const el = $('#' + id);
    el.innerHTML = '';
    entries.slice(0, limit || entries.length).forEach(([key, count]) => {
      const item = document.createElement('div');
      item.className = 'filterpane__item';
      item.innerHTML = `
        <span class="filterpane__check">✓</span>
        <span class="filterpane__label">${escapeHtml(key)}</span>
        <span class="filterpane__count">${count}</span>
      `;
      item.addEventListener('click', () => {
        if (set.has(key)) set.delete(key);
        else set.add(key);
        state.page = 1;
        item.classList.toggle('filterpane__item--active');
        renderLibrary();
      });
      el.appendChild(item);
    });
  };

  fillList('filterTypes', typeEntries, state.filters.types, 30);
  fillList('filterStatus', statusEntries, state.filters.status);
  fillList('filterRegions', regionEntries, state.filters.regions, 16);
  fillList('filterYears', yearEntries, state.filters.years, 9);
  // Top IPs
  const topIps = Object.entries(s.byIp).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const topIpEl = $('#filterTopIps');
  topIpEl.innerHTML = '';
  topIps.forEach(([ip, count]) => {
    const item = document.createElement('div');
    item.className = 'filterpane__item';
    item.innerHTML = `
      <span class="filterpane__check">✓</span>
      <span class="filterpane__label">${escapeHtml(ip)}</span>
      <span class="filterpane__count">${count}</span>
    `;
    item.addEventListener('click', () => {
      if (state.filters.ips.has(ip)) state.filters.ips.delete(ip);
      else state.filters.ips.add(ip);
      state.page = 1;
      item.classList.toggle('filterpane__item--active');
      renderLibrary();
    });
    topIpEl.appendChild(item);
  });
}

// 详情抽屉
function openDrawer(w) {
  const drawer = $('#drawer');
  const content = $('#drawerContent');
  const c = colorFromString(w.ip);
  const c2 = COLORS[(w.id * 3) % COLORS.length];

  // 关联作品（同名 IP 下的其他作品）
  const related = DATA.filter(x => x.ip === w.ip && x.id !== w.id).slice(0, 6);

  content.innerHTML = `
    <div class="drawer__cover" style="--drawer-bg: linear-gradient(135deg, ${c}, ${c2})">
      <div class="drawer__cover-mark">${escapeHtml(w.name.slice(0, 2))}</div>
    </div>
    <div class="drawer__body">
      <div class="drawer__type">${escapeHtml(w.type)}</div>
      <div class="drawer__name">${escapeHtml(w.name)}</div>
      <div class="drawer__ip">▸ ${escapeHtml(w.ip)}</div>
      <div class="drawer__rating">${w.rating} / 10</div>
      <div class="drawer__meta">
        <div class="drawer__meta-item">
          <div class="drawer__meta-label">状态</div>
          <div class="drawer__meta-value"><span class="${STATUS_CLASS[w.status] || ''}" style="padding:2px 6px;border-radius:2px;font-family:var(--f-mono);font-size:11px;">${escapeHtml(w.status)}</span></div>
        </div>
        <div class="drawer__meta-item">
          <div class="drawer__meta-label">首次公开</div>
          <div class="drawer__meta-value">${w.year} 年</div>
        </div>
        <div class="drawer__meta-item">
          <div class="drawer__meta-label">地区</div>
          <div class="drawer__meta-value">${escapeHtml(w.region)}</div>
        </div>
        <div class="drawer__meta-item">
          <div class="drawer__meta-label">编号</div>
          <div class="drawer__meta-value">#${String(w.id).padStart(4, '0')}</div>
        </div>
        <div class="drawer__meta-item" style="grid-column:1/-1">
          <div class="drawer__meta-label">发行方 / 制作团队</div>
          <div class="drawer__meta-value">${escapeHtml(w.publisher)}</div>
        </div>
      </div>
      <div class="drawer__desc">${escapeHtml(w.description)}</div>
      <div class="drawer__tags">
        ${(w.tags || []).map(t => `<span class="drawer__tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      ${related.length ? `
        <div class="drawer__related">
          <h4 class="drawer__related-title">同 IP 其它衍生</h4>
          <div class="drawer__related-grid">
            ${related.map(r => `
              <div class="drawer__related-card" data-rid="${r.id}">
                <div class="drawer__related-name">${escapeHtml(r.name)}</div>
                <div class="drawer__related-meta">${escapeHtml(r.type)} · ${r.year} · ★ ${r.rating}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  drawer.hidden = false;
  document.body.style.overflow = 'hidden';

  content.querySelectorAll('.drawer__related-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.rid);
      const next = DATA.find(x => x.id === id);
      if (next) openDrawer(next);
    });
  });
}

function closeDrawer() {
  $('#drawer').hidden = true;
  document.body.style.overflow = '';
}

// Trends
function renderTrends() {
  const s = getStats();

  // 年份趋势
  const years = [];
  for (let y = 2010; y <= 2026; y++) years.push(y);
  const vals = years.map(y => s.byYear[y] || 0);
  drawLine($('#trendChart2'), years.map(String), vals);

  // 状态分布
  const statusEntries = Object.entries(s.byStatus).sort((a, b) => b[1] - a[1]);
  drawDonut($('#statusChart'), statusEntries, DATA.length);

  // 地区 TOP 12
  const regionTop = Object.entries(s.byRegion).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([k, v], i) => [k, v, COLORS[i % COLORS.length]]);
  drawHorizontalBars($('#regionChart'), regionTop);

  // 评分分布（0.5 步长）
  const buckets = [];
  for (let i = 0; i < 20; i++) {
    const low = i * 0.5;
    const high = (i + 1) * 0.5;
    const count = s.ratings.filter(r => r >= low && r < high + 0.001).length;
    buckets.push([(low).toFixed(1), count]);
  }
  drawHistogram($('#ratingChart'), buckets);

  // IP TOP 20
  const ipTop = Object.entries(s.byIp).sort((a, b) => b[1] - a[1]).slice(0, 20)
    .map(([k, v], i) => [k, v, COLORS[i % COLORS.length]]);
  drawHorizontalBars($('#ipChart'), ipTop);

  // 类型 × 年份堆叠
  const recentYears = years.slice(-9);
  const topTypes = Object.entries(s.byType).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const series = topTypes.map(([typeName], i) => ({
    name: typeName,
    color: COLORS[i % COLORS.length],
    values: recentYears.map(y => DATA.filter(w => w.type === typeName && w.year === y).length),
  }));
  drawStackedBars($('#typeYearChart'), recentYears.map(String), series);
}

// 粒子背景
function initParticles() {
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const colors = ['#ff2e88', '#00f0ff', '#a259ff', '#facc15'];

  function resize() {
    W = canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    H = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  function init() {
    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.5 + 0.2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
    });
    // 连线
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = a.c;
          ctx.globalAlpha = (1 - dist / 120) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  step();
}

// 事件绑定
function bindEvents() {
  // 搜索
  const onSearch = debounce((v) => {
    state.search = v;
    state.page = 1;
    if (state.view === 'library') renderLibrary();
    else { location.hash = '#/library'; }
  }, 300);
  $('#searchInput').addEventListener('input', (e) => onSearch(e.target.value));

  // 顶栏导航
  $$('.topnav__item').forEach(btn => {
    btn.addEventListener('click', () => { location.hash = btn.dataset.route; });
  });
  $$('[data-route]').forEach(btn => {
    if (btn.classList.contains('brand')) {
      btn.addEventListener('click', (e) => { e.preventDefault(); location.hash = '#/'; });
    }
  });

  // ⌘K 快捷键
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      $('#searchInput').focus();
    }
    if (e.key === 'Escape') closeDrawer();
  });

  // 抽屉关闭
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#drawerX').addEventListener('click', closeDrawer);

  // 排序
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; state.page = 1; renderLibrary(); });
  $('#pageSize').addEventListener('change', (e) => { state.pageSize = parseInt(e.target.value); state.page = 1; renderLibrary(); });

  // 视图切换
  $$('#viewToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#viewToggle button').forEach(b => b.classList.remove('viewtoggle__btn--active'));
      btn.classList.add('viewtoggle__btn--active');
      state.viewMode = btn.dataset.view;
      renderLibrary();
    });
  });

  // 分页
  $$('[data-pager]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filtered = getSorted(getFiltered());
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      if (btn.dataset.pager === 'first') state.page = 1;
      else if (btn.dataset.pager === 'prev') state.page = Math.max(1, state.page - 1);
      else if (btn.dataset.pager === 'next') state.page = Math.min(totalPages, state.page + 1);
      else if (btn.dataset.pager === 'last') state.page = totalPages;
      renderLibrary();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  $('#jumpPage').addEventListener('change', (e) => {
    const p = parseInt(e.target.value);
    if (p >= 1) { state.page = p; renderLibrary(); }
  });

  // 评分滑块
  $('#ratingMin').addEventListener('input', (e) => {
    state.ratingMin = parseFloat(e.target.value);
    $('#ratingMinVal').textContent = state.ratingMin;
    state.page = 1;
    renderLibrary();
  });

  // 清空筛选
  $('#clearFilters').addEventListener('click', () => {
    state.filters.types.clear();
    state.filters.status.clear();
    state.filters.regions.clear();
    state.filters.years.clear();
    state.filters.ips.clear();
    state.ratingMin = 0;
    state.search = '';
    state.page = 1;
    $('#ratingMin').value = 0;
    $('#ratingMinVal').textContent = '0';
    $('#searchInput').value = '';
    buildFilters();
    renderLibrary();
  });

  // Featured 切换
  $$('#featuredTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#featuredTabs button').forEach(b => b.classList.remove('tab--active'));
      btn.classList.add('tab--active');
      const mode = btn.dataset.featured;
      const grid = $('#featuredGrid');
      let list = DATA.slice();
      if (mode === 'rating') list = list.filter(w => w.rating >= 8.5).sort((a, b) => b.rating - a.rating).slice(0, 12);
      else if (mode === 'recent') list = list.sort((a, b) => b.year - a.year).slice(0, 12);
      else list = list.sort(() => Math.random() - 0.5).slice(0, 12);
      grid.innerHTML = '';
      list.forEach(w => {
        const c = colorFromString(w.ip);
        const c2 = COLORS[(w.id * 3) % COLORS.length];
        const card = el('div', { className: 'feature-card' });
        card.style.setProperty('--card-bg', `linear-gradient(135deg, ${c}, ${c2})`);
        card.style.setProperty('--card-glow', c);
        card.innerHTML = `
          <div>
            <div class="feature-card__type">${escapeHtml(w.type)}</div>
            <div class="feature-card__name">${escapeHtml(w.name)}</div>
            <div class="feature-card__ip">${escapeHtml(w.ip)}</div>
          </div>
          <div class="feature-card__meta">
            <span>${w.year} · ${escapeHtml(w.region)}</span>
            <span class="feature-card__rating">${w.rating}</span>
          </div>
        `;
        card.addEventListener('click', () => openDrawer(w));
        grid.appendChild(card);
      });
    });
  });

  // 移动端筛选
  $('#filterToggleMobile').addEventListener('click', () => {
    $('#filterPane').classList.toggle('filterpane--open');
  });

  // 回到顶部
  $('#scrollTopBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 数据导出
  $('#exportBtn').addEventListener('click', () => {
    const items = state.view === 'library' ? getSorted(getFiltered()) : DATA;
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iparc-${state.view}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // 路由
  window.addEventListener('hashchange', () => navigate());
}

// 启动
function start() {
  if (!DATA.length) {
    document.body.innerHTML = '<div style="padding:60px;text-align:center;color:#f5f3ff;font-family:monospace">数据加载失败 (data.js is empty)。</div>';
    return;
  }
  bindEvents();
  initParticles();
  navigate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

})();
