/* =================================================================
   组件：窑火（Flame）交互控制
   =================================================================
   <div class="flame" data-flame="auto"></div>
   <div class="flame flame-sm" data-flame="hover"></div>
   - auto: 自动播放（默认）
   - hover: 鼠标悬停播放
   - click: 点击播放
   ================================================================= */

(function () {
  'use strict';

  const flames = document.querySelectorAll('[data-flame]');
  flames.forEach(el => {
    const mode = el.dataset.flame || 'auto';
    if (mode === 'hover') {
      el.style.animationPlayState = 'paused';
      el.addEventListener('mouseenter', () => { el.style.animationPlayState = 'running'; });
      el.addEventListener('mouseleave', () => { el.style.animationPlayState = 'paused'; });
    } else if (mode === 'click') {
      el.style.animationPlayState = 'paused';
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        el.style.animationPlayState = 'running';
        setTimeout(() => { el.style.animationPlayState = 'paused'; }, 3000);
      });
    }
  });
})();
