import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { HEROES } from "@/data/heroes";
import { CATEGORIES, GAMES } from "@/data/games";
import { HeroCard } from "@/components/HeroCard";

export default function Category() {
  const { cat } = useParams<{ cat: string }>();
  const category = CATEGORIES.find((c) => c.id === cat);
  const heroes = HEROES.filter((h) => h.category === cat);

  if (!category) {
    return (
      <div className="py-20 text-center">
        <div className="text-2xl text-white/60">未找到该分类</div>
        <Link to="/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at top, ${category.color}40, transparent 70%)`,
          }}
        />
        <div className="starfield absolute inset-0" />
        <div className="relative">
          <div
            className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            style={{
              color: category.color,
              borderColor: `${category.color}60`,
              background: `${category.color}1a`,
            }}
          >
            按职业筛选
          </div>
          <h1 className="font-serif text-5xl font-black text-white sm:text-6xl">
            {category.name}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            来自 {GAMES.length} 款游戏的 {heroes.length} 位 {category.name} 角色
          </p>
        </div>
      </div>

      {heroes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-12 text-center text-white/40">
          该分类下暂无角色
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {heroes.map((h) => (
            <HeroCard key={h.id} hero={h} />
          ))}
        </div>
      )}
    </div>
  );
}
