/* =================================================================
   PPT 翻页控制脚本
   ================================================================= */
(function () {
  'use strict';

  const deck = document.querySelector('.deck');
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll('.slide'));
  const total  = slides.length;
  let current  = 0;
  let isAnimating = false;

  const progressBar = document.querySelector('.progress-bar');
  const numCurrent  = document.querySelector('.num-current');
  const numTotal    = document.querySelector('.num-total');

  if (numTotal) numTotal.textContent = String(total).padStart(2, '0');

  function show(index) {
    if (index < 0 || index >= total || isAnimating) return;
    isAnimating = true;

    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i < index)      s.classList.add('prev');
      else if (i === index) s.classList.add('active');
    });

    current = index;
    if (numCurrent) numCurrent.textContent = String(current + 1).padStart(2, '0');
    if (progressBar) progressBar.style.width = ((current + 1) / total * 100) + '%';

    document.querySelectorAll('[data-slide-jump]').forEach(btn => {
      btn.addEventListener('click', () => goTo(parseInt(btn.dataset.slideJump, 10)));
    });

    setTimeout(() => { isAnimating = false; }, 600);
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function goTo(i) { show(i); }

  document.addEventListener('keydown', (e) => {
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
        e.preventDefault(); goTo(0); break;
    }
  });

  // 触摸支持
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) (dx < 0 ? next() : prev());
  });

  // 按钮
  document.querySelectorAll('[data-deck-next]').forEach(b => b.addEventListener('click', next));
  document.querySelectorAll('[data-deck-prev]').forEach(b => b.addEventListener('click', prev));

  // 启动
  show(0);
})();
