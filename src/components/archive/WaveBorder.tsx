import React from 'react';

export interface WaveBorderProps {
  width?: number;
  height?: number;
  waves?: number;
  color?: string;
}

const WaveBorder: React.FC<WaveBorderProps> = ({
  width = 400,
  height = 60,
  waves = 5,
  color = '#1a3a6b',
}) => {
  const waveWidth = width / waves;
  const midY = height / 2;
  const amp = height * 0.3;

  let topPath = `M0,${midY}`;
  let bottomPath = `M0,${midY}`;
  for (let i = 0; i < waves; i++) {
    const x1 = i * waveWidth + waveWidth * 0.25;
    const x2 = i * waveWidth + waveWidth * 0.5;
    const x3 = i * waveWidth + waveWidth * 0.75;
    const x4 = (i + 1) * waveWidth;
    topPath += ` Q${x1},${midY - amp} ${x2},${midY} Q${x3},${midY + amp} ${x4},${midY}`;
    bottomPath += ` Q${x1},${midY + amp * 0.6} ${x2},${midY} Q${x3},${midY - amp * 0.6} ${x4},${midY}`;
  }

  const rockX = width * 0.5;
  const rockPath = `M${rockX - 15},${height} L${rockX - 8},${midY + 5} L${rockX},${midY - 2} L${rockX + 8},${midY + 5} L${rockX + 15},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} fill="none" strokeWidth={1}>
        <path d={topPath} />
        <path d={bottomPath} strokeWidth={0.6} opacity={0.5} />
        <path d={rockPath} fill={color} opacity={0.15} />
      </g>
      <line x1={0} y1={height - 1} x2={width} y2={height - 1} stroke={color} strokeWidth={0.5} opacity={0.3} />
    </svg>
  );
};

export default WaveBorder;
