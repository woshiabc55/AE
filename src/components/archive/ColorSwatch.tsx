import React from 'react';

export interface ColorSwatchProps {
  color?: string;
  label?: string;
  hex?: string;
  size?: number;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color = '#1a3a6b',
  label = '青花蓝',
  hex = '#1a3a6b',
  size = 60,
}) => {
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className="border border-[#d0d0d0]"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: '2px',
        }}
      />
      <div className="text-center">
        <div className="font-mono text-[9px] text-[#1a1a1a]">{label}</div>
        <div className="font-mono text-[8px] text-[#909090] uppercase">{hex}</div>
      </div>
    </div>
  );
};

export default ColorSwatch;
