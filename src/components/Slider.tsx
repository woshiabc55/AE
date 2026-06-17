export default function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between text-[10px] tracking-[0.18em] uppercase text-white/55 font-mono">
        <span>{label}</span>
        <span className="text-white/85">{format ? format(value) : value.toFixed(2)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-px bg-white/15" />
        <div
          className="absolute h-px bg-gradient-to-r from-[#7DF9FF] via-[#9B5DE5] to-[#FF3CAC]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_12px_rgba(125,249,255,0.7)]"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
    </div>
  );
}
