interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Sunflower({ className, width = 64, height = 72 }: Props) {
  return (
    <svg
      viewBox="0 0 64 72"
      width={width}
      height={height}
      className={className}
      aria-label="向日葵"
    >
      <title>向日葵</title>
      <g className="origin-bottom animate-bob">
        <path
          d="M32 68 Q36 48 32 32"
          stroke="#3a6b1f"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M32 58 Q18 52 14 42 Q24 48 32 52" fill="#66b032" />
        <path d="M32 54 Q48 48 52 38 Q42 46 32 50" fill="#66b032" />
        <g transform="translate(32, 28)">
          <circle r="14" fill="#4a2c08" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse
              key={a}
              cx={Math.cos((a * Math.PI) / 180) * 18}
              cy={Math.sin((a * Math.PI) / 180) * 18}
              rx="6"
              ry="10"
              fill="#ffd23f"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="10" fill="#6b3e0e" />
          <circle cx="-3" cy="-2" r="2" fill="#1f1f1f" />
          <circle cx="3" cy="-2" r="2" fill="#1f1f1f" />
          <path d="M-4 3 Q0 6 4 3" stroke="#1f1f1f" strokeWidth="1.2" fill="none" />
        </g>
      </g>
    </svg>
  );
}
