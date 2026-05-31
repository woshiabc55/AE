import React from 'react';

export interface TonalInversionProps {
  original?: string;
  inverted?: string;
}

const TonalInversion: React.FC<TonalInversionProps> = ({
  original = '#1a3a6b',
  inverted = '#e5c594',
}) => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const computeInverted = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return `#${[255 - r, 255 - g, 255 - b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  };

  const autoInverted = computeInverted(original);

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="font-mono text-[9px] text-[#909090]">色调反转 / TONAL INVERSION</div>
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <div
            className="border border-[#d0d0d0]"
            style={{ width: 50, height: 50, backgroundColor: original, borderRadius: '2px' }}
          />
          <span className="font-mono text-[8px] text-[#1a1a1a]">{original}</span>
          <span className="font-mono text-[7px] text-[#909090]">ORIGINAL</span>
        </div>
        <div className="flex items-center font-mono text-[#909090]">→</div>
        <div className="flex flex-col items-center gap-0.5">
          <div
            className="border border-[#d0d0d0]"
            style={{ width: 50, height: 50, backgroundColor: inverted, borderRadius: '2px' }}
          />
          <span className="font-mono text-[8px] text-[#1a1a1a]">{inverted}</span>
          <span className="font-mono text-[7px] text-[#909090]">INVERTED</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div
            className="border border-[#d0d0d0]"
            style={{ width: 50, height: 50, backgroundColor: autoInverted, borderRadius: '2px' }}
          />
          <span className="font-mono text-[8px] text-[#1a1a1a]">{autoInverted}</span>
          <span className="font-mono text-[7px] text-[#909090]">AUTO</span>
        </div>
      </div>
    </div>
  );
};

export default TonalInversion;
