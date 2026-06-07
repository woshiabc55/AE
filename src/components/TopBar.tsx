import { useStellaris } from '@/store/useStellaris'
import { EXHIBITS, TOTAL_ELEMENTS } from '@/lib/exhibits'
import { Volume2, VolumeX, Maximize2, Minimize2, Hash } from 'lucide-react'

export function TopBar() {
  const active = useStellaris((s) => s.active)
  const setActive = useStellaris((s) => s.setActive)
  const muted = useStellaris((s) => s.muted)
  const toggleMuted = useStellaris((s) => s.toggleMuted)
  const isFs = useStellaris((s) => s.isFullscreen)
  const toggleFs = useStellaris((s) => s.toggleFullscreen)
  const count = useStellaris((s) => s.count)
  const idx = EXHIBITS.findIndex((e) => e.id === active)
  const ex = EXHIBITS[idx]
  const progress = ((idx + 1) / EXHIBITS.length) * 100

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActive('overture')}
          className="group flex items-center gap-2"
          data-cursor="hover"
        >
          <span className="relative h-7 w-7 rounded-full border border-paper/40 group-hover:border-gilt transition-colors duration-700">
            <span className="absolute inset-1.5 rounded-full bg-gilt/80" />
          </span>
          <span className="hidden md:flex flex-col leading-tight">
            <span className="font-display text-sm tracking-wider">STELLARIS</span>
            <span className="font-mono text-[0.6rem] tracking-[0.3em] text-paper/50">
              万象天文台
            </span>
          </span>
        </button>
      </div>

      <div className="hidden md:flex flex-1 items-center gap-6 px-10">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="font-mono text-[0.62rem] tracking-[0.3em] text-paper/50">
            {ex.index}
          </span>
          <div className="relative h-px flex-1 bg-paper/10">
            <div
              className="absolute inset-y-0 left-0 bg-gilt transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[0.62rem] tracking-[0.3em] text-paper/50">
            {EXHIBITS.length}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base tracking-wide">
            {ex.title}
          </span>
          <span className="font-mono text-[0.62rem] tracking-[0.3em] text-paper/40">
            {ex.titleEn}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bord-paper-15">
          <Hash className="h-3 w-3 text-gilt" />
          <span className="font-mono text-[0.65rem] tracking-wider text-paper/80">
            {(TOTAL_ELEMENTS + count).toLocaleString('en')}
          </span>
        </div>
        <button
          onClick={toggleMuted}
          className="rounded-full bord-paper-15 p-2 hover:bord-gilt-50 transition-colors duration-500"
          aria-label={muted ? '取消静音' : '静音'}
          data-cursor="hover"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={toggleFs}
          className="rounded-full bord-paper-15 p-2 hover:bord-gilt-50 transition-colors duration-500"
          aria-label={isFs ? '退出全屏' : '全屏'}
          data-cursor="hover"
        >
          {isFs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </header>
  )
}
