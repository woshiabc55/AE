import React from 'react';

export interface FibonacciSpiralProps {
  turns?: number;
  size?: number;
  color?: string;
}

const FibonacciSpiral: React.FC<FibonacciSpiralProps> = ({
  turns = 6,
  size = 200,
  color = '#1a3a6b',
}) => {
  const padding = 10;
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;

  const phi = (1 + Math.sqrt(5)) / 2;
  const maxAngle = turns * 2 * Math.PI;
  const steps = turns * 60;

  const spiralPoints: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * maxAngle;
    const r = (size * 0.4) * Math.pow(phi, (angle / (2 * Math.PI)) - turns);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    spiralPoints.push([x, y]);
  }

  const pathD = spiralPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(' ');

  const fibSquares: React.ReactElement[] = [];
  const fib = [1, 1];
  for (let i = 2; i < turns + 2; i++) fib.push(fib[i - 1] + fib[i - 2]);
  const maxFib = fib[fib.length - 1];
  const unit = (size * 0.8) / maxFib;

  let sx = cx - size * 0.4;
  let sy = cy - size * 0.4;
  for (let i = 0; i < Math.min(turns, fib.length); i++) {
    const s = fib[i] * unit;
    fibSquares.push(
      <rect
        key={i}
        x={sx}
        y={sy}
        width={s}
        height={s}
        fill="none"
        stroke={color}
        strokeWidth={0.3}
        opacity={0.25}
      />
    );
    if (i % 4 === 0) sy += s;
    else if (i % 4 === 1) sx += s;
    else if (i % 4 === 2) sy -= fib[i + 1] * unit;
    else sx -= fib[i + 1] * unit;
  }

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {fibSquares}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1}
      />
    </svg>
  );
};

export default FibonacciSpiral;
