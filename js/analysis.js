/* =========================================================
   analysis.js — 主旨解读页（v2: 6 段结构 / 4 章节）
   ========================================================= */
(function () {
  'use strict';

  const root = document.getElementById('analysisRoot');

  function findShot(shots, id) {
    return shots.find(function (s) { return s.id === id; });
  }

  function renderShotLink(shot) {
    if (!shot) return '';
    return '<a href="shot.html?shot=' + shot.id + '" style="color:var(--seal-red);">镜 ' + shot.id + '</a>';
  }

  Promise.all([KE.loadCharacters(), KE.loadShots(), KE.loadStructure()]).then(function (results) {
    const cData = results[0];
    const sData = results[1];
    const structure = results[2];
    const shots = sData.shots;
    const brothers = cData.characters;

    // 章节章节主题色
    const chapterColors = {
      ch1: '#6b8e7f',
      ch2: '#8a4a2c',
      ch3: '#b53028',
      ch4: '#d96b27'
    };

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

    function renderKeyLines(c) {
      return c.keyLines.map(function (kl) {
        const shot = findShot(shots, kl.shot);
        return '' +
          '<li>' +
            renderShotLink(shot) + ' · ' +
            KE.formatDialogue(kl.line) +
            (shot ? ' <span style="color:var(--ink-soft);font-size:0.85em">（' + KE.esc(shot.shotSize) + '）</span>' : '') +
          '</li>';
      }).join('');
    }

    // 按章节分组的镜号关键台词
    function chapterKeyLines(chId) {
      return shots
        .filter(function (s) { return s.act === chId; })
        .filter(function (s) { return s.audio; })
        .slice(0, 4)
        .map(function (s) {
          return '<li>' +
            renderShotLink(s) + ' · ' +
            KE.formatDialogue(s.audio) +
            ' <span style="color:var(--ink-soft);font-size:0.85em">（' + KE.esc(s.shotSize) + '）</span>' +
            '</li>';
        }).join('');
    }

    function renderChapterBlock(ch, idx) {
      const color = ch.color || 'var(--kiln-fire)';
      const href = 'chapter-' + (idx + 1) + '.html';
      return '' +
        '<section class="slide chapter-block" style="--ch-color:' + color + '">' +
          '<div class="chapter-block__head">' +
            '<span class="chapter-block__num" style="color:' + color + '">' + KE.pad2(ch.chapterNum) + '</span>' +
            '<div class="chapter-block__title">' +
              '<h2 class="slide__title">' + KE.esc(ch.title) + ' · ' + KE.esc(ch.subtitle) + '</h2>' +
              '<span class="chapter-block__duration">' + KE.esc(ch.duration) + ' · 镜 ' + ch.shotRange[0] + '–' + ch.shotRange[1] + '</span>' +
            '</div>' +
            '<a href="' + href + '" class="chapter-block__more">→ 查看章节</a>' +
          '</div>' +
          '<p class="slide__content">' + KE.esc(ch.desc) + '</p>' +
          '<div class="chapter-block__keyline">「' + KE.esc(ch.keyline) + '」</div>' +
          '<ul class="slide__list chapter-block__lines">' + chapterKeyLines(ch.id) + '</ul>' +
        '</section>';
    }

    // 章节卡片区段
    const chapterBlocks = (structure.chapters || []).map(renderChapterBlock).join('');

    const html = '' +
      // 总纲
      '<section class="slide">' +
        '<h2 class="slide__title">总纲——不变的核心</h2>' +
        '<p class="slide__subtitle">《哥窑》</p>' +
        '<p class="slide__content">《哥窑》是关于"传承"的视觉史诗。"哥"通"歌"——窑火如歌，兄弟如线。</p>' +
        '<p class="slide__content">本项目以修订版"哥哥=张寄，弟弟=张志元"为准。原始脚本中"章生一""张志耀""张寄"等混用视为笔误。</p>' +
      '</section>' +

      // 6 段结构提示
      '<section class="slide structure-overview">' +
        '<h2 class="slide__title">6 段结构总览</h2>' +
        '<p class="slide__subtitle">前幕·制作组 / 第一~四章 / 尾幕·展开 PPT</p>' +
        '<div class="structure-overview__list">' +
          '<a href="preface.html" class="structure-overview__item" style="--so:#0e0e10">' +
            '<span class="so__num">前幕</span>' +
            '<span class="so__sub">制作组·自白</span>' +
            '<span class="so__dur">24s</span>' +
          '</a>' +
          (structure.chapters || []).map(function (c, i) {
            return '<a href="chapter-' + (i + 1) + '.html" class="structure-overview__item" style="--so:' + c.color + '">' +
              '<span class="so__num">' + KE.esc(c.title) + '</span>' +
              '<span class="so__sub">' + KE.esc(c.subtitle) + '</span>' +
              '<span class="so__dur">' + KE.esc(c.duration) + '</span>' +
            '</a>';
          }).join('') +
          '<a href="epilogue.html" class="structure-overview__item" style="--so:#1a1814">' +
            '<span class="so__num">尾幕</span>' +
            '<span class="so__sub">展开 PPT</span>' +
            '<span class="so__dur">—</span>' +
          '</a>' +
        '</div>' +
      '</section>' +

      // 4 章节详细解读
      chapterBlocks +

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
        '<ul class="slide__list">' + renderKeyLines(brothers[0]) + '</ul>' +
      '</section>' +

      '<section class="slide slide--explorer">' +
        '<h2 class="slide__title">证据链（二）—— 弟弟张志元的探索</h2>' +
        '<p class="slide__subtitle">开创者的天赋之眼</p>' +
        '<p class="slide__content">弟弟在剧中的"探索"动作链：</p>' +
        '<ul class="slide__list">' + renderKeyLines(brothers[1]) + '</ul>' +
      '</section>' +

      // 升华
      '<section class="slide slide--transcendence">' +
        '<h2 class="slide__title">主旨升华</h2>' +
        '<p class="slide__subtitle">"哥"是"歌"，也是"兄"</p>' +
        '<div class="slide__content">"哥窑之'哥'，非长幼之序，乃'歌'之古字——窑火如歌，兄弟如线。"</div>' +
        '<ul class="slide__list">' +
          '<li><strong>哥哥张寄</strong> = 那首"歌"的定音鼓和节拍器——他让弟弟的狂想不至于失控，让天赋落地为传世之作。</li>' +
          '<li><strong>弟弟张志元</strong> = 探索者的天赋之眼——能听见"土在唱歌"，能听出"火太急了"。</li>' +
          '<li>真正的传承，从来不是一个人的独唱，而是两双手按在同一方印上（' + renderShotLink(findShot(shots, 45)) + '）、两个背影在时光中重叠（' + renderShotLink(findShot(shots, 66)) + '）的二重唱。</li>' +
          '<li>哥哥代表"持守"，弟弟代表"开创"。<strong>哥窑之美，正在于持守与开创的完美和弦。</strong></li>' +
        '</ul>' +
        '<p class="slide__content" style="margin-top:24px"><a href="epilogue-ppt.html" class="btn btn--fire">→ 展开 11 页 PPT</a></p>' +
      '</section>';

    root.innerHTML = html;
  }).catch(function (err) {
    root.innerHTML = '<div style="text-align:center;padding:60px;color:var(--seal-red)">数据加载失败：' + KE.esc(err.message) + '</div>';
  });
})();
