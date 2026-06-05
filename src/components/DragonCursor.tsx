import { useEffect, useState } from "react";

/**
 * 龙尾鼠标跟随组件
 * - 桌面端：跟随光标绘出弯曲龙尾轨迹
 * - 移动端：不渲染
 */
export function DragonCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    setIsCoarse(mql.matches);
    const onChange = () => setIsCoarse(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isCoarse) return;
    let raf = 0;
    let last: { x: number; y: number } | null = null;
    const onMove = (e: MouseEvent) => {
      const next = { x: e.clientX, y: e.clientY };
      last = next;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (last) {
            setPos(last);
            setTrail((prev) => {
              const newTrail = [last!, ...prev].slice(0, 18);
              return newTrail;
            });
          }
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isCoarse]);

  if (isCoarse || !pos) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
      <svg className="h-full w-full">
        <defs>
          <linearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff2d4a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {trail.length > 1 && (
          <path
            d={trail
              .map((p, i) => {
                if (i === 0) return `M ${p.x} ${p.y}`;
                const prev = trail[i - 1];
                const cx = (prev.x + p.x) / 2;
                const cy = (prev.y + p.y) / 2 - 20;
                return `Q ${cx} ${cy} ${p.x} ${p.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="url(#tailGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}
      </svg>
      <div
        className="absolute"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="h-2 w-2 rotate-45 bg-cyan ring-2 ring-crimson" />
      </div>
    </div>
  );
}
