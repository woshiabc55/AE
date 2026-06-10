import { character } from '@/data/character'

/**
 * 二创标识 — 右下角静态水印。
 * 等宽字体,小号大写,无干扰位置。
 */
export function DerivativeMark() {
  return (
    <div className="pointer-events-none fixed bottom-3 right-4 z-50 flex items-center gap-2 select-none">
      <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-oxide shadow-[0_0_8px_rgba(176,58,46,0.6)]" />
      <span className="font-mono text-[9px] tracking-widish uppercase text-bone-100/70">
        {character.derivativeMark}
      </span>
    </div>
  )
}
