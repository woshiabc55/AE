/* =========================================================
   《哥 · 歌 · 窑》 主旨解读 PPT — 交互控制
   ========================================================= */

(function () {
  'use strict';

  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const progressBar = document.getElementById('progressBar');
  const curPageEl = document.getElementById('curPage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const hint = document.getElementById('hint');
  const embers = document.getElementById('embers');

  let current = 0;
  let wheelLock = false;
  let hintTimer = null;

  /* ---------- 火星粒子生成 ---------- */
  function buildEmbers() {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.animationDuration = (6 + Math.random() * 9) + 's';
      s.style.animationDelay = (-Math.random() * 12) + 's';
      const size = 1 + Math.random() * 3;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.opacity = 0.4 + Math.random() * 0.5;
      embers.appendChild(s);
    }
  }

  /* ---------- 翻页 ---------- */
  function goTo(index) {
    if (index < 0 || index >= total || index === current) return;

    const direction = index > current ? 'next' : 'prev';
    const oldSlide = slides[current];
    const newSlide = slides[index];

    // 标记旧 slide
    oldSlide.classList.remove('is-active');
    oldSlide.classList.add(direction === 'next' ? 'is-prev' : '');

    // 激活新 slide
    newSlide.classList.remove('is-prev');
    newSlide.classList.add('is-active');

    current = index;
    updateUI();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function first() { goTo(0); }
  function last() { goTo(total - 1); }

  function updateUI() {
    const ratio = (current + 1) / total;
    progressBar.style.transform = `scaleX(${ratio})`;

    curPageEl.textContent = String(current + 1).padStart(2, '0');

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  /* ---------- 键盘事件 ---------- */
  function onKey(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        first();
        break;
      case 'End':
        e.preventDefault();
        last();
        break;
    }
  }

  /* ---------- 滚轮事件（节流） ---------- */
  function onWheel(e) {
    if (wheelLock) return;
    // 仅在垂直滚动且 deltaY 明显时触发
    if (Math.abs(e.deltaY) < 30 && Math.abs(e.deltaX) < 30) return;

    wheelLock = true;
    if (e.deltaY > 0 || e.deltaX > 0) {
      next();
    } else {
      prev();
    }
    setTimeout(() => { wheelLock = false; }, 850);
  }

  /* ---------- 触摸事件 ---------- */
  let touchStartX = 0;
  let touchStartY = 0;
  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    } else {
      if (dy < 0) next(); else prev();
    }
  }

  /* ---------- 提示气泡 ---------- */
  function showHint() {
    hint.classList.add('is-visible');
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hint.classList.remove('is-visible');
    }, 3500);
  }

  /* ---------- 初始化 ---------- */
  function init() {
    buildEmbers();
    updateUI();

    // 按钮
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    if (startBtn) {
      startBtn.addEventListener('click', () => { next(); hideHint(); });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', first);
    }

    // 键盘
    document.addEventListener('keydown', onKey);

    // 滚轮
    window.addEventListener('wheel', onWheel, { passive: true });

    // 触摸
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });

    // 3.5s 后展示提示
    setTimeout(showHint, 1200);
  }

  function hideHint() {
    hint.classList.remove('is-visible');
    if (hintTimer) clearTimeout(hintTimer);
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
