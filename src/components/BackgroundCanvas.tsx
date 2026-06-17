// 背景渐变 - 根据调色板变化
import { useAudioStore } from "@/store/useAudioStore"
import { PALETTES } from "@/lib/palettes"

export function BackgroundCanvas() {
  const palette = useAudioStore((s) => s.palette)
  const bass = useAudioStore((s) => s.bassLevel)
  const beat = useAudioStore((s) => s.beatPulse)
  const p = PALETTES[palette]
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-all duration-1000"
      style={{ background: p.background }}
    >
      {/* 微噪点覆盖 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />
      {/* 节拍光晕 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 600 + bass * 400 + beat * 200,
          height: 600 + bass * 400 + beat * 200,
          background: `radial-gradient(circle, ${p.colors[0].getStyle()}33 0%, transparent 70%)`,
          filter: "blur(60px)",
          transition: "all 0.12s ease-out",
        }}
      />
    </div>
  )
}
