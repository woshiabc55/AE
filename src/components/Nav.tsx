import { NavLink, Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';

export default function Nav() {
  return (
    <header className="border-b-2 border-bone/30 sticky top-0 z-50 bg-ink/90 backdrop-blur">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-10 h-10 bg-volt text-ink flex items-center justify-center border-2 border-bone group-hover:rotate-12 transition-transform">
            <Hammer size={20} strokeWidth={2.5} />
          </span>
          <div className="leading-none">
            <div className="font-display text-2xl font-black tracking-tight">SKILL FORGE</div>
            <div className="font-mono text-[10px] text-bone/60">大量 HTML 技能工具 / V.01</div>
          </div>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-volt' : 'hover:text-volt'}>工具 / TOOLS</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-volt' : 'hover:text-volt'}>关于 / ABOUT</NavLink>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:inline-block px-3 py-1.5 bg-bone text-ink border-2 border-bone hover:bg-volt hover:border-volt transition-colors font-bold">
            ★ STAR
          </a>
        </nav>
      </div>
    </header>
  );
}
