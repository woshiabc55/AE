import React from 'react';

export interface KochSnowflakeProps {
  depth?: number;
  size?: number;
  color?: string;
}

const KochSnowflake: React.FC<KochSnowflakeProps> = ({
  depth = 3,
  size = 200,
  color = '#1a3a6b',
}) => {
  const h = (size * Math.sqrt(3)) / 2;
  const padding = 10;

  const kochPoints = (
    x1: number, y1: number,
    x2: number, y2: number,
    d: number,
  ): [number, number][] => {
    if (d <= 0) return [[x2, y2]];
    const dx = x2 - x1, dy = y2 - y1;
    const ax = x1 + dx / 3, ay = y1 + dy / 3;
    const bx = x1 + (2 * dx) / 3, by = y1 + (2 * dy) / 3;
    const px = (ax + bx) / 2 - (Math.sqrt(3) / 2) * (by - ay);
    const py = (ay + by) / 2 + (Math.sqrt(3) / 2) * (bx - ax);
    return [
      ...kochPoints(x1, y1, ax, ay, d - 1),
      ...kochPoints(ax, ay, px, py, d - 1),
      ...kochPoints(px, py, bx, by, d - 1),
      ...kochPoints(bx, by, x2, y2, d - 1),
    ];
  };

  const p1: [number, number] = [padding, h + padding];
  const p2: [number, number] = [size / 2 + padding, padding];
  const p3: [number, number] = [size + padding, h + padding];

  const points = [
    [p1[0], p1[1]] as [number, number],
    ...kochPoints(p1[0], p1[1], p2[0], p2[1], depth),
    ...kochPoints(p2[0], p2[1], p3[0], p3[1], depth),
    ...kochPoints(p3[0], p3[1], p1[0], p1[1], depth),
  ];

  const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg
      width={size + padding * 2}
      height={h + padding * 2}
      viewBox={`0 0 ${size + padding * 2} ${h + padding * 2}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points={pointsStr}
        fill={color}
        fillOpacity={0.06}
        stroke={color}
        strokeWidth={0.8}
      />
    </svg>
  );
};

export default KochSnowflake;
