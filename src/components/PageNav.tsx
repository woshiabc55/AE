import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ROUTES = [
  { path: '/', label: '工具' },
  { path: '/exhibition', label: '展览' },
  { path: '/distribution', label: '分布' },
  { path: '/standards', label: '条例' },
  { path: '/design-system', label: '设计系统' },
  { path: '/font-garden', label: '字体花园' },
  { path: '/schemes', label: '方案' },
  { path: '/game-schemes', label: 'IP' },
  { path: '/packs', label: '包' },
  { path: '/qa', label: 'QA' },
  { path: '/manifesto', label: '法典' },
  { path: '/arknights', label: '方舟' },
  { path: '/plum', label: '梅' },
  { path: '/about', label: '关于' },
];

export default function PageNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const idx = ROUTES.findIndex(r => r.path === location.pathname);
  const prev = idx > 0 ? ROUTES[idx - 1] : null;
  const next = idx >= 0 && idx < ROUTES.length - 1 ? ROUTES[idx + 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 不在输入框中才响应
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && prev) {
        navigate(prev.path);
      } else if (e.key === 'ArrowRight' && next) {
        navigate(next.path);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate]);

  if (idx < 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-stretch border-2 border-bone bg-ink/95 backdrop-blur shadow-2xl">
      <button
        disabled={!prev}
        onClick={() => prev && navigate(prev.path)}
        className="px-3 py-2 flex items-center gap-2 font-mono text-xs border-r-2 border-bone/30 hover:bg-volt hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone transition-colors"
        title="← 左方向键"
      >
        <ChevronLeft size={14} />
        <span className="hidden lg:inline">{prev?.label || '—'}</span>
      </button>
      <div className="px-3 py-2 font-mono text-[10px] text-bone/60 flex items-center gap-2">
        <span className="text-bone/40">PAGE</span>
        <span className="text-volt font-bold">{String(idx + 1).padStart(2, '0')}</span>
        <span className="text-bone/40">/ {String(ROUTES.length).padStart(2, '0')}</span>
        <span className="hidden lg:inline ml-2 text-bone/30">·</span>
        <span className="hidden lg:inline ml-1 text-bone">{ROUTES[idx].label}</span>
      </div>
      <button
        disabled={!next}
        onClick={() => next && navigate(next.path)}
        className="px-3 py-2 flex items-center gap-2 font-mono text-xs border-l-2 border-bone/30 hover:bg-volt hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone transition-colors"
        title="→ 右方向键"
      >
        <span className="hidden lg:inline">{next?.label || '—'}</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
