/* =========================================================
   shot.js — 单镜详情
   ========================================================= */
(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('shot'), 10);
  const root = document.getElementById('shotRoot');

  if (!id) {
    root.innerHTML = '<div style="text-align:center;padding:60px"><h2>未指定镜号</h2><p><a href="storyboard.html" class="btn">← 返回分镜长卷</a></p></div>';
    return;
  }

  function renderShot(s, all) {
    const idx = all.findIndex(function (x) { return x.id === s.id; });
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx < all.length - 1 ? all[idx + 1] : null;

    const imgUrl = KE.imageUrl(s.prompt, s.imageSize || 'landscape_16_9');

    const prevLink = prev
      ? '<a href="shot.html?shot=' + prev.id + '">← 镜 ' + prev.id + ' · ' + KE.esc(prev.shotSize) + '</a>'
      : '<a class="disabled">已是第一镜</a>';
    const nextLink = next
      ? '<a href="shot.html?shot=' + next.id + '">镜 ' + next.id + ' · ' + KE.esc(next.shotSize) + ' →</a>'
      : '<a class="disabled">已是最后一镜</a>';

    return '' +
      '<div class="shot-detail__nav">' +
        '<a href="storyboard.html">← 返回分镜长卷</a>' +
        '<a href="analysis.html">主旨解读 →</a>' +
      '</div>' +
      '<div class="shot-detail__hero">' +
        '<div class="shot-detail__media">' +
          '<div class="shot__media-loading" id="shotImgLoading">生成中 · ' + s.id + '</div>' +
          '<img src="' + imgUrl + '" alt="镜 ' + s.id + '" onload="document.getElementById(\'shotImgLoading\') && (document.getElementById(\'shotImgLoading\').style.display=\'none\')" onerror="document.getElementById(\'shotImgLoading\') && (document.getElementById(\'shotImgLoading\').textContent=\'图片暂未生成\'); this.style.opacity=0.3">' +
        '</div>' +
        '<div class="shot-detail__info">' +
          '<div class="shot__id">镜号 ' + s.id + ' / ' + KE.esc(s.actName) + '</div>' +
          '<h1>' + KE.esc(s.shotSize) + '</h1>' +
          (s.duration ? '<div class="shot__id" style="margin-top:-8px">时长 ' + KE.esc(s.duration) + '</div>' : '') +
          '<dl>' +
            '<dt>景别</dt><dd>' + KE.esc(s.shotSize) + '</dd>' +
            '<dt>幕</dt><dd>' + KE.esc(s.actName) + '</dd>' +
            '<dt>画面</dt><dd>' + KE.esc(s.visual || '—') + '</dd>' +
            '<dt>声音</dt><dd>' + (s.audio ? KE.esc(s.audio) : '—') + '</dd>' +
          '</dl>' +
          (s.audio ? '<div class="shot-detail__quote">' + KE.formatDialogue(s.audio) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="shot-detail__nav-2">' + prevLink + nextLink + '</div>';
  }

  KE.loadShots().then(function (data) {
    const shot = data.shots.find(function (s) { return s.id === id; });
    if (!shot) {
      root.innerHTML = '<div style="text-align:center;padding:60px"><h2>未找到镜号 ' + id + '</h2><p><a href="storyboard.html" class="btn">← 返回分镜长卷</a></p></div>';
      return;
    }
    document.title = '镜 ' + shot.id + ' · ' + shot.shotSize + ' — 哥窑';
    root.innerHTML = renderShot(shot, data.shots);
  }).catch(function (err) {
    root.innerHTML = '<div style="text-align:center;padding:60px;color:var(--seal-red)">数据加载失败：' + KE.esc(err.message) + '</div>';
  });
})();
