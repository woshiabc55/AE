import React from 'react';

export interface DimensionLineProps {
  length?: number;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

const DimensionLine: React.FC<DimensionLineProps> = ({
  length = 200,
  label = '100mm',
  orientation = 'horizontal',
}) => {
  const color = '#1a1a1a';
  const tickH = 6;
  const isH = orientation === 'horizontal';
  const w = isH ? length : tickH + 14;
  const h = isH ? tickH + 14 : length;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {isH ? (
        <>
          <line x1={0} y1={tickH / 2} x2={0} y2={tickH / 2 + 8} stroke={color} strokeWidth={0.5} />
          <line x1={length} y1={tickH / 2} x2={length} y2={tickH / 2 + 8} stroke={color} strokeWidth={0.5} />
          <line x1={0} y1={tickH / 2 + 4} x2={length} y2={tickH / 2 + 4} stroke={color} strokeWidth={0.4} />
          <line x1={2} y1={tickH / 2 + 2} x2={2} y2={tickH / 2 + 6} stroke={color} strokeWidth={0.3} />
          <line x1={length - 2} y1={tickH / 2 + 2} x2={length - 2} y2={tickH / 2 + 6} stroke={color} strokeWidth={0.3} />
          <text
            x={length / 2}
            y={tickH + 12}
            textAnchor="middle"
            fontFamily="monospace"
            fontSize={8}
            fill={color}
          >
            {label}
          </text>
        </>
      ) : (
        <>
          <line x1={tickH / 2} y1={0} x2={tickH / 2 + 8} y2={0} stroke={color} strokeWidth={0.5} />
          <line x1={tickH / 2} y1={length} x2={tickH / 2 + 8} y2={length} stroke={color} strokeWidth={0.5} />
          <line x1={tickH / 2 + 4} y1={0} x2={tickH / 2 + 4} y2={length} stroke={color} strokeWidth={0.4} />
          <text
            x={tickH + 10}
            y={length / 2}
            textAnchor="middle"
            fontFamily="monospace"
            fontSize={8}
            fill={color}
            transform={`rotate(90, ${tickH + 10}, ${length / 2})`}
          >
            {label}
          </text>
        </>
      )}
    </svg>
  );
};

export default DimensionLine;
