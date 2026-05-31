import React from 'react';

export interface PaletteCardProps {
  name?: string;
  colors?: string[];
  description?: string;
}

const PaletteCard: React.FC<PaletteCardProps> = ({
  name = '青花瓷',
  colors = ['#0a1e3d', '#1a3a6b', '#3a6aaa', '#7aaad4', '#a8c8e8', '#faf8f5'],
  description = '传统青花瓷色彩体系',
}) => {
  return (
    <div className="inline-flex flex-col bg-white border border-ink" style={{ borderRadius: '2px', width: 220 }}>
      <div className="flex" style={{ height: 40 }}>
        {colors.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="px-3 py-2">
        <div className="font-mono text-xs text-[#1a1a1a] font-bold">{name}</div>
        <div className="font-mono text-[9px] text-[#909090] mt-0.5">{description}</div>
        <div className="flex gap-1 mt-2">
          {colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="border border-[#e0e0e0]"
                style={{ width: 20, height: 20, backgroundColor: c, borderRadius: '1px' }}
              />
              <span className="font-mono text-[6px] text-[#909090] mt-0.5">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaletteCard;
