import { motion } from 'framer-motion';

interface ProgressRingProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
}

export default function ProgressRing({ percentage, size, strokeWidth, color }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-brand-border/40"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.22}
        fontFamily="Outfit, sans-serif"
        fontWeight={600}
      >
        {Math.round(clampedPercentage)}%
      </text>
    </svg>
  );
}
