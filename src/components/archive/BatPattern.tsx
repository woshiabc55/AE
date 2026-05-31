import React from 'react';

export interface BatPatternProps {
  size?: number;
  color?: string;
  count?: number;
}

const BatPattern: React.FC<BatPatternProps> = ({
  size = 60,
  color = '#1a3a6b',
  count = 5,
}) => {
  const svgSize = size * 2 + 40;
  const batWing = (cx: number, cy: number, s: number) => {
    const half = s * 0.5;
    return `M${cx},${cy - half * 0.2} ` +
      `C${cx - half * 0.3},${cy - half * 0.8} ${cx - half},${cy - half * 0.6} ${cx - half},${cy} ` +
      `L${cx - half * 0.7},${cy + half * 0.1} ` +
      `L${cx - half * 0.5},${cy} ` +
      `L${cx - half * 0.3},${cy + half * 0.15} ` +
      `L${cx - half * 0.15},${cy} ` +
      `L${cx},${cy + half * 0.2} ` +
      `L${cx + half * 0.15},${cy} ` +
      `L${cx + half * 0.3},${cy + half * 0.15} ` +
      `L${cx + half * 0.5},${cy} ` +
      `L${cx + half * 0.7},${cy + half * 0.1} ` +
      `L${cx + half},${cy} ` +
      `C${cx + half},${cy - half * 0.6} ${cx + half * 0.3},${cy - half * 0.8} ${cx},${cy - half * 0.2} Z`;
  };

  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const dist = size * 0.6;
    return {
      x: svgSize / 2 + Math.cos(rad) * dist,
      y: svgSize / 2 + Math.sin(rad) * dist,
      rotation: angle + 90,
    };
  });

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {positions.map((pos, i) => (
        <path
          key={i}
          d={batWing(0, 0, size * 0.5)}
          transform={`translate(${pos.x},${pos.y}) rotate(${pos.rotation})`}
          stroke={color}
          fill={color}
          fillOpacity={0.1}
          strokeWidth={0.8}
        />
      ))}
      <circle
        cx={svgSize / 2}
        cy={svgSize / 2}
        r={size * 0.12}
        stroke={color}
        fill="none"
        strokeWidth={0.5}
        strokeDasharray="2 2"
      />
    </svg>
  );
};

export default BatPattern;
