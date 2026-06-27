interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Pea({ className, width = 16, height = 16 }: Props) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={width}
      height={height}
      className={className}
      aria-label="豌豆子弹"
    >
      <title>豌豆子弹</title>
      <circle cx="8" cy="8" r="6" fill="#4a9c2d" />
      <circle cx="6" cy="6" r="2" fill="#a8e063" opacity="0.7" />
    </svg>
  );
}
