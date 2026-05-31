import React from 'react';

export interface InkWashProps {
  opacity?: number;
  color?: string;
  style?: 'light' | 'medium' | 'heavy';
}

const InkWash: React.FC<InkWashProps> = ({
  opacity = 0.15,
  color = '#1a1a1a',
  style = 'medium',
}) => {
  const blur = style === 'light' ? 20 : style === 'medium' ? 12 : 6;
  const count = style === 'light' ? 3 : style === 'medium' ? 5 : 8;

  const blobs = Array.from({ length: count }, (_, i) => {
    const cx = 20 + Math.sin(i * 2.3) * 30 + 50;
    const cy = 20 + Math.cos(i * 1.7) * 25 + 50;
    const rx = 15 + Math.sin(i * 3.1) * 10;
    const ry = 12 + Math.cos(i * 2.7) * 8;
    const blobOpacity = style === 'light' ? 0.3 : style === 'medium' ? 0.5 : 0.7;
    return (
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={color}
        opacity={blobOpacity}
        transform={`rotate(${i * 37}, ${cx}, ${cy})`}
      />
    );
  });

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`ink-blur-${style}`}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        <g filter={`url(#ink-blur-${style})`}>
          {blobs}
        </g>
      </svg>
    </div>
  );
};

export default InkWash;
