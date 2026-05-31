import React from 'react';

export interface CloudCollarProps {
  clouds?: number;
  radius?: number;
  color?: string;
}

const CloudCollar: React.FC<CloudCollarProps> = ({
  clouds = 5,
  radius = 80,
  color = '#1a3a6b',
}) => {
  const size = (radius + 30) * 2;
  const cx = size / 2;
  const cy = size / 2;

  const cloudPaths = Array.from({ length: clouds }, (_, i) => {
    const angle = (360 / clouds) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const dist = radius * 0.55;
    const cloudCx = Math.cos(rad) * dist;
    const cloudCy = Math.sin(rad) * dist;
    const r = radius * 0.28;
    const lobes = 3;
    let d = `M${cloudCx - r},${cloudCy}`;
    for (let j = 0; j < lobes; j++) {
      const lobeAngle = (Math.PI / lobes) * j - Math.PI / 2;
      const lx = cloudCx + Math.cos(lobeAngle) * r * 0.5;
      const ly = cloudCy + Math.sin(lobeAngle) * r * 0.5;
      d += ` Q${lx},${ly - r * 0.4} ${cloudCx + (r / lobes) * (j + 0.5)},${cloudCy}`;
    }
    d += ` Q${cloudCx + r * 0.5},${cloudCy + r * 0.3} ${cloudCx + r},${cloudCy}`;
    d += ` Q${cloudCx + r * 0.5},${cloudCy + r * 0.5} ${cloudCx},${cloudCy + r * 0.3}`;
    d += ` Q${cloudCx - r * 0.5},${cloudCy + r * 0.5} ${cloudCx - r},${cloudCy}`;
    d += ' Z';
    return <path key={i} d={d} transform={`rotate(${angle + 90}, ${cloudCx}, ${cloudCy})`} />;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`translate(${cx},${cy})`} stroke={color} fill="none" strokeWidth={1}>
        <circle r={radius * 0.2} />
        <circle r={radius * 0.35} strokeDasharray="2 2" strokeWidth={0.5} opacity={0.4} />
        {cloudPaths}
      </g>
    </svg>
  );
};

export default CloudCollar;
