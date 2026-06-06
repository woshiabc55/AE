/* ============================================================
   哨兵之桥 · 电影剧本展示页 · 交互脚本
   ============================================================ */
(function () {
  'use strict';

  const data = window.SCRIPT_DATA || [];

  // ---------- 工具 ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));

  // ---------- 渲染：目录（TOC） ----------
  function renderTOC() {
    const list = $('#tocList');
    if (!list) return;
    list.innerHTML = data.map((c, i) => `
      <li class="toc__item" data-target="${c.id}">
        <div class="toc__num">${String(i).padStart(2, '0')} / ${escapeHtml(c.number)}</div>
        <div class="toc__body">
          <div class="toc__name">${escapeHtml(c.title)}</div>
          <div class="toc__en">${escapeHtml(c.en)}</div>
          <div class="toc__lead-line">${escapeHtml(c.lead)}</div>
        </div>
      </li>
    `).join('');
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.toc__item');
      if (!item) return;
      const id = item.dataset.target;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeDrawer();
    });
  }

  // ---------- 渲染：侧边栏目录 ----------
  function renderSidenav() {
    const list = $('#sidenavList');
    if (!list) return;
    list.innerHTML = data.map((c, i) => `
      <li class="sidenav__item" data-target="${c.id}">
        <span class="sidenav__num">${String(i).padStart(2, '0')}</span>
        <span class="sidenav__title">${escapeHtml(c.title)}</span>
      </li>
    `).join('');
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.sidenav__item');
      if (!item) return;
      const el = document.getElementById(item.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- 渲染：抽屉（移动端） ----------
  function renderDrawer() {
    const list = $('#drawerList');
    if (!list) return;
    list.innerHTML = data.map((c, i) => `
      <li data-target="${c.id}">
        <span class="num">${String(i).padStart(2, '0')}</span>
        <span>${escapeHtml(c.title)}</span>
      </li>
    `).join('');
    list.addEventListener('click', (e) => {
      const item = e.target.closest('li');
      if (!item) return;
      const el = document.getElementById(item.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeDrawer();
    });
  }

  // ---------- 渲染：场景卡片 ----------
  function renderScenes(scenes) {
    return scenes.map((s) => {
      const tagsHtml = (s.tags || []).map((t) => `<span class="scene__tag">${escapeHtml(t)}</span>`).join('');
      const bodyHtml = (s.body || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      const body2Html = (s.body2 || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      const body3Html = (s.body3 || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      const quoteHtml = s.quote
        ? `<div class="scene__quote">${escapeHtml(s.quote)}</div>`
        : '';
      const dialogueHtml = (s.dialogue && s.dialogue.length)
        ? `<div class="scene__dialogue">${s.dialogue.map((d) => `
            <div class="scene__dlg">
              <span class="scene__dlg-name">${escapeHtml(d.speaker)}</span>
              <span class="scene__dlg-line">${escapeHtml(d.line)}</span>
            </div>
          `).join('')}</div>`
        : '';
      return `
        <div class="scene">
          <div class="scene__rail">
            <div class="scene__no">${escapeHtml(s.no)}</div>
          </div>
          <div class="scene__body">
            <div class="scene__setting">${escapeHtml(s.setting)}</div>
            <div class="scene__tags">${tagsHtml}</div>
            <div class="scene__text">${bodyHtml}${quoteHtml}${dialogueHtml}${body2Html}${body3Html}</div>
            ${s.mood ? `<div class="scene__mood">${escapeHtml(s.mood)}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ---------- 渲染：章节 ----------
  function renderChapters() {
    const container = $('#chapters');
    if (!container) return;
    const html = data.map((c, idx) => {
      const isFlashback = c.id === 'chapter-2';
      return `
        <section class="chapter" id="${c.id}" data-mood="${c.mood}" data-chapter-id="${c.id}">
          <div class="chapter__inner">
            <header class="chapter__head">
              <div class="chapter__number">CHAPTER ${String(idx).padStart(2, '0')} · ${escapeHtml(c.number)}</div>
              <h2 class="chapter__title">${escapeHtml(c.title)}</h2>
              <div class="chapter__en">${escapeHtml(c.en)}</div>
              <p class="chapter__lead">${escapeHtml(c.lead)}</p>
            </header>
            <div class="scenes">${renderScenes(c.scenes)}</div>
          </div>
        </section>
        ${idx < data.length - 1 ? `
          <div class="chapter__divider">
            <div class="chapter__divider-mark">CHAPTER ${String(idx + 1).padStart(2, '0')} / ${String(idx + 2).padStart(2, '0')}</div>
          </div>
        ` : ''}
      `;
    }).join('');
    container.innerHTML = html;
  }

  // ---------- 进度条 ----------
  function setupProgress() {
    const bar = $('#progressBar');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---------- 当前章节高亮 + 氛围切换 ----------
  function setupChapterObserver() {
    const sections = $$('.chapter');
    if (!sections.length) return;
    const sidenavItems = $$('.sidenav__item');
    const body = document.body;

    let lastMood = body.dataset.mood;

    // 用 IntersectionObserver 找出"占视口最多"的章节
    const visibility = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => visibility.set(e.target.dataset.chapterId, e.intersectionRatio));
      let bestId = null, bestRatio = 0;
      visibility.forEach((v, k) => {
        if (v > bestRatio) { bestRatio = v; bestId = k; }
      });
      if (!bestId) return;
      const sec = sections.find((s) => s.dataset.chapterId === bestId);
      if (!sec) return;
      // 高亮目录
      sidenavItems.forEach((it) => it.classList.toggle('is-active', it.dataset.target === bestId));
      // 切换 mood
      const mood = sec.dataset.mood;
      if (mood && mood !== lastMood) {
        body.dataset.mood = mood;
        lastMood = mood;
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '-15% 0px -40% 0px'
    });
    sections.forEach((s) => io.observe(s));
  }

  // ---------- 场景淡入动画 ----------
  function setupSceneReveal() {
    const scenes = $$('.scene');
    if (!scenes.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    scenes.forEach((s) => io.observe(s));
  }

  // ---------- 抽屉（移动端） ----------
  function setupDrawer() {
    const drawer = $('#drawer');
    const mask = $('#drawerMask');
    const btn = $('#menuBtn');
    const close = $('#drawerClose');
    if (!drawer) return;

    const open = () => {
      drawer.classList.add('is-open');
      mask.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      btn && btn.setAttribute('aria-expanded', 'true');
    };
    window.closeDrawer = () => {
      drawer.classList.remove('is-open');
      mask.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      btn && btn.setAttribute('aria-expanded', 'false');
    };
    btn && btn.addEventListener('click', open);
    close && close.addEventListener('click', closeDrawer);
    mask && mask.addEventListener('click', closeDrawer);
  }

  // ---------- 尘埃粒子 canvas ----------
  function setupDust() {
    const canvas = $('#dustCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { canvas.style.display = 'none'; return; }

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.round((w * h) / 22000); // 粒子数随屏幕大小自适应
    const dust = [];
    for (let i = 0; i < COUNT; i++) {
      dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.6,
        vx: -0.05 + Math.random() * 0.1,
        vy: -0.15 - Math.random() * 0.25,
        a: 0.15 + Math.random() * 0.45,
        tw: Math.random() * Math.PI * 2,
        tws: 0.005 + Math.random() * 0.015
      });
    }

    let mouseX = w / 2, mouseY = h / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function tick() {
      ctx.clearRect(0, 0, w, h);
      const cs = getComputedStyle(document.body);
      const dustColor = (cs.getPropertyValue('--dust') || '#c4b9a0').trim();
      ctx.fillStyle = dustColor;

      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.tws;
        const alphaMod = 0.6 + 0.4 * Math.sin(p.tw);

        // 鼠标交互：粒子被吹散
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const f = (1 - dist / 120) * 0.5;
          p.vx += (dx / dist) * f * 0.4;
          p.vy += (dy / dist) * f * 0.4;
        }
        // 阻尼回正
        p.vx *= 0.98;
        p.vy *= 0.98;
        // 恢复基准速度
        p.vy += (-0.15 - Math.random() * 0.05 - p.vy) * 0.02;

        // 出界回收
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.globalAlpha = p.a * alphaMod;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- 键盘快捷键 ----------
  function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Home') {
        const c = $('#cover'); if (c) c.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'End') {
        const c = $('#credits'); if (c) c.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 't' || e.key === 'T') {
        const c = $('#toc'); if (c) c.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------- 启动 ----------
  function init() {
    renderChapters();
    renderTOC();
    renderSidenav();
    renderDrawer();
    setupProgress();
    // 等待 DOM 渲染完再绑定观察
    requestAnimationFrame(() => {
      setupChapterObserver();
      setupSceneReveal();
    });
    setupDrawer();
    setupDust();
    setupKeyboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
