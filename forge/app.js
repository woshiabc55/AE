// ============================================================
// SCRIPT.FORGE · 主逻辑
// 纯原生 ES6+，无构建依赖
// ============================================================
'use strict';

// ---------- 数据 ----------
const ALL_SCRIPTS = window.SCRIPTS || [];
let scripts = ALL_SCRIPTS.slice(); // 当前数据集（生成时可追加）

// ---------- 工具 ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const el = (tag, props = {}, children = []) => {
  const e = document.createElement(tag);
  for (const key in props) {
    if (key === 'dataset') {
      const d = props[key];
      if (d) for (const k in d) e.dataset[k] = d[k];
    } else if (key === 'style' && typeof props[key] === 'object') {
      Object.assign(e.style, props[key]);
    } else if (key.startsWith('on') && typeof props[key] === 'function') {
      e.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else if (key in e && !(key in HTMLElement.prototype && key !== 'classList')) {
      try { e[key] = props[key]; } catch (_) { /* read-only */ }
    } else if (key === 'class') {
      e.className = props[key];
    } else {
      try { e.setAttribute(key, props[key]); } catch (_) {}
    }
  }
  if (children == null) return e;
  if (typeof children === 'string') e.textContent = children;
  else if (Array.isArray(children)) children.forEach(c => c != null && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
};
const pad = (n, w = 4) => String(n).padStart(w, '0');
const debounce = (fn, ms) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};
const copy = (s) => {
  navigator.clipboard?.writeText(s).then(() => toast('已复制到剪贴板')).catch(() => toast('复制失败'));
};
const download = (filename, content, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ---------- Toast ----------
const toastEl = $('#toast');
let toastT;
const toast = (msg) => {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('show'), 1800);
};

// ---------- 状态 ----------
const state = {
  view: 'home',
  search: '',
  filters: { type: new Set(), genre: new Set(), era: new Set(), perspective: new Set(), tone: new Set() },
  ratingMin: 0,
  sort: 'id-desc',
  page: 1,
  pageSize: 24,
  viewMode: 'grid',
  selectedId: null,
};

// ---------- 全局统计 ----------
function getStats() {
  const stats = {
    total: scripts.length,
    types: new Set(),
    genres: new Set(),
    eras: new Set(),
    perspectives: new Set(),
    tones: new Set(),
    structures: new Set(),
    totalWords: 0,
    avgWords: 0,
    maxWords: 0,
  };
  for (const s of scripts) {
    stats.types.add(s.type);
    stats.genres.add(s.genre);
    stats.eras.add(s.era);
    stats.perspectives.add(s.perspective);
    stats.tones.add(s.tone);
    stats.structures.add(s.structure);
    stats.totalWords += s.wordCount;
    if (s.wordCount > stats.maxWords) stats.maxWords = s.wordCount;
  }
  stats.avgWords = Math.round(stats.totalWords / Math.max(scripts.length, 1));
  stats.typesCt = stats.types.size;
  stats.genresCt = stats.genres.size;
  stats.erasCt = stats.eras.size;
  stats.perspectivesCt = stats.perspectives.size;
  stats.tonesCt = stats.tones.size;
  stats.structuresCt = stats.structures.size;
  return stats;
}

