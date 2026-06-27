interface Props {
  className?: string;
  width?: number;
  height?: number;
  isHit?: boolean;
  isAttacking?: boolean;
}

export default function ConeheadZombie({
  className,
  width = 60,
  height = 84,
  isHit,
  isAttacking,
}: Props) {
  const hitOverlay = isHit ? (
    <rect x="0" y="0" width="60" height="84" fill="red" opacity="0.35" />
  ) : null;
  return (
    <svg
      viewBox="0 0 60 84"
      width={width}
      height={height}
      className={className}
      aria-label="路障僵尸"
    >
      <title>路障僵尸</title>
      <g className={isAttacking ? "animate-wiggle" : "origin-bottom-left"}>
        <path d="M18 78 L22 84 L28 84 L26 72 Z" fill="#2f3a2f" />
        <path d="M34 78 L38 84 L44 84 L42 72 Z" fill="#2f3a2f" />
        <rect x="18" y="50" width="26" height="28" rx="3" fill="#3d4b3d" />
        <rect x="18" y="50" width="26" height="10" fill="#7a8a7a" />
        <path d="M18 58 L12 72 L20 72 L22 60 Z" fill="#7a8a7a" />
        <path d="M44 58 L50 70 L42 70 L40 60 Z" fill="#7a8a7a" />
        <circle cx="31" cy="36" r="14" fill="#7a8a7a" />
        <path
          d="M20 26 Q31 16 42 26 Q46 36 42 44 Q38 34 31 34 Q24 34 20 44 Q16 36 20 26"
          fill="#2a332a"
        />
        <circle cx="26" cy="36" r="2.2" fill="#0f1a0f" />
        <circle cx="36" cy="36" r="2.2" fill="#0f1a0f" />
        <path
          d="M24 44 Q31 48 38 44"
          stroke="#0f1a0f"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M22 24 L40 24 L34 2 L28 2 Z" fill="#ff8a2b" />
        <rect x="22" y="22" width="18" height="4" fill="#e06b10" />
        <path d="M26 8 L36 8 L34 20 L28 20 Z" fill="#ffab5c" opacity="0.5" />
        {hitOverlay}
      </g>
    </svg>
  );
}
