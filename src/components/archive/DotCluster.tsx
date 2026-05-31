import React from 'react';

export interface DotClusterProps {
  count?: number;
  size?: number;
  arrangement?: 'horizontal' | 'diagonal' | 'grid';
}

const DotCluster: React.FC<DotClusterProps> = ({
  count = 9,
  size = 4,
  arrangement = 'grid',
}) => {
  const color = '#1a3a6b';
  const gap = size * 2.5;

  const getPositions = (): [number, number][] => {
    switch (arrangement) {
      case 'horizontal':
        return Array.from({ length: count }, (_, i) => [i * gap, 0]);
      case 'diagonal':
        return Array.from({ length: count }, (_, i) => [i * gap, i * gap]);
      case 'grid': {
        const cols = Math.ceil(Math.sqrt(count));
        return Array.from({ length: count }, (_, i) => [
          (i % cols) * gap,
          Math.floor(i / cols) * gap,
        ]);
      }
    }
  };

  const positions = getPositions();
  const xs = positions.map(p => p[0]);
  const ys = positions.map(p => p[1]);
  const maxX = Math.max(...xs) + size * 2;
  const maxY = Math.max(...ys) + size * 2;

  return (
    <svg
      width={maxX}
      height={maxY}
      viewBox={`0 0 ${maxX} ${maxY}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {positions.map(([x, y], i) => (
        <circle
          key={i}
          cx={x + size}
          cy={y + size}
          r={size / 2}
          fill={color}
          opacity={0.6}
        />
      ))}
    </svg>
  );
};

export default DotCluster;
