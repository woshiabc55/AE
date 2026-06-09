import { useEffect, useState } from 'react';

// 顶部胶片过片条
export default function FilmStrip() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      setScroll(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 用 24 个 perforation 表示胶片
  const frames = 24;
  const filled = Math.round(scroll * frames);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* 胶片条 */}
      <div className="bg-carbon-900/95 border-b border-gilt-600/40 backdrop-blur-sm">
        <div className="flex items-center gap-1 px-2 py-1 overflow-hidden">
          <div className="slate text-[8px] text-gilt-400 shrink-0">REEL · 01</div>
          <div className="flex-1 flex items-center gap-[2px]">
            {Array.from({ length: frames }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-3 border border-gilt-600/40 transition-colors duration-200 ${
                  i < filled ? 'bg-clapper-500' : 'bg-carbon-700'
                }`}
              />
            ))}
          </div>
          <div className="slate text-[8px] text-parchment-100 shrink-0">
            {(scroll * 100).toFixed(0).padStart(2, '0')}%
          </div>
        </div>
        {/* 进度线 */}
        <div
          className="h-px bg-clapper-500 transition-[width] duration-100"
          style={{ width: `${scroll * 100}%` }}
        />
      </div>
    </div>
  );
}
