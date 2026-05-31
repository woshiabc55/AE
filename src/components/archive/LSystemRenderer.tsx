import React from 'react';

export interface LSystemRendererProps {
  axiom?: string;
  rules?: Record<string, string>;
  angle?: number;
  iterations?: number;
  size?: number;
}

const LSystemRenderer: React.FC<LSystemRendererProps> = ({
  axiom = 'F',
  rules = { F: 'F+F-F-F+F' },
  angle = 90,
  iterations = 4,
  size = 200,
}) => {
  const color = '#1a3a6b';
  const padding = 10;

  const generateLSystem = (ax: string, rls: Record<string, string>, n: number): string => {
    let current = ax;
    for (let i = 0; i < n; i++) {
      current = current.split('').map(c => rls[c] || c).join('');
    }
    return current;
  };

  const lSystemString = generateLSystem(axiom, rules, iterations);

  const computePoints = (str: string, ang: number): [number, number][] => {
    let x = 0, y = 0, dir = 0;
    const pts: [number, number][] = [[x, y]];
    const stack: [number, number, number][] = [];
    const rad = (ang * Math.PI) / 180;

    for (const ch of str) {
      if (ch === 'F' || ch === 'G') {
        x += Math.cos(dir);
        y += Math.sin(dir);
        pts.push([x, y]);
      } else if (ch === '+') {
        dir += rad;
      } else if (ch === '-') {
        dir -= rad;
      } else if (ch === '[') {
        stack.push([x, y, dir]);
      } else if (ch === ']') {
        const state = stack.pop();
        if (state) { [x, y, dir] = state; }
      }
    }
    return pts;
  };

  const rawPoints = computePoints(lSystemString, angle);
  if (rawPoints.length < 2) {
    return <svg width={size} height={size} />;
  }

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

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

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

export default LSystemRenderer;
