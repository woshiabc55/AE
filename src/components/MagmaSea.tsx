import { useEffect, useRef } from "react";

/**
 * 终章背景动画：滚烫的橘红色岩浆海表面流动效果。
 */
export default function MagmaSea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = canvas.offsetWidth * dpr);
    let height = (canvas.height = canvas.offsetHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const resize = () => {
      width = canvas.offsetWidth * dpr;
      height = canvas.offsetHeight * dpr;
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.008;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // 岩浆海基底渐变
      const base = ctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "rgba(42, 10, 5, 0)");
      base.addColorStop(0.4, "rgba(120, 30, 10, 0.4)");
      base.addColorStop(1, "rgba(255, 90, 31, 0.6)");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // 流动的岩浆裂纹
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yBase = h * (0.5 + i * 0.1);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.01 + t + i) * 12 +
            Math.sin(x * 0.03 + t * 1.5 + i * 2) * 6;
          ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, yBase - 20, 0, yBase + 20);
        grad.addColorStop(0, "rgba(255, 179, 71, 0)");
        grad.addColorStop(0.5, `rgba(255, 179, 71, ${0.3 - i * 0.04})`);
        grad.addColorStop(1, "rgba(255, 90, 31, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 气泡
      for (let i = 0; i < 8; i++) {
        const bx = (Math.sin(t * 0.5 + i * 1.7) * 0.5 + 0.5) * w;
        const by = h * (0.7 + Math.sin(t + i) * 0.15);
        const br = 3 + Math.sin(t * 2 + i) * 2;
        const bubble = ctx.createRadialGradient(bx, by, 0, bx, by, br * 3);
        bubble.addColorStop(0, "rgba(255, 217, 160, 0.6)");
        bubble.addColorStop(1, "rgba(255, 90, 31, 0)");
        ctx.fillStyle = bubble;
        ctx.beginPath();
        ctx.arc(bx, by, br * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
