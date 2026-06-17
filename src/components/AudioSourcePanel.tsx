// 音频源选择面板 - 文件拖拽 + 麦克风
import { useCallback, useRef, useState } from "react"
import { Upload, Mic, Square, FileAudio } from "lucide-react"
import { audioEngine } from "@/lib/audio"
import { useAudioStore } from "@/store/useAudioStore"
import { cn } from "@/lib/utils"

export function AudioSourcePanel() {
  const source = useAudioStore((s) => s.source)
  const setSource = useAudioStore((s) => s.setSource)
  const setAudioBuffer = useAudioStore((s) => s.setAudioBuffer)
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying)
  const setHint = useAudioStore((s) => s.setHint)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return
      try {
        setHint("DECODING…")
        await audioEngine.resume()
        const buffer = await audioEngine.loadFile(file)
        setAudioBuffer(buffer, file.name)
        audioEngine.setVolume(useAudioStore.getState().volume)
        audioEngine.playBuffer(buffer, 0)
        setSource("file")
        setIsPlaying(true)
        setHint(null)
      } catch (e) {
        console.error(e)
        setHint("DECODE FAILED")
        setTimeout(() => setHint(null), 2000)
      }
    },
    [setAudioBuffer, setHint, setIsPlaying, setSource]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const startMic = useCallback(async () => {
    try {
      setHint("REQUESTING MIC…")
      await audioEngine.resume()
      await audioEngine.startMic()
      setSource("mic")
      setIsPlaying(true)
      setHint(null)
    } catch (e) {
      console.error(e)
      setHint("MIC DENIED")
      setTimeout(() => setHint(null), 2000)
    }
  }, [setHint, setIsPlaying, setSource])

  const stopAll = useCallback(() => {
    audioEngine.stopAll()
    setSource("none")
    setIsPlaying(false)
  }, [setIsPlaying, setSource])

  return (
    <div
      className={cn(
        "glass rounded-2xl p-3 flex items-center gap-2 transition-all",
        dragOver && "ring-2 ring-white/40"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={onPick}
      />
      <button
        className="btn-glow flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-white/85 hover:bg-white/10"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />
        FILE
      </button>
      <button
        className={cn(
          "btn-glow flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 font-mono text-[11px] uppercase tracking-wider hover:bg-white/10",
          source === "mic" ? "text-[#00F5A0]" : "text-white/85"
        )}
        onClick={source === "mic" ? stopAll : startMic}
      >
        {source === "mic" ? (
          <Square className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Mic className="h-3.5 w-3.5" />
        )}
        {source === "mic" ? "STOP MIC" : "MIC"}
      </button>
      {source === "file" && (
        <div className="flex items-center gap-1.5 rounded-xl bg-white/3 px-3 py-2 font-mono text-[10px] text-white/60">
          <FileAudio className="h-3 w-3" />
          <span className="max-w-[140px] truncate">
            {useAudioStore.getState().fileName || "audio"}
          </span>
        </div>
      )}
    </div>
  )
}
