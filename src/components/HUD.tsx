// HUD 容器 - 整合所有 UI 控件
import { AudioSourcePanel } from "./AudioSourcePanel"
import { PresetBar } from "./PresetBar"
import { PaletteBar } from "./PaletteBar"
import { ParamConsole } from "./ParamConsole"
import { PlayerBar } from "./PlayerBar"
import { TitleBar } from "./TitleBar"
import { HintOverlay } from "./HintOverlay"
import { useAudioStore } from "@/store/useAudioStore"

export function HUD() {
  const source = useAudioStore((s) => s.source)
  const showHint = source === "none"

  return (
    <>
      <TitleBar />
      <HintOverlay visible={showHint} />
      {/* 左下：预设 + 配色 */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-30 flex max-w-[220px] flex-col gap-3">
        <PresetBar />
        <PaletteBar />
      </div>
      {/* 右下：参数控制台 + 音源 + 播放 */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-30 flex max-w-[360px] flex-col gap-3">
        <ParamConsole />
        <AudioSourcePanel />
        <PlayerBar />
      </div>
    </>
  )
}
