import React from 'react';

export interface ColorRampProps {
  colors?: string[];
  direction?: 'horizontal' | 'vertical';
  label?: string;
}

const ColorRamp: React.FC<ColorRampProps> = ({
  colors = ['#0a1e3d', '#1a3a6b', '#3a6aaa', '#7aaad4', '#a8c8e8', '#d0e4f4'],
  direction = 'horizontal',
  label = '钴蓝色域',
}) => {
  const isH = direction === 'horizontal';
  const length = colors.length * 40;
  const thickness = 20;

  return (
    <div className="inline-flex flex-col gap-1">
      {label && (
        <div className="font-mono text-[9px] text-[#909090]">{label}</div>
      )}
      <div
        className="flex border border-[#d0d0d0] overflow-hidden"
        style={{
          flexDirection: isH ? 'row' : 'column',
          width: isH ? length : thickness,
          height: isH ? thickness : length,
          borderRadius: '1px',
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              backgroundColor: c,
              flex: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorRamp;
