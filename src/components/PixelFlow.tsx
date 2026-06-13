import { useEffect, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";

/**
 * 迷幻像素流动层
 * - 低分辨率内部画布（96 × 54），高分辨率位图放大
 * - 每个 cell 颜色由多频 sin / cos 叠加决定，色相持续循环
 * - 鼠标位置影响流动中心
 * - blend-mode: screen，呈现"赛博迷幻"质感
 */
export default function PixelFlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useMouse();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    const t0 = performance.now();

    // 内部低分辨率
    const COLS = 96;
    const ROWS = 54;

    // 用一个不可见的内部画布
    const off = document.createElement("canvas");
    off.width = COLS;
    off.height = ROWS;
    const offCtx = off.getContext("2d")!;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const imageData = offCtx.createImageData(COLS, ROWS);
    const data = imageData.data;

    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      const mx = mouse.x;
      const my = mouse.y;

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          // 多频 sin/cos 场
          const nx = x / COLS - 0.5;
          const ny = y / ROWS - 0.5;
          const dx = nx - (mx - 0.5);
          const dy = ny - (my - 0.5);
          const r = Math.hypot(dx, dy);

          const v =
            Math.sin(nx * 6 + t * 0.8) *
              Math.cos(ny * 5 - t * 0.6) +
            0.5 *
              Math.sin((nx + ny) * 4 + t * 1.2) *
              Math.cos((nx - ny) * 3 - t * 0.4) -
            0.6 * Math.exp(-r * 4) * Math.cos(r * 18 - t * 2.2);

          // 映射到 HSL（hue 持续偏移，迷幻色循环）
          const hue = (v * 120 + t * 35 + r * 220) % 360;
          const sat = 75 + Math.sin(t + r * 4) * 20;
          const light = 32 + Math.abs(v) * 30;

          // HSL -> RGB（手写以节省性能）
          const [R, G, B] = hslToRgb(hue, sat, light);
          const i = (y * COLS + x) * 4;
          // 距离鼠标近的地方更亮
          const boost = 0.25 + 0.75 * Math.exp(-r * 3.2);
          data[i] = R * boost;
          data[i + 1] = G * boost;
          data[i + 2] = B * boost;
          data[i + 3] = 255;
        }
      }
      offCtx.putImageData(imageData, 0, 0);

      // 缩放绘制到主画布（imageSmoothingEnabled = false 保留像素颗粒）
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / COLS;
      const scaleY = canvas.height / ROWS;
      ctx.drawImage(off, 0, 0, COLS, ROWS, 0, 0, COLS * scaleX, ROWS * scaleY);

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
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        mixBlendMode: "screen",
        opacity: 0.18,
        imageRendering: "pixelated",
      }}
    />
  );
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return [f(0), f(8), f(4)];
}
