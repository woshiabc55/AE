import { useId } from 'react';

interface FlameSilhouetteProps {
  /** 火焰数量 */
  count?: number;
  /** 强度 0-1 */
  intensity?: number;
  className?: string;
}

/**
 * 火焰剪影：使用 SVG path 绘制若干道波浪形火焰
 */
export function FlameSilhouette({ count = 5, intensity = 0.7, className = '' }: FlameSilhouetteProps) {
  const id = useId().replace(/[:]/g, '_');
  const flames = Array.from({ length: count }, (_, i) => {
    const baseX = 10 + (i / (count - 1)) * 80;
    const height = 30 + ((i * 37) % 30);
    const sway = 6 + (i % 3) * 3;
    return { baseX, height, sway, idx: i };
  });

  return (
    <svg
      className={`absolute inset-x-0 bottom-0 w-full h-3/4 ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`flame-${id}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#C2502A" stopOpacity={intensity} />
          <stop offset="50%" stopColor="#E8893A" stopOpacity={intensity * 0.7} />
          <stop offset="100%" stopColor="#FFD4A0" stopOpacity="0" />
        </linearGradient>
        <filter id={`blur-${id}`}>
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {flames.map((f) => (
        <path
          key={f.idx}
          d={`M ${f.baseX} 100
              C ${f.baseX - f.sway} ${100 - f.height * 0.4},
                ${f.baseX + f.sway} ${100 - f.height * 0.6},
                ${f.baseX + f.sway * 0.5} ${100 - f.height}
              C ${f.baseX - f.sway * 0.5} ${100 - f.height * 0.85},
                ${f.baseX + f.sway * 0.2} ${100 - f.height * 0.5},
                ${f.baseX} ${100 - f.height * 0.7}
              Z`}
          fill={`url(#flame-${id})`}
          filter={`url(#blur-${id})`}
          style={{
            transformOrigin: `${f.baseX}% 100%`,
            animation: `flameSway${f.idx % 3} 1.${2 + f.idx % 3}s ease-in-out infinite alternate`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
      <style>{`
        @keyframes flameSway0 { from { transform: scaleY(0.95) skewX(-1deg); } to { transform: scaleY(1.05) skewX(1deg); } }
        @keyframes flameSway1 { from { transform: scaleY(1.05) skewX(1deg); } to { transform: scaleY(0.95) skewX(-1deg); } }
        @keyframes flameSway2 { from { transform: scaleY(0.92) skewX(0.5deg); } to { transform: scaleY(1.08) skewX(-0.5deg); } }
      `}</style>
    </svg>
  );
}
