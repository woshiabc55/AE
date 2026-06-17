import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HEROES } from "@/data/heroes";
import { GAMES } from "@/data/games";

interface SearchBarProps {
  onSubmit?: () => void;
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return [
      ...HEROES.filter(
        (h) =>
          h.name.includes(q) ||
          h.nameEn.toLowerCase().includes(lower) ||
          h.title.includes(q),
      ).slice(0, 6),
      ...GAMES.filter(
        (g) => g.name.includes(q) || g.nameEn.toLowerCase().includes(lower),
      )
        .slice(0, 4)
        .map((g) => ({ ...g, isGame: true })),
    ];
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
            setOpen(false);
            onSubmit?.();
          }
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-md transition-colors focus-within:border-neon-cyan/50">
          <Search className="h-4 w-4 text-white/50" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="搜索角色 / 皮肤 / 游戏…"
            className="w-44 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none lg:w-64"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-auto rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur-xl">
          {results.map((r: any) => (
            <button
              key={r.id}
              onClick={() => {
                navigate(r.isGame ? `/game/${r.id}` : `/hero/${r.id}`);
                setOpen(false);
                setQ("");
                onSubmit?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
            >
              <div
                className="h-8 w-8 shrink-0 rounded-lg"
                style={{
                  background: r.isGame
                    ? r.cover
                    : `linear-gradient(135deg, ${r.paletteFrom}, ${r.paletteTo})`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-white">{r.name}</div>
                <div className="truncate text-xs text-white/40">
                  {r.isGame ? r.nameEn : r.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
