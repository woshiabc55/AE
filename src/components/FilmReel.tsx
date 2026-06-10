// 程序化 3D 胶片圆筒 — 极轻量、无外部资源
// 通过纯 SVG / CSS 渲染，不引入 three.js 以保证首屏性能

import { useEffect, useState } from "react";

const FRAMES = [
  { label: "01", title: "起", caption: "开场" },
  { label: "02", title: "承", caption: "铺垫" },
  { label: "03", title: "转", caption: "节拍转折" },
  { label: "04", title: "合", caption: "落点" },
  { label: "05", title: "钩", caption: "悬念" },
  { label: "06", title: "翻", caption: "反转" },
];

export function FilmReel() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      setAngle((a) => (a + dt * 0.012) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 半径
  const radius = 220;
  const fov = 520;
  const cx = 240;
  const cy = 240;
  const eachDeg = 360 / FRAMES.length;

  return (
    <div className="relative w-[480px] h-[480px] select-none" aria-hidden>
      {/* 投影 / 圆盘背 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #1c1c24 0%, #13131a 60%, #0b0b0e 100%)",
          boxShadow:
            "0 0 0 1px #262630, 0 60px 80px -20px rgba(212,168,87,0.15)",
        }}
      />
      {/* 圆环轨道 */}
      <div className="absolute inset-6 rounded-full border border-ink-600" />
      <div className="absolute inset-12 rounded-full border border-dashed border-ink-600" />

      {/* 中心 hub */}
      <div className="absolute inset-[42%] rounded-full border border-amber bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[9px] uppercase tracking-widest2 text-amber">REEL</div>
          <div className="font-display text-paper-100 text-[18px] leading-none mt-1">04</div>
        </div>
      </div>

      {/* 菲林孔 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 + (angle * Math.PI) / 180;
        const x = cx + Math.cos(a) * 200;
        const y = cy + Math.sin(a) * 200;
        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-ink-900 border border-paper-200/50"
            style={{ left: x - 3, top: y - 3 }}
          />
        );
      })}

      {/* 帧卡片 */}
      {FRAMES.map((f, i) => {
        const a = (angle + i * eachDeg) * (Math.PI / 180);
        const x = cx + Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        const scale = (z + radius) / (2 * radius);
        const opacity = 0.25 + 0.75 * scale;
        const w = 80 * (0.7 + 0.3 * scale);
        const h = 56 * (0.7 + 0.3 * scale);
        return (
          <div
            key={f.label}
            className="absolute"
            style={{
              left: x - w / 2,
              top: cy - h / 2,
              width: w,
              height: h,
              opacity,
              transform: `translateZ(0)`,
              transition: "opacity 0.1s linear",
            }}
          >
            <div
              className="w-full h-full border border-amber/40 bg-ink-900/90 p-2 flex flex-col justify-between"
              style={{
                boxShadow: `0 0 ${20 * scale}px rgba(212,168,87,${0.15 * scale})`,
              }}
            >
              <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-widest2">
                <span className="text-amber">SC {f.label}</span>
                <span className="text-ink-300">{f.caption}</span>
              </div>
              <div className="font-cn-display text-paper-100 text-[14px] leading-none">
                {f.title}
              </div>
            </div>
            {/* 顶部菲林孔 */}
            <div className="absolute -top-1.5 left-2 right-2 h-1 flex justify-between">
              {Array.from({ length: 5 }).map((_, k) => (
                <div key={k} className="w-1 h-1 rounded-full bg-paper-200" />
              ))}
            </div>
          </div>
        );
      })}

      {/* 顶点标记 */}
      <div
        className="absolute"
        style={{ left: cx - 5, top: cy - radius - 18 }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_20px_#d4a857]" />
      </div>

      {/* 标签（固定） */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest2 text-amber">
        ◉ Take 12 / 24
      </div>
    </div>
  );
}
