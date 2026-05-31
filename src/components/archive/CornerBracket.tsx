import React from 'react';

export interface CornerBracketProps {
  size?: number;
  armLen?: number;
  strokeWidth?: number;
  position?: 'tl' | 'tr' | 'bl' | 'br';
}

const CornerBracket: React.FC<CornerBracketProps> = ({
  size = 20,
  armLen = 20,
  strokeWidth = 0.75,
  position = 'tl',
}) => {
  const color = '#1a1a1a';
  const a = armLen;

  const getPoints = () => {
    switch (position) {
      case 'tl': return `${size},${size} ${size},${size - a} ${size - a},${size}`;
      case 'tr': return `${size},${size} ${size},${size - a} ${size + a},${size}`;
      case 'bl': return `${size},${size} ${size},${size + a} ${size - a},${size}`;
      case 'br': return `${size},${size} ${size},${size + a} ${size + a},${size}`;
    }
  };

  const viewBoxSize = size + armLen;

  return (
    <svg
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        points={getPoints()}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default CornerBracket;
