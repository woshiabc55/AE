import React from 'react';

export interface AxisIndicatorProps {
  size?: number;
  labels?: { x?: string; y?: string };
}

const AxisIndicator: React.FC<AxisIndicatorProps> = ({
  size = 60,
  labels = { x: 'X', y: 'Y' },
}) => {
  const color = '#1a1a1a';
  const arrowLen = 6;
  const margin = 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1={margin}
        y1={size - margin}
        x2={size - margin}
        y2={size - margin}
        stroke={color}
        strokeWidth={0.5}
      />
      <line
        x1={margin}
        y1={size - margin}
        x2={size - margin}
        y2={margin}
        stroke={color}
        strokeWidth={0.5}
      />
      <polygon
        points={`${size - margin},${margin} ${size - margin - arrowLen / 2},${margin + arrowLen} ${size - margin + arrowLen / 2},${margin + arrowLen}`}
        fill={color}
      />
      <polygon
        points={`${margin},${margin} ${margin - arrowLen / 2},${margin + arrowLen} ${margin + arrowLen / 2},${margin + arrowLen}`}
        fill={color}
        transform={`rotate(-90, ${margin}, ${size - margin})`}
      />
      <text
        x={size - margin + 4}
        y={margin + 4}
        fontFamily="monospace"
        fontSize={8}
        fill={color}
      >
        {labels.x}
      </text>
      <text
        x={margin - 2}
        y={margin - 4}
        fontFamily="monospace"
        fontSize={8}
        fill={color}
      >
        {labels.y}
      </text>
      <circle cx={margin} cy={size - margin} r={1.5} fill={color} />
    </svg>
  );
};

export default AxisIndicator;
