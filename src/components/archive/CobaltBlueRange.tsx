import React from 'react';

export interface CobaltBlueRangeProps {
  from?: string;
  to?: string;
  steps?: number;
}

const CobaltBlueRange: React.FC<CobaltBlueRangeProps> = ({
  from = '#0a1e3d',
  to = '#a8c8e8',
  steps = 8,
}) => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
  };

  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);

  const colors = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
  });

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="font-mono text-[9px] text-[#909090]">钴蓝色域 / COBALT RANGE</div>
      <div className="flex border border-[#d0d0d0] overflow-hidden" style={{ borderRadius: '1px' }}>
        {colors.map((c, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              backgroundColor: c,
              height: 24,
              minWidth: 30,
            }}
          />
        ))}
      </div>
      <div className="flex font-mono text-[7px] text-[#909090]">
        {colors.map((c, i) => (
          <span key={i} className="flex-1 text-center">{c}</span>
        ))}
      </div>
    </div>
  );
};

export default CobaltBlueRange;
