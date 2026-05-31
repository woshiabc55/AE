import React from 'react';

export interface HilbertCurveProps {
  order?: number;
  size?: number;
  color?: string;
}

const HilbertCurve: React.FC<HilbertCurveProps> = ({
  order = 4,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;
  const totalSize = size + padding * 2;

  const hilbert = (n: number, x: number, y: number, xi: number, xj: number, yi: number, yj: number): [number, number][] => {
    if (n <= 0) {
      return [[x + (xi + yi) / 2, y + (xj + yj) / 2]];
    }
    return [
      ...hilbert(n - 1, x, y, yi / 2, yj / 2, xi / 2, xj / 2),
      ...hilbert(n - 1, x + xi / 2, y + xj / 2, xi / 2, xj / 2, yi / 2, yj / 2),
      ...hilbert(n - 1, x + xi / 2 + yi / 2, y + xj / 2 + yj / 2, xi / 2, xj / 2, yi / 2, yj / 2),
      ...hilbert(n - 1, x + xi / 2 + yi, y + xj / 2 + yj, -yi / 2, -yj / 2, -xi / 2, -xj / 2),
    ];
  };

  const points = hilbert(order, padding, padding, size, 0, 0, size);
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        opacity={0.8}
      />
    </svg>
  );
};

export default HilbertCurve;
