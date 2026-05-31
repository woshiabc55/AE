import React from 'react';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  height?: number;
  color?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 65,
  max = 100,
  height = 8,
  color = '#1a3a6b',
  label = '',
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="inline-flex flex-col gap-1">
      {label && (
        <div className="flex items-center justify-between font-mono text-[9px] text-[#909090]">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="bg-[#f0f0f0] border border-[#d0d0d0] overflow-hidden"
        style={{ height, borderRadius: '1px' }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
