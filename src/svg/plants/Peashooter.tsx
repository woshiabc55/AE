interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Peashooter({ className, width = 64, height = 72 }: Props) {
  return (
    <svg
      viewBox="0 0 64 72"
      width={width}
      height={height}
      className={className}
      aria-label="豌豆射手"
    >
      <title>豌豆射手</title>
      <g className="origin-bottom animate-bob">
        <path
          d="M32 68 Q28 52 32 42"
          stroke="#3a6b1f"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M32 58 Q14 54 10 46 Q22 50 32 54" fill="#66b032" />
        <path d="M32 56 Q50 52 54 44 Q42 50 32 54" fill="#66b032" />
        <g transform="translate(34, 30)">
          <ellipse cx="-8" cy="2" rx="18" ry="16" fill="#4a9c2d" />
          <path
            d="M-6 -6 Q12 -10 24 -2 Q28 4 24 10 Q12 18 -6 14 Q2 6 -6 -6"
            fill="#5ba848"
          />
          <ellipse cx="22" cy="2" rx="7" ry="9" fill="#3a6b1f" />
          <circle cx="-4" cy="-2" r="2.5" fill="#1f1f1f" />
          <circle cx="6" cy="-2" r="2.5" fill="#1f1f1f" />
          <path d="M-2 6 Q4 9 10 6" stroke="#1f1f1f" strokeWidth="1.5" fill="none" />
        </g>
      </g>
    </svg>
  );
}
