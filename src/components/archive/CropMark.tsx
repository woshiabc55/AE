import React from 'react';

export interface CropMarkProps {
  size?: number;
  position?: 'tl' | 'tr' | 'bl' | 'br';
}

const CropMark: React.FC<CropMarkProps> = ({
  size = 20,
  position = 'tl',
}) => {
  const color = '#1a1a1a';
  const strokeWidth = 0.75;

  const getLines = () => {
    switch (position) {
      case 'tl':
        return [
          <line key="h" x1={0} y1={size} x2={size * 0.4} y2={size} stroke={color} strokeWidth={strokeWidth} />,
          <line key="v" x1={size} y1={0} x2={size} y2={size * 0.4} stroke={color} strokeWidth={strokeWidth} />,
        ];
      case 'tr':
        return [
          <line key="h" x1={size * 0.6} y1={size} x2={size} y2={size} stroke={color} strokeWidth={strokeWidth} />,
          <line key="v" x1={0} y1={0} x2={0} y2={size * 0.4} stroke={color} strokeWidth={strokeWidth} />,
        ];
      case 'bl':
        return [
          <line key="h" x1={0} y1={0} x2={size * 0.4} y2={0} stroke={color} strokeWidth={strokeWidth} />,
          <line key="v" x1={size} y1={size * 0.6} x2={size} y2={size} stroke={color} strokeWidth={strokeWidth} />,
        ];
      case 'br':
        return [
          <line key="h" x1={size * 0.6} y1={0} x2={size} y2={0} stroke={color} strokeWidth={strokeWidth} />,
          <line key="v" x1={0} y1={size * 0.6} x2={0} y2={size} stroke={color} strokeWidth={strokeWidth} />,
        ];
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getLines()}
    </svg>
  );
};

export default CropMark;
