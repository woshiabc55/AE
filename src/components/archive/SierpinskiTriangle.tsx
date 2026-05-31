import React from 'react';

export interface SierpinskiTriangleProps {
  depth?: number;
  size?: number;
  color?: string;
}

const SierpinskiTriangle: React.FC<SierpinskiTriangleProps> = ({
  depth = 4,
  size = 200,
  color = '#1a3a6b',
}) => {
  const h = (size * Math.sqrt(3)) / 2;

  const generateTriangles = (
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    d: number,
  ): React.ReactElement[] => {
    if (d <= 0) {
      return [
        <polygon
          key={`${x1}-${y1}-${d}`}
          points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
          fill={color}
          fillOpacity={0.15 + (depth - d) * 0.05}
          stroke={color}
          strokeWidth={0.5}
        />,
      ];
    }
    const mx12 = (x1 + x2) / 2, my12 = (y1 + y2) / 2;
    const mx23 = (x2 + x3) / 2, my23 = (y2 + y3) / 2;
    const mx13 = (x1 + x3) / 2, my13 = (y1 + y3) / 2;
    return [
      ...generateTriangles(x1, y1, mx12, my12, mx13, my13, d - 1),
      ...generateTriangles(mx12, my12, x2, y2, mx23, my23, d - 1),
      ...generateTriangles(mx13, my13, mx23, my23, x3, y3, d - 1),
    ];
  };

  const padding = 10;
  const elements = generateTriangles(
    padding, h + padding,
    size / 2 + padding, padding,
    size + padding, h + padding,
    depth,
  );

  return (
    <svg
      width={size + padding * 2}
      height={h + padding * 2}
      viewBox={`0 0 ${size + padding * 2} ${h + padding * 2}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {elements}
    </svg>
  );
};

export default SierpinskiTriangle;
