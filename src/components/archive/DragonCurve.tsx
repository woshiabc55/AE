import React from 'react';

export interface DragonCurveProps {
  iterations?: number;
  size?: number;
  color?: string;
}

const DragonCurve: React.FC<DragonCurveProps> = ({
  iterations = 10,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;

  const generateDragonCurve = (n: number): [number, number][] => {
    let turns: number[] = [1];
    for (let i = 1; i < n; i++) {
      const newTurns = [...turns, 1, ...turns.slice().reverse().map(t => -t)];
      turns = newTurns;
    }

    const directions: [number, number][] = [[1, 0], [0, -1], [-1, 0], [0, 1]];
    let dir = 0;
    let x = 0, y = 0;
    const points: [number, number][] = [[x, y]];

    for (let i = 0; i < turns.length; i++) {
      dir = ((dir + turns[i]) % 4 + 4) % 4;
      x += directions[dir][0];
      y += directions[dir][1];
      points.push([x, y]);
    }

    return points;
  };

  const rawPoints = generateDragonCurve(iterations);
  const xs = rawPoints.map(p => p[0]);
  const ys = rawPoints.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const scale = (size - padding * 2) / Math.max(rangeX, rangeY);

  const points = rawPoints.map(([px, py]) => [
    padding + (px - minX) * scale,
    padding + (py - minY) * scale,
  ]);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={0.6}
        opacity={0.8}
      />
    </svg>
  );
};

export default DragonCurve;
