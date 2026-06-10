import { useEffect, useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import { Sparkles, Brush, Layers, GitBranch, LayoutGrid, PlayCircle, Download, Eye, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { to: "/draw", label: "绘制", sub: "Draw", icon: Brush, color: "text-sakura-400" },
  { to: "/layers", label: "分层", sub: "Split", icon: Layers, color: "text-butter-400" },
  { to: "/mesh", label: "网格", sub: "Mesh", icon: GitBranch, color: "text-leaf" },
  { to: "/atlas", label: "展开", sub: "Atlas", icon: LayoutGrid, color: "text-butter-300" },
  { to: "/animate", label: "动画", sub: "Animate", icon: PlayCircle, color: "text-sky" },
  { to: "/export", label: "导出", sub: "Export", icon: Download, color: "text-flame" },
];

export default function TopBar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300",
        scrolled ? "backdrop-blur-md bg-ink-900/60 border-b border-mist-100/5" : "bg-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-sakura-400 shadow-pop flex items-center justify-center text-ink-900 group-hover:-translate-y-0.5 transition-transform">
            <Sparkles className="w-5 h-5" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-display text-mist-50 text-lg tracking-tight">Mochi Live</span>
            <span className="text-[10px] font-mono text-mist-300 tracking-[0.25em] uppercase">studio · v0.1</span>
          </div>
        </Link>

        {!isHome && (
          <nav className="ml-6 hidden md:flex items-center gap-1 panel-solid p-1">
            {STEPS.map((s, i) => {
              const active = pathname.startsWith(s.to);
              return (
                <NavLink
                  key={s.to}
                  to={s.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-display font-bold transition-all",
                    active
                      ? "bg-sakura-400 text-ink-900 shadow-pop"
                      : "text-mist-200 hover:text-sakura-300"
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
                  <s.icon className="w-4 h-4" strokeWidth={2.2} />
                  {s.label}
                </NavLink>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Link to="/preview" className="btn-ghost hidden md:inline-flex">
            <Eye className="w-4 h-4" /> 预览
          </Link>
          <Link to="/draw" className="btn-primary">
            <Wand2 className="w-4 h-4" /> 开始创作
          </Link>
        </div>
      </div>
    </header>
  );
}
