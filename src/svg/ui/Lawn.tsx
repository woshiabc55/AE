interface Props {
  className?: string;
  width?: number;
  height?: number;
  variant?: "light" | "dark";
}

export default function Lawn({ className, width = 80, height = 80, variant = "light" }: Props) {
  const base = variant === "light" ? "#5ba848" : "#4a9638";
  const stripe = variant === "light" ? "#66b032" : "#54a02a";
  return (
    <svg
      viewBox="0 0 80 80"
      width={width}
      height={height}
      className={className}
      aria-label="草地格子"
    >
      <title>草地格子</title>
      <rect width="80" height="80" fill={base} />
      <path d="M0 60 Q20 55 40 60 T80 60" stroke={stripe} strokeWidth="3" fill="none" />
      <path d="M0 20 Q30 25 60 20 T80 22" stroke={stripe} strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M10 70 Q25 65 40 70" stroke={stripe} strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}
