/* =================================================================
   组件：目录跳转（TOC jump）
   =================================================================
   <div class="toc">
     <a class="toc-item" data-jump="4">...</a>
   </div>
   配合自定义跳转目标：data-jump-target="#slide-XX"
   ================================================================= */

(function () {
  'use strict';

  document.querySelectorAll('[data-jump]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.jumpTarget;
      if (target) {
        e.preventDefault();
        const dest = document.querySelector(target);
        if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // 否则：触发自定义事件，由父组件监听
      const n = parseInt(el.dataset.jump, 10);
      if (!isNaN(n)) {
        e.preventDefault();
        el.dispatchEvent(new CustomEvent('toc:jump', { detail: { index: n }, bubbles: true }));
      }
    });
  });
})();
