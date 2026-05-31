import React from 'react';

export interface BambooSilhouetteProps {
  opacity?: number;
  position?: 'left' | 'right' | 'center';
  size?: number;
}

const BambooSilhouette: React.FC<BambooSilhouetteProps> = ({
  opacity = 0.08,
  position = 'right',
  size = 200,
}) => {
  const color = '#1a3a6b';
  const w = size * 0.6;
  const h = size * 1.4;

  const stemX = position === 'left' ? w * 0.3 : position === 'right' ? w * 0.7 : w * 0.5;

  const nodes = [0.15, 0.35, 0.55, 0.75, 0.9];
  const leaves = [
    { y: 0.2, side: -1, angle: -30 },
    { y: 0.3, side: 1, angle: 25 },
    { y: 0.45, side: -1, angle: -35 },
    { y: 0.55, side: 1, angle: 20 },
    { y: 0.7, side: -1, angle: -25 },
    { y: 0.8, side: 1, angle: 30 },
  ];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <g fill={color} stroke={color}>
        <line
          x1={stemX}
          y1={h * 0.05}
          x2={stemX}
          y2={h * 0.95}
          strokeWidth={2}
          strokeOpacity={0.6}
        />
        {nodes.map((ny, i) => (
          <ellipse
            key={i}
            cx={stemX}
            cy={ny * h}
            rx={4}
            ry={1.5}
            fillOpacity={0.4}
          />
        ))}
        {leaves.map((leaf, i) => {
          const lx = stemX + leaf.side * 3;
          const ly = leaf.y * h;
          const leafLen = size * 0.2;
          const rad = (leaf.angle * Math.PI) / 180;
          const tipX = lx + Math.sin(rad) * leafLen * leaf.side;
          const tipY = ly - Math.cos(rad) * leafLen;
          const cpX = lx + Math.sin(rad) * leafLen * 0.5 * leaf.side;
          const cpY = ly - Math.cos(rad) * leafLen * 0.5;
          return (
            <path
              key={`l${i}`}
              d={`M${lx},${ly} Q${cpX + leaf.side * 4},${cpY} ${tipX},${tipY}`}
              fill="none"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default BambooSilhouette;
