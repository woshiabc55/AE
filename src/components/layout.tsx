// 应用外壳 - 顶栏 + 内容 + Toast
import { type ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Film, Library, Sparkles, Menu, X, LogIn, LogOut, User as UserIcon, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store/useApp';
import { ToastContainer } from './ui';
import { cn } from '../lib/utils';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      <div className="relative w-9 h-9 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
        <div className="absolute inset-0 rounded-[7px] bg-gradient-to-br from-[var(--amber-1)] to-[var(--amber-3)] opacity-90 shadow-[0_0_18px_rgba(232,177,74,0.35)]" />
        <div className="absolute inset-[1px] rounded-[6px] bg-[var(--ink-1)] flex items-center justify-center">
          <Film size={17} className="text-[var(--amber-2)] transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="display text-[18px] font-semibold tracking-tight text-[var(--paper-0)] transition-colors group-hover:text-[var(--amber-1)]">剧幕</span>
        <span className="mono text-[9px] tracking-[0.25em] text-[var(--paper-3)] uppercase">PromptStage</span>
      </div>
    </Link>
  );
}

function NavItem({ to, children, icon }: { to: string; children: ReactNode; icon: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] text-[13px] font-medium transition-all',
          isActive
            ? 'text-[var(--amber-1)] bg-[rgba(232,177,74,0.08)]'
            : 'text-[var(--paper-2)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-3)]'
        )
      }
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {children}
    </NavLink>
  );
}

function UserMenu() {
  const { user, logout, loginDemo } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={loginDemo}
          className="hidden md:inline-flex h-8 px-3 text-[12px] font-medium text-[var(--paper-2)] hover:text-[var(--paper-0)] rounded-[6px] hover:bg-[var(--ink-3)] transition-colors"
        >
          体验演示
        </button>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] text-[13px] font-medium bg-[var(--amber-2)] text-[var(--ink-0)] hover:bg-[var(--amber-1)] transition-colors"
        >
          <LogIn size={14} />
          登录 / 注册
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 pl-1 pr-3 rounded-[6px] bg-[var(--ink-3)] border border-[var(--ink-4)] hover:border-[var(--ink-5)] transition-colors"
      >
        <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-[var(--amber-1)] to-[var(--amber-3)] flex items-center justify-center text-[var(--ink-0)] text-[12px] font-bold">
          {user.name.slice(0, 1)}
        </div>
        <span className="text-[12px] font-medium text-[var(--paper-1)] max-w-[80px] truncate">{user.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 top-full mt-2 w-56 bg-[var(--ink-2)] border border-[var(--ink-4)] rounded-[8px] shadow-[var(--shadow-3)] z-40 overflow-hidden"
            >
              <div className="px-3 py-2.5 border-b border-[var(--ink-4)]">
                <div className="text-[13px] text-[var(--paper-0)] font-medium truncate">{user.name}</div>
                <div className="text-[11px] text-[var(--paper-3)] truncate">{user.email}</div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setOpen(false); nav('/library'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-[var(--paper-1)] hover:bg-[var(--ink-3)] rounded-[4px]"
                >
                  <Library size={13} /> 我的剧库
                </button>
                <button
                  onClick={() => { setOpen(false); nav('/editor'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-[var(--paper-1)] hover:bg-[var(--ink-3)] rounded-[4px]"
                >
                  <PenLine size={13} /> 新建模板
                </button>
                <div className="my-1 hairline" />
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-[var(--vermilion)] hover:bg-[var(--ink-3)] rounded-[4px]"
                >
                  <LogOut size={13} /> 退出登录
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶栏 */}
      <header className={cn(
        'sticky top-0 z-30 backdrop-blur-md bg-[rgba(11,11,15,0.78)] border-b border-[var(--ink-4)] transition-shadow duration-300',
        scrolled && 'header-glow'
      )}>
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex items-center gap-1">
              <NavItem to="/gallery" icon={<Sparkles size={14} />}>模板展厅</NavItem>
              <NavItem to="/editor" icon={<PenLine size={14} />}>剧本编辑器</NavItem>
              <NavItem to="/library" icon={<Library size={14} />}>我的剧库</NavItem>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-[11px] text-[var(--paper-3)] mono">
              <span className="dot-jade" />
              云端已同步
            </div>
            <UserMenu />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-[6px] text-[var(--paper-2)] hover:bg-[var(--ink-3)]"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="md:hidden overflow-hidden border-t border-[var(--ink-4)] glass"
            >
              <div className="px-5 py-3 flex flex-col gap-1">
                <NavLink to="/gallery" className="py-2 text-[14px] text-[var(--paper-1)]">模板展厅</NavLink>
                <NavLink to="/editor" className="py-2 text-[14px] text-[var(--paper-1)]">剧本编辑器</NavLink>
                <NavLink to="/library" className="py-2 text-[14px] text-[var(--paper-1)]">我的剧库</NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 内容 */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-[var(--ink-4)] bg-[var(--ink-1)] mt-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--amber-4)] to-transparent opacity-50" />
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline text-[11px] text-[var(--paper-3)] ml-1">· 一次搭建，永久调用的剧目资产</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-[var(--paper-2)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="dot-amber" />
              <span className="text-[var(--paper-1)]">剧幕 PromptStage</span>
            </span>
            <span className="text-[var(--paper-3)]">·</span>
            <span className="mono text-[11px] text-[var(--paper-3)]">v1.0.0 · 公开测试中</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
