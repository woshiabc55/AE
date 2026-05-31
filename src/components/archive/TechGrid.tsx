import React from 'react';

export interface TechGridProps {
  width?: number;
  height?: number;
  majorGrid?: number;
  minorDiv?: number;
  opacity?: number;
}

const TechGrid: React.FC<TechGridProps> = ({
  width = 400,
  height = 300,
  majorGrid = 40,
  minorDiv = 5,
  opacity = 1,
}) => {
  const minorStep = majorGrid / minorDiv;

  const majorLinesH = Array.from(
    { length: Math.floor(height / majorGrid) + 1 },
    (_, i) => (
      <line key={`mh${i}`} x1={0} y1={i * majorGrid} x2={width} y2={i * majorGrid} stroke="#c0c0c0" strokeWidth={0.5} />
    ),
  );

  const majorLinesV = Array.from(
    { length: Math.floor(width / majorGrid) + 1 },
    (_, i) => (
      <line key={`mv${i}`} x1={i * majorGrid} y1={0} x2={i * majorGrid} y2={height} stroke="#c0c0c0" strokeWidth={0.5} />
    ),
  );

  const minorLinesH = Array.from(
    { length: Math.floor(height / minorStep) + 1 },
    (_, i) => {
      if (i % minorDiv === 0) return null;
      return <line key={`xh${i}`} x1={0} y1={i * minorStep} x2={width} y2={i * minorStep} stroke="#e0e0e0" strokeWidth={0.2} />;
    },
  );

  const minorLinesV = Array.from(
    { length: Math.floor(width / minorStep) + 1 },
    (_, i) => {
      if (i % minorDiv === 0) return null;
      return <line key={`xv${i}`} x1={i * minorStep} y1={0} x2={i * minorStep} y2={height} stroke="#e0e0e0" strokeWidth={0.2} />;
    },
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <rect width={width} height={height} fill="#f0f0f0" />
      {minorLinesH}
      {minorLinesV}
      {majorLinesH}
      {majorLinesV}
    </svg>
  );
};

export default TechGrid;
