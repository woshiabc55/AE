/* =========================================================
   ppt.js — PPT 演示翻页逻辑
   ========================================================= */
(function () {
  'use strict';

  const SLIDES = [
    {
      type: 'cover',
      title: '哥窑',
      titleAccent: '',
      subtitle: '窑火如歌，兄弟如线',
      content: '《哥窑》剧本 · 视觉史诗 · 修订版分镜与主旨解读',
      bullets: [
        { num: 'I', text: '<strong>总纲：</strong>关于"传承"的视觉史诗——"哥"通"歌"' },
        { num: 'II', text: '<strong>证据：</strong>兄弟二人四条动作链：守护 / 探索' },
        { num: 'III', text: '<strong>升华：</strong>持守与开创的和弦 = 哥窑之美' }
      ]
    },
    {
      type: 'normal',
      title: '总纲',
      titleAccent: '—— 不变的核心',
      subtitle: '《哥窑》',
      content: '"《哥窑》是关于'传承'的视觉史诗。'哥'通'歌'——窑火如歌，兄弟如线。"',
      bullets: [
        { num: '01', text: '<strong>剧本名：</strong>哥窑' },
        { num: '02', text: '<strong>结构：</strong>序幕·现代 + 第一/二/三幕（历史回溯 / 贡品之印 / 窑火成瓷）' },
        { num: '03', text: '<strong>核心冲突：</strong>持守与开创、个人与传承、技艺与时代' }
      ]
    },
    {
      type: 'normal',
      title: '人物定位',
      titleAccent: '—— 哥哥与弟弟',
      subtitle: '修订版关系（重要）',
      content: '本项目以修订版"哥哥=张寄，弟弟=张志元"为准。原始脚本中的"章生一""张志耀""张寄"等混用视为笔误。',
      bullets: [
        { num: '哥', text: '<strong>哥哥 张寄</strong>——持灯者/守护者。年长、稳重、理性。是"线"的锚点。' },
        { num: '弟', text: '<strong>弟弟 张志元</strong>——行路人/探索者。年轻、敏感、天赋异炳。是"线"的延伸。' }
      ]
    },
    {
      type: 'act',
      title: '第一幕',
      titleAccent: '·历史回溯',
      subtitle: '南下·寻土·建窑·开窑',
      content: '战乱 → 父亲嘱托 → 兄弟南下 → 发现紫金土 → 依山建龙窑 → 第一窑开火',
      quote: '"龙窑要依山而建，火才能顺着山势往上走。" —— 张寄',
      bullets: [
        { num: '镜9', text: '父亲：往南走，找能烧窑的土地，不能丢。手艺不能断。志元，看好你弟弟。' },
        { num: '镜16', text: '张志元：哥，这土……在唱歌。' },
        { num: '镜17', text: '张寄：那就这儿了。' }
      ]
    },
    {
      type: 'act',
      title: '第二幕',
      titleAccent: '·贡品之印',
      subtitle: '朝廷·青瓷·贡印',
      content: '官府查验 → 第二窑青瓷 → 釉面细纹浑然天成 → 赐"龙泉章氏"贡印',
      quote: '"无意之得，方为天工。此窑，准予贡品之印。" —— 朝廷官员',
      bullets: [
        { num: '镜40', text: '官员：这纹路……如冰裂，却浑然天成？' },
        { num: '镜45', text: '张志元：哥，没有你这盏灯，我哪能坚持学业……' },
        { num: '镜45', text: '兄弟二人手按同一印——传承不是独唱，是二重唱。' }
      ]
    },
    {
      type: 'act',
      title: '第三幕',
      titleAccent: '·窑火成瓷',
      subtitle: '火候·金丝铁线·天亮',
      content: '火候失控 → 哥哥拉住弟弟 → 静默守候 → 开窑：釉面金丝铁线前所未见',
      quote: '"等！现在开窑，全毁了！" —— 张寄 / "哥……成了。" —— 张志元',
      bullets: [
        { num: '镜51', text: '张志元：哥，火……太急了。' },
        { num: '镜53', text: '张寄：等！现在开窑，全毁了！' },
        { num: '镜57', text: '张志元：哥……成了。' }
      ]
    },
    {
      type: 'trans',
      title: '主旨升华',
      titleAccent: '',
      subtitle: '哥窑之"哥"——是"歌"，也是"兄"',
      content: '',
      quote: '"哥窑之'哥'，非长幼之序，乃'歌'之古字——窑火如歌，兄弟如线。"',
      bullets: [
        { num: '持守', text: '哥哥张寄 = 那首"歌"的定音鼓和节拍器' },
        { num: '开创', text: '弟弟张志元 = 让狂想落地为传世之作的天赋' },
        { num: '和弦', text: '哥窑之美 = 持守与开创的完美和弦' }
      ]
    },
    {
      type: 'end',
      title: '感谢观看',
      titleAccent: '',
      subtitle: '请进入分镜长卷查看全部 36+ 镜号',
      content: '',
      bullets: [
        { num: '①', text: '<a href="storyboard.html" style="color:var(--kiln-glow)">分镜长卷 →</a>' },
        { num: '②', text: '<a href="analysis.html" style="color:var(--kiln-glow)">主旨解读 →</a>' },
        { num: '③', text: '<a href="about.html" style="color:var(--kiln-glow)">关于项目 →</a>' }
      ]
    }
  ];

  const viewport = document.getElementById('pptViewport');
  const dotsEl = document.getElementById('pptDots');
  const progressEl = document.getElementById('pptProgress');
  const prevBtn = document.getElementById('pptPrev');
  const nextBtn = document.getElementById('pptNext');
  const fullscreenBtn = document.getElementById('pptFullscreen');

  let current = 0;

  function buildSlides() {
    const html = SLIDES.map(function (s, i) {
      const cover = s.type === 'cover' ? ' ppt__cover' : '';
      const act = s.type === 'act' ? ' ppt__act' : '';
      const end = s.type === 'end' ? ' ppt__cover' : '';
      const list = (s.bullets || []).map(function (b) {
        return '<li data-num="' + b.num + '">' + b.text + '</li>';
      }).join('');
      const quote = s.quote ? '<div class="ppt__quote">' + s.quote + '</div>' : '';
      return '' +
        '<section class="ppt__slide' + cover + act + end + '" data-index="' + i + '">' +
          '<span class="ppt__corner ppt__corner--tl">哥窑 · 修订版</span>' +
          '<span class="ppt__corner ppt__corner--tr">Slide ' + (i + 1) + ' / ' + SLIDES.length + '</span>' +
          '<h2 class="ppt__title">' + s.title + '<span class="accent">' + (s.titleAccent || '') + '</span></h2>' +
          (s.subtitle ? '<p class="ppt__subtitle">' + s.subtitle + '</p>' : '') +
          (s.content ? '<p class="ppt__content">' + s.content + '</p>' : '') +
          (list ? '<ul class="ppt__list">' + list + '</ul>' : '') +
          quote +
          '<span class="ppt__corner ppt__corner--bl">窑火如歌</span>' +
          '<span class="ppt__corner ppt__corner--br">' + (i + 1) + '</span>' +
        '</section>';
    }).join('');
    viewport.innerHTML = html;

    // 进度条
    const dots = SLIDES.map(function (_, i) {
      return '<span class="ppt__dot' + (i === 0 ? ' active' : '') + '" data-goto="' + i + '"></span>';
    }).join('');
    dotsEl.innerHTML = dots;
    dotsEl.addEventListener('click', function (e) {
      const t = e.target;
      if (t && t.dataset && t.dataset.goto) {
        go(parseInt(t.dataset.goto, 10));
      }
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
    const dots = dotsEl.querySelectorAll('.ppt__dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === n);
    });
    progressEl.textContent = (n + 1) + ' / ' + SLIDES.length;
    current = n;
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
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

    // 点击翻页
    viewport.addEventListener('click', function (e) {
      // 避免点击链接或按钮时翻页
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x > rect.width * 0.6) next();
      else if (x < rect.width * 0.4) prev();
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
    buildSlides();
    bindKeys();
    go(0);
  });
})();
