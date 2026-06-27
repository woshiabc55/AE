interface Props {
  className?: string;
  width?: number;
  height?: number;
  isHit?: boolean;
  isAttacking?: boolean;
}

export default function BasicZombie({
  className,
  width = 60,
  height = 76,
  isHit,
  isAttacking,
}: Props) {
  const hitOverlay = isHit ? (
    <rect x="0" y="0" width="60" height="76" fill="red" opacity="0.35" />
  ) : null;
  return (
    <svg
      viewBox="0 0 60 76"
      width={width}
      height={height}
      className={className}
      aria-label="普通僵尸"
    >
      <title>普通僵尸</title>
      <g className={isAttacking ? "animate-wiggle" : "origin-bottom-left"}>
        <path d="M18 70 L22 76 L28 76 L26 64 Z" fill="#2f3a2f" />
        <path d="M34 70 L38 76 L44 76 L42 64 Z" fill="#2f3a2f" />
        <rect x="18" y="42" width="26" height="28" rx="3" fill="#3d4b3d" />
        <rect x="18" y="42" width="26" height="10" fill="#7a8a7a" />
        <path d="M18 50 L12 64 L20 64 L22 52 Z" fill="#7a8a7a" />
        <path d="M44 50 L50 62 L42 62 L40 52 Z" fill="#7a8a7a" />
        <circle cx="31" cy="28" r="14" fill="#7a8a7a" />
        <path
          d="M20 18 Q31 8 42 18 Q46 28 42 36 Q38 26 31 26 Q24 26 20 36 Q16 28 20 18"
          fill="#2a332a"
        />
        <circle cx="26" cy="28" r="2.2" fill="#0f1a0f" />
        <circle cx="36" cy="28" r="2.2" fill="#0f1a0f" />
        <path
          d="M24 36 Q31 40 38 36"
          stroke="#0f1a0f"
          strokeWidth="1.5"
          fill="none"
        />
        {hitOverlay}
      </g>
    </svg>
  );
}