// ---------- 筛选 + 排序 ----------
function getFiltered() {
  const f = state.filters;
  const q = (state.search || '').trim().toLowerCase();
  return scripts.filter(s => {
    if (f.type.size && !f.type.has(s.type)) return false;
    if (f.genre.size && !f.genre.has(s.genre)) return false;
    if (f.era.size && !f.era.has(s.era)) return false;
    if (f.perspective.size && !f.perspective.has(s.perspective)) return false;
    if (f.tone.size && !f.tone.has(s.tone)) return false;
    if (q) {
      const hay = (s.title + ' ' + s.logline + ' ' + s.setting + ' ' + s.themes.join(' ') + ' ' + s.characters.map(c => c.name + ' ' + c.archetype).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
function getSorted(list) {
  const arr = list.slice();
  switch (state.sort) {
    case 'id-asc': arr.sort((a, b) => a.id - b.id); break;
    case 'id-desc': arr.sort((a, b) => b.id - a.id); break;
    case 'title-asc': arr.sort((a, b) => a.title.localeCompare(b.title, 'zh')); break;
    case 'title-desc': arr.sort((a, b) => b.title.localeCompare(a.title, 'zh')); break;
    case 'wordCount-desc': arr.sort((a, b) => b.wordCount - a.wordCount); break;
    case 'wordCount-asc': arr.sort((a, b) => a.wordCount - b.wordCount); break;
    case 'createdAt-desc': arr.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
  }
  return arr;
}
function getPage(list) {
  const start = (state.page - 1) * state.pageSize;
  return list.slice(start, start + state.pageSize);
}

// ---------- 全局模板展示数据 ----------
const TEMPLATE_MODULES = [
  { icon: 'Ⅰ', name: '题材池', nameEn: 'Genre Pool', desc: '硬科幻 / 奇幻 / 悬疑 / 爱情 / 仙侠 / 赛博朋克 …… 60+ 题材作为原子单位，可自由组合。', count: 60, pills: ['硬科幻', '仙侠', '赛博朋克', '克苏鲁', '历史', '末世'] },
  { icon: 'Ⅱ', name: '时代池', nameEn: 'Era Pool', desc: '上古神话 / 魏晋 / 民国 / 当代 / 近未来 / 末日废土 …… 18+ 时代背景决定视觉与习俗。', count: 18, pills: ['上古', '魏晋', '民国', '当代', '近未来', '末日'] },
  { icon: 'Ⅲ', name: '视角池', nameEn: 'Perspective Pool', desc: '第一人称 / 第三人称限制 / 多线 POV / 群像 / 倒叙 / 信件日记 …… 8 种叙事镜头。', count: 8, pills: ['第一人称', '多线', '群像', '倒叙'] },
  { icon: 'Ⅳ', name: '基调池', nameEn: 'Tone Pool', desc: '黑暗 / 温暖 / 史诗 / 抒情 / 黑色幽默 …… 17 种情绪基色，铺设故事的温度。', count: 17, pills: ['黑暗', '温暖', '史诗', '抒情', '黑色幽默'] },
  { icon: 'Ⅴ', name: '幕结构池', nameEn: 'Act Structure Pool', desc: '三幕剧 / 五幕剧 / 救猫咪 15 拍 / 英雄之旅 12 段 / 起承转合 …… 7 种经典节拍。', count: 7, pills: ['三幕剧', '救猫咪', '英雄之旅', '起承转合', '五幕剧'], red: true },
  { icon: 'Ⅵ', name: '场景模板', nameEn: 'Scene Templates', desc: '开场钩子 / 触发事件 / 中点反转 / 至暗时刻 / 高潮对决 / 收尾余韵 …… 8 种场戏类型。', count: 8, pills: ['钩子', '中点', '至暗', '高潮', '收尾'] },
];

// ---------- Hero 文本动画 ----------
function typewriter(elTarget, text, speed = 30) {
  elTarget.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    if (i < text.length) {
      elTarget.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(t);
    }
  }, speed);
}

// ---------- 渲染：首页 ----------
function renderHome() {
  const stats = getStats();
  const main = $('#main');
  main.innerHTML = '';

  // HERO
  const hero = el('section', { class: 'section' });
  const heroInner = el('div', { class: 'hero' });
  heroInner.appendChild(el('div', { class: 'hero__eyebrow' }, ['— SCREENPLAY FACTORY · 全球剧本智造 —']));
  const heroTitle = el('h1', { class: 'hero__title' });
  heroTitle.innerHTML = `<span class="underline">剧本工厂</span><br/><span style="font-style:normal;font-size:0.5em;letter-spacing:0.4em;color:var(--ink-2)">SCRIPT  ·  FORGE</span>`;
  heroInner.appendChild(heroTitle);

  const sub = el('div', { class: 'hero__sub' });
  sub.innerHTML = `基于<span class="red"> 6 大原子池 · 200+ 主题 · 60+ 题材 · 7 种幕结构 </span>，将灵感工业化。` +
    `<br/>每份剧本由 <span class="gold">题材 ⊗ 时代 ⊗ 视角 ⊗ 基调 ⊗ 幕结构 ⊗ 角色 ⊗ 主题 ⊗ 转折</span> 自由组合生成。` +
    `<br/>总计 <span class="red">${stats.total.toLocaleString()}</span> 份结构化剧本，每份均含完整幕 / 场 / 角色 / 对话。`;
  heroInner.appendChild(sub);

  const byline = el('div', { class: 'hero__byline' });
  byline.appendChild(el('span', {}, ['v 1.0']));
  byline.appendChild(el('span', { class: 'dot' }, ['·']));
  byline.appendChild(el('span', {}, ['静态生成']));
  byline.appendChild(el('span', { class: 'dot' }, ['·']));
  byline.appendChild(el('span', {}, ['种子 20260608']));
  byline.appendChild(el('span', { class: 'dot' }, ['·']));
  byline.appendChild(el('span', {}, ['可导出 MD / JSON / TXT']));
  heroInner.appendChild(byline);

  const stamp = el('div', { class: 'hero__stamp' }, ['印 · 剧 · 之 · 章']);
  heroInner.appendChild(stamp);

  hero.appendChild(heroInner);
  main.appendChild(hero);

  // 打字机效果
  setTimeout(() => {
    const elT = sub;
    const orig = elT.innerHTML;
    elT.style.opacity = '1';
    elT.dataset.orig = orig;
  }, 100);

  // STATS
  const statsPanel = el('section', { class: 'section' });
  const cards = [
    { num: stats.total.toLocaleString(), label: '剧本总量', accent: 'red' },
    { num: stats.genresCt, label: '题材', accent: 'gold' },
    { num: stats.erasCt, label: '时代', accent: '' },
    { num: stats.typesCt, label: '类型', accent: 'red' },
    { num: stats.tonesCt, label: '基调', accent: '' },
    { num: stats.structuresCt, label: '幕结构', accent: 'gold' },
    { num: stats.avgWords.toLocaleString(), label: '均字数', accent: '' },
    { num: stats.maxWords.toLocaleString(), label: '最高字数', accent: 'red' },
  ];
  const statWrap = el('div', { class: 'stats' });
  for (const c of cards) {
    const card = el('div', { class: 'stat-card' });
    card.innerHTML = `<div class="stat-card__num">${c.accent === 'red' ? `<span class="red">${c.num}</span>` : c.accent === 'gold' ? `<span class="gold">${c.num}</span>` : c.num}</div><div class="stat-card__label">${c.label}</div>`;
    statWrap.appendChild(card);
  }
  statsPanel.appendChild(statWrap);
  main.appendChild(statsPanel);

  // 模板展示
  const tplSection = el('section', { class: 'section' });
  const tplHead = el('div', { class: 'section__head' });
  tplHead.innerHTML = `<span class="num">§ 01</span><h2>全局模板 · 6 大原子池</h2><span class="deco"></span><span class="meta">GLOBAL TEMPLATE</span>`;
  tplSection.appendChild(tplHead);
  const tplGrid = el('div', { class: 'template-grid' });
  for (const m of TEMPLATE_MODULES) {
    const card = el('div', { class: 'tpl-card' });
    card.innerHTML = `
      <div class="tpl-card__icon">${m.icon}</div>
      <div class="tpl-card__name">${m.name}</div>
      <div class="tpl-card__name-en">${m.nameEn} · ${m.count} units</div>
      <div class="tpl-card__desc">${m.desc}</div>
      <div class="tpl-card__pills">
        ${m.pills.map(p => `<span class="${m.red ? 'red' : ''}">${p}</span>`).join('')}
      </div>
    `;
    tplGrid.appendChild(card);
  }
  tplSection.appendChild(tplGrid);
  main.appendChild(tplSection);

  // 生成器
  const genSection = el('section', { class: 'section' });
  genSection.appendChild(renderGenerator());
  main.appendChild(genSection);

  // 近期生成
  const recentSection = el('section', { class: 'section' });
  const recentHead = el('div', { class: 'section__head' });
  recentHead.innerHTML = `<span class="num">§ 02</span><h2>近期生成 · LATEST SCRIPTS</h2><span class="deco"></span><span class="meta">点击卡片查看完整剧本</span>`;
  recentSection.appendChild(recentHead);
  const recentGrid = el('div', { class: 'recent-grid' });
  const recent = scripts.slice().sort((a, b) => b.id - a.id).slice(0, 12);
  for (const s of recent) {
    const card = el('div', { class: 'recent-card', dataset: { id: s.id } });
    card.innerHTML = `
      <div class="recent-card__type">${s.type} · ${s.structure}</div>
      <div class="recent-card__title">${s.title}</div>
      <div class="recent-card__logline">${s.logline}</div>
      <div class="recent-card__meta">
        <span>${s.genre}</span>
        <span>${s.era}</span>
        <span>${s.tone}</span>
        <span>${s.wordCount}字</span>
      </div>
    `;
    card.addEventListener('click', () => openDrawer(s.id));
    recentGrid.appendChild(card);
  }
  recentSection.appendChild(recentGrid);
  main.appendChild(recentSection);
}

// ---------- 生成器 ----------
const genState = {
  types: new Set(),
  genre: new Set(),
  era: new Set(),
  perspective: new Set(),
  tone: new Set(),
  structure: new Set(),
  count: 8,
};

const GEN_TYPE_OPTIONS = ['动画', '游戏', '影视', '广播剧', '漫画脚本', '小说大纲', '短剧', '剧本杀'];
const GEN_STRUCTURE_OPTIONS = Object.keys({
  '三幕剧': 1, '四幕剧': 1, '五幕剧': 1, '救猫咪 15 拍': 1, '英雄之旅 12 段': 1, '起承转合': 1, '节拍表 8 拍': 1,
});

function renderGenerator() {
  const gen = el('div', { class: 'generator' });

  // row 1: 类型
  gen.appendChild(renderGenRow('类型 · TYPE', GEN_TYPE_OPTIONS, genState.types));
  // row 2: 题材
  gen.appendChild(renderGenRow('题材 · GENRE', Array.from(new Set(scripts.map(s => s.genre))).sort((a, b) => a.localeCompare(b, 'zh')), genState.genre, 12));
  // row 3: 时代
  gen.appendChild(renderGenRow('时代 · ERA', Array.from(new Set(scripts.map(s => s.era))).sort((a, b) => a.localeCompare(b, 'zh')), genState.era, 8));
  // row 4: 视角
  gen.appendChild(renderGenRow('视角 · POV', Array.from(new Set(scripts.map(s => s.perspective))), genState.perspective));
  // row 5: 基调
  gen.appendChild(renderGenRow('基调 · TONE', Array.from(new Set(scripts.map(s => s.tone))).sort((a, b) => a.localeCompare(b, 'zh')), genState.tone, 10));
  // row 6: 幕结构
  gen.appendChild(renderGenRow('幕结构 · STRUCTURE', GEN_STRUCTURE_OPTIONS, genState.structure));

  // footer
  const footer = el('div', { class: 'gen-footer' });
  const countWrap = el('div', { class: 'gen-footer__count' });
  countWrap.appendChild(el('span', {}, ['数量 · COUNT']));
  const minus = el('button', {}, ['−']);
  const num = el('span', { class: 'num' }, [String(genState.count)]);
  const plus = el('button', {}, ['+']);
  minus.addEventListener('click', () => { genState.count = Math.max(1, genState.count - 1); num.textContent = genState.count; });
  plus.addEventListener('click', () => { genState.count = Math.min(50, genState.count + 1); num.textContent = genState.count; });
  countWrap.appendChild(minus);
  countWrap.appendChild(num);
  countWrap.appendChild(plus);
  footer.appendChild(countWrap);

  const actions = el('div', { style: { display: 'flex', gap: '8px' } });
  const clear = el('button', { class: 'btn btn--ghost', style: { color: 'var(--paper)', borderColor: 'var(--paper)' } }, ['清空选择']);
  clear.addEventListener('click', () => {
    genState.types.clear(); genState.genre.clear(); genState.era.clear(); genState.perspective.clear(); genState.tone.clear(); genState.structure.clear();
    renderView();
  });
  const run = el('button', { class: 'btn btn--gold' }, ['▶  立即生成']);
  run.addEventListener('click', () => generateScripts());
  actions.appendChild(clear);
  actions.appendChild(run);
  footer.appendChild(actions);

  gen.appendChild(footer);
  return gen;
}

function renderGenRow(label, options, set, max = 999) {
  const row = el('div', { class: 'gen-row' });
  row.appendChild(el('div', { class: 'gen-row__label' }, [label]));
  const body = el('div', { class: 'gen-row__body' });
  const shown = options.slice(0, max);
  for (const opt of shown) {
    const c = el('button', { class: 'chip' + (set.has(opt) ? ' active' : '') }, [opt]);
    c.addEventListener('click', () => {
      if (set.has(opt)) set.delete(opt); else set.add(opt);
      c.classList.toggle('active');
    });
    body.appendChild(c);
  }
  if (options.length > max) {
    const more = el('span', { class: 'chip', style: { cursor: 'default', opacity: '0.5' } }, [`+${options.length - max} 更多`]);
    body.appendChild(more);
  }
  row.appendChild(body);
  return row;
}

// ---------- 生成 ----------
function generateScripts() {
  if (typeof window.ScriptForge_makeScript !== 'function') {
    // 数据生成器是 Node 端，这里提供前端增量实现
    return generateScriptsFrontend();
  }
  const newOnes = [];
  for (let i = 0; i < genState.count; i++) {
    const opts = {};
    if (genState.types.size) opts.type = { name: pickFromSet(genState.types) };
    if (genState.genre.size) opts.genre = { name: pickFromSet(genState.genre), en: '', templates: { logline: ['{role}的{story}，{twist}。'] } };
    if (genState.era.size) opts.era = { name: pickFromSet(genState.era), place: ['未知之地'] };
    if (genState.perspective.size) opts.perspective = { name: pickFromSet(genState.perspective), desc: '' };
    if (genState.tone.size) opts.tone = { name: pickFromSet(genState.tone), desc: '' };
    if (genState.structure) opts.structure = pickFromSet(genState.structure) || undefined;
    try {
      newOnes.push(window.ScriptForge_makeScript(scripts.length + i + 1, opts));
    } catch (e) {
      return generateScriptsFrontend();
    }
  }
  appendScripts(newOnes);
}

function pickFromSet(set) {
  const arr = Array.from(set);
  return arr[Math.floor(Math.random() * arr.length)];
}

// 前端简易版生成（不依赖 Node 端）
function generateScriptsFrontend() {
  const CN_SURN = '李王张刘陈杨黄赵吴周徐孙马朱胡林何高罗郑梁谢宋唐韩曹许邓萧冯'.split('');
  const CN_GIVN = '子轩浩然梓萱欣怡俊豪雨桐晓彤志强美玲建国一鸣一凡逸尘清欢知行予安'.split('');
  const EN_SURN = ['Hawthorne', 'Wynter', 'Ashford', 'Blackwood', 'Crowley', 'Drake', 'Eames', 'Falconer', 'Graves', 'Sinclair', 'Thorne'];
  const EN_GIVN = ['Eliot', 'Mira', 'Caleb', 'Iris', 'Theo', 'Wren', 'Silas', 'Juno', 'Felix', 'Maeve', 'Orion', 'Sage'];
  const ARCH = [
    { name: '英雄', role: 'protagonist', traits: ['坚毅', '正直', '理想主义'], motivation: '守护所爱之人', arc: '从冲动走向成熟' },
    { name: '反英雄', role: 'protagonist', traits: ['玩世不恭', '冷幽默'], motivation: '赎过去的债', arc: '在利他中重获价值' },
    { name: '导师', role: 'mentor', traits: ['智慧', '神秘'], motivation: '传递未尽之志', arc: '在离别中成全' },
    { name: '阴影', role: 'antagonist', traits: ['黑暗', '执念'], motivation: '证明宿命的合理', arc: '在自我矛盾中溃败' },
    { name: '爱人', role: 'love_interest', traits: ['独立', '聪慧'], motivation: '寻找灵魂共鸣', arc: '从试探到交付' },
    { name: '盟友', role: 'ally', traits: ['可靠', '温和'], motivation: '成为主角的支柱', arc: '在危难中自我觉醒' },
    { name: '骗子', role: 'trickster', traits: ['狡黠', '幽默'], motivation: '在混乱中获利', arc: '在真诚面前失去伪装' },
  ];
  const TONES = ['黑暗', '冷峻', '温暖', '明亮', '幽默', '讽刺', '史诗', '抒情', '紧张', '小清新', '浪漫', '克制'];
  const ERAS = ['上古神话', '秦汉', '三国', '魏晋南北朝', '隋唐五代', '宋元明清', '民国', '近现代', '当代', '近未来', '远未来', '末日废土'];
  const TYPES = ['动画', '游戏', '影视', '广播剧', '漫画脚本', '小说大纲', '短剧', '剧本杀'];
  const PERSP = ['第一人称', '第三人称限制', '第三人称全知', '多线 POV', '群像 POV'];
  const GENRES_ALL = Array.from(new Set(scripts.map(s => s.genre)));
  const TITLES = ['灯塔', '回声', '信', '星图', '密令', '影子', '挽歌', '风铃', '雨季', '玻璃', '密钥', '罗盘', '裂缝', '钟声', '旧屋', '黑匣子', '灰烬', '信号', '海图', '日历', '画像', '雪原', '潮汐', '长街', '站台', '花房', '钟楼', '碎片', '盲盒', '回廊', '霓虹', '剪影', '墓志铭', '白噪声', '旧照', '邮箱', '钢琴', '冷月', '碎镜'];
  const SUBJ = ['最后的', '无人知晓的', '北方的', '第三种', '缓慢的', '失重的', '被遗忘的', '微小的', '永恒的', '黑夜的', '古老的', '从前的', '虚构的', '寂静的', '明日的', '第七日', '漫长的', '深海的'];
  const SUFFIX = ['之下', '之后', '之间', '之外', '之境', '之约', '之歌', '手记', '备忘录', '残卷', '补遗', '断章', '札记', '答问', '后日谈', '前夜'];
  const STRUCTURES = ['三幕剧', '四幕剧', '五幕剧', '救猫咪 15 拍', '英雄之旅 12 段', '起承转合', '节拍表 8 拍'];
  const STRUCTURE_ACT = {
    '三幕剧': ['第一幕 · 建置', '第二幕 · 对抗', '第三幕 · 结局'],
    '四幕剧': ['第一幕 · 建置', '第二幕 · 上升', '第三幕 · 高潮', '第四幕 · 收尾'],
    '五幕剧': ['第一幕 · 建置', '第二幕 · 上升', '第三幕 · 高潮', '第四幕 · 下降', '第五幕 · 新秩序'],
    '救猫咪 15 拍': ['第一幕', '副线与乐趣', '反派逼近', '终局'],
    '英雄之旅 12 段': ['启程', '试炼', '归来'],
    '起承转合': ['起', '承', '转', '合'],
    '节拍表 8 拍': ['上半场', '下半场'],
  };
  const LOCATIONS = ['咖啡馆', '深夜的车厢', '医院走廊', '废弃工厂', '海边悬崖', '老宅', '地铁站', '校园天台', '北方山道', '雨夜的桥', '录音棚', '旧书店', '码头的灯塔', '办公室的茶水间', '手术室', '法庭', '小酒馆', '北方山间', '南方海岸', '天桥', '旋转餐厅', '写字楼大堂', '街角的便利店', '森林小屋', '沙漠客栈'];
  const TIMES = ['夜', '清晨', '黄昏', '深夜', '凌晨', '午后', '黎明前'];
  const HOOKS = [
    '一封迟到的信抵达。', '一位陌生人找上门。', '一场突如其来的断电。',
    '一段未完成的旋律在耳边响起。', '一则讣告。', '一次重逢。',
    '一份遗嘱。', '一道血字。', '一个孩子的哭声。',
  ];
  const ACTIONS = [
    '霓虹将街道染成紫色，{role}独自站在{place}的边缘，{event}。',
    '空气中弥漫着湿气，{role}推门而入，{event}。',
    '铃声在巷尾回响，{role}与{other}的对峙已经开始。',
    '白噪音成为背景，{role}无法分辨现实与记忆。',
    '电磁嗡鸣穿透墙壁，{role}听见来自过去的声音。',
  ];
  const ROLES = ['前工程师', '辞职检察官', '失语作曲家', '退役宇航员', '通缉黑客', '落魄剧作家', '被除名的医生', '失去女儿的父亲', '没有执照的侦探', '盲眼钢琴师', '被遗忘的画家'];
  const DIALOGUES = [
    { l: '你以为你可以永远逃开吗？', p: '(低声)' },
    { l: '没有人可以永远逃开。' },
    { l: '那如果我不再想逃呢？', p: '(转身)' },
    { l: '——你想回到哪里？' },
    { l: '我想回到她还在的时候。', p: '(沉默良久)' },
    { l: '……我也想。' },
    { l: '你不欠我任何东西。' },
    { l: '我欠的，从不是东西。', p: '(看着窗外)' },
    { l: '系统显示节点正在衰减。' },
    { l: '还剩多少？' },
    { l: '按这个速率，十七分钟。' },
    { l: '我断后。' },
    { l: '……你每次都这样说。' },
    { l: '因为每次都是真的。' },
  ];
  const TRANS = ['CUT TO:', 'FADE IN:', 'SMASH CUT TO:', 'DISSOLVE TO:', 'INTERCUT WITH:', 'FADE OUT.', 'THE END.'];

  const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pickN = (arr, n) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };
  const fmt = (s, vars) => {
    vars = vars || {};
    return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] || '___');
  };
  const makeName = () => Math.random() < 0.4
    ? `${r(EN_SURN)} ${r(EN_GIVN)}`
    : `${r(CN_SURN)}${r(CN_GIVN)}`;

  const newOnes = [];
  const baseId = scripts.length;
  for (let i = 0; i < genState.count; i++) {
    const id = baseId + i + 1;
    const type = genState.types.size ? r(Array.from(genState.types)) : r(TYPES);
    const genre = genState.genre.size ? r(Array.from(genState.genre)) : r(GENRES_ALL);
    const era = genState.era.size ? r(Array.from(genState.era)) : r(ERAS);
    const perspective = genState.perspective.size ? r(Array.from(genState.perspective)) : r(PERSP);
    const tone = genState.tone.size ? r(Array.from(genState.tone)) : r(TONES);
    const structure = genState.structure.size ? r(Array.from(genState.structure)) : r(STRUCTURES);

    const title = Math.random() < 0.5 ? `${r(SUBJ)}${r(TITLES)}` : `${r(TITLES)}${r(SUFFIX)}`;
    const charCount = ri(3, 6);
    const characters = pickN(ARCH, charCount).map(a => ({
      name: makeName(),
      role: a.role,
      archetype: a.name,
      traits: pickN(a.traits, ri(1, 2)),
      motivation: a.motivation,
      arc: a.arc,
    }));
    const logline = `一位${r(ROLES)}，在${era}的背景下，因一次${r(HOOKS)}而走向无法回头的选择。`;
    const setting = `${era}的某处，空气中弥漫着故事的气息。一位${r(ROLES)}的日常被打破，${r(HOOKS)}之后，命运的分叉已经到来。`;
    const themes = pickN(['救赎', '复仇', '成长', '牺牲', '身份认同', '自由与枷锁', '爱与失去', '权力腐败', '记忆', '孤独与连接', '选择', '宽恕', '家庭', '时间', '正义'], ri(3, 5));

    const actsTpl = STRUCTURE_ACT[structure];
    const acts = actsTpl.map((at, idx) => ({
      number: idx + 1,
      title: at,
      scenes: (() => {
        const num = ri(2, 3);
        const scs = [];
        for (let j = 0; j < num; j++) {
          const loc = r(LOCATIONS);
          const tm = r(TIMES);
          const action = fmt(r(ACTIONS), { role: r(ROLES), place: loc, event: r(HOOKS), other: r(ROLES) });
          const dCount = ri(2, 4);
          const dialogue = [];
          for (let k = 0; k < dCount; k++) {
            const d = r(DIALOGUES);
            dialogue.push({ character: r(characters).name, line: d.l, parenthetical: d.p });
          }
          scs.push({
            number: 0,
            heading: `INT. ${loc.toUpperCase()} - ${tm.toUpperCase()}`,
            location: loc,
            time: tm,
            action,
            dialogue,
            transition: r(TRANS),
          });
        }
        let n = 1;
        for (const s of scs) s.number = n++;
        return scs;
      })(),
    }));

    const wordCount = logline.length + setting.length + acts.reduce((a, b) => a + b.scenes.reduce((c, d) => c + d.action.length + d.dialogue.reduce((e, f) => e + f.line.length + 8, 0), 0), 0);

    newOnes.push({
      id,
      title,
      type,
      typeEn: '',
      genre,
      genreEn: '',
      era,
      perspective,
      perspectiveDesc: '',
      tone,
      toneDesc: '',
      structure,
      actCount: acts.length,
      logline,
      setting,
      characters,
      themes,
      acts,
      wordCount,
      tags: [genre, type, era, tone, structure, ...themes.slice(0, 2)],
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }
  appendScripts(newOnes);
}

function appendScripts(arr) {
  if (!arr.length) {
    toast('请至少选择一个生成条件');
    return;
  }
  scripts = scripts.concat(arr);
  state.page = 1;
  toast(`已生成 ${arr.length} 份剧本`);
  setTimeout(() => navigate('library'), 400);
}

// ---------- 资料库 ----------
function renderLibrary() {
  const main = $('#main');
  main.innerHTML = '';

  // 工具栏
  const toolbar = el('div', { class: 'toolbar' });
  const search = el('div', { class: 'toolbar__search' });
  const searchIcon = el('span', { class: 'icon' }, ['⌕']);
  const searchInput = el('input', { type: 'search', placeholder: '搜索标题 / 角色 / 主题 / logline', value: state.search });
  const clearSearch = el('button', { class: 'btn btn--sm btn--ghost', style: { padding: '2px 8px' } }, ['×']);
  clearSearch.addEventListener('click', () => { state.search = ''; searchInput.value = ''; renderView(); });
  searchInput.addEventListener('input', debounce(() => { state.search = searchInput.value; state.page = 1; renderView(); }, 220));
  search.appendChild(searchIcon);
  search.appendChild(searchInput);
  search.appendChild(clearSearch);
  toolbar.appendChild(search);

  // 排序
  const sort = el('div', { class: 'toolbar__sort' });
  sort.appendChild(el('span', {}, ['排序 · SORT']));
  const sel = el('select');
  const sorts = [
    ['id-desc', 'ID ↓ (最新)'],
    ['id-asc', 'ID ↑ (最早)'],
    ['title-asc', '标题 A→Z'],
    ['title-desc', '标题 Z→A'],
    ['wordCount-desc', '字数 ↓'],
    ['wordCount-asc', '字数 ↑'],
    ['createdAt-desc', '生成日期 ↓'],
  ];
  for (const [v, t] of sorts) {
    const o = el('option', { value: v }, [t]);
    if (state.sort === v) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => { state.sort = sel.value; renderView(); });
  sort.appendChild(sel);
  toolbar.appendChild(sort);

  // 视图切换
  const views = el('div', { class: 'toolbar__views' });
  for (const [k, t] of [['grid', '网格'], ['list', '列表'], ['script', '剧本']]) {
    const b = el('button', { class: state.viewMode === k ? 'active' : '' }, [t]);
    b.addEventListener('click', () => { state.viewMode = k; renderView(); });
    views.appendChild(b);
  }
  toolbar.appendChild(views);

  // 信息
  const filtered = getFiltered();
  const info = el('div', { class: 'toolbar__info' });
  info.textContent = `共 ${filtered.length} / ${scripts.length} 份`;
  toolbar.appendChild(info);

  main.appendChild(toolbar);

  // 主体
  const wrap = el('div', { class: 'library' });
  wrap.appendChild(renderFilterPane());
  const content = el('div', { class: 'library__main' });
  if (!filtered.length) {
    const empty = el('div', { class: 'empty' });
    empty.innerHTML = `无匹配剧本<br/><span class="deco">NO MATCHING SCRIPT</span>`;
    content.appendChild(empty);
  } else if (state.viewMode === 'grid') {
    content.appendChild(renderGrid(filtered));
  } else if (state.viewMode === 'list') {
    content.appendChild(renderList(filtered));
  } else {
    content.appendChild(renderScriptView(filtered));
  }
  content.appendChild(renderPager(filtered));
  wrap.appendChild(content);
  main.appendChild(wrap);
}

function renderFilterPane() {
  const pane = el('aside', { class: 'filterpane' });
  pane.appendChild(el('h3', {}, ['筛选 · FILTERS']));

  // 类型
  pane.appendChild(renderFilterGroup('类型', 'type', Array.from(new Set(scripts.map(s => s.type))).sort()));
  pane.appendChild(renderFilterGroup('题材', 'genre', Array.from(new Set(scripts.map(s => s.genre))).sort((a, b) => a.localeCompare(b, 'zh')), 18));
  pane.appendChild(renderFilterGroup('时代', 'era', Array.from(new Set(scripts.map(s => s.era))).sort((a, b) => a.localeCompare(b, 'zh')), 18));
  pane.appendChild(renderFilterGroup('视角', 'perspective', Array.from(new Set(scripts.map(s => s.perspective)))));
  pane.appendChild(renderFilterGroup('基调', 'tone', Array.from(new Set(scripts.map(s => s.tone))).sort((a, b) => a.localeCompare(b, 'zh')), 16));

  const clear = el('button', { class: 'filterpane__clear' }, ['清空全部筛选']);
  clear.addEventListener('click', () => {
    state.filters.type.clear();
    state.filters.genre.clear();
    state.filters.era.clear();
    state.filters.perspective.clear();
    state.filters.tone.clear();
    state.page = 1;
    renderView();
  });
  pane.appendChild(clear);
  return pane;
}

function renderFilterGroup(title, key, options, max = 999) {
  const g = el('div', { class: 'filter-group' });
  g.appendChild(el('div', { class: 'filter-group__title' }, [title + ' · ' + options.length]));
  const items = el('div', { class: 'filter-group__items' });
  const shown = options.slice(0, max);
  for (const opt of shown) {
    const ct = scripts.filter(s => s[key] === opt).length;
    const isActive = state.filters[key].has(opt);
    const p = el('button', { class: 'filter-pill' + (isActive ? ' active' : '') }, [`${opt}`, el('span', { class: 'ct' }, [`${ct}`])]);
    p.addEventListener('click', () => {
      if (state.filters[key].has(opt)) state.filters[key].delete(opt);
      else state.filters[key].add(opt);
      state.page = 1;
      renderView();
    });
    items.appendChild(p);
  }
  if (options.length > max) {
    const more = el('span', { class: 'filter-pill', style: { cursor: 'default', opacity: '0.5' } }, [`+${options.length - max}`]);
    items.appendChild(more);
  }
  g.appendChild(items);
  return g;
}

function renderGrid(filtered) {
  const sorted = getSorted(filtered);
  const page = getPage(sorted);
  const grid = el('div', { class: 'cards-grid' });
  for (const s of page) {
    const card = el('div', { class: 'work-card', dataset: { id: s.id } });
    card.innerHTML = `
      <div class="work-card__no">№ ${pad(s.id)}</div>
      <div class="work-card__type">${s.type} · ${s.structure}</div>
      <div class="work-card__title">${s.title}</div>
      <div class="work-card__logline">${s.logline}</div>
      <div class="work-card__meta">
        <span class="red">${s.genre}</span>
        <span>${s.era}</span>
        <span>${s.tone}</span>
        <span class="gold">${s.wordCount}字</span>
      </div>
    `;
    card.addEventListener('click', () => openDrawer(s.id));
    grid.appendChild(card);
  }
  return grid;
}

function renderList(filtered) {
  const sorted = getSorted(filtered);
  const page = getPage(sorted);
  const list = el('div', { class: 'work-list' });
  for (const s of page) {
    const row = el('div', { class: 'work-row', dataset: { id: s.id } });
    row.innerHTML = `
      <div class="work-row__no">№ ${pad(s.id)}</div>
      <div>
        <div class="work-row__title">${s.title}</div>
        <div class="work-row__logline">${s.logline}</div>
      </div>
      <div class="work-row__cell red">${s.genre}</div>
      <div class="work-row__cell">${s.era}</div>
      <div class="work-row__cell gold">${s.wordCount}</div>
      <div class="work-row__cell">${s.type}</div>
    `;
    row.addEventListener('click', () => openDrawer(s.id));
    list.appendChild(row);
  }
  return list;
}

function renderScriptView(filtered) {
  const sorted = getSorted(filtered);
  const page = getPage(sorted);
  const view = el('div', { class: 'script-view' });
  for (const s of page) {
    const paper = el('div', { class: 'script-paper', dataset: { id: s.id } });
    const inner = el('div', {});
    inner.appendChild(el('div', { class: 'script-paper__head' }, [s.title]));
    inner.appendChild(el('div', { class: 'script-paper__logline' }, [s.logline]));
    inner.appendChild(el('div', { class: 'script-paper__meta' }, [`${s.type} · ${s.genre} · ${s.era} · ${s.perspective} · ${s.tone} · ${s.structure} · ${s.wordCount}字 · №${pad(s.id)}`]));
    for (const a of s.acts) {
      inner.appendChild(el('div', { class: 'script-paper__act' }, [a.title]));
      for (const sc of a.scenes) {
        const sBlk = el('div', { class: 'script-paper__scene' });
        sBlk.appendChild(el('div', { class: 'script-paper__heading' }, [`场 ${sc.number} — ${sc.heading}`]));
        sBlk.appendChild(el('div', { class: 'script-paper__action' }, [sc.action]));
        for (const d of sc.dialogue) {
          const dl = el('div', { class: 'script-paper__dialogue' });
          if (d.parenthetical) dl.appendChild(el('span', { style: { fontSize: '11px', color: 'var(--ink-light)' } }, [d.parenthetical]));
          dl.appendChild(el('span', { class: 'script-paper__char' }, [d.character.toUpperCase()]));
          dl.appendChild(el('div', { class: 'script-paper__line' }, [d.line]));
          sBlk.appendChild(dl);
        }
        if (sc.transition) sBlk.appendChild(el('div', { class: 'script-paper__trans' }, [sc.transition]));
        inner.appendChild(sBlk);
      }
    }
    paper.appendChild(inner);
    paper.addEventListener('click', () => openDrawer(s.id));
    view.appendChild(paper);
  }
  return view;
}

function renderPager(filtered) {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;
  const pager = el('div', { class: 'pager' });
  const prev = el('button', {}, ['‹']);
  prev.disabled = state.page === 1;
  prev.addEventListener('click', () => { state.page = Math.max(1, state.page - 1); renderView(); });
  pager.appendChild(prev);

  // 简易页码
  const maxBtns = 7;
  let start = Math.max(1, state.page - 3);
  let end = Math.min(totalPages, start + maxBtns - 1);
  start = Math.max(1, end - maxBtns + 1);
  for (let i = start; i <= end; i++) {
    const b = el('button', { class: i === state.page ? 'active' : '' }, [String(i)]);
    b.addEventListener('click', () => { state.page = i; renderView(); });
    pager.appendChild(b);
  }
  const next = el('button', {}, ['›']);
  next.disabled = state.page === totalPages;
  next.addEventListener('click', () => { state.page = Math.min(totalPages, state.page + 1); renderView(); });
  pager.appendChild(next);

  const info = el('span', { class: 'info' }, [`${state.page} / ${totalPages}  ·  每页 ${state.pageSize}`]);
  pager.appendChild(info);

  // 调整 pageSize
  const sizeSel = el('select', { style: { marginLeft: '12px' } });
  for (const n of [12, 24, 48, 96]) {
    const o = el('option', { value: n }, [`每页 ${n}`]);
    if (state.pageSize === n) o.selected = true;
    sizeSel.appendChild(o);
  }
  sizeSel.addEventListener('change', () => { state.pageSize = parseInt(sizeSel.value, 10); state.page = 1; renderView(); });
  pager.appendChild(sizeSel);

  return pager;
}

// ---------- 详情弹窗 ----------
function openDrawer(id) {
  const s = scripts.find(x => x.id === id);
  if (!s) return;
  state.selectedId = id;
  const sheet = $('#drawerSheet');
  sheet.innerHTML = '';

  const close = el('button', { class: 'drawer__close', 'aria-label': '关闭' }, ['×']);
  close.addEventListener('click', closeDrawer);
  sheet.appendChild(close);

  const d = el('div', { class: 'detail' });
  d.appendChild(el('div', { class: 'detail__eyebrow' }, [`№ ${pad(s.id)} · ${s.type} · ${s.structure}`]));
  d.appendChild(el('h2', { class: 'detail__title' }, [s.title]));
  d.appendChild(el('div', { class: 'detail__logline' }, [s.logline]));

  const meta = el('div', { class: 'detail__meta' });
  for (const [k, v] of [['题材', s.genre], ['时代', s.era], ['视角', s.perspective], ['基调', s.tone]]) {
    meta.appendChild(el('div', {}, [k, el('strong', {}, [v])]));
  }
  meta.appendChild(el('div', {}, ['结构', el('strong', {}, [s.structure])]));
  meta.appendChild(el('div', {}, ['幕 / 场', el('strong', {}, [`${s.actCount} 幕 / ${s.acts.reduce((a, b) => a + b.scenes.length, 0)} 场`])]));
  meta.appendChild(el('div', {}, ['字数', el('strong', {}, [s.wordCount.toLocaleString() + ' 字'])]));
  meta.appendChild(el('div', {}, ['生成', el('strong', {}, [s.createdAt || '—'])]));
  d.appendChild(meta);

  // setting
  const setting = el('div', { class: 'detail__setting' }, [s.setting]);
  d.appendChild(setting);

  // themes
  const themes = el('div', { class: 'detail__themes' });
  for (const t of s.themes) themes.appendChild(el('span', { class: 'theme-tag' }, [t]));
  d.appendChild(themes);

  // characters
  const chars = el('div', { class: 'detail__chars' });
  for (const c of s.characters) {
    const card = el('div', { class: 'char-card' });
    card.innerHTML = `
      <div class="char-card__name">${c.name}</div>
      <div class="char-card__arch">${c.archetype} · ${c.role}</div>
      <div class="char-card__traits">${(c.traits || []).join(' · ')}</div>
      <div class="char-card__motivation">动机：${c.motivation}</div>
      <div class="char-card__arc">弧线：${c.arc}</div>
    `;
    chars.appendChild(card);
  }
  d.appendChild(chars);

  // body
  const body = el('div', { class: 'detail__body' });
  body.appendChild(el('h3', {}, ['完整剧本 · FULL SCRIPT']));
  for (const a of s.acts) {
    const ab = el('div', { class: 'act-block' });
    ab.appendChild(el('div', { class: 'act-block__title' }, [a.title]));
    for (const sc of a.scenes) {
      const sBlk = el('div', { class: 'scene-block' });
      sBlk.appendChild(el('div', { class: 'scene-block__heading' }, [`场 ${sc.number} — ${sc.heading}`]));
      sBlk.appendChild(el('div', { class: 'scene-block__action' }, [sc.action]));
      for (const dl of sc.dialogue) {
        const dEl = el('div', { class: 'dialogue-line' });
        if (dl.parenthetical) dEl.appendChild(el('span', { class: 'parenthetical' }, [dl.parenthetical]));
        dEl.appendChild(el('span', { class: 'name' }, [dl.character.toUpperCase()]));
        dEl.appendChild(el('span', { class: 'line' }, [dl.line]));
        sBlk.appendChild(dEl);
      }
      if (sc.transition) sBlk.appendChild(el('div', { class: 'scene-block__transition' }, [sc.transition]));
      ab.appendChild(sBlk);
    }
    body.appendChild(ab);
  }
  d.appendChild(body);

  // actions
  const actions = el('div', { class: 'detail__actions' });
  const expMd = el('button', { class: 'btn btn--ghost btn--sm' }, ['↓ 导出 Markdown']);
  expMd.addEventListener('click', () => exportScript(s, 'md'));
  const expJson = el('button', { class: 'btn btn--ghost btn--sm' }, ['↓ 导出 JSON']);
  expJson.addEventListener('click', () => exportScript(s, 'json'));
  const expTxt = el('button', { class: 'btn btn--ghost btn--sm' }, ['↓ 导出 TXT']);
  expTxt.addEventListener('click', () => exportScript(s, 'txt'));
  const cpJson = el('button', { class: 'btn btn--ghost btn--sm' }, ['📋 复制 JSON']);
  cpJson.addEventListener('click', () => copy(JSON.stringify(s, null, 2)));
  const cpMd = el('button', { class: 'btn btn--ghost btn--sm' }, ['📋 复制 MD']);
  cpMd.addEventListener('click', () => copy(scriptToMarkdown(s)));
  const regen = el('button', { class: 'btn btn--sm btn--gold' }, ['↻ 同源再生成']);
  regen.addEventListener('click', () => regenerateSimilar(s));
  actions.appendChild(expMd);
  actions.appendChild(expJson);
  actions.appendChild(expTxt);
  actions.appendChild(cpJson);
  actions.appendChild(cpMd);
  actions.appendChild(regen);
  d.appendChild(actions);

  sheet.appendChild(d);
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  state.selectedId = null;
}

function regenerateSimilar(src) {
  // 沿用同题材 + 同类型，生成 1 份
  closeDrawer();
  genState.types = new Set([src.type]);
  genState.genre = new Set([src.genre]);
  genState.era = new Set([src.era]);
  genState.perspective = new Set([src.perspective]);
  genState.tone = new Set([src.tone]);
  genState.structure = new Set([src.structure]);
  genState.count = 1;
  generateScriptsFrontend();
}

// ---------- 导出 ----------
function scriptToMarkdown(s) {
  const lines = [];
  lines.push(`# ${s.title}`);
  lines.push('');
  lines.push(`> ${s.logline}`);
  lines.push('');
  lines.push(`**题材**：${s.genre}  ·  **类型**：${s.type}  ·  **时代**：${s.era}  ·  **视角**：${s.perspective}  ·  **基调**：${s.tone}  ·  **结构**：${s.structure}`);
  lines.push('');
  lines.push(`**主题**：${s.themes.join(' · ')}`);
  lines.push('');
  lines.push('## 设定');
  lines.push(s.setting);
  lines.push('');
  lines.push('## 角色');
  for (const c of s.characters) {
    lines.push(`- **${c.name}**（${c.archetype} · ${c.role}）：${(c.traits || []).join('、')} —— 动机：${c.motivation}；弧线：${c.arc}`);
  }
  lines.push('');
  for (const a of s.acts) {
    lines.push(`## ACT ${a.number}：${a.title}`);
    lines.push('');
    for (const sc of a.scenes) {
      lines.push(`### 场 ${sc.number} — ${sc.heading}`);
      lines.push('');
      lines.push(sc.action);
      lines.push('');
      for (const d of sc.dialogue) {
        if (d.parenthetical) lines.push(`*${d.parenthetical}*`);
        lines.push(`**${d.character.toUpperCase()}**`);
        lines.push(d.line);
        lines.push('');
      }
      if (sc.transition) lines.push(`> ${sc.transition}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}
function scriptToText(s) {
  const lines = [];
  lines.push(s.title.toUpperCase());
  lines.push('='.repeat(s.title.length * 2));
  lines.push('');
  lines.push(s.logline);
  lines.push('');
  lines.push(`[${s.type} · ${s.genre} · ${s.era} · ${s.perspective} · ${s.tone} · ${s.structure}]`);
  lines.push('');
  lines.push('--- 设定 ---');
  lines.push(s.setting);
  lines.push('');
  lines.push('--- 角色 ---');
  for (const c of s.characters) {
    lines.push(`· ${c.name} (${c.archetype}): ${(c.traits || []).join('、')}`);
    lines.push(`  动机: ${c.motivation}  弧线: ${c.arc}`);
  }
  lines.push('');
  for (const a of s.acts) {
    lines.push(`ACT ${a.number} - ${a.title}`);
    lines.push('-'.repeat(40));
    for (const sc of a.scenes) {
      lines.push(`[场${sc.number}] ${sc.heading}`);
      lines.push(sc.action);
      for (const d of sc.dialogue) {
        if (d.parenthetical) lines.push(`  ${d.parenthetical}`);
        lines.push(`  ${d.character.toUpperCase()}`);
        lines.push(`    ${d.line}`);
      }
      if (sc.transition) lines.push(`  ${sc.transition}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

function exportScript(s, fmt) {
  const name = `script_${pad(s.id)}_${s.title.replace(/[^\w\u4e00-\u9fa5]/g, '_').slice(0, 30)}`;
  if (fmt === 'md') download(name + '.md', scriptToMarkdown(s), 'text/markdown;charset=utf-8');
  else if (fmt === 'json') download(name + '.json', JSON.stringify(s, null, 2), 'application/json;charset=utf-8');
  else download(name + '.txt', scriptToText(s), 'text/plain;charset=utf-8');
  toast('已导出');
}

// ---------- 趋势 ----------
function renderTrends() {
  const main = $('#main');
  main.innerHTML = '';
  const head = el('div', { class: 'section__head' });
  head.innerHTML = `<span class="num">§ 03</span><h2>趋势 · TRENDS</h2><span class="deco"></span><span class="meta">基于 ${scripts.length} 份剧本的统计</span>`;
  main.appendChild(head);

  // 统计
  const stats = getStats();
  const grid = el('div', { class: 'stats' });
  for (const [k, v, c] of [
    [stats.total.toLocaleString(), '剧本', 'red'],
    [stats.genresCt, '题材', 'gold'],
    [stats.erasCt, '时代', ''],
    [stats.tonesCt, '基调', ''],
    [stats.structuresCt, '结构', 'gold'],
    [stats.avgWords.toLocaleString(), '均字数', ''],
    [stats.maxWords.toLocaleString(), '最高字数', 'red'],
    [stats.typesCt, '类型', ''],
  ]) {
    const card = el('div', { class: 'stat-card' });
    card.innerHTML = `<div class="stat-card__num">${c ? `<span class="${c}">${v}</span>` : v}</div><div class="stat-card__label">${k}</div>`;
    grid.appendChild(card);
  }
  main.appendChild(grid);

  const chartsGrid = el('div', { class: 'charts-grid' });
  chartsGrid.appendChild(makeChartCard('题材分布', 'GENRE DISTRIBUTION', 'genreChart'));
  chartsGrid.appendChild(makeChartCard('时代分布', 'ERA DISTRIBUTION', 'eraChart'));
  chartsGrid.appendChild(makeChartCard('基调分布', 'TONE DISTRIBUTION', 'toneChart'));
  chartsGrid.appendChild(makeChartCard('视角分布', 'PERSPECTIVE DISTRIBUTION', 'perspectiveChart'));
  chartsGrid.appendChild(makeChartCard('幕结构分布', 'STRUCTURE DISTRIBUTION', 'structureChart'));
  chartsGrid.appendChild(makeChartCard('类型分布', 'TYPE DISTRIBUTION', 'typeChart'));
  chartsGrid.appendChild(Object.assign(makeChartCard('字数分布直方图', 'WORD COUNT HISTOGRAM', 'wordChart', 320), { className: 'chart-card full' }));
  chartsGrid.appendChild(Object.assign(makeChartCard('生成时间线', 'CREATION TIMELINE', 'timeChart', 320), { className: 'chart-card full' }));
  main.appendChild(chartsGrid);

  // 画图
  drawDistribution('genreChart', scripts.reduce((a, b) => { a[b.genre] = (a[b.genre] || 0) + 1; return a; }, {}), 'horizontal');
  drawDistribution('eraChart', scripts.reduce((a, b) => { a[b.era] = (a[b.era] || 0) + 1; return a; }, {}), 'donut');
  drawDistribution('toneChart', scripts.reduce((a, b) => { a[b.tone] = (a[b.tone] || 0) + 1; return a; }, {}), 'horizontal');
  drawDistribution('perspectiveChart', scripts.reduce((a, b) => { a[b.perspective] = (a[b.perspective] || 0) + 1; return a; }, {}), 'donut');
  drawDistribution('structureChart', scripts.reduce((a, b) => { a[b.structure] = (a[b.structure] || 0) + 1; return a; }, {}), 'bars');
  drawDistribution('typeChart', scripts.reduce((a, b) => { a[b.type] = (a[b.type] || 0) + 1; return a; }, {}), 'donut');
  drawHistogram('wordChart', scripts.map(s => s.wordCount));
  drawTimeLine('timeChart', scripts);
}

function makeChartCard(title, sub, canvasId, h = 280) {
  const c = el('div', { class: 'chart-card' });
  c.innerHTML = `<h3>${title}</h3><div class="sub">${sub}</div><canvas id="${canvasId}" style="height:${h}px"></canvas>`;
  return c;
}

// ---------- 画图 ----------
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w: rect.width, h: rect.height };
}

const COLORS = ['#c1121f', '#bb8b00', '#1a3a5c', '#5a4a3a', '#8a5a2a', '#a02020', '#d4a82a', '#3a5a7c', '#8a7a6a', '#c1a060'];

function drawDistribution(canvasId, data, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (mode === 'horizontal') {
    const top = entries.slice(0, 12);
    const max = top[0][1];
    const rowH = (h - 30) / top.length;
    const labelW = 80;
    const barX = labelW + 10;
    const barW = w - barX - 50;
    ctx.font = '12px "Special Elite", monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < top.length; i++) {
      const [k, v] = top[i];
      const y = 20 + i * rowH + rowH / 2;
      ctx.fillStyle = '#0a0a0a';
      ctx.textAlign = 'right';
      ctx.fillText(k.slice(0, 8), labelW, y);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(barX, y - 7, barW * (v / max), 14);
      ctx.fillStyle = '#0a0a0a';
      ctx.textAlign = 'left';
      ctx.fillText(String(v), barX + barW * (v / max) + 6, y);
    }
  } else if (mode === 'donut') {
    const total = entries.reduce((a, b) => a + b[1], 0);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) / 2 - 30;
    const innerR = r * 0.55;
    let start = -Math.PI / 2;
    const top = entries.slice(0, 8);
    for (let i = 0; i < top.length; i++) {
      const [k, v] = top[i];
      const angle = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      // 中空
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      start += angle;
    }
    // 中心文字
    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 24px "Bodoni Moda", serif';
    ctx.textAlign = 'center';
    ctx.fillText(total.toLocaleString(), cx, cy);
    ctx.font = '11px "Special Elite", monospace';
    ctx.fillText('SCRIPTS', cx, cy + 18);
    // 图例
    ctx.font = '10px "Special Elite", monospace';
    ctx.textAlign = 'left';
    let ly = 12;
    for (let i = 0; i < Math.min(6, top.length); i++) {
      const [k, v] = top[i];
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(8, ly, 8, 8);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillText(`${k} (${v})`, 22, ly + 7);
      ly += 14;
    }
  } else if (mode === 'bars') {
    const top = entries.slice(0, 10);
    const max = top[0][1];
    const barW = (w - 40) / top.length - 8;
    for (let i = 0; i < top.length; i++) {
      const [k, v] = top[i];
      const x = 20 + i * (barW + 8);
      const bh = (h - 60) * (v / max);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(x, h - 30 - bh, barW, bh);
      ctx.fillStyle = '#0a0a0a';
      ctx.font = '10px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(v), x + barW / 2, h - 30 - bh - 6);
      ctx.save();
      ctx.translate(x + barW / 2, h - 18);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(k, 0, 0);
      ctx.restore();
    }
  }
}

function drawHistogram(canvasId, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);

  if (!values.length) return;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = 20;
  const step = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  for (const v of values) {
    const i = Math.min(bins - 1, Math.floor((v - min) / step));
    counts[i]++;
  }
  const maxCt = Math.max(...counts);
  const barW = (w - 40) / bins - 2;
  for (let i = 0; i < bins; i++) {
    const x = 20 + i * (barW + 2);
    const bh = (h - 50) * (counts[i] / maxCt);
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fillRect(x, h - 30 - bh, barW, bh);
  }
  // 轴
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '10px "Special Elite", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${min}`, 20, h - 10);
  ctx.fillText(`${Math.round((min + max) / 2)}`, w / 2, h - 10);
  ctx.fillText(`${max}`, w - 20, h - 10);
  ctx.textAlign = 'left';
  ctx.fillText('字数分布', 8, 14);
}

function drawTimeLine(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);

  // 按月聚合
  const map = new Map();
  for (const s of data) {
    const k = (s.createdAt || '').slice(0, 7);
    if (!k) continue;
    map.set(k, (map.get(k) || 0) + 1);
  }
  const arr = Array.from(map.entries()).sort();
  if (arr.length < 2) {
    ctx.fillStyle = '#0a0a0a';
    ctx.font = '14px "Bodoni Moda", serif';
    ctx.textAlign = 'center';
    ctx.fillText('数据不足', w / 2, h / 2);
    return;
  }
  const max = Math.max(...arr.map(a => a[1]));
  const step = (w - 60) / (arr.length - 1);
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  arr.forEach(([k, v], i) => {
    const x = 30 + i * step;
    const y = h - 30 - (h - 60) * (v / max);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  // 点
  for (const [k, v] of arr.entries()) {
    const [_, val] = arr[k];
    const x = 30 + k * step;
    const y = h - 30 - (h - 60) * (val / max);
    ctx.fillStyle = '#c1121f';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // 标签
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '10px "Special Elite", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(arr[0][0], 30, h - 10);
  ctx.fillText(arr[arr.length - 1][0], 30 + (arr.length - 1) * step, h - 10);
}

// ---------- 关于 ----------
function renderAbout() {
  const main = $('#main');
  main.innerHTML = '';
  const about = el('div', { class: 'about' });
  const left = el('div', {});
  left.appendChild(el('h2', {}, ['SCRIPT.FORGE']));
  left.appendChild(el('div', { class: 'sub' }, ['—  剧  本  工 厂  ·  全  局  模  板  —']));
  left.appendChild(el('p', {}, ['剧本工厂 SCRIPT.FORGE 是一套基于「全局模板 + 大规模资料池」的剧本智造系统。']));
  left.appendChild(el('p', {}, ['由 6 大原子池（题材 / 时代 / 视角 / 基调 / 幕结构 / 场景模板）自由组合，配合 200+ 主题词库与 37+ 角色原型，让「灵感」从抽象走向结构。']));
  left.appendChild(el('p', {}, ['每份剧本都包含完整的幕 / 场 / 角色 / 对话 / 转场，并支持 Markdown / JSON / TXT 导出，可直接进入下一阶段创作。']));
  left.appendChild(el('p', { style: { color: 'var(--red)', fontStyle: 'normal', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', marginTop: '24px' } }, ['—  「剧本是写给看不见的人的情书。」']));
  about.appendChild(left);

  const side = el('dl', { class: 'about__side' });
  const data = [
    ['版本', 'v 1.0'],
    ['种子', '20260608'],
    ['类型', '静态生成 · 浏览器端'],
    ['脚本数量', scripts.length.toLocaleString()],
    ['题材池', '60+'],
    ['时代池', '18'],
    ['视角池', '8'],
    ['基调池', '17'],
    ['结构池', '7'],
    ['场景模板', '8 类'],
    ['角色原型', '37+'],
    ['主题池', '200+'],
    ['渲染', '纯原生 ES6+'],
    ['图表', '自绘 Canvas'],
    ['字体', 'Bodoni Moda / Special Elite / EB Garamond / Noto Serif SC'],
    ['生成', 'Mulberry32 PRNG'],
    ['导出', 'MD / JSON / TXT'],
  ];
  for (const [k, v] of data) {
    side.appendChild(el('dt', {}, [k]));
    side.appendChild(el('dd', {}, [v]));
  }
  about.appendChild(side);
  main.appendChild(about);
}

// ---------- 路由 ----------
function navigate(view) {
  location.hash = '#/' + view;
}
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '') || 'home';
  const [view, idStr] = h.split('/');
  return { view: view || 'home', id: idStr ? parseInt(idStr, 10) : null };
}
function renderView() {
  // 同步导航高亮
  const cur = parseRoute().view;
  for (const a of $$('.topnav a')) a.classList.toggle('active', a.getAttribute('href') === '#/' + cur);
  switch (cur) {
    case 'home': renderHome(); break;
    case 'library': renderLibrary(); break;
    case 'trends': renderTrends(); break;
    case 'about': renderAbout(); break;
    default: renderHome();
  }
  if (parseRoute().id) {
    setTimeout(() => openDrawer(parseRoute().id), 100);
  }
  window.scrollTo(0, 0);
}

// ---------- 启动 ----------
function init() {
  // 顶栏搜索
  const topSearch = $('#topSearch');
  topSearch.addEventListener('input', debounce(() => {
    state.search = topSearch.value;
    state.page = 1;
    if (parseRoute().view !== 'library') navigate('library');
    else renderView();
  }, 220));

  // drawer 关闭
  $$('[data-drawer-close]').forEach(e => e.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#drawer').classList.contains('open')) closeDrawer();
  });

  // hash 路由
  window.addEventListener('hashchange', renderView);
  renderView();
}

document.addEventListener('DOMContentLoaded', init);
