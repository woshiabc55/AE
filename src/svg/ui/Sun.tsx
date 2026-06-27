interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Sun({ className, width = 36, height = 36 }: Props) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={width}
      height={height}
      className={className}
      aria-label="阳光"
    >
      <title>阳光</title>
      <circle cx="18" cy="18" r="10" fill="#ffd23f" />
      <circle cx="18" cy="18" r="7" fill="#ffe066" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={18 + Math.cos((a * Math.PI) / 180) * 12}
          y1={18 + Math.sin((a * Math.PI) / 180) * 12}
          x2={18 + Math.cos((a * Math.PI) / 180) * 16}
          y2={18 + Math.sin((a * Math.PI) / 180) * 16}
          stroke="#ffb700"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
