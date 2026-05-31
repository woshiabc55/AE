import React from 'react';

export interface SealStampProps {
  character?: string;
  size?: number;
  color?: string;
  rotation?: number;
}

const SealStamp: React.FC<SealStampProps> = ({
  character = '印',
  size = 60,
  color = '#c23a2e',
  rotation = -3,
}) => {
  const padding = 6;
  const inner = size - padding * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <rect
        x={padding}
        y={padding}
        width={inner}
        height={inner}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <rect
        x={padding + 3}
        y={padding + 3}
        width={inner - 6}
        height={inner - 6}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
      />
      <text
        x={size / 2}
        y={size / 2 + size * 0.15}
        textAnchor="middle"
        fontFamily="serif"
        fontSize={size * 0.4}
        fontWeight="bold"
        fill={color}
      >
        {character}
      </text>
    </svg>
  );
};

export default SealStamp;
