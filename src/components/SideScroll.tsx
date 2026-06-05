import { chapters } from '../data/chapters'
import { Seal } from '../lib/svg'

interface Props {
  active: number
  progress: number
  onJump: (id: number) => void
}

export const SideScroll: React.FC<Props> = ({ active, progress, onJump }) => {
  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 select-none">
      <div className="lens-tag">SCROLL</div>
      <div className="scroll-rail w-8 h-[60vh] relative flex flex-col items-center justify-between py-4">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold-700/30 via-gold-500/40 to-gold-700/30" />
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[3px] bg-cinnabar rounded-full transition-all" style={{ height: `calc(${progress * 100}% - 16px)` }} />
        <div className="relative z-10 flex flex-col gap-6 items-center">
          {chapters.map((c) => (
            <button key={c.id} onClick={() => onJump(c.id)} className="group flex flex-col items-center gap-1" title={c.title}>
              <span className={`w-3 h-3 rounded-full transition-all ${active === c.id ? 'bg-cinnabar scale-125 shadow-[0_0_12px_rgba(162,43,31,0.7)]' : 'bg-gold-700/50 group-hover:bg-gold-500'}`} />
              <span className={`font-seal text-[10px] tracking-widest transition ${active === c.id ? 'text-cinnabar' : 'text-silk-300/50 group-hover:text-silk-100'}`}>{c.seal}</span>
            </button>
          ))}
        </div>
      </div>
      <Seal char="轴" size={28} rotate={4} />
    </aside>
  )
}
