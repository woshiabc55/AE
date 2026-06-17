// 帧驱动器 - 协调 audioEngine.tick 与渲染循环
import { useFrame } from "@react-three/fiber"
import { useEffect } from "react"
import { audioEngine } from "@/lib/audio"

export function FrameDriver() {
  useFrame(() => {
    audioEngine.tick()
  })
  return null
}

// 全局键盘快捷键
export function GlobalShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault()
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
        } else {
          document.exitFullscreen().catch(() => {})
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  return null
}
