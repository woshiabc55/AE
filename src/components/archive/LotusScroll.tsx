import React from 'react';

export interface LotusScrollProps {
  petals?: number;
  radius?: number;
  color?: string;
}

const LotusScroll: React.FC<LotusScrollProps> = ({
  petals = 8,
  radius = 80,
  color = '#1a3a6b',
}) => {
  const cx = radius + 20;
  const cy = radius + 20;
  const size = (radius + 20) * 2;

  const petalElements = Array.from({ length: petals }, (_, i) => {
    const angle = (360 / petals) * i;
    return (
      <ellipse
        key={i}
        cx={0}
        cy={-radius * 0.45}
        rx={radius * 0.15}
        ry={radius * 0.4}
        transform={`rotate(${angle})`}
      />
    );
  });

  const scrollStems = Array.from({ length: petals }, (_, i) => {
    const angle = (360 / petals) * i + 360 / petals / 2;
    const rad = (angle * Math.PI) / 180;
    const x1 = Math.cos(rad) * radius * 0.2;
    const y1 = Math.sin(rad) * radius * 0.2;
    const x2 = Math.cos(rad) * radius * 0.7;
    const y2 = Math.sin(rad) * radius * 0.7;
    const cx1 = Math.cos(rad + 0.3) * radius * 0.5;
    const cy1 = Math.sin(rad + 0.3) * radius * 0.5;
    return (
      <path
        key={`s${i}`}
        d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`}
        strokeWidth={1}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`translate(${cx},${cy})`} stroke={color} fill="none" strokeWidth={1.2}>
        {scrollStems}
        {petalElements}
        <circle r={radius * 0.12} strokeWidth={0.8} />
        <circle r={radius * 0.05} fill={color} />
      </g>
    </svg>
  );
};

export default LotusScroll;
