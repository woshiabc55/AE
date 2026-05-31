import React from 'react';

export interface MengerSpongeProps {
  depth?: number;
  size?: number;
  color?: string;
}

const MengerSponge: React.FC<MengerSpongeProps> = ({
  depth = 2,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;
  const totalSize = size + padding * 2;

  const generateSquares = (
    x: number,
    y: number,
    s: number,
    d: number,
  ): React.ReactElement[] => {
    if (d <= 0) {
      return [
        <rect
          key={`${x}-${y}-${d}-${s}`}
          x={x}
          y={y}
          width={s}
          height={s}
          fill={color}
          fillOpacity={0.12}
          stroke={color}
          strokeWidth={0.4}
        />,
      ];
    }
    const results: React.ReactElement[] = [];
    const unit = s / 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (row === 1 && col === 1) continue;
        results.push(...generateSquares(x + col * unit, y + row * unit, unit, d - 1));
      }
    }
    return results;
  };

  const elements = generateSquares(padding, padding, size, depth);

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {elements}
    </svg>
  );
};

export default MengerSponge;
