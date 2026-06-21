import { useEffect, useRef, useState } from "react";

/**
 * 章节四专属动画：原恒星从暗红到蓝白点火的脉动过程。
 */
export default function StarIgnition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.012;
      // 点火进度：0(暗红) → 1(蓝白) 循环
      const cycle = (Math.sin(t * 0.5) + 1) / 2;
      setPhase(cycle);

      ctx.clearRect(0, 0, size, size);

      // 颜色插值：暗红 → 橙 → 白 → 蓝白
      const r = Math.round(255 - cycle * 100);
      const g = Math.round(74 + cycle * 180);
      const b = Math.round(43 + cycle * 200);
      const coreColor = `rgba(${r}, ${g}, ${b}, 0.95)`;
      const haloColor = `rgba(${r}, ${g}, ${b}, 0.4)`;

      // 外层光晕（脉动）
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      const outerR = 110 * pulse;
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      halo.addColorStop(0, haloColor);
      halo.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.12)`);
      halo.addColorStop(1, "rgba(5, 5, 16, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // 日珥喷射
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.3;
        const len = 30 + Math.sin(t * 3 + i) * 15;
        const x1 = cx + Math.cos(a) * 35;
        const y1 = cy + Math.sin(a) * 35;
        const x2 = cx + Math.cos(a) * (35 + len);
        const y2 = cy + Math.sin(a) * (35 + len);
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 恒星核心
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
      core.addColorStop(0, coreColor);
      core.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.7)`);
      core.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(raf);
  }, []);

  const label =
    phase < 0.33 ? "原恒星 · 红外暗红" : phase < 0.66 ? "点火中 · 氢核聚变" : "主序星 · 蓝白光芒";

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="block" aria-hidden="true" />
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-star-white/40">
        {label}
      </p>
    </div>
  );
}
