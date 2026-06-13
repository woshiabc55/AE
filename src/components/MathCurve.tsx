import { useEffect, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";

/**
 * 数学曲线层
 * 在 Canvas 上叠加多条参数曲线（Lissajous / Rose / Spiral / Hypotrochoid），
 * 由 sin / cos 驱动，鼠标位置影响相位，缓慢自转并色相循环。
 */
export default function MathCurve() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useMouse();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const t = (performance.now() - t0) / 1000;
      const cx = w / 2;
      const cy = h / 2;
      const phase = (mouse.x - 0.5) * Math.PI * 2;
      const phaseY = (mouse.y - 0.5) * Math.PI;

      // 1) Lissajous 曲线
      drawLissajous(ctx, cx, cy, t, phase, phaseY, 3, 4);
      // 2) Rose curve (rhodonea)
      drawRose(ctx, cx, cy, t, phase, 5);
      // 3) 螺旋
      drawSpiral(ctx, cx, cy, t, phase);
      // 4) Hypotrochoid
      drawHypotrochoid(ctx, cx, cy, t, phaseY);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mouse.x, mouse.y]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ mixBlendMode: "screen", opacity: 0.85 }}
    />
  );
}

function hue(t: number, offset = 0) {
  return `hsl(${(t * 28 + offset) % 360}, 90%, 60%)`;
}

function drawLissajous(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  phase: number,
  phaseY: number,
  a: number,
  b: number
) {
  const R = Math.min(cx, cy) * 0.85;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i <= 800; i++) {
    const u = (i / 800) * Math.PI * 2 + t * 0.18;
    const x = cx + R * Math.sin(a * u + phase);
    const y = cy + R * Math.sin(b * u + phaseY + t * 0.2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = hue(t, 200);
  ctx.shadowColor = hue(t, 200);
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawRose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  phase: number,
  k: number
) {
  const R = Math.min(cx, cy) * 0.6;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (let theta = 0; theta < Math.PI * 2 * k; theta += 0.01) {
    const r = R * Math.abs(Math.cos(k * theta * 0.5 + t * 0.4));
    const x = cx + r * Math.cos(theta + phase);
    const y = cy + r * Math.sin(theta + phase);
    if (theta === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = hue(t, 320);
  ctx.shadowColor = hue(t, 320);
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawSpiral(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  phase: number
) {
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  const turns = 22;
  for (let i = 0; i <= 1200; i++) {
    const u = (i / 1200) * turns * Math.PI * 2 + t * 0.3;
    const r = (i / 1200) * Math.min(cx, cy) * 0.7;
    const x = cx + r * Math.cos(u + phase);
    const y = cy + r * Math.sin(u + phase);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = hue(t, 0);
  ctx.shadowColor = hue(t, 0);
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawHypotrochoid(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  phaseY: number
) {
  const R = Math.min(cx, cy) * 0.5;
  const r = R * 0.55;
  const d = R * 0.45;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let i = 0; i <= 1500; i++) {
    const u = (i / 1500) * Math.PI * 2 * 5 + t * 0.15;
    const x = cx + (R - r) * Math.cos(u) + d * Math.cos(((R - r) / r) * u + phaseY);
    const y = cy + (R - r) * Math.sin(u) - d * Math.sin(((R - r) / r) * u + phaseY);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = hue(t, 120);
  ctx.shadowColor = hue(t, 120);
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;
}
