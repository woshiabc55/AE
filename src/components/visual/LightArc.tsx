import { useId } from 'react';

interface LightArcProps {
  /** 旋转角度 */
  rotate?: number;
  /** 弧度（0-2π） */
  arc?: number;
  /** 半径（基于 viewBox 100） */
  radius?: number;
  /** 描边色 */
  color?: string;
  /** 描边宽度 */
  width?: number;
  /** 模糊 */
  blur?: number;
  className?: string;
  /** 反向 */
  reverse?: boolean;
  /** 不透明度 */
  opacity?: number;
}

/**
 * 光弧：使用 SVG path 绘制一段弧线，描边带虚线动画 + 模糊滤镜，模拟"窑火余晖"
 */
export function LightArc({
  rotate = 0,
  arc = Math.PI * 1.2,
  radius = 38,
  color = '#C2502A',
  width = 1.2,
  blur = 6,
  className = '',
  reverse = false,
  opacity = 0.9,
}: LightArcProps) {
  const id = useId().replace(/[:]/g, '_');
  const start = -arc / 2;
  const end = arc / 2;
  const x1 = 50 + Math.cos(start) * radius;
  const y1 = 50 + Math.sin(start) * radius;
  const x2 = 50 + Math.cos(end) * radius;
  const y2 = 50 + Math.sin(end) * radius;
  const large = arc > Math.PI ? 1 : 0;
  const sweep = reverse ? 0 : 1;
  const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} ${sweep} ${x2} ${y2}`;
  const filterId = `glow-${id}`;

  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{ transform: `rotate(${rotate}deg)`, opacity }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={blur / 4} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="20%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor="#EFE7D6" stopOpacity="1" />
          <stop offset="80%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={`url(#grad-${id})`}
        strokeWidth={width}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
        strokeDasharray="80 200"
        style={{ animation: 'dashFlow 5s linear infinite' }}
      />
    </svg>
  );
}
