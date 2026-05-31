import React from 'react';

export interface DragonPatternProps {
  size?: number;
  color?: string;
  simplified?: boolean;
}

const DragonPattern: React.FC<DragonPatternProps> = ({
  size = 200,
  color = '#1a3a6b',
  simplified = true,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.4;

  const bodyPath = simplified
    ? `M${cx - s * 0.8},${cy} C${cx - s * 0.5},${cy - s * 0.6} ${cx},${cy - s * 0.3} ${cx + s * 0.2},${cy - s * 0.5} C${cx + s * 0.5},${cy - s * 0.8} ${cx + s * 0.7},${cy - s * 0.2} ${cx + s * 0.8},${cy}`
    : `M${cx - s * 0.8},${cy} C${cx - s * 0.6},${cy - s * 0.7} ${cx - s * 0.2},${cy - s * 0.5} ${cx},${cy - s * 0.6} C${cx + s * 0.3},${cy - s * 0.8} ${cx + s * 0.5},${cy - s * 0.3} ${cx + s * 0.7},${cy - s * 0.1} C${cx + s * 0.8},${cy} ${cx + s * 0.6},${cy + s * 0.3} ${cx + s * 0.3},${cy + s * 0.2}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={1.2}>
        <path d={bodyPath} />
        <circle cx={cx + s * 0.6} cy={cy - s * 0.45} r={s * 0.08} fill={color} />
        {!simplified && (
          <>
            <path d={`M${cx - s * 0.7},${cy - s * 0.1} L${cx - s * 0.9},${cy - s * 0.3}`} strokeWidth={0.8} />
            <path d={`M${cx - s * 0.65},${cy + s * 0.05} L${cx - s * 0.85},${cy + s * 0.2}`} strokeWidth={0.8} />
            <path d={`M${cx + s * 0.5},${cy - s * 0.5} L${cx + s * 0.65},${cy - s * 0.7} L${cx + s * 0.55},${cy - s * 0.65}`} strokeWidth={0.6} />
          </>
        )}
        <path d={`M${cx + s * 0.8},${cy} Q${cx + s * 0.9},${cy + s * 0.15} ${cx + s * 0.7},${cy + s * 0.2}`} strokeWidth={0.8} />
        {simplified && (
          <>
            <path d={`M${cx - s * 0.3},${cy - s * 0.15} L${cx - s * 0.15},${cy - s * 0.25}`} strokeWidth={0.5} />
            <path d={`M${cx},${cy - s * 0.3} L${cx + s * 0.1},${cy - s * 0.45}`} strokeWidth={0.5} />
          </>
        )}
      </g>
    </svg>
  );
};

export default DragonPattern;
