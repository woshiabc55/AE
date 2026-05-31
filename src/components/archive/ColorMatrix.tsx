import React from 'react';

export interface ColorMatrixProps {
  rows?: number;
  cols?: number;
  colorGenerator?: (row: number, col: number) => string;
}

const ColorMatrix: React.FC<ColorMatrixProps> = ({
  rows = 5,
  cols = 5,
  colorGenerator,
}) => {
  const defaultGenerator = (r: number, c: number) => {
    const hue = 210 + (c / cols) * 30 - 15;
    const lightness = 15 + (r / rows) * 70;
    return `hsl(${hue}, 60%, ${lightness}%)`;
  };

  const gen = colorGenerator || defaultGenerator;
  const cellSize = 28;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="font-mono text-[9px] text-[#909090]">色彩矩阵 / {rows}×{cols}</div>
      <div
        className="grid border border-[#d0d0d0]"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          return (
            <div
              key={i}
              style={{
                backgroundColor: gen(r, c),
                borderRight: c < cols - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                borderBottom: r < rows - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorMatrix;
