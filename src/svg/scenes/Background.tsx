interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Background({ className, width = 720, height = 400 }: Props) {
  return (
    <svg
      viewBox="0 0 720 400"
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="后院场景"
    >
      <title>后院场景</title>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5caee3" />
          <stop offset="100%" stopColor="#a9ddf7" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3e7d2e" />
          <stop offset="100%" stopColor="#5ba848" />
        </linearGradient>
      </defs>
      <rect width="720" height="400" fill="url(#sky)" />
      <circle cx="620" cy="70" r="35" fill="#fff0a6" opacity="0.9" />
      <ellipse cx="140" cy="80" rx="50" ry="22" fill="#fff" opacity="0.7" />
      <ellipse cx="180" cy="70" rx="35" ry="18" fill="#fff" opacity="0.7" />
      <ellipse cx="460" cy="110" rx="55" ry="24" fill="#fff" opacity="0.6" />
      <ellipse cx="510" cy="100" rx="38" ry="18" fill="#fff" opacity="0.6" />
      <rect x="0" y="260" width="720" height="140" fill="url(#grass)" />
      <path d="M0 260 Q80 250 160 260 T320 260 T480 260 T640 260 T720 260" fill="#4a9638" />
      <path d="M0 260 L60 160 L120 260 Z" fill="#2e5f22" opacity="0.9" />
      <rect x="55" y="180" width="14" height="20" fill="#87ceeb" opacity="0.7" />
      <rect x="85" y="190" width="14" height="20" fill="#87ceeb" opacity="0.7" />
      <path d="M110 260 L160 200 L210 260 Z" fill="#2e5f22" opacity="0.85" />
      <rect x="140" y="215" width="12" height="18" fill="#87ceeb" opacity="0.7" />
      <rect x="170" y="220" width="12" height="18" fill="#87ceeb" opacity="0.7" />
    </svg>
  );
}
