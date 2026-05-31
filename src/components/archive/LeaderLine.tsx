import React from 'react';

export interface LeaderLineProps {
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  label?: string;
  color?: string;
}

const LeaderLine: React.FC<LeaderLineProps> = ({
  from = { x: 10, y: 10 },
  to = { x: 120, y: 40 },
  label = '标注',
  color = '#1a1a1a',
}) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midX = from.x + dx * 0.6;
  const midY = from.y + dy * 0.6;
  const elbowX = to.x - 20;
  const elbowY = to.y;

  const pathD = `M${from.x},${from.y} L${midX},${midY} L${elbowX},${elbowY} L${to.x},${to.y}`;

  const svgW = Math.max(from.x, to.x) + 40;
  const svgH = Math.max(from.y, to.y) + 20;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={0.6}
      />
      <circle cx={from.x} cy={from.y} r={1.5} fill={color} />
      <circle cx={to.x} cy={to.y} r={1} fill={color} />
      <text
        x={to.x + 4}
        y={to.y + 3}
        fontFamily="monospace"
        fontSize={9}
        fill={color}
      >
        {label}
      </text>
    </svg>
  );
};

export default LeaderLine;
