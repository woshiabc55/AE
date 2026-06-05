// ====================================================================
// Nav — 重组为分组下拉式
// 5 组 × 9 子项 = 45 个细粒度入口
// ====================================================================
import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Hammer, Wrench, Image, BookOpen, Compass, Sparkles, ChevronDown,
  Layers, Boxes, ShieldCheck, ScrollText, Grid3x3, Crosshair, Palette, Type,
  Frame, LayoutGrid, BookText, Camera, Database, FileCode, BarChart3, Hexagon,
  Command, Component,
} from 'lucide-react';
import { TagLegend } from './Tag';
import { ThemeSwitcherInline, useThemeModal, ThemeSwitcherModal } from './ThemeSwitcher';
import { THEMES, useTheme } from './Theme';

interface NavItem {
  to: string;
  label: string;
  en: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  id: string;
  label: string;
  en: string;
  color: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'tools', label: '工具', en: 'TOOLS', color: 'volt',
    icon: <Wrench size={12} />,
    items: [
      { to: '/',                  label: '浏览全部',  en: 'BROWSE',   icon: <Hammer size={11} /> },
      { to: '/distribution',      label: '分布',      en: 'DIST',     icon: <BarChart3 size={11} /> },
      { to: '/packs',             label: '技能包',    en: 'PACKS',    icon: <Boxes size={11} />, badge: '8×L5' },
      { to: '/qa',                label: '问题',      en: 'QA',       icon: <ShieldCheck size={11} /> },
    ],
  },
  {
    id: 'design', label: '设计', en: 'DESIGN', color: 'pink',
    icon: <Palette size={12} />,
    items: [
      { to: '/design-system',     label: '设计系统',  en: 'SYSTEM',   icon: <Layers size={11} /> },
      { to: '/borders',           label: '边界',      en: 'BORDERS',  icon: <Frame size={11} />, badge: '30+' },
      { to: '/modular',           label: '模块化',    en: 'MODULAR',  icon: <LayoutGrid size={11} />, badge: '9×9' },
      { to: '/font-garden',       label: '字体园',    en: 'FONTS',    icon: <Type size={11} /> },
      { to: '/schemes',           label: '配色方案',  en: 'PALETTE',  icon: <Palette size={11} /> },
      { to: '/themes',            label: '主题',      en: 'THEMES',   icon: <Sparkles size={11} />, badge: '6' },
    ],
  },
  {
    id: 'exhibit', label: '展览', en: 'EXHIBIT', color: 'cyan',
    icon: <Image size={12} />,
    items: [
      { to: '/exhibition',        label: '主展览',    en: 'EXHIBIT',  icon: <Image size={11} /> },
      { to: '/halftone',          label: '半色调展',  en: 'HALFTONE', icon: <Frame size={11} />, badge: 'NEW' },
      { to: '/plum',              label: '梅花',      en: 'PLUM',     icon: <Grid3x3 size={11} /> },
      { to: '/arknights',         label: '方舟',      en: 'ARKNIGHT', icon: <Crosshair size={11} /> },
      { to: '/game-schemes',      label: '游戏 IP',   en: 'GAME IP',  icon: <Command size={11} /> },
    ],
  },
  {
    id: 'codex', label: '守则', en: 'CODEX', color: 'volt',
    icon: <BookOpen size={12} />,
    items: [
      { to: '/standards',         label: '工坊守则',  en: 'CODEX',    icon: <BookText size={11} />, badge: '9×9' },
      { to: '/manifesto',         label: '法典',      en: 'MANIFESTO',icon: <ScrollText size={11} />, badge: '24节' },
    ],
  },
  {
    id: 'about', label: '关于', en: 'ABOUT', color: 'volt',
    icon: <Compass size={12} />,
    items: [
      { to: '/about',             label: '关于工坊',  en: 'ABOUT',    icon: <Compass size={11} /> },
    ],
  },
];

