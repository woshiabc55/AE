import { useEffect, useRef } from 'react';
import { seededRandom, hashString } from '@/utils/random';

interface DotMatrixProps {
  seed: string;
  /** 网格列数 */
  cols?: number;
  /** 网格行数 */
  rows?: number;
  /** 主题色 */
  color?: string;
  /** 暗背景色 */
  bg?: string;
  /** 密度系数 0-1 */
  density?: number;
  /** 缩放 0-1 */
  scale?: number;
  /** 是否添加窑火光环 */
  glow?: boolean;
  className?: string;
}

/**
 * 点阵画布：以 cols×rows 网格绘制圆形点阵，
 * 点的位置、大小、亮度由 seed 字符串 + density 决定。
 */
export function DotMatrix({
  seed,
  cols = 80,
  rows = 45,
  color = '#C9A972',
  bg = 'transparent',
  density = 0.6,
  scale = 1,
  glow = false,
  className = '',
}: DotMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const rand = seededRandom(hashString(seed));
    // 预生成所有点参数（位置偏移、半径基准、闪烁相位）
    const points: Array<{ x: number; y: number; r: number; phase: number }> = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // 用密度过滤
        if (rand() > density) continue;
        const ox = (rand() - 0.5) * 6;
        const oy = (rand() - 0.5) * 6;
        points.push({
          x: ((i + 0.5) / cols + ox / W) * W,
          y: ((j + 0.5) / rows + oy / H) * H,
          r: (0.6 + rand() * 1.6) * scale,
          phase: rand() * Math.PI * 2,
        });
      }
    }

    let raf = 0;
    const draw = (now: number) => {
      const t = (now - startRef.current) / 1000;
      ctx.clearRect(0, 0, W, H);
      if (bg !== 'transparent') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
      }
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }
      for (const p of points) {
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + p.phase);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = tw * 0.85;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [seed, cols, rows, color, bg, density, scale, glow]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />;
}
