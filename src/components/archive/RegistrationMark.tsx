import React from 'react';

export interface RegistrationMarkProps {
  size?: number;
  circles?: number;
}

const RegistrationMark: React.FC<RegistrationMarkProps> = ({
  size = 30,
  circles = 3,
}) => {
  const color = '#1a1a1a';
  const cx = size / 2;
  const cy = size / 2;

  const circleElements = Array.from({ length: circles }, (_, i) => {
    const r = (size / 2) * ((i + 1) / (circles + 1));
    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={0.4}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1={0} y1={cy} x2={size} y2={cy} stroke={color} strokeWidth={0.3} />
      <line x1={cx} y1={0} x2={cx} y2={size} stroke={color} strokeWidth={0.3} />
      {circleElements}
      <circle cx={cx} cy={cy} r={0.8} fill={color} />
    </svg>
  );
};

export default RegistrationMark;
