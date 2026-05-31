import React from 'react';

export interface DashedBorderProps {
  width?: number;
  height?: number;
  dash?: number;
  gap?: number;
  color?: string;
}

const DashedBorder: React.FC<DashedBorderProps> = ({
  width = 200,
  height = 100,
  dash = 6,
  gap = 3,
  color = '#1a3a6b',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={0.5}
        y={0.5}
        width={width - 1}
        height={height - 1}
        fill="none"
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray={`${dash} ${gap}`}
      />
    </svg>
  );
};

export default DashedBorder;
