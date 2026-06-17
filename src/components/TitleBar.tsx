// 顶部标题栏 - 显示应用标识 + 当前音源
import { useAudioStore } from "@/store/useAudioStore"
import { PALETTES } from "@/lib/palettes"

export function TitleBar() {
  const source = useAudioStore((s) => s.source)
  const fileName = useAudioStore((s) => s.fileName)
  const paletteId = useAudioStore((s) => s.palette)
  const bass = useAudioStore((s) => s.bassLevel)
  const mid = useAudioStore((s) => s.midLevel)
  const treble = useAudioStore((s) => s.trebleLevel)
  const beat = useAudioStore((s) => s.beatPulse)

  const palette = PALETTES[paletteId]
  const sourceLabel =
    source === "file" && fileName ? fileName : source === "mic" ? "MIC IN" : "NO INPUT"

  return (
    <div className="pointer-events-none fixed left-6 top-6 z-30 select-none no-select title-in">
      <div className="flex items-start gap-3">
        <div className="font-display text-2xl leading-none tracking-tight">
          MUSIC<span className="text-white/30">·</span>PARTICLES
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: source === "none" ? "#555" : palette.colors[0].getStyle(),
              boxShadow:
                source !== "none" ? `0 0 8px ${palette.colors[0].getStyle()}` : "none",
            }}
          />
          <span>{sourceLabel}</span>
        </div>
        <div className="h-3 w-px bg-white/15" />
        <span>PAL · {palette.zh}</span>
        <div className="h-3 w-px bg-white/15" />
        <span>SYNC · {source === "none" ? "IDLE" : "LIVE"}</span>
      </div>

      {/* 实时仪表 */}
      <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/35">
        <span>BASS</span>
        <div className="h-1 w-20 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, bass * 100)}%`,
              background: palette.colors[0].getStyle(),
              transition: "width 0.06s linear",
            }}
          />
        </div>
        <span className="ml-2">MID</span>
        <div className="h-1 w-20 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, mid * 100)}%`,
              background: palette.colors[1].getStyle(),
              transition: "width 0.06s linear",
            }}
          />
        </div>
        <span className="ml-2">HI</span>
        <div className="h-1 w-20 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, treble * 100)}%`,
              background: palette.colors[2].getStyle(),
              transition: "width 0.06s linear",
            }}
          />
        </div>
        <div className="ml-3 flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: beat > 0.1 ? "#fff" : "rgba(255,255,255,0.2)",
              boxShadow: beat > 0.1 ? "0 0 12px #fff" : "none",
              transition: "all 0.08s",
            }}
          />
          <span>BEAT</span>
        </div>
      </div>
    </div>
  )
}
