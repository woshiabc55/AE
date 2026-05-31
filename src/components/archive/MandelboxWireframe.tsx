import React from 'react';

export interface MandelboxWireframeProps {
  depth?: number;
  size?: number;
  gap?: number;
  color?: string;
}

const MandelboxWireframe: React.FC<MandelboxWireframeProps> = ({
  depth = 3,
  size = 200,
  gap = 8,
  color = '#1a3a6b',
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const baseUnit = size * 0.35;

  const generateBoxes = (
    x: number,
    y: number,
    unit: number,
    d: number,
  ): React.ReactElement[] => {
    if (d <= 0) return [];
    const results: React.ReactElement[] = [];
    const half = unit / 2;
    results.push(
      <rect
        key={`b-${x}-${y}-${d}`}
        x={x - half}
        y={y - half}
        width={unit}
        height={unit}
        strokeWidth={0.5 / (depth - d + 1)}
      />
    );
    const positions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    const nextUnit = unit / 3;
    positions.forEach(([dx, dy], i) => {
      results.push(...generateBoxes(x + dx * (half + gap / (depth - d + 1)), y + dy * (half + gap / (depth - d + 1)), nextUnit, d - 1));
    });
    return results;
  };

  const elements = generateBoxes(cx, cy, baseUnit, depth);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none">
        {elements}
      </g>
    </svg>
  );
};

export default MandelboxWireframe;
