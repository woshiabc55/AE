import { useEffect, useRef } from 'react';
import { useAtelier } from '../store/useAtelier';
import { nibbleCircle } from '../utils/inkPath';
import { mulberry32 } from '../utils/rng';

const HOLE_SEED = 9821;
const HOLE_COUNT = 7;

// 虫蛀孔 — 直接在主舞台顶层绘制深色不规则圆，
// 模拟"被虫咬穿"的破洞。
export default function BorerMask() {
  const ref = useRef<SVGSVGElement>(null);
  const sealed = useAtelier((s) => s.sealed);
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rng = mulberry32(HOLE_SEED);
    const vbW = 1000;
    const vbH = 700;
    el.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
    el.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    for (let i = 0; i < HOLE_COUNT; i++) {
      const cx = 0.10 + (i / HOLE_COUNT) * 0.80 + (rng() - 0.5) * 0.06;
      const cy = 0.22 + rng() * 0.46;
      const r = 28 + rng() * 36;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'borer');
      g.setAttribute(
        'style',
        `transform-origin: ${(cx * vbW).toFixed(1)}px ${(cy * vbH).toFixed(1)}px;`
      );

      // 锯齿边缘
      const nib = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      nib.setAttribute('d', nibbleCircle(cx * vbW, cy * vbH, r));
      nib.setAttribute('fill', '#1B1612');
      nib.setAttribute('opacity', '0.92');
      g.appendChild(nib);

      // 内部深色渐变（仿古纸被咬穿）
      const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      inner.setAttribute('cx', (cx * vbW).toString());
      inner.setAttribute('cy', (cy * vbH).toString());
      inner.setAttribute('r', (r * 0.78).toString());
      inner.setAttribute('fill', 'rgba(10,8,6,0.96)');
      g.appendChild(inner);

      // 中心像素"虫"
      const bug = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bug.setAttribute('x', (cx * vbW - 4).toString());
      bug.setAttribute('y', (cy * vbH - 4).toString());
      bug.setAttribute('width', '8');
      bug.setAttribute('height', '8');
      bug.setAttribute('fill', '#5BE7C4');
      bug.setAttribute('class', 'bug');
      g.appendChild(bug);

      groupRef.current?.appendChild(g);
    }
  }, []);

  // 朱印盖下时把全部 borer 缩为 0
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.style.transition = 'transform 220ms cubic-bezier(.68,-.55,.27,1.55)';
    groupRef.current.style.transformOrigin = '50% 50%';
    groupRef.current.style.transform = sealed ? 'scale(0)' : 'scale(1)';
    const t = setTimeout(() => {
      if (groupRef.current) groupRef.current.style.transform = 'scale(1)';
      useAtelier.setState({ sealed: false });
    }, 480);
    return () => clearTimeout(t);
  }, [sealed]);

  return (
    <svg
      ref={ref}
      aria-hidden
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <style>
          {`@keyframes bug-blink { 0%,100%{opacity:1} 50%{opacity:0.2} } .bug { animation: bug-blink 1.2s ease-in-out infinite; }`}
        </style>
      </defs>
      <g ref={groupRef} />
    </svg>
  );
}
