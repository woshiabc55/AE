import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// 顶部刊头导航 - 学术期刊式
export function Masthead() {
  const location = useLocation();

  const navItems = [
    { label: "卷宗", labelEn: "Archive", path: "/" },
    { label: "试卷", labelEn: "Papers", path: "/?focus=exams" },
    { label: "提纲", labelEn: "Outline", path: "/?focus=outline" },
  ];

  return (
    <header className="relative z-30 border-b-2 border-ink">
      {/* 顶部细线刊头信息条 */}
      <div className="border-b border-ink/30 bg-paper-cream/60">
        <div className="container flex items-center justify-between py-1.5 text-[10px] uppercase tracking-widest-xl text-ink-muted font-sans">
          <span>Vol. Ⅻ · No. 04</span>
          <span className="hidden sm:inline">高等数学教研档案 · Advanced Mathematics Archive</span>
          <span>MMXXIV — Anno Academico</span>
        </div>
      </div>

      {/* 主刊头 */}
      <div className="container py-5 md:py-7">
        <div className="flex items-end justify-between gap-6">
          <Link to="/" className="group block">
            <div className="flex items-baseline gap-3">
              <span className="math-deco text-2xl text-crimson leading-none">∫</span>
              <h1 className="font-serif font-black text-ink leading-none tracking-tight text-3xl md:text-5xl">
                高数卷宗
              </h1>
            </div>
            <p className="font-display-latin italic text-ink-muted text-sm md:text-base mt-1.5 tracking-wide">
              The Advanced Mathematics Archive
            </p>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path.split("?")[0]) &&
                    item.path !== "/";
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "group flex flex-col items-end transition-colors",
                    active ? "text-crimson" : "text-ink hover:text-crimson"
                  )}
                >
                  <span className="font-serif text-base font-semibold link-underline">
                    {item.label}
                  </span>
                  <span className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light mt-0.5">
                    {item.labelEn}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 双线分隔 */}
      <div className="border-t border-ink/40" />
    </header>
  );
}
