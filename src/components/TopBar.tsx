import { useStore } from '../store/useStore'
import { Seal } from '../lib/svg'

interface Props {
  onJump: (id: number) => void
}

export const TopBar: React.FC<Props> = ({ onJump }) => {
  const { isKeeper, toggleKeeper } = useStore()
  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <div className="px-8 py-4 flex items-center justify-between bg-gradient-to-b from-ink-950/95 via-ink-950/70 to-transparent backdrop-blur-sm">
        <button onClick={() => onJump(1)} className="flex items-center gap-3 group">
          <Seal char="卷" size={40} rotate={-4} />
          <div className="flex flex-col leading-tight">
            <span className="font-brush text-xl text-silk-100 group-hover:text-gold-500 transition">HRNMLJ</span>
            <span className="text-[10px] tracking-[0.4em] text-silk-300/60 font-seal">墨卷为屏 · 江湖为幕</span>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {['卷一', '卷二', '卷三', '卷四', '目录', '雅物', '典籍', '设计', '卷末'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (i < 4) onJump(i + 1)
                else {
                  const map = ['catalog', 'catalog', 'cabinet', 'library', 'design', 'seal']
                  document.getElementById(map[i - 4])?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-3 py-1.5 text-silk-300/80 hover:text-gold-500 transition font-brush tracking-widest"
            >
              {label}
            </button>
          ))}
        </nav>
        <button onClick={toggleKeeper} className={`btn-seal text-sm ${isKeeper ? 'ring-2 ring-gold-500' : ''}`}>
          {isKeeper ? '已入卷' : '入 卷'}
        </button>
      </div>
      <div className="divider-tassel opacity-40" />
    </header>
  )
}
