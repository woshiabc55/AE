import { Link } from "react-router-dom";
import { Layers, Mountain, Swords, ArrowUpRight } from "lucide-react";
import { artworks } from "@/data/artworks";
import { artworkImage } from "@/lib/image";
import SmartImage from "@/components/common/SmartImage";

const CATS = [
  {
    to: "/cards",
    icon: Layers,
    name: "角色卡牌",
    en: "Character Cards",
    desc: "稀有度分级、阵营归属、可翻转背刻的角色卡牌图鉴",
    accent: "magenta",
  },
  {
    to: "/scenes",
    icon: Mountain,
    name: "场景壁纸",
    en: "Scene Wallpapers",
    desc: "氛围各异的沉浸式场景，瀑布流错落排布一键沉浸",
    accent: "cyan",
  },
  {
    to: "/items",
    icon: Swords,
    name: "物品设计",
    en: "Item Designs",
    desc: "武器、配饰、道具、载具的精致 AI 概念设计",
    accent: "legendary",
  },
] as const;

const ACCENT_MAP = {
  magenta: {
    border: "hover:border-magenta/60",
    glow: "hover:shadow-glow-magenta",
    text: "text-magenta-soft",
    orb: "bg-magenta/20",
    from: "from-magenta/20",
  },
  cyan: {
    border: "hover:border-cyan/60",
    glow: "hover:shadow-glow-cyan",
    text: "text-cyan-soft",
    orb: "bg-cyan/20",
    from: "from-cyan/20",
  },
  legendary: {
    border: "hover:border-rarity-legendary/60",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(255,181,71,0.5)]",
    text: "text-rarity-legendary",
    orb: "bg-rarity-legendary/20",
    from: "from-rarity-legendary/20",
  },
} as const;

export default function CategoryCards() {
  return (
    <section className="container py-20">
      <div className="mb-10 text-center">
        <div className="section-eyebrow justify-center">Collections · 三大馆藏</div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          按<span className="text-gradient">维度</span>聚合，按灵感探索
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {CATS.map((c) => {
          const count = artworks.filter((a) => a.kind === c.to.slice(1)).length;
          const preview = artworks
            .filter((a) => a.kind === c.to.slice(1))
            .slice(0, 4);
          const acc = ACCENT_MAP[c.accent];
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 ${acc.border} ${acc.glow}`}
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 ${acc.orb} opacity-60 group-hover:opacity-100`} />

              <div className="relative flex items-start justify-between">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 ${acc.text}`}>
                  <Icon size={22} />
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                />
              </div>

              <div className="relative mt-5">
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${acc.text}`}>
                  {c.en}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{c.desc}</p>
              </div>

              <div className="relative mt-5 flex items-center gap-2">
                {preview.map((a) => (
                  <div
                    key={a.id}
                    className="h-12 w-12 overflow-hidden rounded-lg border border-white/10"
                  >
                    <SmartImage
                      src={artworkImage(a).src}
                      fallbackSrc={artworkImage(a).fallback}
                      alt={a.title}
                      className="h-full w-full"
                    />
                  </div>
                ))}
                <span className="ml-auto font-mono text-xs text-white/40">
                  {count} 件
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
