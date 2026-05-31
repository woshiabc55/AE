import React from 'react';

export interface ScrollworkProps {
  scrolls?: number;
  amplitude?: number;
  color?: string;
}

const Scrollwork: React.FC<ScrollworkProps> = ({
  scrolls = 4,
  amplitude = 30,
  color = '#1a3a6b',
}) => {
  const width = scrolls * amplitude * 3 + 40;
  const height = amplitude * 4 + 40;
  const startX = 20;
  const midY = height / 2;

  const mainPath = Array.from({ length: scrolls }, (_, i) => {
    const x = startX + i * amplitude * 3;
    const cp1x = x + amplitude * 0.5;
    const cp1y = midY - amplitude;
    const cp2x = x + amplitude * 1.5;
    const cp2y = midY + amplitude;
    const endX = x + amplitude * 3;
    return `C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${midY}`;
  }).join(' ');

  const tendrils = Array.from({ length: scrolls * 2 }, (_, i) => {
    const x = startX + (i * amplitude * 1.5) + amplitude * 0.75;
    const dir = i % 2 === 0 ? -1 : 1;
    const ty = midY + dir * amplitude * 0.3;
    return (
      <path
        key={i}
        d={`M${x},${midY} Q${x + amplitude * 0.2},${ty} ${x + amplitude * 0.4},${midY}`}
        strokeWidth={0.6}
        opacity={0.6}
      />
    );
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={1.2}>
        <path d={`M${startX},${midY} ${mainPath}`} />
        {tendrils}
      </g>
    </svg>
  );
};

export default Scrollwork;
