/* =========================================================
   chapter.js — 章节页通用渲染
   ========================================================= */
(function () {
  'use strict';

  function renderChapter(ch, shots, prev, next) {
    const color = ch.color || '#3e5a4d';
    const colorDeep = ch.colorDeep || '#1a1814';

    document.documentElement.style.setProperty('--ch-color', color);
    document.documentElement.style.setProperty('--ch-color-deep', colorDeep);

    // Hero
    const hero = document.getElementById('chapterHero');
    hero.style.color = color;
    hero.innerHTML = '' +
      '<div class="chapter-hero__num" style="color: ' + color + ';">' + KE.pad2(ch.chapterNum) + '</div>' +
      '<div class="chapter-hero__body">' +
        '<h1 style="color: var(--ink-black)">' + KE.esc(ch.title) + ' · ' + KE.esc(ch.subtitle) + '</h1>' +
        '<div class="chapter-hero__meta">' +
          '<span><strong style="color: ' + color + '">' + KE.esc(ch.duration) + '</strong> · 时长</span>' +
          '<span><strong style="color: ' + color + '">' + ch.shots.length + '</strong> · 镜号数</span>' +
          '<span><strong style="color: ' + color + '">镜 ' + ch.shotRange[0] + '–' + ch.shotRange[1] + '</strong> · 镜号区间</span>' +
        '</div>' +
        '<p class="chapter-hero__desc">' + KE.esc(ch.desc) + '</p>' +
        '<div class="chapter-hero__keyline" style="border-color: ' + color + ';">' + KE.esc(ch.keyline) + '</div>' +
      '</div>';

    // Shots
    const head = document.getElementById('shotsHead');
    head.innerHTML = '<h2>分镜</h2>' +
      '<span class="chapter-shots__count" style="color: ' + color + '">' + ch.shots.length + ' 镜</span>';

    const grid = document.getElementById('shotsGrid');
    grid.innerHTML = shots.map(function (s) {
      const imgUrl = KE.imageUrl(s.prompt, s.imageSize || 'landscape_16_9');
      return '' +
        '<article class="shot" data-shot="' + s.id + '" style="border-color: ' + color + '">' +
          '<a class="shot__media" href="shot.html?shot=' + s.id + '">' +
            '<div class="shot__media-loading">生成中 · ' + s.id + '</div>' +
            '<img src="' + imgUrl + '" alt="镜 ' + s.id + '" loading="lazy" ' +
              'onload="this.previousElementSibling && (this.previousElementSibling.style.display=\'none\')" ' +
              'onerror="this.previousElementSibling && (this.previousElementSibling.textContent=\'图片暂未生成\'); this.style.opacity=0.3">' +
            '<span class="shot__media-num">#' + s.id + '</span>' +
            '<span class="shot__media-size" style="background: ' + color + '">' + KE.esc(s.shotSize) + '</span>' +
          '</a>' +
          '<div class="shot__body">' +
            '<div class="shot__id">镜号 ' + s.id + ' / ' + KE.esc(s.actName) + '</div>' +
            '<h3 class="shot__title">' + KE.esc(s.shotSize) + ' · ' + (s.duration || '—') + '</h3>' +
            '<p class="shot__visual">' + KE.esc(s.visual || '—') + '</p>' +
            (s.audio ? '<p class="shot__audio">' + KE.formatDialogue(s.audio) + '</p>' : '') +
            '<a class="shot__link" href="shot.html?shot=' + s.id + '" style="color: ' + color + '">查看单镜详情 →</a>' +
          '</div>' +
        '</article>';
    }).join('');

    // Nav
    const nav = document.getElementById('chapterNav');
    const prevLink = prev
      ? '<a href="' + prev.href + '"><span class="nav-arrow">‹</span><span class="nav-label"><span class="nav-num" style="color: ' + prev.color + '">' + KE.esc(prev.num) + '</span><span class="nav-title">' + KE.esc(prev.title) + '</span></span></a>'
      : '<a class="disabled"><span class="nav-arrow">‹</span><span class="nav-label"><span class="nav-num">前</span><span class="nav-title">已是第一段</span></span></a>';
    const nextLink = next
      ? '<a href="' + next.href + '"><span class="nav-label"><span class="nav-num" style="color: ' + next.color + '">' + KE.esc(next.num) + '</span><span class="nav-title">' + KE.esc(next.title) + '</span></span><span class="nav-arrow">›</span></a>'
      : '<a class="disabled"><span class="nav-label"><span class="nav-num">尾</span><span class="nav-title">已是最后一段</span></span><span class="nav-arrow">›</span></a>';
    nav.innerHTML = prevLink + nextLink;

    // Document title
    document.title = ch.title + ' · ' + ch.subtitle + ' — 哥窑';
  }

  // 暴露
  global.KE = global.KE || {};
  global.KE.renderChapter = renderChapter;
})();
