import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { HEROES } from "@/data/heroes";
import { HeroCard } from "@/components/HeroCard";

export default function Favorites() {
  const favorites = useAppStore((s) => s.favorites);
  const heroes = HEROES.filter((h) => favorites.includes(h.id));

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-pink/40 bg-neon-pink/10 px-3 py-1 text-xs text-neon-pink">
          <Heart className="h-3.5 w-3.5" />
          MY CODEX · 我的收藏
        </div>
        <h1 className="font-serif text-5xl font-black text-white sm:text-6xl">
          <span className="text-gradient-gold">珍藏</span>的角色
        </h1>
        <p className="mt-2 text-sm text-white/60">
          你共收藏了 {heroes.length} 位角色。这些角色将作为你的二创灵感库持久保存在本机。
        </p>
      </div>

      {heroes.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-ink-900/50 p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-white/20" />
          <div className="mt-4 text-lg text-white/60">收藏夹还是空的</div>
          <p className="mt-2 text-sm text-white/40">
            在角色卡片上点击 ♥ 按钮，把你喜欢的英雄加入收藏。
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            开始浏览
          </Link>
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
