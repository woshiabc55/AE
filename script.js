/* =====================================================
   Deploy·Atlas — 交互逻辑
   - TOC 联动高亮
   - 暗/亮主题切换
   - 代码块一键复制
   - 滚动揭示动画
   ===================================================== */

(function () {
  'use strict';

  // ---------- 1. 主题切换 ----------
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('deploy-atlas-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('deploy-atlas-theme', next);
    });
  }

  // ---------- 2. TOC 联动（IntersectionObserver） ----------
  const spyLinks = document.querySelectorAll('[data-spy]');
  const sectionIds = Array.from(spyLinks).map((a) => a.getAttribute('href').slice(1));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    spyLinks.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        // 找到最靠近视口顶部的可见 section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // ---------- 3. 滚动揭示 ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // ---------- 4. 代码块复制 ----------
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  document.querySelectorAll('.codeblock').forEach((block) => {
    const btn = block.querySelector('.copy-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const code = block.querySelector('code');
      const text = code ? code.innerText : block.innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        btn.textContent = '✓';
        showToast('已复制到剪贴板 ✓');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '⎘';
        }, 1500);
      } catch (e) {
        // 退化方案
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('已复制 ✓');
        } catch (err) {
          showToast('复制失败，请手动选择');
        }
        document.body.removeChild(ta);
      }
    });
  });

  // ---------- 5. 平滑滚动 ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- 6. 顶部状态栏打字机效果 ----------
  const pathEl = document.querySelector('.status-bar .path');
  if (pathEl) {
    const final = pathEl.textContent;
    pathEl.textContent = '';
    let i = 0;
    const tick = () => {
      if (i <= final.length) {
        pathEl.textContent = final.slice(0, i);
        i++;
        setTimeout(tick, 38);
      }
    };
    setTimeout(tick, 400);
  }

  // ---------- 7. Hero 标题字符错位动画 ----------
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
      heroTitle.style.transition = 'transform 0.2s';
      heroTitle.style.transform = 'translateX(2px)';
      setTimeout(() => {
        heroTitle.style.transform = 'translateX(0)';
      }, 120);
    });
  }
})();
