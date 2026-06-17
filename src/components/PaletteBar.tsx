// 配色色板栏
import { PALETTES, PALETTE_ORDER } from "@/lib/palettes"
import { useAudioStore } from "@/store/useAudioStore"
import { cn } from "@/lib/utils"

export function PaletteBar() {
  const palette = useAudioStore((s) => s.palette)
  const setPalette = useAudioStore((s) => s.setPalette)

  return (
    <div className="glass rounded-2xl p-3">
      <div className="pb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
        PALETTE · 色
      </div>
      <div className="flex gap-2">
        {PALETTE_ORDER.map((id) => {
          const p = PALETTES[id]
          const active = palette === id
          return (
            <button
              key={id}
              className={cn(
                "btn-glow group relative flex h-9 w-9 items-center justify-center rounded-full transition-all",
                active && "ring-2 ring-white/60"
              )}
              onClick={() => setPalette(id)}
              title={p.zh}
            >
              <div
                className="absolute inset-0.5 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${p.colors[0].getStyle()}, ${p.colors[1].getStyle()}, ${p.colors[2].getStyle()}, ${p.colors[3].getStyle()}, ${p.colors[0].getStyle()})`,
                  filter: active ? "saturate(1.2)" : "saturate(0.7)",
                  opacity: active ? 1 : 0.55,
                  transition: "all 0.3s",
                }}
              />
              <div
                className={cn(
                  "absolute inset-0 rounded-full transition-all",
                  active ? "shadow-[0_0_18px_rgba(255,255,255,0.35)]" : "shadow-none"
                )}
              />
            </button>
          )
        })}
      </div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-white/55">
        {PALETTES[palette].zh}
      </div>
    </div>
  )
}
