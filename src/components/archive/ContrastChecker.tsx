import React from 'react';

export interface ContrastCheckerProps {
  foreground?: string;
  background?: string;
}

const ContrastChecker: React.FC<ContrastCheckerProps> = ({
  foreground = '#1a3a6b',
  background = '#faf8f5',
}) => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const relativeLuminance = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const ratioStr = ratio.toFixed(2);

  const aaLarge = ratio >= 3;
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;

  return (
    <div className="inline-flex flex-col gap-2 bg-white border border-ink p-3" style={{ borderRadius: '2px', width: 200 }}>
      <div className="font-mono text-[9px] text-[#909090]">对比度检查 / CONTRAST</div>
      <div
        className="flex items-center justify-center py-3 font-mono text-sm"
        style={{ backgroundColor: background, color: foreground, borderRadius: '2px' }}
      >
        Aa 样例文本
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-[#909090]">FG</span>
        <span className="font-mono text-[9px] text-[#1a1a1a]">{foreground}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-[#909090]">BG</span>
        <span className="font-mono text-[9px] text-[#1a1a1a]">{background}</span>
      </div>
      <div className="border-t border-dashed border-[#e0e0e0] pt-1">
        <div className="font-mono text-lg text-[#1a1a1a] font-bold">{ratioStr}:1</div>
      </div>
      <div className="flex gap-2 font-mono text-[8px]">
        <span className={aaLarge ? 'text-green-600' : 'text-red-500'}>AA大 {aaLarge ? '✓' : '✗'}</span>
        <span className={aa ? 'text-green-600' : 'text-red-500'}>AA {aa ? '✓' : '✗'}</span>
        <span className={aaa ? 'text-green-600' : 'text-red-500'}>AAA {aaa ? '✓' : '✗'}</span>
      </div>
    </div>
  );
};

export default ContrastChecker;
