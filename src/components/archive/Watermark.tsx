import React from 'react';

export interface WatermarkProps {
  text?: string;
  opacity?: number;
  rotation?: number;
  fontSize?: number;
}

const Watermark: React.FC<WatermarkProps> = ({
  text = 'ARCHIVE',
  opacity = 0.06,
  rotation = -30,
  fontSize = 48,
}) => {
  const color = '#1a3a6b';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <span
          className="font-mono font-bold select-none whitespace-nowrap"
          style={{
            fontSize,
            color,
            letterSpacing: '0.3em',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default Watermark;
