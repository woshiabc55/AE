import React from 'react';

export interface TopoContourProps {
  lines?: number;
  size?: number;
  color?: string;
}

const TopoContour: React.FC<TopoContourProps> = ({
  lines = 8,
  size = 200,
  color = '#1a3a6b',
}) => {
  const cx = size / 2;
  const cy = size / 2;

  const pseudoNoise = (x: number, y: number) => {
    return Math.sin(x * 0.02 + 1.3) * Math.cos(y * 0.025 + 0.7) +
           Math.sin(x * 0.015 - y * 0.01 + 2.1) * 0.5;
  };

  const contourPaths = Array.from({ length: lines }, (_, i) => {
    const level = (i / lines) * 2 - 1;
    const points: [number, number][] = [];
    const step = 4;

    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const v = pseudoNoise(x + i * 15, y + i * 10);
        if (Math.abs(v - level) < 0.08) {
          points.push([x, y]);
        }
      }
    }

    if (points.length < 2) return null;

    const pathD = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
      .join(' ');

    return (
      <path
        key={i}
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={0.4}
        opacity={0.2 + (i / lines) * 0.5}
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
      {contourPaths}
    </svg>
  );
};

export default TopoContour;
