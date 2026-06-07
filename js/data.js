/* =========================================================
   data.js — 暴露全局数据（v2: 6 段结构）
   ========================================================= */
(function (global) {
  'use strict';

  // 异步加载数据并通过回调暴露
  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.json();
  }

  // 同步注入（被各页面 script 标签直接包含）
  global.KE = global.KE || {};
  global.KE.loadShots = function () { return loadJSON('data/shots.json'); };
  global.KE.loadCharacters = function () { return loadJSON('data/characters.json'); };
  global.KE.loadStructure = function () { return loadJSON('data/structure.json'); };

  // 提供 image URL 生成
  global.KE.imageUrl = function (prompt, size) {
    const enc = encodeURIComponent(prompt);
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + enc + '&image_size=' + (size || 'landscape_16_9');
  };

  // 工具：幕名映射（v2 兼容）
  global.KE.ACT_NAMES = {
    preface: '前幕·制作组',
    ch1: '第一章·角色·离别-入梦',
    ch2: '第二章·梦中·制窑-入境-反思',
    ch3: '第三章·弟归',
    ch4: '第四章·共窑-传名',
    epilogue: '尾幕·展开PPT'
  };

  // 工具：数字补零
  global.KE.pad2 = function (n) {
    n = parseInt(n, 10) || 0;
    return n < 10 ? '0' + n : '' + n;
  };

  // 工具：根据 act id 获取新章节名
  global.KE.chapterName = function (actId) {
    return global.KE.ACT_NAMES[actId] || actId;
  };
})(window);
