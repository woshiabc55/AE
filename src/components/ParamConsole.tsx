// 参数控制台 - 滑块组
import { useAudioStore } from "@/store/useAudioStore"
import { cn } from "@/lib/utils"

interface SliderProps {
  label: string
  unit: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
}

function Slider({ label, unit, value, min, max, step = 0.01, onChange, format }: SliderProps) {
  const display = format ? format(value) : value.toFixed(2)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-white/55">
        <span>{label}</span>
        <span className="text-white/90 digit-pulse">
          {display}
          <span className="ml-0.5 text-white/40">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        className="mp-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

export function ParamConsole() {
  const density = useAudioStore((s) => s.density)
  const speed = useAudioStore((s) => s.speed)
  const glow = useAudioStore((s) => s.glow)
  const setDensity = useAudioStore((s) => s.setDensity)
  const setSpeed = useAudioStore((s) => s.setSpeed)
  const setGlow = useAudioStore((s) => s.setGlow)

  return (
    <div className="glass rounded-2xl p-3">
      <div className="pb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
        CONSOLE · 参
      </div>
      <div className="flex flex-col gap-3">
        <Slider
          label="Density"
          unit=""
          value={density}
          min={0.1}
          max={1.0}
          format={(v) => Math.floor(5000 + v * 25000).toString()}
          onChange={setDensity}
        />
        <Slider
          label="Speed"
          unit="×"
          value={speed}
          min={0.1}
          max={3.0}
          onChange={setSpeed}
        />
        <Slider
          label="Glow"
          unit=""
          value={glow}
          min={0}
          max={2.0}
          onChange={setGlow}
        />
      </div>
    </div>
  )
}
