import React from 'react';

export interface ShuMarkProps {
  size?: number;
  style?: 'modern' | 'seal';
}

const ShuMark: React.FC<ShuMarkProps> = ({
  size = 60,
  style = 'modern',
}) => {
  const color = '#1a3a6b';
  const cx = size / 2;
  const cy = size / 2;

  if (style === 'seal') {
    const r = size * 0.38;
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
          stroke="#c23a2e"
          strokeWidth={1.5}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r - 3}
          fill="none"
          stroke="#c23a2e"
          strokeWidth={0.5}
        />
        <text
          x={cx}
          y={cy + size * 0.12}
          textAnchor="middle"
          fontFamily="serif"
          fontSize={size * 0.32}
          fontWeight="bold"
          fill="#c23a2e"
        >
          蜀
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={4}
        y={4}
        width={size - 8}
        height={size - 8}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        rx={2}
      />
      <text
        x={cx}
        y={cy + size * 0.12}
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize={size * 0.35}
        fontWeight="bold"
        fill={color}
      >
        蜀
      </text>
      <line
        x1={8}
        y1={size - 12}
        x2={size - 8}
        y2={size - 12}
        stroke={color}
        strokeWidth={0.5}
        opacity={0.4}
      />
    </svg>
  );
};

export default ShuMark;
