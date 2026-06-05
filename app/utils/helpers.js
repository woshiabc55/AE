// 通用 helper — 暴露给 EJS 模板
export const helpers = {
  // pad: '5' -> '05'
  pad2: (n) => String(n).padStart(2, '0'),
  pad3: (n) => String(n).padStart(3, '0'),
  // 时钟
  clock: (d = new Date()) => {
    const h = helpers.pad2(d.getUTCHours());
    const m = helpers.pad2(d.getUTCMinutes());
    const s = helpers.pad2(d.getUTCSeconds());
    return `${h}:${m}:${s} UTC`;
  },
  date: (d = new Date()) => `${d.getUTCFullYear()}.${helpers.pad2(d.getUTCMonth() + 1)}.${helpers.pad2(d.getUTCDate())}`,
  // 友好时间
  timeAgo: (ts) => {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s 前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m 前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h 前`;
    return `${Math.floor(diff / 86400)}d 前`;
  },
  // 数字格式化
  num: (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  },
  // JSON 安全输出到 HTML
  json: (v) => JSON.stringify(v).replace(/</g, '\\u003c'),
  // 转义 HTML 字符
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  // 稀有度颜色
  rarityClass: (r) => `rarity-${String(r).toLowerCase()}`,
  // 数组分组(每 n 个一组)
  chunk: (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  },
  // 简易范围
  range: (n) => Array.from({ length: n }, (_, i) => i),
  // ifEquals
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  // 数组长度
  len: (a) => (Array.isArray(a) ? a.length : 0),
  // 求和
  sum: (arr, key) => arr.reduce((acc, x) => acc + (key ? x[key] : x), 0),
  // 平均
  avg: (arr, key) => (arr.length ? Math.round(helpers.sum(arr, key) / arr.length) : 0),
  // 计数
  count: (arr, pred) => arr.filter(pred).length,
  // 截断
  truncate: (s, n = 80) => (s.length > n ? s.slice(0, n) + '…' : s),
};
