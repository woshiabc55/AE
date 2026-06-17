import { Link } from "react-router-dom";
import { ArrowRight, Swords, Wand2, Crown, Sparkles } from "lucide-react";
import { GAMES, CATEGORIES } from "@/data/games";
import { HEROES } from "@/data/heroes";
import type { GameId } from "@/data/types";
import { HeroGallery } from "@/components/HeroGallery";
import { GameCard } from "@/components/GameCard";
import { HeroCard } from "@/components/HeroCard";
import { useReveal } from "@/hooks/useReveal";

export default function Home() {
  const sectionRef = useReveal<HTMLDivElement>();
  const gameRef = useReveal<HTMLDivElement>();
  const catRef = useReveal<HTMLDivElement>();

  return (
    <div className="space-y-24">
      <HeroGallery />

      {/* Stats marquee */}
      <section className="relative">
        <div className="marquee-mask flex overflow-hidden border-y border-white/5 bg-ink-950/40 py-4">
          <div className="flex shrink-0 animate-marquee items-center gap-12 whitespace-nowrap px-6 font-display text-sm uppercase tracking-[0.4em] text-white/40">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-12">
                <span className="text-neon-cyan">★ 王者荣耀</span>
                <span>原神 Teyvat</span>
                <span className="text-neon-gold">★ 英雄联盟</span>
                <span>CS2 Source 2</span>
                <span className="text-neon-pink">★ 我的世界</span>
                <span>永劫无间</span>
                <span className="text-neon-jade">★ 绝区零 ZZZ</span>
                <span>绝地求生</span>
                <span className="text-neon-violet">★ 二创友好</span>
                <span>设定图索引</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular games */}
      <section ref={gameRef} className="reveal space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
              <Swords className="h-4 w-4 text-neon-cyan" />
              POPULAR GAMES · 流行游戏一览
            </div>
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">
              探索 <span className="text-gradient-neon">游戏宇宙</span>
            </h2>
            <p className="mt-2 text-sm text-white/50">
              覆盖 MOBA、开放世界、FPS、沙盒、大逃杀等多种类型，按游戏深入图鉴。
            </p>
          </div>
          <Link to={`/game/${GAMES[0].id}`} className="btn-ghost">
            进入王者荣耀
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section ref={catRef} className="reveal space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
              <Wand2 className="h-4 w-4 text-neon-violet" />
              CATEGORIES · 按类型筛选
            </div>
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">
              按 <span className="text-gradient-gold">职业与玩法</span> 速览
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-4 transition-all hover:-translate-y-1 hover:border-white/30"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at top, ${c.color}30, transparent 70%)`,
                }}
              />
              <div
                className="mb-2 h-1.5 w-12 rounded-full"
                style={{ background: c.color }}
              />
              <div className="text-base font-bold text-white">{c.name}</div>
              <div className="mt-1 text-xs text-white/40">
                {HEROES.filter((h) => h.category === c.id).length} 位角色
              </div>
            </Link>
          ))}
        </div>
      </section>

      <GameHeroSection
        gameId="kog"
        title="王者荣耀"
        subtitle="Honor of Kings"
        desc="从青莲剑仙到凤求凰——中华幻想的视觉巅峰，30+ 英雄与 60+ 皮肤设定集。"
        accent="#f59e0b"
      />
      <GameHeroSection
        gameId="genshin"
        title="原神"
        subtitle="Genshin Impact"
        desc="提瓦特七国、元素反应、命之座——开放世界角色群像。"
        accent="#10b981"
      />
      <GameHeroSection
        gameId="lol"
        title="英雄联盟"
        subtitle="League of Legends"
        desc="符文之地的经典图鉴，星之守护者、K/DA 等经典皮肤系列。"
        accent="#a855f7"
      />

      {/* CTA */}
      <section
        ref={sectionRef}
        className="reveal relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center"
      >
        <div className="starfield absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(168,85,247,0.2), transparent 70%)",
          }}
        />
        <div className="relative">
          <Crown className="mx-auto h-10 w-10 text-neon-gold" />
          <h3 className="mt-4 font-serif text-3xl font-black text-white sm:text-4xl">
            加入 <span className="text-gradient-gold">二创宇宙</span>
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
            收藏你喜欢的英雄与皮肤，作为你的二创素材库。更多游戏、更多设定图持续收录中。
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/favorites" className="btn-primary">
              <Sparkles className="h-4 w-4" />
              查看我的收藏
            </Link>
            <Link to="/game/kog" className="btn-ghost">
              开始浏览
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface GameHeroSectionProps {
  gameId: GameId;
  title: string;
  subtitle: string;
  desc: string;
  accent: string;
}

function GameHeroSection({
  gameId,
  title,
  subtitle,
  desc,
  accent,
}: GameHeroSectionProps) {
  const ref = useReveal<HTMLDivElement>();
  const heroes = HEROES.filter((h) => h.gameId === gameId).slice(0, 8);
  return (
    <section ref={ref} className="reveal space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            style={{
              color: accent,
              borderColor: `${accent}50`,
              background: `${accent}1a`,
            }}
          >
            <Sparkles className="h-3 w-3" />
            {subtitle}
          </div>
          <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/55">{desc}</p>
        </div>
        <Link
          to={`/game/${gameId}`}
          className="btn-ghost"
          style={{ borderColor: `${accent}40` }}
        >
          全部 {title} 角色
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {heroes.map((h) => (
          <HeroCard key={h.id} hero={h} />
        ))}
      </div>
    </section>
  );
}
