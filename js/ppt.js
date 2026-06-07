/* =========================================================
   ppt.js — PPT 演示（v2: 11 页 · 6 段结构对齐）
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
      lead: '《哥窑》6 段结构总览 · 153 秒 · 62 镜',
      bullets: [
        { num: '前', text: '前幕·制作组自白 — 我们为什么拍这个故事' },
        { num: '壹', text: '第一~四章 — 4 章节 · 角色 / 制窑 / 弟归 / 共窑' },
        { num: '尾', text: '尾幕 — 展开 PPT · 从「哥」通「歌」说起' }
      ]
    },

    // ---------- 2. 目录 ----------
    {
      type: 'toc',
      chapter: 'CONTENTS',
      title: '目录',
      titleAccent: '',
      subtitle: '6 段结构 · 4 章节',
      lead: '修订版《哥窑》6 段结构总览与主旨解读。',
      items: [
        { num: '前', title: '前幕', desc: '制作组·自白介绍', page: 3 },
        { num: 'I', title: '第一章', desc: '角色 · 离别-入梦（36s / 9 镜）', page: 4 },
        { num: 'II', title: '第二章', desc: '梦中 · 制窑-入境-反思（51s / 22 镜）', page: 6 },
        { num: 'III', title: '第三章', desc: '弟归（30s / 12 镜）', page: 7 },
        { num: 'IV', title: '第四章', desc: '共窑-传名（12s / 19 镜）', page: 8 },
        { num: '尾', title: '尾幕', desc: '展开 PPT · 升华', page: 10 }
      ]
    },

    // ---------- 3. 前幕·制作组 ----------
    {
      type: 'divider',
      chapter: '前',
      chapterLabel: 'PROLOGUE',
      title: '前幕',
      titleAccent: '—— 制作组自白',
      subtitle: '为什么拍这个故事',
      lead: '「我们想用 153 秒讲一个关于「哥窑」的故事。在动笔之前，我们想先告诉你——为什么是这个名字，为什么是两个男人、为什么是一座窑。」'
    },

    // ---------- 4. 第一~四章 · 角色 / 制窑 / 弟归 / 共窑 ----------
    {
      type: 'duo',
      chapter: 'I · 第一章',
      title: '第一章 · 角色 · 离别-入梦',
      titleAccent: '',
      subtitle: '36s · 镜 1–9 · 当代送别与战乱烽火',
      left: {
        role: '当代',
        seal: '送别',
        traits: ['地铁', '嘱托', '兄弟', '光影'],
        desc: '老匠人送弟弟去上学。父亲把瓷土与家谱塞入兄弟手中——「往南走，找能烧窑的土地，不能丢。手艺不能断。」',
        keyLine: { shot: 9, text: '「手艺不能断。」' }
      },
      right: {
        role: '历史',
        seal: '烽火',
        traits: ['父亲', '瓷土', '家谱', '南迁'],
        desc: '战乱烽火中父亲将紫金土与家谱塞入兄弟手中。一句嘱托，兄弟南迁。',
        keyLine: { shot: 5, text: '「往南走，找能烧窑的土地。」' }
      },
      bullets: [
        { num: '镜 1', text: '<strong>开篇意象：</strong>当代地铁站，老匠人送弟弟去上学。' },
        { num: '镜 9', text: '<strong>父亲嘱托：</strong>「往南走，找能烧窑的土地，不能丢。手艺不能断。」' }
      ]
    },

    // ---------- 5. 第二章·制窑 ----------
    {
      type: 'content',
      chapter: 'II · 第二章',
      title: '第二章 · 梦中 · 制窑-入境-反思',
      titleAccent: '',
      subtitle: '51s · 镜 11–33 · 紫金土在唱歌',
      bullets: [
        { num: '镜 11', text: '<strong>南下途中：</strong>弟弟听见紫金土在唱歌。' },
        { num: '镜 16', text: '<strong>发现之眼：</strong>「哥，这土……在唱歌。」—— 找到建窑之所。' },
        { num: '镜 18-27', text: '<strong>依山建龙窑：</strong>兄弟并肩夯土、砌窑。' },
        { num: '镜 29', text: '<strong>第一窑开火：</strong>釉色如玉，却未开片。反思火候。' }
      ]
    },

    // ---------- 6. 第三章·弟归 ----------
    {
      type: 'content',
      chapter: 'III · 第三章',
      title: '第三章 · 弟归',
      titleAccent: '—— 龙泉章氏贡印',
      subtitle: '30s · 镜 36–47 · 朝廷查验与赐印',
      bullets: [
        { num: '镜 36', text: '<strong>朝廷官员查验：</strong>第二窑出窑的青瓷釉色更润、隐隐有细纹。' },
        { num: '镜 40', text: '<strong>赐「龙泉章氏」贡印：</strong>朝廷赐印，兄弟受命。' },
        { num: '镜 45', text: '<strong>持守·最高点：</strong>两双手按在同一方印上——张志元：哥，没有你这盏灯……' },
        { num: '镜 47', text: '<strong>弟归：</strong>弟弟归来，兄弟重聚。' }
      ]
    },

    // ---------- 7. 第四章·共窑-传名 ----------
    {
      type: 'content',
      chapter: 'IV · 第四章',
      title: '第四章 · 共窑-传名',
      titleAccent: '—— 金丝铁线',
      subtitle: '12s · 镜 48–66 · 火候失控与开片',
      bullets: [
        { num: '镜 51', text: '<strong>火候预警：</strong>弟弟察觉「火……太急了。」' },
        { num: '镜 53', text: '<strong>持守·守护：</strong>哥哥拉住弟弟——「等！现在开窑，全毁了！」' },
        { num: '镜 57', text: '<strong>开片释然：</strong>「哥……成了。」—— 金丝铁线前所未见。' },
        { num: '镜 66', text: '<strong>背影重叠：</strong>两个时代的背影，窑火不灭。' }
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
      lead: '从前幕到尾幕，所有线索最终汇向一句话——'
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
      subtitle: '《哥窑》6 段结构 · 修订版分镜与主旨解读',
      lead: '请进入下方入口查看完整内容',
      bullets: [
        { num: '01', text: '<a href="preface.html">前幕 · 制作组自白 →</a>' },
        { num: '02', text: '<a href="storyboard.html">分镜长卷 · 62 镜 →</a>' },
        { num: '03', text: '<a href="analysis.html">主旨解读 →</a>' },
        { num: '04', text: '<a href="about.html">关于项目 →</a>' }
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
          (s.left && s.right ? '<div class="duo__verse">' + KE.esc(s.left.seal || '') + ' ⟷ ' + KE.esc(s.right.seal || '') + '</div>' : '') +
        '</div>' +
        renderDuoCard(s.right) +
      '</div>' +
      (bullets ? '<ul class="ppt__list ppt__list--duo">' + bullets + '</ul>' : '');
  }

  function renderDuoCard(c) {
    if (!c) return '';
    const traits = (c.traits || []).map(function (t) { return '<span>' + KE.esc(t) + '</span>'; }).join('');
    const keyLine = c.keyLine
      ? '<div class="duo__keyline"><span class="duo__shot">镜 ' + c.keyLine.shot + '</span>' + KE.formatDialogue(c.keyLine.text) + '</div>'
      : '';
    return '' +
      '<div class="duo__card">' +
        '<div class="duo__role">' + KE.esc(c.role || '') + '</div>' +
        '<div class="duo__seal">' + KE.esc(c.seal || '') + '</div>' +
        '<div class="duo__desc">' + KE.esc(c.desc || '') + '</div>' +
        '<div class="duo__traits">' + traits + '</div>' +
        keyLine +
      '</div>';
  }

  function renderQuoteSlide(s) {
    const bullets = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      '<div class="quote__inner">' +
        '<div class="quote__text">' + KE.esc(s.quote || '') + '</div>' +
        (s.quoteAttr ? '<div class="quote__attr">' + KE.esc(s.quoteAttr) + '</div>' : '') +
      '</div>' +
      (bullets ? '<ul class="ppt__list">' + bullets + '</ul>' : '');
  }

  function renderDuet(s) {
    const quotes = (s.quotes || []).map(function (q) {
      return '<div class="duet__quote"><span class="duet__shot">镜 ' + q.shot + '</span><span class="duet__line">' + KE.esc(q.text) + '</span></div>';
    }).join('');
    return '' +
      renderTitle(s.title, s.titleAccent) +
      (s.subtitle ? '<p class="ppt__subtitle">' + KE.esc(s.subtitle) + '</p>' : '') +
      (s.lead ? '<p class="ppt__lead">' + KE.esc(s.lead) + '</p>' : '') +
      '<div class="duet__grid">' + quotes + '</div>';
  }

  function renderEnd(s) {
    const list = (s.bullets || []).map(function (b) {
      return '<li data-num="' + KE.esc(b.num) + '">' + b.text + '</li>';
    }).join('');
    return '' +
      '<div class="end__seal">哥<br>窑</div>' +
      renderTitle(s.title, s.titleAccent, 'end__title') +
      '<div class="end__subtitle">' + KE.esc(s.subtitle) + '</div>' +
      '<p class="end__lead">' + KE.esc(s.lead) + '</p>' +
      '<ul class="end__list">' + list + '</ul>' +
      '<div class="end__meta">— 感谢观看 —</div>';
  }

  // =========================================================
  // 控制
  // =========================================================
  function render() {
    viewport.innerHTML = SLIDES.map(buildSlide).join('');
    renderDots();
    update();
  }

  function renderDots() {
    dotsEl.innerHTML = SLIDES.map(function (_, i) {
      return '<button class="ppt__dot" data-goto="' + i + '" aria-label="跳到第 ' + (i + 1) + ' 页"></button>';
    }).join('');
    dotsEl.querySelectorAll('.ppt__dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-goto'), 10));
      });
    });
    viewport.querySelectorAll('[data-goto]').forEach(function (a) {
      a.addEventListener('click', function () {
        const idx = parseInt(a.getAttribute('data-goto'), 10);
        if (!isNaN(idx)) goTo(idx);
      });
    });
  }

  function update() {
    progressEl.textContent = KE.pad2(current + 1) + ' / ' + KE.pad2(SLIDES.length);
    dotsEl.querySelectorAll('.ppt__dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === current);
    });
    viewport.querySelectorAll('.ppt__slide').forEach(function (s, i) {
      s.classList.toggle('is-active', i === current);
    });
  }

  function goTo(i) {
    if (i < 0) i = 0;
    if (i > SLIDES.length - 1) i = SLIDES.length - 1;
    current = i;
    update();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
      const el = document.documentElement;
      if (!document.fullscreenElement) {
        (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen).call(el);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { prev(); e.preventDefault(); }
    else if (e.key === 'Home') { goTo(0); e.preventDefault(); }
    else if (e.key === 'End') { goTo(SLIDES.length - 1); e.preventDefault(); }
    else if (e.key === 'f' || e.key === 'F') {
      if (fullscreenBtn) fullscreenBtn.click();
    }
  });

  if (brandLink) {
    brandLink.addEventListener('click', function (e) {
      if (document.referrer && document.referrer.indexOf(window.location.origin) === 0) {
        e.preventDefault();
        history.back();
      }
    });
  }

  render();
})();
