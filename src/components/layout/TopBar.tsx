import { Link, NavLink, useLocation } from 'react-router-dom'
import { Library, Heart, GitCompare, Gamepad2, Boxes } from 'lucide-react'
import { useLibraryStore } from '../../store/useLibraryStore'

export function TopBar() {
  const favs = useLibraryStore((s) => s.favorites.length)
  const compare = useLibraryStore((s) => s.compareList.length)
  const loc = useLocation()
  return (
    <header className="sticky top-0 z-30 border-b border-bone/15 bg-ink/85 backdrop-blur supports-[backdrop-filter]:bg-ink/65">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center bg-neon">
            <Gamepad2 className="h-5 w-5 text-ink" strokeWidth={2.4} />
            <span className="absolute -right-1 -top-1 h-2 w-2 bg-arcane animate-flicker" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="pixel-h text-sm glow-text">IP-CODEX</span>
            <span className="label-pixel opacity-70">次元典藏 · {favCountLabel(favs)}</span>
          </div>
        </Link>

        <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex">
          <NavTab to="/" current={loc.pathname} icon={<Boxes className="h-3.5 w-3.5" />} label="探索台" />
          <NavTab to="/library" current={loc.pathname} icon={<Library className="h-3.5 w-3.5" />} label="资料库" />
          <NavTab to="/favorites" current={loc.pathname} icon={<Heart className="h-3.5 w-3.5" />} label="收藏夹" badge={favs} />
          <NavTab to="/compare" current={loc.pathname} icon={<GitCompare className="h-3.5 w-3.5" />} label="对比" badge={compare} />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/library" className="btn-pixel accent hidden md:inline-flex">
            进入资料库
          </Link>
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="grid grid-cols-4 border-t border-bone/10 md:hidden">
        <MobileTab to="/" current={loc.pathname} label="探索" />
        <MobileTab to="/library" current={loc.pathname} label="资料库" />
        <MobileTab to="/favorites" current={loc.pathname} label="收藏" badge={favs} />
        <MobileTab to="/compare" current={loc.pathname} label="对比" badge={compare} />
      </nav>
    </header>
  )
}

function favCountLabel(n: number) {
  if (n === 0) return 'START'
  if (n < 10) return `0${n} 收藏`
  return `${n} 收藏`
}

function NavTab({ to, current, icon, label, badge }: { to: string; current: string; icon: React.ReactNode; label: string; badge?: number }) {
  const active = to === '/' ? current === '/' : current.startsWith(to)
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-2 px-3 py-2 font-mono text-[13px] tracking-wide transition ${
        active ? 'text-bone' : 'text-bone/55 hover:text-bone'
      }`}
    >
      <span className={`grid h-5 w-5 place-items-center ${active ? 'text-neon' : 'text-bone/55'}`}>{icon}</span>
      <span>{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-1 grid h-4 min-w-4 place-items-center bg-neon px-1 font-pixel text-[8px] text-ink">
          {badge}
        </span>
      )}
      <span className={`absolute -bottom-px left-0 right-0 h-0.5 ${active ? 'bg-neon' : 'bg-transparent'} transition`} />
    </Link>
  )
}

function MobileTab({ to, current, label, badge }: { to: string; current: string; label: string; badge?: number }) {
  const active = to === '/' ? current === '/' : current.startsWith(to)
  return (
    <Link to={to} className={`relative flex flex-col items-center py-2 text-[10px] ${active ? 'text-neon' : 'text-bone/55'}`}>
      <span className="font-pixel text-[10px]">{label}</span>
      {badge != null && badge > 0 && (
        <span className="absolute right-3 top-1.5 grid h-4 min-w-4 place-items-center bg-neon px-1 font-pixel text-[8px] text-ink">
          {badge}
        </span>
      )}
      {active && <span className="absolute bottom-0 h-0.5 w-6 bg-neon" />}
    </Link>
  )
}
