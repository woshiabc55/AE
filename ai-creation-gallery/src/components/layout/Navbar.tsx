import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, Hexagon, Menu, X } from "lucide-react";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "首页", end: true },
  { to: "/cards", label: "卡牌馆" },
  { to: "/scenes", label: "场景馆" },
  { to: "/items", label: "物品馆" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const favCount = useFavoriteStore((s) => s.ids.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 glass-strong">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center">
            <Hexagon
              className="absolute inset-0 h-9 w-9 text-magenta transition-transform duration-500 group-hover:rotate-180"
              strokeWidth={1.4}
            />
            <span className="font-display text-sm font-black text-cyan">CC</span>
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm font-bold tracking-widest text-white">
              CYBER CURATORIUM
            </span>
            <span className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-white/40">
              AI 二创聚合馆
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-white/55 hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-magenta to-transparent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden items-center lg:flex">
          <div className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 transition-colors focus-within:border-cyan/50">
            <Search size={16} className="text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索作品 / 作者 / 标签"
              className="w-44 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        </form>

        <Link
          to="/search?fav=1"
          className="relative ml-auto grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-white/70 transition-colors hover:border-magenta/50 hover:text-magenta lg:ml-2"
          aria-label="我的收藏"
        >
          <Heart size={18} />
          {favCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 font-mono text-[10px] font-bold text-ink-950">
              {favCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-white/70 md:hidden"
          aria-label="菜单"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/8 bg-ink-900/95 px-4 py-4 md:hidden">
          <form onSubmit={submit} className="mb-3 flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-2.5">
            <Search size={16} className="text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索作品 / 作者 / 标签"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive ? "bg-magenta/15 text-magenta" : "text-white/70 hover:bg-white/5",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
