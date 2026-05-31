import React from 'react';

export interface StatusBarProps {
  items?: Array<{ label: string; value: string }>;
  position?: 'top' | 'bottom';
}

const StatusBar: React.FC<StatusBarProps> = ({
  items = [
    { label: 'ZOOM', value: '100%' },
    { label: 'X', value: '240' },
    { label: 'Y', value: '180' },
    { label: 'MODE', value: 'ARCHIVE' },
  ],
  position = 'bottom',
}) => {
  return (
    <div
      className={`flex items-center gap-4 px-3 py-1 bg-[#faf8f5] border-ink font-mono text-[9px] ${
        position === 'top' ? 'border-b' : 'border-t'
      }`}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="text-[#909090] uppercase">{item.label}</span>
          <span className="text-[#1a1a1a]">{item.value}</span>
          {i < items.length - 1 && <span className="text-[#d0d0d0]">│</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusBar;
