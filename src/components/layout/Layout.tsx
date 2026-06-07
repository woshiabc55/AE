import { NavLink, Link } from 'react-router-dom';
import { Hexagon, Sparkles, Settings as SettingsIcon, Library, Images } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: '工作台', icon: Hexagon },
  { to: '/templates', label: '模板', icon: Library },
  { to: '/gallery', label: '画廊', icon: Images },
  { to: '/settings', label: '设置', icon: SettingsIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-ink-900/70">
        <div className="mx-auto max-w-[1480px] px-6 h-16 flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 grid place-items-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-violet to-ember opacity-90 group-hover:opacity-100 transition" />
              <Sparkles className="relative w-4.5 h-4.5 text-ink-900" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-wide">AniForge</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-fog-dim">studio · v0.1</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm transition',
                    'text-fog hover:text-cream hover:bg-white/5',
                    isActive && 'text-cream bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]',
                  )
                }
              >
                <it.icon className="w-4 h-4" />
                <span>{it.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 text-[11px] text-fog-dim font-mono">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseGlow" />
            <span>本地引擎就绪</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">{children}</main>

      <footer className="border-t border-white/5 py-4 text-center text-[11px] text-fog-dim font-mono tracking-wider">
        Crafted with React · Vite · WebGL-ready · {new Date().getFullYear()} AniForge Labs
      </footer>
    </div>
  );
}