const COLOR_ACTIVE: Record<string, string> = {
  volt: 'text-volt',
  pink: 'text-pink',
  cyan: 'text-cyan',
  plum: 'text-plum',
};

export default function Nav() {
  const { theme } = useTheme();
  const { open, openModal, closeModal } = useThemeModal();
  const m = THEMES[theme];
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // 路由变化时关闭下拉
  useEffect(() => { setOpenGroup(null); }, [location.pathname]);

  // 点击外部关闭
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenGroup(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="border-b-2 border-bone/30 sticky top-0 z-50 bg-ink/90 backdrop-blur">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className="w-10 h-10 bg-volt text-ink flex items-center justify-center border-2 border-bone group-hover:rotate-12 transition-transform">
            <Hammer size={20} strokeWidth={2.5} />
          </span>
          <div className="leading-none">
            <div className="font-display text-2xl font-black tracking-tight">SKILL FORGE</div>
            <div className="font-mono text-[10px] text-bone/60">工坊 V.10 · THEME: {m.name} · 9×9 守则</div>
          </div>
        </Link>

        <nav ref={navRef} className="flex items-center gap-1 font-mono text-sm relative">
          {NAV_GROUPS.map(g => {
            const isOpen = openGroup === g.id;
            return (
              <div
                key={g.id}
                className="relative"
                onMouseEnter={() => setOpenGroup(g.id)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  onClick={() => setOpenGroup(isOpen ? null : g.id)}
                  className={`px-2 md:px-3 py-1.5 transition-colors flex items-center gap-1.5 ${isOpen ? COLOR_ACTIVE[g.color] : 'hover:' + COLOR_ACTIVE[g.color]}`}
                >
                  <span className="hidden md:inline">{g.icon}</span>
                  <span>{g.label}</span>
                  <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                    <div className="bg-ink border-2 border-bone min-w-[220px] shadow-2xl">
                      <div className="px-3 py-2 border-b-2 border-bone/30 flex items-center justify-between">
                        <div>
                          <div className={`font-display font-black text-sm ${COLOR_ACTIVE[g.color]}`}>{g.en}</div>
                          <div className="font-mono text-[9px] text-bone/50">{g.label} · {g.items.length} 项</div>
                        </div>
                        <span className={`w-2 h-2 rounded-full bg-${g.color}`} />
                      </div>
                      <div className="py-1">
                        {g.items.map(item => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `flex items-center justify-between px-3 py-1.5 text-xs hover:bg-bone/5 transition-colors ${isActive ? `${COLOR_ACTIVE[g.color]} bg-bone/5` : 'text-bone/80'}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="opacity-60">{item.icon}</span>
                              <span>{item.label}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="font-mono text-[9px] text-bone/40">{item.en}</span>
                              {item.badge && (
                                <span className={`font-mono text-[8px] font-bold px-1 py-0.5 bg-${g.color} text-ink`}>
                                  {item.badge}
                                </span>
                              )}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden lg:inline-block ml-2 px-3 py-1.5 bg-bone text-ink border-2 border-bone hover:bg-volt hover:border-volt transition-colors font-bold">
            ★ STAR
          </a>
          <ThemeSwitcherInline />
          <button
            onClick={openModal}
            className="px-2 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-[10px] font-bold flex items-center gap-1"
            title="THEMES"
          >
            <Palette size={11} /><span className="hidden md:inline">THEMES</span>
          </button>
        </nav>
      </div>
      <ThemeSwitcherModal open={open} onClose={closeModal} />
      {/* 9 类目色板条 — 模块化9 的标准色规 */}
      <div className="border-t border-bone/20 bg-ink overflow-x-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-1.5 flex items-center gap-2 min-w-min">
          <span className="font-mono text-[9px] text-bone/40 shrink-0">TAGS</span>
          <TagLegend size="xs" />
          <span className="font-mono text-[9px] text-bone/40 ml-auto shrink-0 hidden md:inline">▸ 5 组 / 17 路由 / 9 标签 / 6 主题</span>
        </div>
      </div>
    </header>
  );
}
