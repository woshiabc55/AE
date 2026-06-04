import { NavLink, Link } from 'react-router-dom';
import { Hammer, BarChart3, BookOpen, Image, Palette, Type } from 'lucide-react';

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
        <nav className="flex items-center gap-1 md:gap-2 font-mono text-sm">
          <NavLink to="/" end className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors ${isActive ? 'text-volt' : 'hover:text-volt'}`}>工具</NavLink>
          <NavLink to="/exhibition" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1 ${isActive ? 'text-volt' : 'hover:text-volt'}`}>
            <Image size={12} className="hidden md:inline" /> 展览
          </NavLink>
          <NavLink to="/distribution" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1 ${isActive ? 'text-volt' : 'hover:text-volt'}`}>
            <BarChart3 size={12} className="hidden md:inline" /> 分布
          </NavLink>
          <NavLink to="/standards" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1 ${isActive ? 'text-volt' : 'hover:text-volt'}`}>
            <BookOpen size={12} className="hidden md:inline" /> 条例
          </NavLink>
          <NavLink to="/design-system" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1 ${isActive ? 'text-volt' : 'hover:text-volt'}`}>
            <Palette size={12} className="hidden md:inline" /> 设计
          </NavLink>
          <NavLink to="/font-garden" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1 ${isActive ? 'text-volt' : 'hover:text-volt'}`}>
            <Type size={12} className="hidden md:inline" /> 字体
          </NavLink>
          <NavLink to="/about" className={({isActive}) => `px-2 md:px-3 py-1.5 transition-colors ${isActive ? 'text-volt' : 'hover:text-volt'}`}>关于</NavLink>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:inline-block ml-2 px-3 py-1.5 bg-bone text-ink border-2 border-bone hover:bg-volt hover:border-volt transition-colors font-bold">
            ★ STAR
          </a>
        </nav>
      </div>
    </header>
  );
}
