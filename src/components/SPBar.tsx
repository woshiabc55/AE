interface SPBarProps {
  cost: number;
  active: boolean;
  color: string;
  /** 0~1 之间的填充比例 */
  fill?: number;
}

/**
 * SPBar —— 充能进度条
 * active=true 时从头充满到 fill*cost 的位置
 */
export function SPBar({ cost, active, color, fill = 1 }: SPBarProps) {
  const widthPct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <div className="relative h-[6px] w-full overflow-hidden rounded-[1px] bg-ark-2/80">
      {/* 网格底纹 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div
        className={active ? "h-full" : "h-full transition-[width] duration-700 ease-out"}
        style={{
          width: active ? undefined : `${widthPct}%`,
          background: `linear-gradient(90deg, ${color}, #f2f5fa)`,
          boxShadow: active ? `0 0 12px ${color}` : "none",
          animation: active ? `ark-fill 1.2s cubic-bezier(.2,.7,.2,1) forwards` : undefined,
          ["--sp-fill" as never]: `${widthPct}%`,
        }}
      />
      {/* SP 数字 */}
      <div className="absolute inset-0 flex items-center justify-end pr-1">
        <span className="font-mono text-[9px] leading-none text-ark-white/90 mix-blend-difference">
          {cost}
        </span>
      </div>
    </div>
  );
}
