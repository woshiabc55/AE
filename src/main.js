/**
 * 应用入口
 */
import { renderMenu } from './ui/menu.js';
import { startBattle, render as renderBattle } from './ui/battle-ui.js';
import { store } from './game/state.js';

const stage = document.getElementById('stage');

// 初始化渲染主菜单
renderMenu(stage);

// 监听屏幕切换
store.subscribe((s) => {
  // 日志更新时不必重渲染整场战斗
});

// 暴露给全局（调试用）
window.__game = { store, startBattle, renderBattle };

console.log('%c暗影编年史 · Shadow Chronicle', 'color: #d4af37; font-size: 24px; font-weight: 800; font-family: serif;');
console.log('%c准备好了吗，旅人？', 'color: #c2a76b; font-style: italic; font-size: 14px;');
