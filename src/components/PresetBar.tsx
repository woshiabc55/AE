// 形态预设栏
import { Circle, Atom, Grid3x3, Sparkles, Waves } from "lucide-react"
import { PRESETS, type PresetId } from "@/lib/presets"
import { useAudioStore } from "@/store/useAudioStore"
import { cn } from "@/lib/utils"

const ICONS: Record<PresetId, React.ReactNode> = {
  galaxy: <Atom className="h-3.5 w-3.5" />,
  vortex: <Circle className="h-3.5 w-3.5" />,
  grid: <Grid3x3 className="h-3.5 w-3.5" />,
  firework: <Sparkles className="h-3.5 w-3.5" />,
  noiseField: <Waves className="h-3.5 w-3.5" />,
}

export function PresetBar() {
  const preset = useAudioStore((s) => s.preset)
  const setPreset = useAudioStore((s) => s.setPreset)

  return (
    <div className="glass rounded-2xl p-2">
      <div className="px-2 pb-2 pt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
        FORMS · 形
      </div>
      <div className="flex flex-col gap-1">
        {PRESETS.map((p) => {
          const active = preset === p.id
          return (
            <button
              key={p.id}
              className={cn(
                "btn-glow flex items-center gap-2.5 rounded-xl px-2.5 py-2 font-mono text-[11px] uppercase tracking-wider transition-all",
                active
                  ? "bg-white/12 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white/85"
              )}
              onClick={() => setPreset(p.id)}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md",
                  active ? "bg-white text-black" : "bg-white/8 text-white/70"
                )}
              >
                {ICONS[p.id]}
              </div>
              <div className="flex flex-col items-start">
                <span className="leading-none">{p.name}</span>
                <span className="mt-0.5 text-[8px] text-white/35">
                  {p.description}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
