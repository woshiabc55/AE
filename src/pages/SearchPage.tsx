import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { HEROES } from "@/data/heroes";
import { GAMES } from "@/data/games";
import { HeroCard } from "@/components/HeroCard";
import { GameCard } from "@/components/GameCard";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const heroes = HEROES.filter(
    (h) =>
      h.name.includes(q) ||
      h.nameEn.toLowerCase().includes(q.toLowerCase()) ||
      h.title.includes(q) ||
      h.motif.includes(q),
  );
  const games = GAMES.filter(
    (g) => g.name.includes(q) || g.nameEn.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan">
          <Search className="h-3.5 w-3.5" />
          搜索结果
        </div>
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">
          "<span className="text-gradient-neon">{q}</span>" 的相关结果
        </h1>
        <p className="mt-2 text-sm text-white/60">
          找到 {heroes.length} 位角色、{games.length} 款游戏
        </p>
      </div>

      {games.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">游戏</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}

      {heroes.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">角色</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {heroes.map((h) => (
              <HeroCard key={h.id} hero={h} />
            ))}
          </div>
        </section>
      )}

      {heroes.length === 0 && games.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-ink-900/50 p-16 text-center">
          <Search className="mx-auto h-12 w-12 text-white/20" />
          <div className="mt-4 text-lg text-white/60">没有找到匹配的内容</div>
          <p className="mt-2 text-sm text-white/40">试试 "李白"、"原神"、"刺客" 等关键词</p>
        </div>
      )}
    </div>
  );
}
