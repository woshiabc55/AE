import React from 'react';

export interface CrosshairProps {
  size?: number;
  strokeWidth?: number;
}

const Crosshair: React.FC<CrosshairProps> = ({
  size = 30,
  strokeWidth = 0.5,
}) => {
  const color = '#1a1a1a';
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1={0} y1={cy} x2={size} y2={cy} stroke={color} strokeWidth={strokeWidth} />
      <line x1={cx} y1={0} x2={cx} y2={size} stroke={color} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={1} fill={color} />
    </svg>
  );
};

export default Crosshair;
