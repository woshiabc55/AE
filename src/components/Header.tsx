import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Sun, Moon } from 'lucide-react';
import { useExplorer } from '@/store/explorer';
import { useFavorites } from '@/store/favorites';
import { useTheme } from '@/store/theme';

export function Header() {
  const favCount = useFavorites((s) => s.ids.length);
  const loc = useLocation();
  const onFav = loc.pathname === '/favorites';
  const mode = useTheme((s) => s.mode);
  const toggleTheme = useTheme((s) => s.toggle);
  const { keyword, setKeyword } = useExplorer();

  // ⌘K / Ctrl+K 聚焦搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('header-search') as HTMLInputElement | null;
        el?.focus();
        el?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/30 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="font-serif text-2xl font-black italic tracking-tightest text-ink-50">
            ICON
          </span>
          <span className="font-display text-2xl font-bold text-ink-50">
            galaxy
          </span>
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-vermillion transition-transform group-hover:scale-150" />
        </Link>

        <div className="relative ml-2 flex-1 max-w-xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
            strokeWidth={1.5}
          />
          <input
            id="header-search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search across 750+ icons…"
            className="w-full border border-ink-200/30 bg-ink-400/40 py-2 pl-9 pr-20 font-mono text-sm text-ink-50 placeholder:text-ink-300 focus:border-vermillion focus:outline-none"
          />
          {keyword ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-vermillion cursor-blink sm:hidden">
              _
            </span>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 border border-ink-200/40 px-1.5 py-0.5 font-mono text-[10px] text-ink-300 sm:flex">
              <span className="text-ink-300/70">⌘</span>K
            </kbd>
          )}
        </div>

        <nav className="flex items-center gap-1 text-sm font-mono">
          <Link
            to="/"
            className={`px-3 py-1.5 transition-colors ${!onFav ? 'text-ink-50' : 'text-ink-300 hover:text-ink-50'}`}
          >
            <span className="link-underline">explore</span>
          </Link>
          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${onFav ? 'text-ink-50' : 'text-ink-300 hover:text-ink-50'}`}
          >
            <Bookmark size={14} strokeWidth={1.5} />
            <span>favs</span>
            {favCount > 0 && (
              <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center bg-vermillion px-1 text-[10px] font-bold text-ink">
                {favCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
            className="ml-1 flex h-8 w-8 items-center justify-center border border-ink-200/30 text-ink-300 transition-colors hover:border-vermillion hover:text-ink-50"
          >
            {mode === 'dark' ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
