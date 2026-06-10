import { NavLink, Link } from 'react-router-dom';
import { Film, Compass, PenLine, Library, Settings as Cog, Github } from 'lucide-react';

const navItems = [
  { to: '/', label: '幕境', icon: Film, end: true },
  { to: '/templates', label: '模板广场', icon: Compass },
  { to: '/scripts', label: '我的剧本', icon: Library },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold-500/20 bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 bg-gold-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 65% 35%, 65% 100%, 35% 100%, 35% 35%, 0 35%)' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-ink-900" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-wider text-cream-100">幕境</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold-500/70">PromptStage</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'text-gold-500'
                      : 'text-cream-200/70 hover:text-cream-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} strokeWidth={1.5} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                    {isActive && <span className="ml-1 h-1 w-1 rounded-full bg-gold-500" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/editor"
            className="btn-outline hidden sm:inline-flex"
          >
            <PenLine size={14} strokeWidth={1.5} />
            新建剧本
          </Link>
          <Link to="/settings" className="btn-ghost">
            <Cog size={16} strokeWidth={1.5} />
          </Link>
          <div className="ml-1 flex h-8 w-8 items-center justify-center border border-gold-500/30 bg-ink-700 font-display text-sm font-semibold text-gold-500">
            幕
          </div>
        </div>
      </div>
      <div className="gold-line" />
    </header>
  );
}
