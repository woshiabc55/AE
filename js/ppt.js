/* =========================================================
   ppt.js — PPT 演示（重塑版）
   11 页结构：封面 / 目录 / 三章节（扉页+内容） / 尾声 / 谢幕
   ========================================================= */
(function () {
  'use strict';

  // 11 张 slide 数据
  const SLIDES = [
    // ---------- 1. 封面 ----------
    {
      type: 'cover',
      chapter: '',
      seal: '哥窑之印',
      meta: 'LISHUI · LONGQUAN  ·  SONG DYNASTY  ·  EDITION 2026',
      title: '哥窑',
      titleAccent: '',
      subtitle: '窑火如歌，兄弟如线',
      lead: '《哥窑》剧本 · 视觉史诗 · 修订版分镜与主旨解读',
      bullets: [
        { num: '壹', text: '总纲：关于"传承"的视觉史诗——"哥"通"歌"' },
        { num: '贰', text: '证据：兄弟二人两条动作链——守护 / 探索' },
        { num: '叁', text: '升华：持守与开创的和弦 = 哥窑之美' }
      ]
    },

    // ---------- 2. 目录 ----------
    {
      type: 'toc',
      chapter: 'CONTENTS',
      title: '目录',
      titleAccent: '',
      subtitle: '三章一尾声',
      lead: '修订版《哥窑》主旨解读，按章节展开。',
      items: [
        { num: 'I', title: '总纲', desc: '哥窑之"哥"——是"歌"，也是"兄"', page: 4 },
        { num: 'II', title: '证据', desc: '兄弟二人两条动作链：守护 / 探索', page: 6 },
        { num: 'III', title: '升华', desc: '持守与开创的和弦 = 哥窑之美', page: 9 },
        { num: '尾', title: '尾声', desc: '两双手按在同一方印上', page: 10 }
      ]
    },

    // ---------- 3. 章节扉页 I · 总纲 ----------
    {
      type: 'divider',
      chapter: 'I',
      chapterLabel: 'CHAPTER ONE',
      title: '总纲',
      titleAccent: '—— 不变的核心',
      subtitle: '《哥窑》',
      lead: '「《哥窑》是关于"传承"的视觉史诗。"哥"通"歌"——窑火如歌，兄弟如线。」'
    },

    // ---------- 4. 总纲内容 ----------
    {
      type: 'content',
      chapter: 'I · 总纲',
      title: '三条核心命题',
      titleAccent: '',
      subtitle: '《哥窑》讲什么',
      bullets: [
        { num: '01', text: '<strong>剧本名：</strong>哥窑——以"窑"为名，却讲的是"人"。' },
        { num: '02', text: '<strong>结构：</strong>序幕·现代 + 第一/二/三幕（历史回溯 / 贡品之印 / 窑火成瓷）。' },
        { num: '03', text: '<strong>核心命题：</strong>持守与开创、个人与传承、技艺与时代——三组张力同构于兄弟二人。' }
      ]
    },

    // ---------- 5. 章节扉页 II · 证据 ----------
    {
      type: 'divider',
      chapter: 'II',
      chapterLabel: 'CHAPTER TWO',
      title: '证据',
      titleAccent: '—— 兄弟的两条动作链',
      subtitle: '修订版关系（重要）',
      lead: '本项目以修订版"哥哥=张寄，弟弟=张志元"为准。原始脚本中"章生一""张志耀""张寄"等混用视为笔误。'
    },

    // ---------- 6. 人物 + 证据一 · 守护 ----------
    {
      type: 'duo',
      chapter: 'II · 证据',
      title: '兄弟二人 · 守护与探索',
      titleAccent: '',
      subtitle: '修订版人物定位',
      left: {
        role: '哥哥 · 张寄',
        seal: '持灯者',
        traits: ['守护', '理性', '承担', '持守'],
        desc: '年长、稳重、理性。他负责规划、守护、在关键时刻拉住冲动的弟弟。',
        keyLine: { shot: 53, text: '「等！现在开窑，全毁了！」' }
      },
      right: {
        role: '弟弟 · 张志元',
        seal: '行路人',
        traits: ['探索', '感性', '天赋', '开创'],
        desc: '年轻、敏感、天赋异禀。他能听见"土在唱歌"，感知火候的微妙变化。',
        keyLine: { shot: 16, text: '「哥，这土……在唱歌。」' }
      },
      bullets: [
        { num: '镜 9', text: '<strong>父亲嘱托（修订）：</strong>"看好你弟弟。"——父亲托付哥哥张寄照看弟弟志元。' },
        { num: '镜 45', text: '<strong>持守·最高点：</strong>张志元反将哥哥的手按在印上——"哥，没有你这盏灯……"' }
      ]
    },

    // ---------- 7. 证据二 · 探索 ----------
    {
      type: 'content',
      chapter: 'II · 证据',
      title: '证据二 · 弟弟张志元的探索',
      titleAccent: '开创者的天赋之眼',
      subtitle: '镜头里那个能"听见土在唱歌"的人',
      bullets: [
        { num: '镜 16', text: '「哥，这土……在唱歌。」 —— 发现紫金土的精准感知。' },
        { num: '镜 29', text: '「火着了。」 —— 第一窑开火前的聆听。' },
        { num: '镜 51', text: '「哥，火……太急了。」 —— 火候失控前的预警。' },
        { num: '镜 57', text: '「哥……成了。」 —— 金丝铁线开片之时的释然。' }
      ]
    },

    // ---------- 8. 章节扉页 III · 升华 ----------
    {
      type: 'divider',
      chapter: 'III',
      chapterLabel: 'CHAPTER THREE',
      title: '升华',
      titleAccent: '—— 哥窑之"哥"',
      subtitle: '是"歌"，也是"兄"',
      lead: '从镜号 1 到镜号 66，所有线索最终汇向一句话——'
    },

    // ---------- 9. 升华核心 ----------
    {
      type: 'quote',
      chapter: 'III · 升华',
      title: '核心命题',
      titleAccent: '',
      subtitle: '哥哥是那首"歌"的定音鼓和节拍器',
      lead: '',
      quote: '「哥窑之"哥"，非长幼之序，乃"歌"之古字——窑火如歌，兄弟如线。」',
      quoteAttr: '—— 镜 64 · 黑场字幕',
      bullets: [
        { num: '持守', text: '哥哥张寄 = 让弟弟的狂想不至于失控，让天赋落地为传世之作。' },
        { num: '开创', text: '弟弟张志元 = 探索者的天赋之眼，能听见土在唱歌、火在呼吸。' },
        { num: '和弦', text: '哥窑之美 = 持守与开创的完美和弦。' }
      ]
    },

    // ---------- 10. 尾声 · 二重唱 ----------
    {
      type: 'duet',
      chapter: '尾声',
      title: '两双手按在同一方印上',
      titleAccent: '—— 传承不是独唱',
      subtitle: '镜 45 · 镜 66',
      lead: '真正的传承，从来不是一个人的独唱，而是两双手按在同一方印上（镜 45）、两个背影在时光中重叠（镜 66）的二重唱。',
      quotes: [
        { shot: 45, text: '张志元：哥，没有你这盏灯，我哪能坚持学业……' },
        { shot: 66, text: '两个时代的背影重叠——窑火不灭。' }
      ]
    },

    // ---------- 11. 谢幕 ----------
    {
      type: 'end',
      chapter: '',
      title: '感谢观看',
      titleAccent: '',
      subtitle: '《哥窑》修订版分镜与主旨解读',
      lead: '请进入下方入口查看完整内容',
      bullets: [
        { num: '01', text: '<a href="storyboard.html">分镜长卷 · 62 镜 →</a>' },
        { num: '02', text: '<a href="analysis.html">主旨解读 →</a>' },
        { num: '03', text: '<a href="about.html">关于项目 →</a>' }
      ]
    }
  ];

  // =========================================================
  // 渲染
  // =========================================================
  const viewport = document.getElementById('pptViewport');
  const dotsEl = document.getElementById('pptDots');
  const progressEl = document.getElementById('pptProgress');
  const prevBtn = document.getElementById('pptPrev');
  const nextBtn = document.getElementById('pptNext');
  const fullscreenBtn = document.getElementById('pptFullscreen');
  const brandLink = document.getElementById('pptBrand');

  let current = 0;

  function buildSlide(s, i) {
    const total = SLIDES.length;
    const corners =
      '<span class="ppt__corner ppt__corner--tl">' + KE.esc(s.chapter || '哥窑 · 修订版') + '</span>' +
      '<span class="ppt__corner ppt__corner--tr">Slide ' + (i + 1) + ' / ' + total + '</span>' +
      '<span class="ppt__corner ppt__corner--bl">窑火如歌 · 兄弟如线</span>' +
      '<span class="ppt__corner ppt__corner--br">' + KE.pad2(i + 1) + '</span>';

    let body = '';
    if (s.type === 'cover') body = renderCover(s);
    else if (s.type === 'toc') body = renderToc(s);
    else if (s.type === 'divider') body = renderDivider(s);
    else if (s.type === 'content') body = renderContent(s);
    else if (s.type === 'duo') body = renderDuo(s);
    else if (s.type === 'quote') body = renderQuoteSlide(s);
    else if (s.type === 'duet') body = renderDuet(s);
    else if (s.type === 'end') body = renderEnd(s);
    else body = renderContent(s);

    return '' +
      '<section class="ppt__slide ppt__slide--' + s.type + '" data-index="' + i + '">' +
        corners + body +
      '</section>';
  }

  // 工具：title 渲染，accent 为空时省略 span
  function renderTitle(title, accent, klass) {
    const cls = klass || 'ppt__title';
    const acc = accent ? '<span class="accent">' + KE.esc(accent) + '</span>' : '';
    return '<h2 class="' + cls + '">' + KE.esc(title) + acc + '</h2>';
  }

  function renderCover(s) {
    const list = (s.bullets || []).map(function (b) {
      return '<li data-num="' + b.num + '">' + b.text + '</li>';
    }).join('');
    return '' +
      '<div class="cover__grid">' +
        '<div class="cover__left">' +
          '<div class="cover__eyebrow">' + KE.esc(s.seal) + '</div>' +
          '<h1 class="cover__title">' + KE.esc(s.title) + '</h1>' +
          '<div class="cover__subtitle">' + KE.esc(s.subtitle) + '</div>' +
          '<div class="cover__lead">' + KE.esc(s.lead) + '</div>' +
          '<ul class="cover__list">' + list + '</ul>' +
        '</div>' +
        '<div class="cover__right">' +
          '<div class="cover__seal">' +
            '<span>哥</span><span>窑</span><span>章</span><span>氏</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cover__meta">' + KE.esc(s.meta) + '</div>';
  }

  function renderToc(s) {
    const items = (s.items || []).map(function (it) {
      return '' +
        '<a class="toc__item" data-goto="' + (it.page - 1) + '" href="javascript:void(0)">' +
          '<span class="toc__num">' + KE.esc(it.num) + '</span>' +
          '<span class="toc__body">' +
            '<span class="toc__title">' + KE.esc(it.title) + '</span>' +
            '<span class="toc__desc">' + KE.esc(it.desc) + '</span>' +
          '</span>' +
          '<span class="toc__page">P.' + KE.pad2(it.page) + '</span>' +
        '</a>';
    }).join('');
    return '' +
      '<div class="toc__head">' +
        '<div class="toc__eyebrow">' + KE.esc(s.chapter) + '</div>' +
        renderTitle(s.title, s.titleAccent, 'toc__title') +
        '<div class="toc__subtitle">' + KE.esc(s.subtitle) + '</div>' +
        '<div class="toc__lead">' + KE.esc(s.lead) + '</div>' +
      '</div>' +
      '<div class="toc__list">' + items + '</div>';
  }

  function renderDivider(s) {
    return '' +
      '<div class="divider__inner">' +
        '<div class="divider__num">' + KE.esc(s.chapter) + '</div>' +
        '<div class="divider__label">' + KE.esc(s.chapterLabel) + '</div>' +
        renderTitle(s.title, s.titleAccent, 'divider__title') +
        '<div class="divider__subtitle">' + KE.esc(s.subtitle) + '</div>' +
        (s.lead ? '<div class="divider__lead">' + KE.esc(s.lead) + '</div>' : '') +
      '</div>';
  }

  function renderContent(s) {
    const list = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      (list ? '<ul class="ppt__list">' + list + '</ul>' : '');
  }

  function renderDuo(s) {
    const bullets = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      '<div class="duo__grid">' +
        renderDuoCard(s.left) +
        '<div class="duo__center">' +
          '<div class="duo__chord">二重唱</div>' +
          '<div class="duo__chord-line"></div>' +
        '</div>' +
        renderDuoCard(s.right) +
      '</div>' +
      (bullets ? '<ul class="ppt__list ppt__list--duo">' + bullets + '</ul>' : '');
  }

  function renderDuoCard(c) {
    const traits = c.traits.map(function (t) {
      return '<span>' + KE.esc(t) + '</span>';
    }).join('');
    const keyLine = c.keyLine
      ? '<div class="duo__line"><span class="duo__line-shot">镜 ' + c.keyLine.shot + '</span>' + c.keyLine.text + '</div>'
      : '';
    return '' +
      '<div class="duo__card">' +
        '<div class="duo__seal">' + KE.esc(c.seal) + '</div>' +
        '<div class="duo__role">' + KE.esc(c.role) + '</div>' +
        '<div class="duo__desc">' + KE.esc(c.desc) + '</div>' +
        '<div class="duo__traits">' + traits + '</div>' +
        keyLine +
      '</div>';
  }

  function renderQuoteSlide(s) {
    const list = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      '<div class="quote__big">' + s.quote + '</div>' +
      '<div class="quote__attr">' + KE.esc(s.quoteAttr || '') + '</div>' +
      (list ? '<ul class="ppt__list">' + list + '</ul>' : '');
  }

  function renderDuet(s) {
    const quotes = (s.quotes || []).map(function (q) {
      return '' +
        '<div class="duet__quote">' +
          '<span class="duet__shot">镜 ' + q.shot + '</span>' +
          '<div class="duet__text">' + KE.esc(q.text) + '</div>' +
        '</div>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      '<div class="duet__lead">' + KE.esc(s.lead) + '</div>' +
      '<div class="duet__grid">' + quotes + '</div>';
  }

  function renderEnd(s) {
    const list = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      '<div class="end__seal">谢谢</div>' +
      '<h2 class="ppt__title end__title">' + KE.esc(s.title) + '</h2>' +
      '<div class="end__subtitle">' + KE.esc(s.subtitle) + '</div>' +
      (s.lead ? '<div class="end__lead">' + KE.esc(s.lead) + '</div>' : '') +
      (list ? '<ul class="end__list">' + list + '</ul>' : '') +
      '<div class="end__back">' +
        '<a href="index.html" class="end__home">← 返回首页</a>' +
      '</div>';
  }

  function buildAll() {
    viewport.innerHTML = SLIDES.map(buildSlide).join('');

    // 进度条
    const dots = SLIDES.map(function (_, i) {
      return '<span class="ppt__dot' + (i === 0 ? ' active' : '') + '" data-goto="' + i + '" title="Slide ' + (i + 1) + '"></span>';
    }).join('');
    dotsEl.innerHTML = dots;

    // TOC 点击跳转
    viewport.querySelectorAll('.toc__item').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const n = parseInt(a.dataset.goto, 10);
        if (!isNaN(n)) go(n);
      });
    });
  }

  function go(n) {
    n = Math.max(0, Math.min(SLIDES.length - 1, n));
    const slides = viewport.querySelectorAll('.ppt__slide');
    slides.forEach(function (el) {
      const idx = parseInt(el.dataset.index, 10);
      el.classList.remove('active', 'prev');
      if (idx === n) el.classList.add('active');
      else if (idx < n) el.classList.add('prev');
    });
    dotsEl.querySelectorAll('.ppt__dot').forEach(function (d, i) {
      d.classList.toggle('active', i === n);
    });
    progressEl.textContent = KE.pad2(n + 1) + ' / ' + KE.pad2(SLIDES.length);
    current = n;
    if (brandLink) {
      brandLink.style.color = SLIDES[n].type === 'cover' || SLIDES[n].type === 'end' ? 'var(--paper)' : 'var(--paper)';
      brandLink.style.opacity = '0.85';
    }
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      // 在输入框中不拦截
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(SLIDES.length - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    });

    // 点击翻页（左右区域），避免点击链接/按钮/TOC时翻页
    viewport.addEventListener('click', function (e) {
      if (e.target.closest('a, button, .toc__item, .duo__card, .end__home')) return;
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x > rect.width * 0.65) next();
      else if (x < rect.width * 0.35) prev();
    });

    dotsEl.addEventListener('click', function (e) {
      const t = e.target;
      if (t && t.dataset && t.dataset.goto != null) {
        go(parseInt(t.dataset.goto, 10));
      }
    });

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildAll();
    bindKeys();
    go(0);
  });
})();
