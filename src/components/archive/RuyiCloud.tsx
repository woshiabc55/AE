import React from 'react';

export interface RuyiCloudProps {
  size?: number;
  color?: string;
  repeat?: number;
}

const RuyiCloud: React.FC<RuyiCloudProps> = ({
  size = 80,
  color = '#1a3a6b',
  repeat = 3,
}) => {
  const svgWidth = size * repeat + 20;
  const svgHeight = size + 20;
  const startY = svgHeight / 2;

  const ruyiShape = (cx: number, cy: number, s: number) => {
    const r = s * 0.35;
    return `M${cx - r},${cy} ` +
      `C${cx - r},${cy - r * 0.8} ${cx - r * 0.5},${cy - r} ${cx},${cy - r * 0.7} ` +
      `C${cx + r * 0.5},${cy - r} ${cx + r},${cy - r * 0.8} ${cx + r},${cy} ` +
      `C${cx + r * 0.6},${cy + r * 0.3} ${cx + r * 0.2},${cy + r * 0.5} ${cx},${cy + r * 0.3} ` +
      `C${cx - r * 0.2},${cy + r * 0.5} ${cx - r * 0.6},${cy + r * 0.3} ${cx - r},${cy} Z`;
  };

  const elements = Array.from({ length: repeat }, (_, i) => {
    const cx = 10 + size * 0.5 + i * size;
    return (
      <g key={i}>
        <path
          d={ruyiShape(cx, startY, size * 0.8)}
          stroke={color}
          fill={color}
          fillOpacity={0.08}
          strokeWidth={1}
        />
        <circle
          cx={cx}
          cy={startY - size * 0.2}
          r={size * 0.04}
          fill={color}
          opacity={0.5}
        />
      </g>
    );
  });

  const connectionPath = Array.from({ length: repeat - 1 }, (_, i) => {
    const x1 = 10 + size * 0.5 + i * size + size * 0.35;
    const x2 = 10 + size * 0.5 + (i + 1) * size - size * 0.35;
    return `M${x1},${startY} Q${(x1 + x2) / 2},${startY + size * 0.1} ${x2},${startY}`;
  }).join(' ');

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={0.6} opacity={0.4}>
        {connectionPath && <path d={connectionPath} />}
      </g>
      {elements}
    </svg>
  );
};

export default RuyiCloud;
