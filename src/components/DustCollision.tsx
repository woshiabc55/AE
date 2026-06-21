import { useEffect, useRef } from "react";

interface Dust {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  hue: number;
}

/**
 * 章节三专属动画：原行星盘尘埃环——粒子沿椭圆轨道运行并随机碰撞。
 */
export default function DustCollision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const dusts: Dust[] = [];
    for (let i = 0; i < 120; i++) {
      dusts.push({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * 70,
        speed: 0.002 + Math.random() * 0.004,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.3,
        hue: Math.random() < 0.3 ? 25 : 210,
      });
    }

    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, size, size);

      // 中心原恒星
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      core.addColorStop(0, "rgba(255, 217, 160, 0.9)");
      core.addColorStop(0.4, "rgba(255, 140, 66, 0.5)");
      core.addColorStop(1, "rgba(255, 74, 43, 0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, size, size);

      // 轨道环
      ctx.strokeStyle = "rgba(255, 140, 66, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 60; r <= 130; r += 20) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 尘埃粒子
      for (const d of dusts) {
        d.angle += d.speed;
        const wobble = Math.sin(t + d.angle * 3) * 3;
        const px = cx + Math.cos(d.angle) * (d.radius + wobble);
        const py = cy + Math.sin(d.angle) * (d.radius + wobble) * 0.35;

        ctx.fillStyle =
          d.hue === 25
            ? `rgba(255, 140, 66, ${d.alpha})`
            : `rgba(120, 170, 220, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="block" aria-hidden="true" />
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-star-white/40">
        原行星盘 · 尘埃吸积模拟
      </p>
    </div>
  );
}
