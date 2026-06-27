interface Props {
  className?: string;
  width?: number;
  height?: number;
  isHit?: boolean;
  isAttacking?: boolean;
}

export default function BucketheadZombie({
  className,
  width = 60,
  height = 88,
  isHit,
  isAttacking,
}: Props) {
  const hitOverlay = isHit ? (
    <rect x="0" y="0" width="60" height="88" fill="red" opacity="0.35" />
  ) : null;
  return (
    <svg
      viewBox="0 0 60 88"
      width={width}
      height={height}
      className={className}
      aria-label="铁桶僵尸"
    >
      <title>铁桶僵尸</title>
      <g className={isAttacking ? "animate-wiggle" : "origin-bottom-left"}>
        <path d="M18 82 L22 88 L28 88 L26 76 Z" fill="#2f3a2f" />
        <path d="M34 82 L38 88 L44 88 L42 76 Z" fill="#2f3a2f" />
        <rect x="18" y="54" width="26" height="28" rx="3" fill="#3d4b3d" />
        <rect x="18" y="54" width="26" height="10" fill="#7a8a7a" />
        <path d="M18 62 L12 76 L20 76 L22 64 Z" fill="#7a8a7a" />
        <path d="M44 62 L50 74 L42 74 L40 64 Z" fill="#7a8a7a" />
        <circle cx="31" cy="40" r="14" fill="#7a8a7a" />
        <path
          d="M20 30 Q31 20 42 30 Q46 40 42 48 Q38 38 31 38 Q24 38 20 48 Q16 40 20 30"
          fill="#2a332a"
        />
        <circle cx="26" cy="40" r="2.2" fill="#0f1a0f" />
        <circle cx="36" cy="40" r="2.2" fill="#0f1a0f" />
        <path
          d="M24 48 Q31 52 38 48"
          stroke="#0f1a0f"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20 28 L42 28 L42 2 Q31 -2 20 2 Z"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="2"
        />
        <rect x="20" y="8" width="22" height="3" fill="#64748b" />
        <path d="M44 14 Q52 14 52 22 Q52 30 44 30" fill="none" stroke="#64748b" strokeWidth="3" />
        {hitOverlay}
      </g>
    </svg>
  );
}
