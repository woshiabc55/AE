interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function WallNut({ className, width = 56, height = 64 }: Props) {
  return (
    <svg
      viewBox="0 0 56 64"
      width={width}
      height={height}
      className={className}
      aria-label="坚果墙"
    >
      <title>坚果墙</title>
      <g className="origin-bottom animate-bob">
        <ellipse cx="28" cy="38" rx="22" ry="24" fill="#a0662e" />
        <ellipse cx="28" cy="36" rx="16" ry="18" fill="#d49a5a" />
        <path
          d="M20 24 Q28 20 36 24"
          stroke="#5e3a15"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="22" cy="34" r="2.5" fill="#3e2710" />
        <circle cx="34" cy="34" r="2.5" fill="#3e2710" />
        <path d="M24 42 Q28 45 32 42" stroke="#3e2710" strokeWidth="2" fill="none" />
        <path
          d="M14 36 Q10 44 14 52"
          stroke="#5e3a15"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M42 36 Q46 44 42 52"
          stroke="#5e3a15"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
