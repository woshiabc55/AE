import { useEffect, useState } from "react";

/**
 * 顶部 / 底部 HUD 边栏
 * - 顶部：状态、坐标、时间码
 * - 底部：跑马灯 + 倒计时
 */
export default function HUD() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stamp = now.toISOString().replace("T", " / ").slice(0, 22);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <>
      {/* 顶部 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse2" />
          <span className="text-danger/80">REC</span>
          <span className="hidden sm:inline">NX-09 // FACTORY_DUMP</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-neon/70">
          <span>LAT 30.5928°N</span>
          <span>LON 114.3055°E</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-white/40">{stamp}</span>
          <span className="text-white/85 tabular-nums">
            {hh}:{mm}:<span className="text-danger">{ss}</span>
          </span>
        </div>
      </div>

      {/* 顶部装饰横线 */}
      <div
        className="pointer-events-none fixed top-[44px] sm:top-[56px] left-0 right-0 z-20 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />

      {/* 底部跑马灯（紧贴播放器上方） */}
      <div className="pointer-events-none fixed bottom-[56px] sm:bottom-[60px] left-0 right-0 z-20 border-t border-b border-white/8 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="marquee-track py-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-white/55">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="flex items-center px-6">
                  <span className="text-danger">●</span>
                  <span className="ml-2">INDUSTRIAL TRAP // VOL.07</span>
                  <span className="mx-6 text-white/20">/</span>
                  <span className="text-neon">NX-09</span>
                  <span className="mx-3 text-white/40">·</span>
                  <span>STEEL NEVER SLEEPS</span>
                  <span className="mx-6 text-white/20">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
