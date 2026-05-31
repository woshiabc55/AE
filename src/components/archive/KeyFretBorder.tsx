import React from 'react';

export interface KeyFretBorderProps {
  length?: number;
  unitSize?: number;
  color?: string;
}

const KeyFretBorder: React.FC<KeyFretBorderProps> = ({
  length = 400,
  unitSize = 20,
  color = '#1a3a6b',
}) => {
  const units = Math.floor(length / unitSize);
  const svgHeight = unitSize * 2;
  const actualLength = units * unitSize;

  const unitPath = (x: number, y: number, s: number) => {
    const h = s / 2;
    return `M${x},${y + s} L${x},${y + h} L${x + h},${y + h} L${x + h},${y} L${x + s},${y} L${x + s},${y + h}`;
  };

  const paths = Array.from({ length: units }, (_, i) => unitPath(i * unitSize, 0, unitSize));

  return (
    <svg
      width={actualLength}
      height={svgHeight}
      viewBox={`0 0 ${actualLength} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={1}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <line x1={0} y1={svgHeight - 1} x2={actualLength} y2={svgHeight - 1} stroke={color} strokeWidth={0.3} opacity={0.4} />
    </svg>
  );
};

export default KeyFretBorder;
