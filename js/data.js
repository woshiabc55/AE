/* =========================================================
   data.js — 暴露全局数据
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

  // 提供 image URL 生成
  global.KE.imageUrl = function (prompt, size) {
    const enc = encodeURIComponent(prompt);
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + enc + '&image_size=' + (size || 'landscape_16_9');
  };

  // 工具：获取幕名
  global.KE.ACT_NAMES = {
    prologue: '序幕·现代',
    act1: '第一幕·历史回溯',
    act2: '第二幕·贡品之印',
    act3: '第三幕·窑火成瓷'
  };

  // 工具：数字补零
  global.KE.pad2 = function (n) {
    n = parseInt(n, 10) || 0;
    return n < 10 ? '0' + n : '' + n;
  };
})(window);
