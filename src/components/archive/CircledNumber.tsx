import React from 'react';

export interface CircledNumberProps {
  number?: number;
  size?: number;
  color?: string;
}

const CircledNumber: React.FC<CircledNumberProps> = ({
  number = 1,
  size = 24,
  color = '#1a3a6b',
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const fontSize = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + fontSize * 0.35}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={fontSize}
        fontWeight="bold"
        fill={color}
      >
        {number}
      </text>
    </svg>
  );
};

export default CircledNumber;
