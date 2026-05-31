import React from 'react';

export interface BambooLeafProps {
  leaves?: number;
  leafLen?: number;
  color?: string;
}

const BambooLeaf: React.FC<BambooLeafProps> = ({
  leaves = 7,
  leafLen = 30,
  color = '#1a3a6b',
}) => {
  const width = leafLen * 3 + 40;
  const height = leafLen * 4 + 40;
  const cx = width / 2;
  const cy = height / 2;

  const stemPath = `M${cx - 5},${cy + leafLen * 1.5} L${cx},${cy - leafLen * 1.5}`;

  const leafElements = Array.from({ length: leaves }, (_, i) => {
    const t = (i / (leaves - 1)) * 2.8 - 0.4;
    const y = cy + leafLen * 1.5 - t * leafLen;
    const side = i % 2 === 0 ? 1 : -1;
    const angle = side * (25 + Math.random() * 20);
    const rad = (angle * Math.PI) / 180;
    const tipX = cx + Math.sin(rad) * leafLen;
    const tipY = y - Math.cos(rad) * leafLen;
    const cpX = cx + Math.sin(rad) * leafLen * 0.5;
    const cpY = y - Math.cos(rad) * leafLen * 0.5;

    return (
      <g key={i}>
        <path
          d={`M${cx},${y} Q${cpX + side * 4},${cpY} ${tipX},${tipY}`}
          strokeWidth={0.8}
        />
        <line
          x1={cx}
          y1={y}
          x2={tipX}
          y2={tipY}
          strokeWidth={0.3}
          opacity={0.4}
        />
      </g>
    );
  });

  const nodeCircles = [0, 0.33, 0.66, 1].map((t, i) => {
    const y = cy + leafLen * 1.5 - t * leafLen * 3;
    return (
      <circle
        key={`n${i}`}
        cx={cx}
        cy={y}
        r={2}
        fill={color}
        opacity={0.5}
      />
    );
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none">
        <path d={stemPath} strokeWidth={1.5} />
        {nodeCircles}
        {leafElements}
      </g>
    </svg>
  );
};

export default BambooLeaf;
