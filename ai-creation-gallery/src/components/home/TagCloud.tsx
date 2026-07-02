import { Link } from "react-router-dom";
import { Hash } from "lucide-react";
import { topTags } from "@/data/meta";

export default function TagCloud() {
  return (
    <section className="container py-20">
      <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-magenta/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan/15 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="section-eyebrow">
              <Hash size={13} className="text-cyan" /> Trending Tags · 热门标签
            </div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              顺着<span className="text-gradient">标签</span>潜入灵感
            </h2>
          </div>
          <Link
            to="/search"
            className="text-sm text-white/50 transition-colors hover:text-cyan-soft"
          >
            浏览全部标签 →
          </Link>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-2.5">
          {topTags.map(({ tag, count }, i) => (
            <Link
              key={tag}
              to={`/search?tag=${encodeURIComponent(tag)}`}
              className="chip animate-fadeUp text-sm"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              #{tag}
              <span className="ml-1 font-mono text-[10px] text-white/35">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
