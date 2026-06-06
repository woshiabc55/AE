import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Database, BarChart3, Home, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const setQuery = useAppStore((s) => s.setQuery);
  const query = useAppStore((s) => s.query);
  const [local, setLocal] = useState(query);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(local);
    navigate('/browse');
  };

  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-9 h-9 grid place-items-center bg-gradient-to-br from-neon-pink via-neon-violet to-neon-cyan rounded-sm">
            <span className="font-display font-black text-ink-900 text-lg">N</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-yellow rounded-full animate-blink" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-base tracking-widest text-gradient-neon">
              NEON.FRAME
            </div>
            <div className="font-mono text-[10px] text-neon-cyan/70 -mt-0.5">
              // GAME-IP-DERIVATIVES-ARCHIVE
            </div>
          </div>
        </Link>

        {/* 搜索 */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan" />
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="搜索 IP / 衍生作品 / 标签..."
              className="w-full bg-ink-700/60 border border-neon-cyan/20 focus:border-neon-cyan/60 focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2 text-sm rounded-sm font-mono placeholder:text-white/30 transition"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 text-[10px] text-white/40 font-mono border border-white/10 px-1.5 py-0.5 rounded">
              ⏎ ENTER
            </kbd>
          </div>
        </form>

        {/* 导航 */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/" icon={<Home className="w-4 h-4" />} label="首页" />
          <NavItem to="/browse" icon={<Database className="w-4 h-4" />} label="浏览" />
          <NavItem to="/dashboard" icon={<BarChart3 className="w-4 h-4" />} label="看板" />
          <NavItem to="/about" icon={<Info className="w-4 h-4" />} label="关于" />
        </nav>

        {/* 主题切换 */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-sm border border-white/10 hover:border-neon-cyan/60 hover:text-neon-cyan transition"
          title="切换主题"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium transition ${
          isActive
            ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/40'
            : 'text-white/70 hover:text-neon-cyan hover:bg-white/5 border border-transparent'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
