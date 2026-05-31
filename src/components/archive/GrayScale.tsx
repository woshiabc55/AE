import React from 'react';

export interface GrayScaleProps {
  steps?: number;
  direction?: 'horizontal' | 'vertical';
}

const GrayScale: React.FC<GrayScaleProps> = ({
  steps = 10,
  direction = 'horizontal',
}) => {
  const isH = direction === 'horizontal';
  const grays = Array.from({ length: steps }, (_, i) => {
    const v = Math.round((i / (steps - 1)) * 255);
    const hex = v.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  });

  const length = steps * 30;
  const thickness = 20;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="font-mono text-[9px] text-[#909090]">灰阶 / {steps}级</div>
      <div
        className="flex border border-[#d0d0d0] overflow-hidden"
        style={{
          flexDirection: isH ? 'row' : 'column',
          width: isH ? length : thickness,
          height: isH ? thickness : length,
          borderRadius: '1px',
        }}
      >
        {grays.map((c, i) => (
          <div
            key={i}
            style={{
              backgroundColor: c,
              flex: 1,
            }}
          />
        ))}
      </div>
      <div
        className="flex font-mono text-[7px] text-[#909090]"
        style={{ flexDirection: isH ? 'row' : 'column' }}
      >
        {grays.map((c, i) => (
          <span key={i} className="flex-1 text-center">{c}</span>
        ))}
      </div>
    </div>
  );
};

export default GrayScale;
