/* =================================================================
   PPT 翻页控制脚本（v2 · 全面增强版）
   =================================================================
   新增：
     · 5 段动画进场（fade-up / fade-in / scale-in / slide-from-right / 字符打字机）
     · 章节 (ACT) 自动识别 + 顶栏章标
     · Presenter 模式（F · 全屏 + 计时 + 下一篇预览）
     · 全屏 API（F11 替代）
     · 自动播放（A · 8s/张，可关）
     · 屏幕数字键盘 → 翻页
     · 进度环（右下角圆形 SVG，剩余时间）
     · 鼠标点击触发窑火粒子
     · 黑场快捷键 (B)
     · 智能 ESC 行为（先退出面板，再退出全屏，再回首页）
   ================================================================= */
(function () {
  'use strict';

  const deck = document.querySelector('.deck');
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll('.slide'));
  const total  = slides.length;
  let current  = 0;
  let isAnimating = false;
  let autoTimer = null;
  let autoInterval = 8000; // ms
  let isFullscreen = false;
  let lastPressTime = 0;

  const progressBar = document.querySelector('.progress-bar');
  const numCurrent  = document.querySelector('.cur-page');
  const numTotal    = document.querySelector('.total-page');

  if (numTotal) numTotal.textContent = String(total).padStart(2, '0');

  /* ---------------- 1. 章节识别 ---------------- */
  const ACT_RULES = [
    { test: /data-act="prologue"|slide-inner.*序章/, name: 'PROLOGUE',     sub: '序章' },
    { test: /data-act="thesis"|主旨|总纲|主旨解读/, name: 'THESIS',     sub: '主旨' },
    { test: /data-act="character"|人物|张寄|张志元|哥哥|弟弟|持守|开创/, name: 'CHARACTERS', sub: '人物' },
    { test: /data-act="act-1"|第一幕|寻土|起窑|未开片|历史回溯/, name: 'ACT I',     sub: '第一幕' },
    { test: /data-act="act-2"|第二幕|贡品|兄弟之印|证据/, name: 'ACT II',    sub: '第二幕' },
    { test: /data-act="act-3"|第三幕|窑火|金丝铁线|如一人/, name: 'ACT III',  sub: '第三幕' },
    { test: /data-act="climax"|升华|主题曲|片尾|致敬/,     name: 'EPILOGUE',  sub: '升华' },
  ];

  // 给每张幻灯片打 act 标
  slides.forEach((s, i) => {
    const html = s.innerHTML;
    let act = 'EPILOGUE';
    for (const r of ACT_RULES) {
      if (r.test.test(html) || (s.dataset.act && s.dataset.act === r.name.toLowerCase().replace(' ', '-'))) {
        act = r.name; break;
      }
    }
    s.dataset.act = act;
  });

  /* ---------------- 2. 进场动画分发 ---------------- */
  function applyEnterAnimations(slide) {
    // 自动给内部元素加 .anim-* 类，按出现顺序 stagger
    const targets = slide.querySelectorAll(
      '.eyebrow, h1, h2, h3, .huge, .subtitle, .body-text, .pull-quote, ' +
      '.toc-item, .card, .compare-card, .timeline-item, .dialogue, .table, ' +
      '.btn, .seal, .celadon-disc, .credit, .key-moment, [data-reveal]'
    );
    targets.forEach((el, idx) => {
      // 跳过已加过的
      if (el.dataset.animReady === '1') return;
      el.dataset.animReady = '1';

      // 重置（保证重复进入也有动画）
      el.style.animation = 'none';
      // 触发 reflow
      void el.offsetWidth;
      // 决定动画类型
      const animClass = (() => {
        if (el.matches('h1.huge, h2.huge, .huge')) return 'anim-up';
        if (el.matches('.eyebrow')) return 'anim-fade';
        if (el.matches('.pull-quote')) return 'anim-scale';
        if (el.matches('.toc-item, .timeline-item')) return 'anim-right';
        if (el.matches('.card, .compare-card')) return 'anim-up';
        if (el.matches('.btn, .seal')) return 'anim-fade';
        return 'anim-up';
      })();
      el.classList.add(animClass);
      el.style.animationDelay = (idx * 80) + 'ms';
    });
  }

  function resetEnterAnimations(slide) {
    slide.querySelectorAll('[data-anim-ready="1"]').forEach(el => {
      el.style.animation = 'none';
      el.dataset.animReady = '0';
      void el.offsetWidth;
    });
  }

  /* ---------------- 3. 翻页核心 ---------------- */
  function show(index) {
    if (index < 0 || index >= total || isAnimating) return;
    isAnimating = true;

    // 离开当前：reset 动画
    resetEnterAnimations(slides[current]);

    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i < index)        s.classList.add('prev');
      else if (i === index) s.classList.add('active');
    });

    current = index;
    if (numCurrent) numCurrent.textContent = String(current + 1).padStart(2, '0');
    if (progressBar) progressBar.style.width = ((current + 1) / total * 100) + '%';

    // 更新章节标
    updateActIndicator();
    // 更新进度环
    updateProgressRing();
    // 更新发言稿
    updateSpeakerNotes();

    // 应用进场动画
    setTimeout(() => applyEnterAnimations(slides[current]), 50);

    // 通知 presenter
    notifyPresenter();

    setTimeout(() => { isAnimating = false; }, 700);

    // 重置自动播放计时
    if (autoTimer) restartAuto();
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function goTo(i) { show(i); }

  /* ---------------- 进度环更新 ---------------- */
  const ringFg = document.getElementById('ringFg');
  const ringNum = document.getElementById('ringNum');
  function updateProgressRing() {
    if (!ringFg) return;
    const r = 26;
    const C = 2 * Math.PI * r;
    const pct = (current + 1) / total;
    ringFg.style.strokeDashoffset = C * (1 - pct);
    if (ringNum) ringNum.textContent = String(current + 1).padStart(2, '0');
  }

  /* ---------------- 发言稿更新 ---------------- */
  const speakerPanel = document.getElementById('speakerPanel');
  const notesContent = document.getElementById('notesContent');
  const notesBtn = document.getElementById('notesBtn');
  const closeNotes = document.getElementById('closeNotes');
  function updateSpeakerNotes() {
    if (!notesContent) return;
    const slide = slides[current];
    if (!slide) return;
    const note = slide.dataset.notes;
    const slideNum = current + 1;
    const headings = slide.querySelectorAll('h1, h2, h3');
    const heading = headings[0] ? headings[0].textContent.trim() : '当前幻灯片';
    const pauseAt = note ? '<div class="pause">· · ·</div>' : '';
    notesContent.innerHTML = `
      <h3>镜号 / 幻灯片 ${slideNum}</h3>
      <h4>${heading}</h4>
      ${note ? `<div class="note">${note}</div>` : '<div class="note">（本页无发言稿）</div>'}
      ${pauseAt}
      <h4>提示</h4>
      <p style="font-size: 14px; color: var(--ash);">
        翻到下一页时，本面板会自动更新。按 <span style="color: var(--kiln-gold);">N</span> 关闭发言稿。
      </p>`;
  }
  function toggleNotes() { speakerPanel?.classList.toggle('open'); }
  notesBtn?.addEventListener('click', toggleNotes);
  closeNotes?.addEventListener('click', toggleNotes);

  /* ---------------- 文稿模式 ---------------- */
  const docMode = document.getElementById('docMode');
  const docContent = document.getElementById('docContent');
  const docModeBtn = document.getElementById('docModeBtn');
  const closeDoc = document.getElementById('closeDoc');
  const printBtn = document.getElementById('printBtn');
  function buildDocContent() {
    if (!docContent) return;
    let html = '';
    slides.forEach((slide, i) => {
      const inner = slide.querySelector('.slide-inner');
      if (!inner) return;
      const clone = inner.cloneNode(true);
      clone.querySelectorAll('button').forEach(b => b.remove());
      const slideNum = String(i + 1).padStart(2, '0');
      const act = slide.dataset.act || '';
      html += `<div class="doc-slide">
        <div class="doc-num">${slideNum} / ${String(total).padStart(2, '0')} · ${act}</div>
        ${clone.innerHTML}
      </div>`;
    });
    docContent.innerHTML = html;
  }
  function toggleDocMode() {
    if (!docMode) return;
    if (docMode.classList.contains('active')) {
      docMode.classList.remove('active');
      document.body.style.overflow = 'hidden';
    } else {
      buildDocContent();
      docMode.classList.add('active');
      document.body.style.overflow = 'auto';
      docMode.scrollTop = 0;
    }
  }
  docModeBtn?.addEventListener('click', toggleDocMode);
  closeDoc?.addEventListener('click', toggleDocMode);
  printBtn?.addEventListener('click', () => {
    if (!docMode.classList.contains('active')) {
      buildDocContent();
      docMode.classList.add('active');
    }
    setTimeout(() => window.print(), 100);
  });

  /* ---------------- 4. 章节指示 ---------------- */
  const actIndicator = document.getElementById('actIndicator');
  function updateActIndicator() {
    if (!actIndicator) return;
    const slide = slides[current];
    const act = slide.dataset.act || 'EPILOGUE';
    const rule = ACT_RULES.find(r => r.name === act) || { sub: act };
    actIndicator.querySelector('.act-en').textContent = act;
    actIndicator.querySelector('.act-cn').textContent = rule.sub;
    actIndicator.classList.add('flash');
    setTimeout(() => actIndicator.classList.remove('flash'), 800);
  }

  /* ---------------- 5. Presenter 模式 ---------------- */
  const presenterOverlay = document.getElementById('presenterOverlay');
  const presTime = document.getElementById('presTime');
  const presNext = document.getElementById('presNext');
  const presCurrent = document.getElementById('presCurrent');

  function togglePresenter(force) {
    if (!presenterOverlay) return;
    const shouldShow = force === undefined ? !presenterOverlay.classList.contains('show') : force;
    if (shouldShow) {
      notifyPresenter();
      presenterOverlay.classList.add('show');
    } else {
      presenterOverlay.classList.remove('show');
    }
  }
  function notifyPresenter() {
    if (!presTime || !presNext || !presCurrent) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    presTime.textContent = m + ':' + s;
    presCurrent.textContent = (current + 1) + ' / ' + total;
    // 章节 / 进度
    const presAct = document.getElementById('presAct');
    const presPercent = document.getElementById('presPercent');
    if (presAct) {
      const sub = ACT_RULES.find(r => r.name === (slides[current].dataset.act || 'EPILOGUE'));
      presAct.textContent = sub ? sub.sub : '—';
    }
    if (presPercent) presPercent.textContent = Math.round((current + 1) / total * 100) + '%';
    // 顶部计时器
    const elapsedEl = document.getElementById('elapsed');
    if (elapsedEl) elapsedEl.textContent = m + ':' + s;
    // 下一篇预览
    const next = slides[current + 1];
    if (next) {
      const heading = next.querySelector('h1, h2, h3');
      const eyebrow = next.querySelector('.eyebrow');
      presNext.querySelector('.preview-num').textContent = String(current + 2).padStart(2, '0');
      presNext.querySelector('.preview-eye').textContent = eyebrow ? eyebrow.textContent : 'NEXT';
      presNext.querySelector('.preview-title').textContent = heading ? heading.textContent.trim() : '';
    } else {
      presNext.querySelector('.preview-title').textContent = '（已是最后一页）';
    }
  }
  setInterval(notifyPresenter, 1000);

  /* ---------------- 6. 全屏 API ---------------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen ||
       document.documentElement.webkitRequestFullscreen ||
       function(){}).call(document.documentElement);
      isFullscreen = true;
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
      isFullscreen = false;
    }
  }
  document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
  });

  /* ---------------- 7. 自动播放 ---------------- */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      if (current < total - 1) next();
      else stopAuto();
    }, autoInterval);
    const btn = document.getElementById('autoBtn');
    if (btn) btn.classList.add('on');
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    const btn = document.getElementById('autoBtn');
    if (btn) btn.classList.remove('on');
  }
  function restartAuto() { if (autoTimer) startAuto(); }

  /* ---------------- 8. 黑场（用于演讲中暂休） ---------------- */
  function toggleBlackout() {
    document.body.classList.toggle('blackout');
  }

  /* ---------------- 9. 鼠标点击粒子 ---------------- */
  function spawnParticles(x, y) {
    const container = document.getElementById('particles');
    if (!container) return;
    const N = 14;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const angle = (Math.PI * 2 * i) / N + Math.random() * 0.6;
      const dist  = 50 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      p.style.background = ['#d99a52', '#f4a35c', '#c0573a', '#f1ebe0'][i % 4];
      container.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }
  // 仅当点击非交互元素时触发粒子
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('button, a, .btn, .toc-item, .controls-btn, .mode-btn, .dl-btn')) return;
    if (t.closest('input, select, textarea')) return;
    spawnParticles(e.clientX, e.clientY);
  });

  /* ---------------- 10. 键盘 ---------------- */
  document.addEventListener('keydown', (e) => {
    // 防止快速连击
    const now = Date.now();
    if (now - lastPressTime < 50) return;
    lastPressTime = now;

    // 输入框不接管
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); goTo(0); break;
      case 'End':
        e.preventDefault(); goTo(total - 1); break;
      case 'Escape':
        e.preventDefault();
        if (presenterOverlay && presenterOverlay.classList.contains('show')) togglePresenter(false);
        else if (isFullscreen) toggleFullscreen();
        else goTo(0);
        break;
      case 'f': case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      case 'p': case 'P':
        e.preventDefault(); togglePresenter(); break;
      case 'b': case 'B':
        e.preventDefault(); toggleBlackout(); break;
      case 'a': case 'A':
        e.preventDefault(); autoTimer ? stopAuto() : startAuto(); break;
      case 'n': case 'N':
        e.preventDefault();
        const sp = document.getElementById('speakerPanel');
        if (sp) sp.classList.toggle('open'); break;
      case 'd': case 'D':
        e.preventDefault();
        const dm = document.getElementById('docMode');
        if (dm) dm.classList.toggle('active'); break;
      // 数字键 1-9 跳转对应章节（用于快速跳章）
      default:
        if (/^[1-9]$/.test(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const targetSlide = slides.find((s, i) => i >= idx * (total/9|0) && i < (idx+1) * (total/9|0) + 1);
          if (targetSlide) goTo(Array.from(slides).indexOf(targetSlide));
        }
    }
  });

  // 触屏
  let touchStartX = 0, touchStartY = 0, touchStartT = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartT = Date.now();
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartT;
    if (dt > 500) return; // 长按不算
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next() : prev());
  });

  // 按钮
  document.querySelectorAll('[data-deck-next]').forEach(b => b.addEventListener('click', next));
  document.querySelectorAll('[data-deck-prev]').forEach(b => b.addEventListener('click', prev));
  document.querySelectorAll('[data-jump]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); goTo(parseInt(el.dataset.jump, 10) - 1); });
  });

  // Presenter / Fullscreen / Auto 按钮
  document.getElementById('presenterBtn')?.addEventListener('click', () => togglePresenter());
  document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
  document.getElementById('autoBtn')?.addEventListener('click', () => autoTimer ? stopAuto() : startAuto());
  document.getElementById('closePresenter')?.addEventListener('click', () => togglePresenter(false));

  // 启动
  const startTime = Date.now();
  show(0);
})();
