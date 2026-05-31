import React from 'react';

export interface FractalTreeProps {
  depth?: number;
  angle?: number;
  size?: number;
  color?: string;
}

const FractalTree: React.FC<FractalTreeProps> = ({
  depth = 8,
  angle = 25,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;
  const totalW = size + padding * 2;
  const totalH = size * 1.2 + padding * 2;
  const startX = totalW / 2;
  const startY = totalH - padding;
  const trunkLen = size * 0.3;

  const generateBranches = (
    x: number,
    y: number,
    len: number,
    dir: number,
    d: number,
  ): React.ReactElement[] => {
    if (d <= 0 || len < 1) return [];
    const rad = (dir * Math.PI) / 180;
    const endX = x + Math.sin(rad) * len;
    const endY = y - Math.cos(rad) * len;
    const sw = Math.max(0.3, d * 0.3);

    const results: React.ReactElement[] = [
      <line
        key={`${x}-${y}-${d}-0`}
        x1={x}
        y1={y}
        x2={endX}
        y2={endY}
        strokeWidth={sw}
        opacity={0.4 + (depth - d) * 0.08}
      />,
    ];

    const newLen = len * 0.72;
    results.push(...generateBranches(endX, endY, newLen, dir - angle, d - 1));
    results.push(...generateBranches(endX, endY, newLen, dir + angle, d - 1));

    return results;
  };

  const elements = generateBranches(startX, startY, trunkLen, 0, depth);

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none">
        {elements}
      </g>
    </svg>
  );
};

export default FractalTree;
