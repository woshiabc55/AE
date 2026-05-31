import React from 'react';

export interface PeonySprayProps {
  petals?: number;
  radius?: number;
  layers?: number;
}

const PeonySpray: React.FC<PeonySprayProps> = ({
  petals = 6,
  radius = 70,
  layers = 3,
}) => {
  const size = (radius + 30) * 2;
  const cx = size / 2;
  const cy = size / 2;
  const color = '#1a3a6b';

  const layerElements = Array.from({ length: layers }, (_, layer) => {
    const layerRadius = radius * (0.4 + layer * 0.3);
    const layerPetals = petals + layer;
    const opacity = 1 - layer * 0.2;
    return Array.from({ length: layerPetals }, (_, i) => {
      const angle = (360 / layerPetals) * i + layer * 15;
      return (
        <ellipse
          key={`${layer}-${i}`}
          cx={0}
          cy={-layerRadius * 0.4}
          rx={radius * 0.18}
          ry={layerRadius * 0.35}
          transform={`rotate(${angle})`}
          opacity={opacity}
        />
      );
    });
  });

  const stemPath = `M${cx},${cy + radius * 0.15} Q${cx - 15},${cy + radius * 0.6} ${cx - 8},${cy + radius + 20}`;
  const leafPath1 = `M${cx - 8},${cy + radius * 0.5} Q${cx - 25},${cy + radius * 0.4} ${cx - 20},${cy + radius * 0.55} Q${cx - 12},${cy + radius * 0.55} ${cx - 8},${cy + radius * 0.5}`;
  const leafPath2 = `M${cx - 5},${cy + radius * 0.7} Q${cx + 10},${cy + radius * 0.6} ${cx + 8},${cy + radius * 0.75} Q${cx},${cy + radius * 0.75} ${cx - 5},${cy + radius * 0.7}`;

  return (
    <svg
      width={size}
      height={size + 30}
      viewBox={`0 0 ${size} ${size + 30}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={1}>
        <path d={stemPath} />
        <path d={leafPath1} fill={color} opacity={0.1} />
        <path d={leafPath2} fill={color} opacity={0.1} />
      </g>
      <g transform={`translate(${cx},${cy})`} stroke={color} fill="none" strokeWidth={0.8}>
        {layerElements}
        <circle r={radius * 0.08} fill={color} />
      </g>
    </svg>
  );
};

export default PeonySpray;
