import React from 'react';

export interface InfoPanelProps {
  title?: string;
  fields?: Array<{ label: string; value: string }>;
  width?: number;
  accentColor?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  title = 'ARCHIVE-0047',
  fields = [
    { label: 'DATE', value: '2026-05-31' },
    { label: 'CLASS', value: '青花瓷' },
    { label: 'ORIGIN', value: '景德镇' },
    { label: 'MATERIAL', value: '高岭土' },
    { label: 'CONDITION', value: '完好' },
  ],
  width = 200,
  accentColor = '#1a3a6b',
}) => {
  return (
    <div
      className="bg-white border border-ink font-mono text-[10px]"
      style={{ width, borderRadius: '2px' }}
    >
      <div
        className="px-3 py-1.5 text-white text-xs tracking-wider"
        style={{ backgroundColor: accentColor, borderRadius: '2px 2px 0 0' }}
      >
        {title}
      </div>
      <div className="px-3 py-2 space-y-2">
        {fields.map((field, i) => (
          <div key={i}>
            <div className="text-[9px] text-[#909090] uppercase tracking-wider">{field.label}</div>
            <div className="text-[#1a1a1a] text-xs mt-0.5">{field.value}</div>
            {i < fields.length - 1 && (
              <div className="border-b border-dashed border-[#e0e0e0] mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPanel;
