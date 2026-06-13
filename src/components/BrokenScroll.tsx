import { useEffect, useRef } from 'react';
import { useAtelier } from '../store/useAtelier';
import { mulberry32 } from '../utils/rng';

// 远山 — 用 SVG 路径绘三段水墨山形
function Mountains() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMax slice"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <linearGradient id="ink-grad-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A2E22" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6B4A2B" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="ink-grad-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B1612" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3A2E22" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="ink-grad-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0806" stopOpacity="1" />
          <stop offset="100%" stopColor="#1B1612" stopOpacity="0.95" />
        </linearGradient>
        <filter id="ink-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
        <filter id="ink-cloud">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="14" />
        </filter>
      </defs>

      {/* 远云 */}
      <ellipse cx="280" cy="200" rx="260" ry="22" fill="#EFE4CC" opacity="0.55" filter="url(#ink-cloud)" />
      <ellipse cx="720" cy="160" rx="200" ry="16" fill="#EFE4CC" opacity="0.4" filter="url(#ink-cloud)" />

      {/* 远山 */}
      <g className="layer far" filter="url(#ink-rough)">
        <path
          d="M0,420 L80,360 L150,400 L220,320 L320,380 L420,300 L500,360 L600,310 L720,370 L820,330 L900,400 L1000,360 L1000,700 L0,700 Z"
          fill="url(#ink-grad-far)"
        />
      </g>

      {/* 中山 */}
      <g className="layer mid" filter="url(#ink-rough)">
        <path
          d="M0,520 L60,460 L130,500 L220,420 L300,500 L380,440 L460,500 L560,450 L640,520 L720,470 L820,510 L920,460 L1000,500 L1000,700 L0,700 Z"
          fill="url(#ink-grad-mid)"
        />
      </g>

      {/* 近山 */}
      <g className="layer near" filter="url(#ink-rough)">
        <path
          d="M0,640 L40,580 L120,620 L200,560 L280,620 L360,580 L440,640 L520,590 L600,640 L700,600 L800,640 L900,600 L1000,640 L1000,700 L0,700 Z"
          fill="url(#ink-grad-near)"
        />
      </g>
    </svg>
  );
}

// 江面 — Canvas 每帧重绘像素化波纹
function River() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let raf = 0;
    const rng = mulberry32(223);
    const phase = Array.from({ length: 8 }, () => rng() * Math.PI * 2);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = performance.now() / 1000;
      const pix = 6;

      // 远岸 + 浅滩
      ctx.fillStyle = 'rgba(27,22,18,0.04)';
      for (let y = 0; y < h; y += pix) {
        const wave = Math.sin((y / h) * Math.PI * 3 + t * 0.6) * 4;
        const off = Math.sin(y * 0.05 + t * 0.4) * 3;
        ctx.fillRect(0, y, w, pix);
        if (y % (pix * 2) === 0) {
          ctx.fillStyle = 'rgba(168,52,30,0.07)';
          ctx.fillRect(0, y + wave + off, w * 0.7, 1);
          ctx.fillStyle = 'rgba(27,22,18,0.04)';
        }
      }

      // 高光像素点
      ctx.fillStyle = 'rgba(27,22,18,0.55)';
      for (let i = 0; i < phase.length; i++) {
        const y = (h * 0.4) + Math.sin(t * 0.4 + i) * 8 + i * (h * 0.07);
        const x = (Math.sin(t * 0.25 + i * 1.3) * 0.4 + 0.5) * w;
        ctx.fillRect(Math.floor(x / pix) * pix, Math.floor(y / pix) * pix, pix, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="river"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '30%',
        imageRendering: 'pixelated',
      }}
    />
  );
}

// 古松 — 32x32 像素网格
function Pine() {
  return (
    <svg
      className="pine"
      viewBox="0 0 16 30"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* 树干 */}
      <rect x="7" y="14" width="2" height="14" fill="#1B1612" />
      <rect x="6" y="27" width="4" height="2" fill="#1B1612" />
      {/* 松针 — 像素拼 */}
      {[
        [7, 2, 2, 2], [5, 4, 6, 2], [3, 6, 10, 2], [4, 8, 8, 2],
        [5, 10, 6, 2], [6, 12, 4, 2],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#1B1612" />
      ))}
      {/* 朱砂果实 */}
      <rect x="6" y="6" width="1" height="1" fill="#A8341E" />
      <rect x="9" y="10" width="1" height="1" fill="#A8341E" />
      <rect x="4" y="12" width="1" height="1" fill="#A8341E" />
    </svg>
  );
}

// 远帆
function Sail() {
  return (
    <svg className="sail" viewBox="0 0 32 38" shapeRendering="crispEdges" aria-hidden>
      <rect x="14" y="2" width="1" height="22" fill="#1B1612" />
      <polygon points="15,4 26,18 15,18" fill="#EFE4CC" stroke="#1B1612" />
      <polygon points="15,4 4,16 15,16" fill="#D9C28A" stroke="#1B1612" />
      <rect x="11" y="24" width="8" height="2" fill="#1B1612" />
      <rect x="13" y="26" width="4" height="4" fill="#1B1612" />
    </svg>
  );
}

export default function BrokenScroll() {
  const rainId = useAtelier((s) => s.rainId);
  const pulseAt = useAtelier((s) => s.pulseAt);

  // 像素雨 — 每次 pulse 触发一批像素块飞向远山
  useEffect(() => {
    if (!pulseAt) return;
    const layer = document.getElementById('pixel-rain');
    if (!layer) return;
    const colors = ['#5BE7C4', '#E84B82', '#D7F26B', '#A8341E', '#B58A3C'];
    const rect = layer.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'drop';
      const startX = rect.width - 40 - Math.random() * 60; // 从右向左
      const startY = 40 + Math.random() * 80;
      const endX = Math.random() * (rect.width * 0.55);
      const endY = 200 + Math.random() * (rect.height * 0.4);
      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.boxShadow = `0 0 8px ${el.style.background}`;
      el.style.setProperty('--dx', `${endX - startX}px`);
      el.style.setProperty('--dy', `${endY - startY}px`);
      layer.appendChild(el);
      setTimeout(() => el.remove(), 360);
    }
  }, [rainId, pulseAt]);

  return (
    <div className="stage">
      <Mountains />
      <River />
      <Pine />
      <Sail />
      {/* 像素雨层 */}
      <div id="pixel-rain" className="pixel-rain" />
    </div>
  );
}
