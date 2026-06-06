/* =========================================================
   site.js — 通用工具与导航
   ========================================================= */
(function (global) {
  'use strict';

  // IntersectionObserver: 滚到即显
  global.KE = global.KE || {};
  global.KE.observe = function (selector, className, options) {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add(className || 'visible');
      });
      return;
    }
    const opts = Object.assign({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }, options || {});
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add(className || 'visible');
          io.unobserve(e.target);
        }
      });
    }, opts);
    document.querySelectorAll(selector).forEach(function (el) { io.observe(el); });
  };

  // 异步加载图片并支持降级
  global.KE.loadImage = function (url, timeout) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      const t = setTimeout(function () { reject(new Error('image timeout')); }, timeout || 12000);
      img.onload = function () { clearTimeout(t); resolve(img); };
      img.onerror = function () { clearTimeout(t); reject(new Error('image error')); };
      img.src = url;
    });
  };

  // 转义 HTML
  global.KE.esc = function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // 高亮台词（将引号内容加色）
  global.KE.formatDialogue = function (text) {
    if (!text) return '';
    return global.KE.esc(text).replace(/[「「]([^」」]+)[」」]/g, '<em style="color:var(--seal-red);font-style:normal">「$1」</em>');
  };

  // 渲染当前导航的 active 状态
  global.KE.markNav = function (currentPath) {
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === currentPath) a.classList.add('active');
    });
  };
})(window);
