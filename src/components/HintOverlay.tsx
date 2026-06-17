// 中心引导提示 - 拖入音乐 + 快捷键
import { useEffect, useState } from "react"
import { useAudioStore } from "@/store/useAudioStore"
import { ArrowDown, Mic } from "lucide-react"

interface HintOverlayProps {
  visible: boolean
}

export function HintOverlay({ visible }: HintOverlayProps) {
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setShouldShow(false), 600)
      return () => clearTimeout(t)
    }
    setShouldShow(true)
  }, [visible])

  if (!shouldShow) return null

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 select-none transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="font-display text-5xl leading-none tracking-tight title-in">
          DROP<span className="mx-1 text-white/30">·</span>LISTEN
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/35 title-in title-in-delay-1">
          3D · GENERATIVE · AUDIO · VISUALIZER
        </div>
        <div className="mt-3 flex flex-col items-center gap-2 font-mono text-[11px] text-white/55 title-in title-in-delay-2">
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5">
            <ArrowDown className="h-3 w-3 animate-bounce" />
            <span>拖入音乐文件 · 或点击右下 FILE</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Mic className="h-3 w-3" />
            <span>也可启用 MIC 实时响应环境声音</span>
          </div>
        </div>
      </div>
    </div>
  )
}
