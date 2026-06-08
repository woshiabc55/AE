/**
 * 轻量级状态管理（发布订阅）
 * 模拟 zustand 风格的极简 store
 */

export function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  function get() {
    return state;
  }

  function set(updater) {
    const next = typeof updater === 'function' ? updater(state) : updater;
    if (next === state) return;
    state = { ...state, ...next };
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { get, set, subscribe };
}

/**
 * 全局应用 store
 */
export const store = createStore({
  // 屏幕：menu | battle | gameover
  screen: 'menu',
  // 玩家职业
  playerClass: null,
  // AI 职业
  aiClass: null,
  // 战斗状态
  battle: null,
  // 战斗日志
  logs: [],
  // 战斗结果
  result: null,
  // 弹窗 toast
  toast: null,
});

/**
 * 推送日志
 */
export function pushLog(text, type = 'info') {
  const entry = { id: Date.now() + Math.random(), text, type, time: new Date() };
  store.set((s) => ({ logs: [...(s.logs || []), entry].slice(-40) }));
}

/**
 * 显示 toast
 */
export function showToast(text, duration = 2000) {
  store.set({ toast: { text, id: Date.now() } });
  setTimeout(() => {
    store.set((s) => (s.toast && s.toast.text === text ? { toast: null } : {}));
  }, duration);
}
