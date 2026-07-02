import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Flame, Calendar, Copy, Check, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { artworksById } from "@/data/artworks";
import { getRelated, kindLabels } from "@/data/meta";
import { artworkImage } from "@/lib/image";
import { formatHeat, formatDate } from "@/lib/format";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

export default function DetailDrawer() {
  const detailId = useUIStore((s) => s.detailId);
  const close = useUIStore((s) => s.closeDetail);
  const open = useUIStore((s) => s.openDetail);
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const artwork = detailId ? artworksById[detailId] : undefined;
  const openFlag = Boolean(artwork);

  useEffect(() => {
    if (!openFlag) return;
    panelRef.current?.scrollTo({ top: 0 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openFlag, detailId, close]);

  const copyPrompt = async () => {
    if (!artwork) return;
    try {
      await navigator.clipboard.writeText(artwork.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const related = artwork ? getRelated(artwork, 6) : [];

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          openFlag ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] no-scrollbar ${
          openFlag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {artwork && (
          <div className="relative">
            {/* hero image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <SmartImage
                src={artworkImage(artwork).src}
                fallbackSrc={artworkImage(artwork).fallback}
                alt={artwork.title}
                eager
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />

              <button
                type="button"
                onClick={close}
                aria-label="关闭"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-950/50 text-white/80 backdrop-blur transition-colors hover:border-magenta/60 hover:text-magenta"
              >
                <X size={18} />
              </button>

              <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
                <RarityBadge rarity={artwork.rarity} />
                <span className="rounded-full border border-white/15 bg-ink-950/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-soft backdrop-blur">
                  {kindLabels[artwork.kind]}
                </span>
                {artwork.officialImage && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-magenta/50 bg-magenta/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-magenta backdrop-blur">
                    <Sparkles size={10} />
                    官方立绘
                  </span>
                )}
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="font-display text-3xl font-black tracking-wide text-white neon-text">
                  {artwork.title}
                </h2>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* meta */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} className="text-cyan" />
                  {artwork.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flame size={14} className="text-magenta" />
                  <span className="font-mono text-white/80">{formatHeat(artwork.heat)}</span>
                  热度
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-cyan" />
                  {formatDate(artwork.createdAt)}
                </span>
              </div>

              {/* kind-specific */}
              {artwork.kind === "card" && artwork.faction && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/40">阵营</span>
                  <span className="rounded-full border border-magenta/40 bg-magenta/10 px-3 py-0.5 text-magenta-soft">
                    {artwork.faction}
                  </span>
                </div>
              )}
              {artwork.kind === "scene" && artwork.mood && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/40">氛围</span>
                  <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-0.5 text-cyan-soft">
                    {artwork.mood}
                  </span>
                </div>
              )}
              {artwork.kind === "item" && artwork.itemCategory && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/40">类型</span>
                  <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-0.5 text-cyan-soft">
                    {{
                      weapon: "武器",
                      accessory: "配饰",
                      prop: "道具",
                      vehicle: "载具",
                    }[artwork.itemCategory]}
                  </span>
                </div>
              )}

              {artwork.kind === "card" && artwork.backInscription && (
                <blockquote className="border-l-2 border-magenta/60 bg-white/[0.03] px-4 py-3 font-sans text-sm italic leading-relaxed text-white/70">
                  “{artwork.backInscription}”
                </blockquote>
              )}

              {/* tags */}
              <div>
                <div className="section-eyebrow">Tags · 标签</div>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/search?tag=${encodeURIComponent(t)}`}
                      className="chip"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* prompt */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="section-eyebrow mb-0">
                    <Sparkles size={12} /> Prompt · 创作指令
                  </div>
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/60 transition-colors hover:border-cyan/50 hover:text-cyan-soft"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "已复制" : "复制"}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-ink-950/60 p-4 font-mono text-xs leading-relaxed text-cyan-soft/85 no-scrollbar">
{artwork.prompt}
                </pre>
              </div>

              <div className="flex gap-3">
                <FavoriteButton
                  id={artwork.id}
                  className="h-12 flex-1 gap-2 rounded-full text-sm"
                  size={18}
                />
                <span className="grid h-12 flex-1 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/40">
                  已收录 #{artwork.id.toUpperCase()}
                </span>
              </div>

              {/* related */}
              {related.length > 0 && (
                <div>
                  <div className="section-eyebrow">Related · 相关推荐</div>
                  <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar">
                    {related.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => open(r.id)}
                        className="group w-36 shrink-0 text-left"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                          <SmartImage
                            src={artworkImage(r).src}
                            fallbackSrc={artworkImage(r).fallback}
                            alt={r.title}
                            className="absolute inset-0 h-full w-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent opacity-80" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="truncate text-xs font-medium text-white/90">
                              {r.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
