import React from 'react';

export interface BlankSpaceProps {
  width?: number;
  height?: number;
  label?: string;
}

const BlankSpace: React.FC<BlankSpaceProps> = ({
  width = 200,
  height = 120,
  label = '留白',
}) => {
  return (
    <div
      className="relative bg-paper-warm border border-dashed border-[#d0d0d0]"
      style={{ width, height, borderRadius: '2px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] text-[#c0c0c0] tracking-widest">
          {label}
        </span>
      </div>
      <div className="absolute top-1 left-2 font-mono text-[7px] text-[#d0d0d0]">
        {width}×{height}
      </div>
      <div className="absolute bottom-1 right-2 font-mono text-[7px] text-[#d0d0d0]">
        BLANK
      </div>
    </div>
  );
};

export default BlankSpace;
