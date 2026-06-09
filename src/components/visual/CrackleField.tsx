import { useEffect, useRef } from 'react';
import { seededRandom, hashString } from '@/utils/random';

interface CrackleFieldProps {
  seed: string;
  /** 裂纹数量（保留用于外部扩展） */
  count?: number;
  /** 主色 */
  color?: string;
  /** 描边宽度 */
  width?: number;
  className?: string;
}

/**
 * 裂纹场：在画布上绘制从中心向外发散的随机折线裂纹
 */
export function CrackleField({
  seed,
  color = '#C9A972',
  width = 0.8,
  className = '',
}: CrackleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
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

    interface Branch {
      x: number;
      y: number;
      angle: number;
      life: number;
      children: Branch[];
      depth: number;
    }

    const branches: Branch[] = [];
    const cx = W / 2;
    const cy = H / 2;

    // 创建主裂纹（从中心放射）
    const mainCount = 6;
    for (let i = 0; i < mainCount; i++) {
      const baseAngle = (i / mainCount) * Math.PI * 2 + rand() * 0.3;
      const root: Branch = { x: cx, y: cy, angle: baseAngle, life: 0, children: [], depth: 0 };
      branches.push(root);
    }

    // 递归生长
    const grow = (b: Branch) => {
      const steps = 18 + Math.floor(rand() * 24);
      let cur = b;
      for (let i = 0; i < steps; i++) {
        if (b.depth > 3) break;
        const newAngle = cur.angle + (rand() - 0.5) * 0.9;
        const dist = 6 + rand() * 18;
        const nx = cur.x + Math.cos(newAngle) * dist;
        const ny = cur.y + Math.sin(newAngle) * dist;
        if (nx < -20 || nx > W + 20 || ny < -20 || ny > H + 20) break;
        const child: Branch = {
          x: nx, y: ny, angle: newAngle, life: i / steps, children: [], depth: b.depth + 1,
        };
        cur.children.push(child);
        // 分叉
        if (rand() < 0.12 && b.depth < 2) {
          grow(child);
        }
        cur = child;
      }
    };
    branches.forEach(grow);

    let raf = 0;
    const draw = (now: number) => {
      const t = (now - startRef.current) / 1000;
      ctx.clearRect(0, 0, W, H);
      // 微光晕
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.5);
      grad.addColorStop(0, 'rgba(194, 80, 42, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      // 缓慢生长效果
      const phase = (Math.sin(t * 0.4) + 1) / 2; // 0..1
      branches.forEach((b) => {
        drawBranchPartial(b, phase);
      });
      raf = requestAnimationFrame(draw);
    };

    const drawBranchPartial = (b: Branch, phase: number) => {
      for (const c of b.children) {
        const life = c.life;
        if (life > phase) continue;
        const alpha = 0.4 + 0.5 * life;
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width * (1 - c.depth * 0.18);
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (c.children.length) {
          // 递归画子分支（简化版）
          for (const cc of c.children) {
            const life2 = cc.life;
            if (life2 > phase) continue;
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.4 * life2;
            ctx.lineWidth = width * 0.6;
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(cc.x, cc.y);
            ctx.stroke();
          }
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [seed, color, width]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />;
}
