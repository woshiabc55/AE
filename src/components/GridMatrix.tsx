import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  cols?: number;
  rows?: number;
  className?: string;
  /** 是否使用全屏（角落大网格） */
  full?: boolean;
}

/**
 * 音乐网格点阵可视化
 * - 二维点阵：每个点的"亮度 + 尺寸"由 sin(x*ω + t) * cos(y*ω + t) 驱动
 * - 与播放器 BPM 同步：ω = bpm / 60
 * - 双色：左半冷色（cyan），右半暖色（red / orange）
 * - 鼠标位置影响权重（中心点附近更亮）
 */
export default function GridMatrix({
  cols = 28,
  rows = 9,
  className = "",
  full = false,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const playing = usePlayerStore((s) => s.playing);
  const bpm = usePlayerStore((s) => {
    const cur = s.playlist.find((t) => t.id === s.currentId);
    return cur?.bpm ?? 140;
  });
  const tick = usePlayerStore((s) => s.tick);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const t0 = performance.now();
    const mouse = { x: 0.5, y: 0.5 };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    };
    canvas.addEventListener("mousemove", onMove, { passive: true });

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, w, h);
      const t = (performance.now() - t0) / 1000;
      const omega = playing ? bpm / 60 : 0.6;
      const amp = playing ? 1.0 : 0.4;
      const beat = (omega * t) % 1;
      const beatPulse = playing ? Math.max(0, 1 - beat * 3) : 0;

      const cellW = w / cols;
      const cellH = h / rows;
      const baseR = Math.min(cellW, cellH) * (full ? 0.18 : 0.22);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = (x - cols / 2) / cols;
          const ny = (y - rows / 2) / rows;

          // 距离鼠标近的更亮
          const mdx = nx - (mouse.x - 0.5);
          const mdy = ny - (mouse.y - 0.5);
          const mDist = Math.hypot(mdx, mdy);
          const mBoost = 0.55 + 0.45 * Math.exp(-mDist * 4);

          // 双波叠加：径向 + 行波
          const v1 = Math.sin(x * 0.55 + t * omega * 1.4) * Math.cos(y * 0.45 - t * omega * 1.1);
          const v2 = Math.sin((x + y) * 0.4 + t * omega) * Math.cos((x - y) * 0.3 - t * omega * 0.7);
          const v = (v1 + v2 * 0.6) * 0.5 * amp * mBoost;

          // 行波（左侧触发，看起来像扫频）
          const rowWave = Math.exp(-Math.pow((t * 1.6 - x * 0.18) % 4, 2) * 1.2);
          const intensity = Math.max(0, v) + rowWave * 0.35 * amp * mBoost;

          // 颜色：左 cyan，右 red/orange
          const split = x / cols; // 0~1
          const cyan = [124, 246, 255];
          const red = [255, 42, 42];
          const orange = [255, 138, 42];
          let r: number, g: number, b: number;
          if (split < 0.5) {
            const t2 = split * 2;
            r = cyan[0] * (1 - t2) + orange[0] * t2;
            g = cyan[1] * (1 - t2) + orange[1] * t2;
            b = cyan[2] * (1 - t2) + orange[2] * t2;
          } else {
            const t2 = (split - 0.5) * 2;
            r = orange[0] * (1 - t2) + red[0] * t2;
            g = orange[1] * (1 - t2) + red[1] * t2;
            b = orange[2] * (1 - t2) + red[2] * t2;
          }

          const a = Math.min(1, intensity);
          const radius = baseR * (0.5 + intensity * 1.4) + beatPulse * 1.4 * amp;

          const cx = x * cellW + cellW / 2;
          const cy = y * cellH + cellH / 2;

          // 光晕
          const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3.2);
          grd.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${a * 0.95})`);
          grd.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 3.2, 0, Math.PI * 2);
          ctx.fill();

          // 中心实心点
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 节拍闪线
      if (playing && beatPulse > 0) {
        ctx.fillStyle = `rgba(255,42,42,${0.05 * beatPulse})`;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [bpm, playing, tick, cols, rows, full]);

  return <canvas ref={ref} className={`h-full w-full ${className}`} />;
}
