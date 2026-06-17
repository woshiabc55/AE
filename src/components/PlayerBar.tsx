// 播放控制 + 时钟
import { useEffect, useState } from "react"
import { Play, Pause, Volume2, Maximize, Minimize } from "lucide-react"
import { useAudioStore } from "@/store/useAudioStore"
import { audioEngine } from "@/lib/audio"
import { useFullscreen } from "@/hooks/useFullscreen"
import { cn } from "@/lib/utils"

function formatTime(t: number) {
  if (!isFinite(t) || t < 0) return "00:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function PlayerBar() {
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying)
  const source = useAudioStore((s) => s.source)
  const volume = useAudioStore((s) => s.volume)
  const setVolume = useAudioStore((s) => s.setVolume)
  const currentTime = useAudioStore((s) => s.currentTime)
  const setCurrentTime = useAudioStore((s) => s.setCurrentTime)
  const duration = useAudioStore((s) => s.duration)
  const beat = useAudioStore((s) => s.beatPulse)
  const { isFullscreen, toggle } = useFullscreen()
  const [clock, setClock] = useState("")

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setClock(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`
      )
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (source !== "file") return
    let raf = 0
    const tick = () => {
      const store = useAudioStore.getState()
      if (store.isPlaying && store.source === "file") {
        const next = store.currentTime + 0.016
        if (store.duration > 0 && next >= store.duration) {
          // 循环
          audioEngine.playBuffer(store.audioBuffer!, 0)
          setCurrentTime(0)
        } else {
          setCurrentTime(next)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [source, setCurrentTime])

  const togglePlay = () => {
    if (source === "mic") return // 麦克风无法暂停
    const store = useAudioStore.getState()
    if (source === "file" && store.audioBuffer) {
      if (isPlaying) {
        audioEngine.stopBuffer()
        setIsPlaying(false)
      } else {
        audioEngine.playBuffer(store.audioBuffer, store.currentTime % store.duration)
        setIsPlaying(true)
      }
    }
  }

  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={source === "none" || source === "mic"}
          className={cn(
            "btn-glow flex h-9 w-9 items-center justify-center rounded-full transition-all",
            source === "none" || source === "mic"
              ? "cursor-not-allowed bg-white/5 text-white/25"
              : "bg-white text-black hover:bg-white/90"
          )}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between font-mono text-[10px] text-white/55">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/30">{formatTime(duration)}</span>
          </div>
          <div className="relative h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="absolute inset-y-0 left-0 bg-white/85 transition-all"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-2">
          <Volume2 className="h-3.5 w-3.5 text-white/55" />
          <input
            type="range"
            className="mp-slider w-16"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              setVolume(v)
              audioEngine.setVolume(v)
            }}
          />
        </div>

        <button
          onClick={toggle}
          className="btn-glow flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 hover:bg-white/10"
          title="FULLSCREEN (F)"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: beat > 0.1 ? "#fff" : "rgba(255,255,255,0.25)",
              boxShadow: beat > 0.1 ? "0 0 10px #fff" : "none",
            }}
          />
          <span>BEAT SYNC</span>
          <span className="text-white/55">{(beat * 100).toFixed(0)}%</span>
        </div>
        <span className="text-white/50">{clock}</span>
      </div>
    </div>
  )
}
