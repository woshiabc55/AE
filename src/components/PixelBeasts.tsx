import { useEffect, useRef } from 'react';
import { SPRITES, spriteToPath } from '../pixels/sprites';
import { mulberry32 } from '../utils/rng';

// 像素生灵 — 在主舞台中游走
type Beast = {
  key: keyof typeof SPRITES;
  x: number;        // 0..1 比例
  y: number;
  vx: number;       // px / s
  vy: number;
  scale: number;
  phase: number;    // 起始动画相位
  bobAmp: number;
  bobFreq: number;
  flipX: boolean;
};

const BEASTS: Beast[] = [
  { key: 'crane',   x: 0.20, y: 0.32, vx: 14, vy: -3,  scale: 4, phase: 0.0, bobAmp: 6,  bobFreq: 0.6, flipX: false },
  { key: 'deer',    x: 0.50, y: 0.62, vx: 6,  vy: 0,   scale: 5, phase: 0.4, bobAmp: 1,  bobFreq: 1.4, flipX: false },
  { key: 'fish',    x: 0.05, y: 0.82, vx: 22, vy: 0,   scale: 4, phase: 0.8, bobAmp: 2,  bobFreq: 2.2, flipX: false },
  { key: 'sparrow', x: 0.75, y: 0.22, vx: 18, vy: 1,   scale: 4, phase: 0.2, bobAmp: 4,  bobFreq: 1.8, flipX: true  },
  { key: 'frog',    x: 0.40, y: 0.78, vx: 4,  vy: 0,   scale: 5, phase: 0.6, bobAmp: 1,  bobFreq: 0.9, flipX: false },
  { key: 'fish',    x: 0.30, y: 0.86, vx: -16, vy: 0,  scale: 3, phase: 1.2, bobAmp: 2,  bobFreq: 1.7, flipX: true  },
];

export default function PixelBeasts() {
  const ref = useRef<SVGSVGElement>(null);
  const stateRef = useRef(BEASTS.map((b) => ({ ...b })));
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    const stage = svg?.parentElement;
    if (!svg || !stage) return;
    const vbW = 1000;
    const vbH = 700;
    svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');

    let raf = 0;
    const start = performance.now();
    const rng = mulberry32(5);
    // 错峰初始化
    stateRef.current.forEach((b) => (b.phase = rng() * 6));

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const dt = 1 / 60;
      const rect = stage.getBoundingClientRect();
      const g = groupRef.current;
      if (!g) { raf = requestAnimationFrame(tick); return; }

      // 清空
      while (g.firstChild) g.removeChild(g.firstChild);

      stateRef.current.forEach((b, idx) => {
        b.x += (b.vx / rect.width) * dt;
        b.y += (b.vy / rect.height) * dt;
        if (b.x < 0.02) b.x = 0.98;
        if (b.x > 0.99) b.x = 0.02;
        if (b.y < 0.10) b.y = 0.90;
        if (b.y > 0.95) b.y = 0.20;
        const sprite = SPRITES[b.key];
        const cols = sprite.grid[0].length;
        const rows = sprite.grid.length;
        const w = cols * b.scale;
        const h = rows * b.scale;
        const cx = b.x * vbW - w / 2;
        const cy = b.y * vbH - h / 2 + Math.sin((t + b.phase) * b.bobFreq) * b.bobAmp;
        const rects = spriteToPath(sprite.grid, sprite.palette, 0, 0, b.scale);
        const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        inner.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)})${b.flipX ? ` scale(-1 1) translate(${-w} 0)` : ''}`);
        rects.forEach((r) => {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', r.x.toString());
          rect.setAttribute('y', r.y.toString());
          rect.setAttribute('width', r.w.toString());
          rect.setAttribute('height', r.h.toString());
          rect.setAttribute('fill', r.fill);
          inner.appendChild(rect);
        });
        // 像素残影
        if (idx === 1 || idx === 2) {
          const ghost = inner.cloneNode(true) as SVGGElement;
          ghost.setAttribute('opacity', '0.18');
          ghost.setAttribute('transform', inner.getAttribute('transform') + ' translate(-14 0)');
          g.appendChild(ghost);
        }
        g.appendChild(inner);
      });

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={ref}
      className="beasts"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, shapeRendering: 'crispEdges' }}
    >
      <g ref={groupRef} />
    </svg>
  );
}
