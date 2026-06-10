// 顶部 marquee 滚动条
const LINES = [
  "现在开拍 · ACTION",
  "把灵感装进磁轨",
  "一个场景，一个变量",
  "结构化提示词，可复用剧本资产",
  "今日节拍：起承转合",
  "Cut · Print · Next Take",
  "云端协作 · 本地优先",
];

export function Marquee() {
  // 复制一遍以形成无缝滚动
  const items = [...LINES, ...LINES, ...LINES];
  return (
    <div className="relative h-7 overflow-hidden border-b border-ink-700 bg-ink-800">
      <div className="absolute inset-0 flex items-center">
        <div className="flex shrink-0 animate-marquee whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {items.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="mx-8 text-paper-200">{t}</span>
              <span className="text-amber">●</span>
            </span>
          ))}
        </div>
      </div>
      {/* 边缘渐隐 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink-800 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink-800 to-transparent" />
    </div>
  );
}
