import React from 'react';

export interface VoronoiDiagramProps {
  points?: number;
  size?: number;
  color?: string;
}

const VoronoiDiagram: React.FC<VoronoiDiagramProps> = ({
  points = 12,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;
  const totalSize = size + padding * 2;

  const seed = (n: number) => {
    let x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const pts = Array.from({ length: points }, (_, i) => ({
    x: padding + seed(i * 2) * size,
    y: padding + seed(i * 2 + 1) * size,
  }));

  const computeVoronoiEdges = () => {
    const edges: [number, number, number, number][] = [];
    const step = 4;
    const w = totalSize;
    const h = totalSize;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        let min1 = Infinity, min2 = Infinity;
        let nearest = 0;
        for (let i = 0; i < pts.length; i++) {
          const d = (pts[i].x - x) ** 2 + (pts[i].y - y) ** 2;
          if (d < min1) { min2 = min1; min1 = d; nearest = i; }
          else if (d < min2) { min2 = d; }
        }
        const diff = Math.sqrt(min2) - Math.sqrt(min1);
        if (diff < step * 1.5) {
          edges.push([x, y, x + step * 0.5, y + step * 0.5]);
        }
      }
    }
    return edges;
  };

  const edges = computeVoronoiEdges();

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}
      {pts.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p.x}
          cy={p.y}
          r={2}
          fill={color}
          opacity={0.7}
        />
      ))}
    </svg>
  );
};

export default VoronoiDiagram;
