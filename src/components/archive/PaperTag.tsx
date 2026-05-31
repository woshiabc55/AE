import React from 'react';

export interface PaperTagProps {
  label?: string;
  rotation?: number;
  color?: string;
}

const PaperTag: React.FC<PaperTagProps> = ({
  label = 'PATTERN-A',
  rotation = -2,
  color = '#1a1a1a',
}) => {
  return (
    <div
      className="inline-block bg-white border border-ink px-3 py-1 font-mono text-xs tracking-wider"
      style={{
        transform: `rotate(${rotation}deg)`,
        color,
        borderColor: color,
        borderRadius: '1px',
      }}
    >
      {label}
    </div>
  );
};

export default PaperTag;
