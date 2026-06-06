/* =========================================================
   analysis.js — 主旨解读页
   ========================================================= */
(function () {
  'use strict';

  const root = document.getElementById('analysisRoot');

  Promise.all([KE.loadCharacters(), KE.loadShots()]).then(function (results) {
    const cData = results[0];
    const sData = results[1];
    const shots = sData.shots;
    const brothers = cData.characters;

    function findShot(id) {
      return shots.find(function (s) { return s.id === id; });
    }

    function renderCharacter(c) {
      const traits = c.traits.map(function (t) { return '<span>' + KE.esc(t) + '</span>'; }).join('');
      return '' +
        '<div class="character-card">' +
          '<div class="character-card__avatar">' + KE.esc(c.name.charAt(0)) + '</div>' +
          '<div>' +
            '<div class="character-card__name">' + KE.esc(c.name) + '</div>' +
            '<div class="character-card__role">' + KE.esc(c.role) + '</div>' +
            '<div class="character-card__desc">' + KE.esc(c.description) + '</div>' +
            '<div class="character-card__traits">' + traits + '</div>' +
          '</div>' +
        '</div>';
    }

    function renderLines(c) {
      return c.keyLines.map(function (kl) {
        const shot = findShot(kl.shot);
        if (!shot) return '';
        return '' +
          '<li>' +
            '<a href="shot.html?shot=' + shot.id + '">镜 ' + shot.id + '</a> · ' +
            KE.formatDialogue(kl.line) +
            ' <span style="color:var(--ink-soft);font-size:0.85em">（' + KE.esc(shot.shotSize) + '）</span>' +
          '</li>';
      }).join('');
    }

    const html = '' +
      // 总纲
      '<section class="slide">' +
        '<h2 class="slide__title">总纲——不变的核心</h2>' +
        '<p class="slide__subtitle">《哥窑》</p>' +
        '<p class="slide__content">《哥窑》是关于"传承"的视觉史诗。"哥"通"歌"——窑火如歌，兄弟如线。</p>' +
        '<p class="slide__content">本项目以修订版"哥哥=张寄，弟弟=张志元"为准。原始脚本中"章生一""张志耀""张寄"等混用视为笔误。</p>' +
      '</section>' +

      // 人物
      '<section class="slide">' +
        '<h2 class="slide__title">人物定位</h2>' +
        '<p class="slide__subtitle">修订版兄弟关系</p>' +
        brothers.map(renderCharacter).join('') +
      '</section>' +

      // 证据链
      '<section class="slide slide--guardian">' +
        '<h2 class="slide__title">证据链（一）—— 哥哥张寄的守护</h2>' +
        '<p class="slide__subtitle">持守者的关键时刻</p>' +
        '<p class="slide__content">哥哥在剧中的"守护"动作链：</p>' +
        '<ul class="slide__list">' + renderLines(brothers[0]) + '</ul>' +
      '</section>' +

      '<section class="slide slide--explorer">' +
        '<h2 class="slide__title">证据链（二）—— 弟弟张志元的探索</h2>' +
        '<p class="slide__subtitle">开创者的天赋之眼</p>' +
        '<p class="slide__content">弟弟在剧中的"探索"动作链：</p>' +
        '<ul class="slide__list">' + renderLines(brothers[1]) + '</ul>' +
      '</section>' +

      // 升华
      '<section class="slide slide--transcendence">' +
        '<h2 class="slide__title">主旨升华</h2>' +
        '<p class="slide__subtitle">"哥"是"歌"，也是"兄"</p>' +
        '<div class="slide__content">"哥窑之'哥'，非长幼之序，乃'歌'之古字——窑火如歌，兄弟如线。"</div>' +
        '<ul class="slide__list">' +
          '<li><strong>哥哥张寄</strong> = 那首"歌"的定音鼓和节拍器——他让弟弟的狂想不至于失控，让天赋落地为传世之作。</li>' +
          '<li><strong>弟弟张志元</strong> = 探索者的天赋之眼——能听见"土在唱歌"，能听出"火太急了"。</li>' +
          '<li>真正的传承，从来不是一个人的独唱，而是两双手按在同一方印上（<a href="shot.html?shot=45">镜45</a>）、两个背影在时光中重叠（<a href="shot.html?shot=66">镜66</a>）的二重唱。</li>' +
          '<li>哥哥代表"持守"，弟弟代表"开创"。<strong>哥窑之美，正在于持守与开创的完美和弦。</strong></li>' +
        '</ul>' +
      '</section>';

    root.innerHTML = html;
  }).catch(function (err) {
    root.innerHTML = '<div style="text-align:center;padding:60px;color:var(--seal-red)">数据加载失败：' + KE.esc(err.message) + '</div>';
  });
})();
