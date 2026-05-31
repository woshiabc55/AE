import React from 'react';

export interface ArrowEndpointProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number;
  color?: string;
}

const ArrowEndpoint: React.FC<ArrowEndpointProps> = ({
  direction = 'right',
  size = 16,
  color = '#1a1a1a',
}) => {
  const half = size / 2;
  const arrowW = size * 0.4;
  const arrowH = size * 0.3;

  const getPoints = () => {
    switch (direction) {
      case 'right':
        return `${half - arrowW},${half - arrowH} ${half},${half} ${half - arrowW},${half + arrowH}`;
      case 'left':
        return `${half + arrowW},${half - arrowH} ${half},${half} ${half + arrowW},${half + arrowH}`;
      case 'up':
        return `${half - arrowH},${half + arrowW} ${half},${half} ${half + arrowH},${half + arrowW}`;
      case 'down':
        return `${half - arrowH},${half - arrowW} ${half},${half} ${half + arrowH},${half - arrowW}`;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={getPoints()} fill={color} />
    </svg>
  );
};

export default ArrowEndpoint;
