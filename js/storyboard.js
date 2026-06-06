/* =========================================================
   storyboard.js — 分镜长卷渲染
   ========================================================= */
(function () {
  'use strict';

  const listEl = document.getElementById('storyboardList');
  const statTotal = document.getElementById('statTotal');
  const statActs = document.getElementById('statActs');
  const statLines = document.getElementById('statLines');

  function renderShot(shot) {
    const visual = KE.esc(shot.visual || '（无画面描述）');
    const audio = KE.esc(shot.audio || '（无声）');
    const dialogue = KE.formatDialogue(shot.audio);
    const imgUrl = KE.imageUrl(shot.prompt, shot.imageSize || 'landscape_16_9');

    return '' +
      '<article class="shot" data-shot="' + shot.id + '">' +
        '<a class="shot__media" href="shot.html?shot=' + shot.id + '" aria-label="查看镜号 ' + shot.id + ' 详情">' +
          '<div class="shot__media-loading">生成中 · ' + shot.id + '</div>' +
          '<img src="' + imgUrl + '" alt="镜号 ' + shot.id + '：' + visual + '" loading="lazy" onload="this.previousElementSibling && (this.previousElementSibling.style.display=\'none\')" onerror="this.previousElementSibling && (this.previousElementSibling.textContent=\'图片暂未生成\'); this.style.opacity=0.3">' +
          '<span class="shot__media-num">#' + shot.id + '</span>' +
          '<span class="shot__media-size">' + KE.esc(shot.shotSize) + '</span>' +
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
          (shot.audio ? '<div class="shot__audio"><strong>声音 / 台词</strong>' + dialogue + '</div>' : '') +
          '<a class="shot__link" href="shot.html?shot=' + shot.id + '">查看单镜详情 →</a>' +
        '</div>' +
      '</article>';
  }

  function renderActHeader(name) {
    return '<div class="act-divider"><div class="act-divider__num">Act</div><div class="act-divider__title">' + KE.esc(name) + '</div></div>';
  }

  function render(shots) {
    const groups = {};
    const order = [];
    shots.forEach(function (s) {
      if (!groups[s.act]) {
        groups[s.act] = [];
        order.push(s.act);
      }
      groups[s.act].push(s);
    });

    let html = '';
    order.forEach(function (act) {
      html += renderActHeader(KE.ACT_NAMES[act] || act);
      groups[act].forEach(function (s) {
        html += renderShot(s);
      });
    });

    listEl.innerHTML = html;

    // 统计
    const lines = shots.filter(function (s) { return s.audio; }).length;
    statTotal.textContent = shots.length;
    statActs.textContent = order.length;
    statLines.textContent = lines;

    // 显隐动画
    KE.observe('.shot', 'visible');
  }

  KE.loadShots().then(function (data) {
    render(data.shots);
  }).catch(function (err) {
    listEl.innerHTML = '<div style="text-align:center;padding:60px;color:var(--seal-red)">数据加载失败：' + KE.esc(err.message) + '</div>';
  });
})();
