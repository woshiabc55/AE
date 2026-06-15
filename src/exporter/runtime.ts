// 嵌入到导出 HTML 的播放器运行时。
// 这段代码会原样注入到 <script> 中，运行环境是浏览器，不依赖任何外部库。
// 接收数据：window.__RR_DATA__ = { project, videoDataUrl }

export const RUNTIME_JS = `
(function(){
  if (window.__RR_RUNTIME__) return;
  window.__RR_RUNTIME__ = true;
  var DATA = window.__RR_DATA__ || {};
  var PROJECT = DATA.project || {};
  var VIDEO_SRC = DATA.videoDataUrl || "";
  var VIDEO_MIME = DATA.videoMime || "video/mp4";

  var state = {
    currentTime: 0,
    isPlaying: false,
    selectedAnnotation: null,
    compare: { on: false, aIdx: 0, bIdx: 1 }
  };

  // ---------- DOM ----------
  var $ = function(sel, root){ return (root || document).querySelector(sel); };
  var $$ = function(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, attrs, children){
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    if (children) for (var i = 0; i < children.length; i++) n.appendChild(children[i]);
    return n;
  }

  function fmt(t){
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t/60), s = Math.floor(t)%60;
    var pad = function(n){ return n < 10 ? "0"+n : ""+n; };
    return pad(m) + ":" + pad(s);
  }

  // ---------- 根结构 ----------
  var root = $("#rr-root") || el("div", { id: "rr-root" });
  root.innerHTML = "";
  var fontFamily = (PROJECT.theme && PROJECT.theme.font) === "JetBrains Mono" ? '"JetBrains Mono", monospace'
    : (PROJECT.theme && PROJECT.theme.font) === "Space Grotesk" ? '"Space Grotesk", system-ui, sans-serif'
    : 'Inter, system-ui, sans-serif';
  root.style.fontFamily = fontFamily;
  var primary = (PROJECT.theme && PROJECT.theme.primary) || "#7CFFB2";
  var accent = (PROJECT.theme && PROJECT.theme.accent) || "#FF5DA2";

  // 头部
  var header = el("div", { class: "rr-header" });
  var brand = el("div", { class: "rr-brand" });
  brand.appendChild(el("div", { class: "rr-logo" }));
  brand.appendChild(el("div", { class: "rr-title", text: (PROJECT.theme && PROJECT.theme.brand) || "RigReel" }));
  var titleEl = el("div", { class: "rr-project-title", text: PROJECT.name || "未命名工程" });
  header.appendChild(brand);
  header.appendChild(titleEl);
  var headerRight = el("div", { class: "rr-header-right" });
  var compareBtn = el("button", { class: "rr-btn" }, [el("span", { text: "对比模式" })]);
  var pipBtn = el("button", { class: "rr-btn" }, [el("span", { text: "画中画" })]);
  var fsBtn = el("button", { class: "rr-btn" }, [el("span", { text: "全屏" })]);
  headerRight.appendChild(compareBtn);
  headerRight.appendChild(pipBtn);
  headerRight.appendChild(fsBtn);
  header.appendChild(headerRight);
  root.appendChild(header);

  // 主体
  var main = el("div", { class: "rr-main" });
  var stage = el("div", { class: "rr-stage" });
  var stageInner = el("div", { class: "rr-stage-inner" });
  var videoA = el("video", { class: "rr-video" });
  videoA.controls = false;
  videoA.preload = "metadata";
  videoA.playsInline = true;
  var srcA = el("source", { src: VIDEO_SRC, type: VIDEO_MIME });
  videoA.appendChild(srcA);
  stageInner.appendChild(videoA);
  var annLayer = el("div", { class: "rr-ann-layer" });
  stageInner.appendChild(annLayer);
  stage.appendChild(stageInner);
  main.appendChild(stage);

  var side = el("div", { class: "rr-side" });
  var chaptersBlock = el("div", { class: "rr-block" });
  chaptersBlock.appendChild(el("div", { class: "rr-block-title", text: "CHAPTERS · 章节" }));
  var chapterList = el("div", { class: "rr-chapter-list" });
  chaptersBlock.appendChild(chapterList);
  side.appendChild(chaptersBlock);

  var annBlock = el("div", { class: "rr-block" });
  annBlock.appendChild(el("div", { class: "rr-block-title", text: "ANNOTATIONS · 注释" }));
  var annList = el("div", { class: "rr-ann-list" });
  annBlock.appendChild(annList);
  side.appendChild(annBlock);
  main.appendChild(side);
  root.appendChild(main);

  // 时间轴
  var timeline = el("div", { class: "rr-timeline" });
  var ruler = el("div", { class: "rr-ruler" });
  timeline.appendChild(ruler);
  var track = el("div", { class: "rr-track" });
  timeline.appendChild(track);
  var playhead = el("div", { class: "rr-playhead" });
  timeline.appendChild(playhead);
  root.appendChild(timeline);

  // 控制
  var controls = el("div", { class: "rr-controls" });
  var playBtn = el("button", { class: "rr-play" }, [el("span", { text: "▶" })]);
  var timeEl = el("div", { class: "rr-time", text: "00:00 / 00:00" });
  var speedSel = el("select", { class: "rr-speed" });
  [0.25, 0.5, 1, 1.5, 2].forEach(function(s){
    var o = el("option", { value: String(s), text: s + "x" });
    if (s === 1) o.selected = true;
    speedSel.appendChild(o);
  });
  controls.appendChild(playBtn);
  controls.appendChild(timeEl);
  controls.appendChild(speedSel);
  root.appendChild(controls);

  // 章节列表
  function buildChapters(){
    chapterList.innerHTML = "";
    (PROJECT.chapters || []).forEach(function(c){
      var row = el("div", { class: "rr-ch-row", "data-id": c.id });
      var dot = el("div", { class: "rr-ch-dot" });
      dot.style.background = c.color || primary;
      row.appendChild(dot);
      var text = el("div", { class: "rr-ch-text" });
      text.appendChild(el("div", { class: "rr-ch-name", text: c.title }));
      text.appendChild(el("div", { class: "rr-ch-time", text: fmt(c.start) + " — " + fmt(c.end) }));
      row.appendChild(text);
      row.addEventListener("click", function(){
        seekTo(c.start);
        videoA.play();
      });
      chapterList.appendChild(row);
    });
  }

  // 注释列表
  function buildAnnList(){
    annList.innerHTML = "";
    var list = (PROJECT.annotations || []).slice().sort(function(a,b){ return a.t - b.t; });
    list.forEach(function(a){
      var row = el("div", { class: "rr-ann-row", "data-id": a.id });
      var dot = el("div", { class: "rr-ann-dot" });
      dot.style.background = a.kind === "facial" ? accent : primary;
      row.appendChild(dot);
      var text = el("div", { class: "rr-ch-text" });
      var name = a.kind === "facial" ? ("面部 · " + a.control) : ("骨骼 · " + a.label);
      text.appendChild(el("div", { class: "rr-ch-name", text: name }));
      text.appendChild(el("div", { class: "rr-ch-time", text: fmt(a.t) }));
      row.appendChild(text);
      row.addEventListener("click", function(){ seekTo(a.t); });
      annList.appendChild(row);
    });
  }

  // 标尺
  function buildRuler(){
    ruler.innerHTML = "";
    var dur = videoA.duration || (PROJECT.video && PROJECT.video.duration) || 0;
    if (!dur) return;
    var step = dur > 120 ? 10 : dur > 30 ? 5 : 1;
    for (var t = 0; t <= dur; t += step) {
      var left = (t / dur) * 100;
      var tick = el("div", { class: "rr-tick" });
      tick.style.left = left + "%";
      tick.appendChild(el("span", { class: "rr-tick-label", text: fmt(t) }));
      ruler.appendChild(tick);
    }
  }

  // 章节条
  function buildChaptersOnTrack(){
    Array.prototype.slice.call(track.querySelectorAll(".rr-ch-bar")).forEach(function(n){ n.remove(); });
    var dur = videoA.duration || (PROJECT.video && PROJECT.video.duration) || 0;
    if (!dur) return;
    (PROJECT.chapters || []).forEach(function(c){
      var left = (c.start / dur) * 100;
      var width = ((c.end - c.start) / dur) * 100;
      var bar = el("div", { class: "rr-ch-bar", title: c.title });
      bar.style.left = left + "%";
      bar.style.width = Math.max(0.4, width) + "%";
      bar.style.background = c.color || primary;
      bar.appendChild(el("span", { class: "rr-ch-bar-label", text: c.title }));
      bar.addEventListener("click", function(e){
        e.stopPropagation();
        seekTo(c.start);
        videoA.play();
      });
      track.appendChild(bar);
    });
  }

  function renderAnnotations(){
    annLayer.innerHTML = "";
    var t = state.currentTime;
    var window = 1.2;
    (PROJECT.annotations || []).forEach(function(a){
      if (Math.abs(a.t - t) > window) return;
      var wrap = el("div", { class: "rr-ann " + a.kind });
      wrap.style.left = (a.x * 100) + "%";
      wrap.style.top = (a.y * 100) + "%";
      var color = a.kind === "facial" ? accent : (a.color || primary);
      if (a.kind === "facial"){
        wrap.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="6" fill="'+color+'" fill-opacity="0.18" stroke="'+color+'" stroke-width="1.4"/><circle cx="11" cy="11" r="2" fill="'+color+'"/></svg>';
        wrap.appendChild(el("div", { class: "rr-ann-tip", text: facialLabel(a.control) }));
      } else {
        var tx = (a.tailTo ? a.tailTo.x : a.x) * 100;
        var ty = (a.tailTo ? a.tailTo.y : a.y) * 100;
        wrap.innerHTML = '<svg class="rr-ann-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="'+tx+'" y1="'+ty+'" x2="50" y2="50" stroke="'+color+'" stroke-width="0.4" stroke-dasharray="1,1"/></svg>';
        wrap.appendChild(el("div", { class: "rr-bone-dot" }));
        wrap.appendChild(el("div", { class: "rr-ann-tip", text: a.label || "Bone" }));
      }
      annLayer.appendChild(wrap);
    });
  }

  function facialLabel(c){
    var map = { jaw:"下颌", chin:"下巴尖", mouth_l:"嘴角·左", mouth_r:"嘴角·右", lip_top:"上唇", lip_bot:"下唇", lip_corner_l:"唇角·左", lip_corner_r:"唇角·右", tongue:"舌头", brow_l:"眉毛·左", brow_r:"眉毛·右", brow_inner_l:"眉心·左", brow_inner_r:"眉心·右", eye_l:"上眼睑·左", eye_r:"上眼睑·右", pupil_l:"瞳孔·左", pupil_r:"瞳孔·右", nose_tip:"鼻尖", cheek_l:"脸颊·左", cheek_r:"脸颊·右", ear_l:"耳朵·左", ear_r:"耳朵·右" };
    return map[c] || c;
  }

  function seekTo(t){
    t = Math.max(0, Math.min(videoA.duration || 0, t));
    state.currentTime = t;
    try { videoA.currentTime = t; } catch(e){}
    updatePlayhead();
    renderAnnotations();
  }

  function updatePlayhead(){
    var dur = videoA.duration || 0;
    if (!dur) { playhead.style.left = "0%"; return; }
    var left = (state.currentTime / dur) * 100;
    playhead.style.left = left + "%";
    timeEl.textContent = fmt(state.currentTime) + " / " + fmt(dur);
  }

  // 事件
  playBtn.addEventListener("click", function(){
    if (videoA.paused) { videoA.play(); } else { videoA.pause(); }
  });
  videoA.addEventListener("play", function(){ state.isPlaying = true; playBtn.innerHTML = "<span>❚❚</span>"; });
  videoA.addEventListener("pause", function(){ state.isPlaying = false; playBtn.innerHTML = "<span>▶</span>"; });
  videoA.addEventListener("timeupdate", function(){
    state.currentTime = videoA.currentTime;
    updatePlayhead();
    renderAnnotations();
  });
  videoA.addEventListener("loadedmetadata", function(){
    buildRuler();
    buildChaptersOnTrack();
    updatePlayhead();
    renderAnnotations();
  });

  speedSel.addEventListener("change", function(){ videoA.playbackRate = parseFloat(speedSel.value); });

  // 点击时间轴
  timeline.addEventListener("click", function(e){
    if (e.target.closest(".rr-ch-bar")) return;
    var rect = timeline.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    seekTo(ratio * (videoA.duration || 0));
  });

  // 拖动
  (function(){
    var dragging = false;
    function pos(e){
      var rect = timeline.getBoundingClientRect();
      var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekTo(ratio * (videoA.duration || 0));
    }
    playhead.addEventListener("mousedown", function(e){ dragging = true; pos(e); document.body.style.cursor="ew-resize"; });
    document.addEventListener("mousemove", function(e){ if (dragging) pos(e); });
    document.addEventListener("mouseup", function(){ dragging = false; document.body.style.cursor=""; });
  })();

  // 对比模式
  compareBtn.addEventListener("click", function(){
    state.compare.on = !state.compare.on;
    compareBtn.classList.toggle("active", state.compare.on);
    if (state.compare.on) {
      // 切到对比样式
      stage.classList.add("rr-compare");
      var ch = PROJECT.chapters || [];
      if (ch.length >= 2) {
        var aDur = ch[state.compare.aIdx].end - ch[state.compare.aIdx].start;
        var bDur = ch[state.compare.bIdx].end - ch[state.compare.bIdx].start;
        videoA.style.display = "block";
        annLayer.style.display = "block";
      }
    } else {
      stage.classList.remove("rr-compare");
    }
  });

  // 画中画
  pipBtn.addEventListener("click", function(){
    if (document.pictureInPictureElement === videoA) {
      document.exitPictureInPicture().catch(function(){});
    } else if (document.pictureInPictureEnabled) {
      videoA.requestPictureInPicture().catch(function(){});
    }
  });

  // 全屏
  fsBtn.addEventListener("click", function(){
    if (document.fullscreenElement) document.exitFullscreen();
    else root.requestFullscreen && root.requestFullscreen();
  });

  // 键盘
  document.addEventListener("keydown", function(e){
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (e.key === " " || e.code === "Space") { e.preventDefault(); if (videoA.paused) videoA.play(); else videoA.pause(); }
    else if (e.key === "ArrowLeft") { seekTo(state.currentTime - (1/30)); }
    else if (e.key === "ArrowRight") { seekTo(state.currentTime + (1/30)); }
    else if (e.key === "Home") { seekTo(0); }
    else if (e.key === "End") { seekTo(videoA.duration || 0); }
  });

  // 初始化
  buildChapters();
  buildAnnList();
  if (PROJECT.theme && PROJECT.theme.showWatermark) {
    var wm = el("div", { class: "rr-watermark", text: "Made with RigReel" });
    root.appendChild(wm);
  }

  // 暴露
  window.RigReel = { seekTo: seekTo, getState: function(){ return state; } };
})();
`;
