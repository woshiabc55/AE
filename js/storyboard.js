/* =========================================================
   storyboard.js — 分镜长卷渲染（v2: 6 段结构 + 章节分组）
   ========================================================= */
(function () {
  'use strict';

  const listEl = document.getElementById('storyboardList');
  const statTotal = document.getElementById('statTotal');
  const statActs = document.getElementById('statActs');
  const statLines = document.getElementById('statLines');
  const statDuration = document.getElementById('statDuration');
  const filterEl = document.getElementById('chapterFilter');

  function renderShot(shot, color) {
    const visual = KE.esc(shot.visual || '（无画面描述）');
    const audio = KE.esc(shot.audio || '');
    const dialogue = KE.formatDialogue(shot.audio);
    const imgUrl = KE.imageUrl(shot.prompt, shot.imageSize || 'landscape_16_9');
    const accent = color || 'var(--kiln-fire)';

    return '' +
      '<article class="shot" data-shot="' + shot.id + '" data-act="' + KE.esc(shot.act) + '">' +
        '<a class="shot__media" href="shot.html?shot=' + shot.id + '" aria-label="查看镜号 ' + shot.id + ' 详情">' +
          '<div class="shot__media-loading">生成中 · ' + shot.id + '</div>' +
          '<img src="' + imgUrl + '" alt="镜号 ' + shot.id + '：' + visual + '" loading="lazy" onload="this.previousElementSibling && (this.previousElementSibling.style.display=\'none\')" onerror="this.previousElementSibling && (this.previousElementSibling.textContent=\'图片暂未生成\'); this.style.opacity=0.3">' +
          '<span class="shot__media-num">#' + shot.id + '</span>' +
          '<span class="shot__media-size" style="background:' + accent + '">' + KE.esc(shot.shotSize) + '</span>' +
        '</a>' +
        '<div class="shot__body">' +
          '<div class="shot__id">镜号 ' + shot.id + ' / ' + KE.esc(shot.actName) + '</div>' +
          '<h3 class="shot__title">' + KE.esc(shot.shotSize) + ' · ' + (shot.duration || '—') + '</h3>' +
          '<div class="shot__meta">' +
            '<span><span class="label">景别</span> ' + KE.esc(shot.shotSize) + '</span>' +
            (shot.duration ? '<span><span class="label">时长</span> ' + KE.esc(shot.duration) + '</span>' : '') +
            '<span><span class="label">幕</span> ' + KE.esc(shot.actName) + '</span>' +
          '</div>' +
          '<div class="shot__visual"><strong>画面</strong>' + visual + '</div>' +
          (audio ? '<div class="shot__audio"><strong>声音 / 台词</strong>' + dialogue + '</div>' : '') +
          '<a class="shot__link" href="shot.html?shot=' + shot.id + '" style="color:' + accent + '">查看单镜详情 →</a>' +
        '</div>' +
      '</article>';
  }

  function renderActHeader(act, name, color, extra) {
    return '' +
      '<div class="act-divider" style="--divider:' + color + '">' +
        '<div class="act-divider__num" style="color:' + color + '">' + KE.esc(act) + '</div>' +
        '<div class="act-divider__title">' + KE.esc(name) + '</div>' +
        (extra ? '<div class="act-divider__extra">' + extra + '</div>' : '') +
      '</div>';
  }

  function render(shots, structure) {
    const groups = {};
    const order = [];
    shots.forEach(function (s) {
      if (!groups[s.act]) {
        groups[s.act] = [];
        order.push(s.act);
      }
      groups[s.act].push(s);
    });

    // 章节色映射
    const colorMap = {
      ch1: '#6b8e7f',
      ch2: '#8a4a2c',
      ch3: '#b53028',
      ch4: '#d96b27'
    };

    let html = '';
    order.forEach(function (act) {
      let title = KE.ACT_NAMES[act] || act;
      let color = colorMap[act] || 'var(--kiln-fire)';
      let extra = '';
      if (structure && structure.chapters) {
        const ch = structure.chapters.find(function (c) { return c.id === act; });
        if (ch) {
          extra = '<span class="act-divider__range">镜 ' + ch.shotRange[0] + '–' + ch.shotRange[1] + ' · ' + ch.duration + '</span>';
        }
      }
      html += renderActHeader(act.toUpperCase(), title, color, extra);
      groups[act].forEach(function (s) {
        html += renderShot(s, color);
      });
    });

    listEl.innerHTML = html;

    // 统计
    const lines = shots.filter(function (s) { return s.audio; }).length;
    if (statTotal) statTotal.textContent = shots.length;
    if (statActs) statActs.textContent = order.length;
    if (statLines) statLines.textContent = lines;
    if (statDuration && structure && structure.totalDuration) {
      statDuration.textContent = structure.totalDuration;
    }

    // 显隐动画
    KE.observe('.shot', 'visible');
  }

  // 章节筛选 UI
  function renderFilter(structure) {
    if (!filterEl || !structure) return;
    const items = [
      { id: 'all', label: '全部', num: shots_total, color: 'var(--ink-black)' },
      ...structure.chapters.map(function (c, i) {
        return { id: c.id, label: c.title, num: 'ch.' + c.chapterNum, color: c.color, href: 'chapter-' + (i + 1) + '.html' };
      })
    ];
    filterEl.innerHTML = items.map(function (it) {
      const cls = it.id === 'all' ? 'is-active' : '';
      const tag = it.href ? 'a' : 'button';
      const href = it.href ? ' href="' + it.href + '"' : '';
      return '<' + tag + ' class="filter__chip ' + cls + '" data-filter="' + it.id + '"' + href +
        ' style="--chip-color:' + it.color + '">' +
        '<span class="filter__num">' + KE.esc(it.num) + '</span>' +
        '<span class="filter__label">' + KE.esc(it.label) + '</span>' +
        '</' + tag + '>';
    }).join('');

    // 绑定筛选
    filterEl.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const f = btn.getAttribute('data-filter');
        if (f === 'all') {
          e.preventDefault();
          filterEl.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          listEl.querySelectorAll('.shot').forEach(function (s) { s.style.display = ''; });
          listEl.querySelectorAll('.act-divider').forEach(function (d) { d.style.display = ''; });
        } else {
          // 单章节时跳到详情页（更专注）
        }
      });
    });
  }

  let shots_total = 0;

  Promise.all([KE.loadShots(), KE.loadStructure()]).then(function (results) {
    const sData = results[0];
    const structure = results[1];
    shots_total = sData.shots.length;
    render(sData.shots, structure);
    renderFilter(structure);
  }).catch(function (err) {
    listEl.innerHTML = '<div style="text-align:center;padding:60px;color:var(--seal-red)">数据加载失败：' + KE.esc(err.message) + '</div>';
  });
})();
