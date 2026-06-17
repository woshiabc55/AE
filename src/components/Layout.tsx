import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Heart, Search, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GAMES } from "@/data/games";
import { SearchBar } from "./SearchBar";
import { useAppStore } from "@/store/useAppStore";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const favCount = useAppStore((s) => s.favorites.length);

  const navItems = [
    { to: "/", label: "首页" },
    ...GAMES.slice(0, 4).map((g) => ({ to: `/game/${g.id}`, label: g.name })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-pink shadow-lg shadow-neon-violet/30">
              <Gamepad2 className="h-5 w-5 text-white" strokeWidth={2.4} />
            </div>
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-neon-gold animate-pulse" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-base font-black text-white">
              游戏宇宙图鉴
            </div>
            <div className="font-display text-[10px] uppercase tracking-[0.18em] text-white/40">
              Game Universe Codex
            </div>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <Link
            to="/favorites"
            className="btn-ghost relative !px-3"
            aria-label="收藏夹"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden lg:inline">收藏</span>
            {favCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-pink px-1 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden btn-ghost !px-3"
            onClick={() => setOpen((o) => !o)}
            aria-label="菜单"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/5 bg-ink-950/95 backdrop-blur md:hidden">
          <div className="space-y-2 px-4 py-4">
            <SearchBar onSubmit={() => setOpen(false)} />
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      active
                        ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                        : "border-white/10 text-white/70",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-950/40 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet">
              <Gamepad2 className="h-4 w-4 text-white" />
            </div>
            <div className="font-serif text-lg font-black text-white">
              游戏宇宙图鉴
            </div>
          </div>
          <p className="mt-3 text-sm text-white/50">
            收录流行游戏的角色、皮肤与设定图，
            <br />
            为二次创作提供灵感与素材索引。
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white/80">游戏</div>
          <ul className="mt-3 space-y-1.5 text-sm text-white/50">
            {GAMES.slice(0, 6).map((g) => (
              <li key={g.id}>
                <Link
                  to={`/game/${g.id}`}
                  className="hover:text-neon-cyan"
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white/80">声明</div>
          <p className="mt-3 text-sm text-white/50">
            本项目为粉丝向图鉴，素材为社区整理。
            <br />
            角色与皮肤版权归原权利人所有。
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Game Universe Codex · For fan creation only
      </div>
    </footer>
  );
}
