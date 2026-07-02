import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Expand, Flame } from "lucide-react";
import type { Artwork } from "@/types";
import { artworkImage } from "@/lib/image";
import { formatHeat } from "@/lib/format";
import { useUIStore } from "@/store/useUIStore";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

const ASPECTS = ["aspect-[4/3]", "aspect-[16/9]", "aspect-[3/2]", "aspect-[5/4]"];

export default function SceneMasonry({ items }: { items: Artwork[] }) {
  const openDetail = useUIStore((s) => s.openDetail);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const close = useCallback(() => setViewerIndex(null), []);
  const prev = useCallback(
    () => setViewerIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setViewerIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewerIndex, close, prev, next]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((a, i) => (
          <div
            key={a.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-400 hover:border-cyan/50 hover:shadow-glow-cyan"
          >
            <div className={`relative w-full ${ASPECTS[i % ASPECTS.length]}`}>
              <SmartImage
                src={artworkImage(a).src}
                fallbackSrc={artworkImage(a).fallback}
                alt={a.title}
                eager={i < 4}
                className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute left-3 top-3 flex items-center gap-2">
                <RarityBadge rarity={a.rarity} />
                {a.mood && (
                  <span className="rounded-full border border-white/15 bg-ink-950/50 px-2 py-0.5 font-mono text-[10px] text-cyan-soft backdrop-blur">
                    {a.mood}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewerIndex(i)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-ink-950/50 text-white/70 backdrop-blur transition-colors hover:text-cyan-soft"
                aria-label="沉浸查看"
              >
                <Expand size={14} />
              </button>

              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold text-white">
                    {a.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/55">{a.author}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-magenta-soft">
                    <Flame size={11} /> {formatHeat(a.heat)}
                  </span>
                  <FavoriteButton id={a.id} className="h-7 w-7" size={13} />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openDetail(a.id)}
              className="sr-only"
              aria-label={`查看 ${a.title} 详情`}
            />
          </div>
        ))}
      </div>

      {/* immersive viewer */}
      {viewerIndex !== null && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <RarityBadge rarity={items[viewerIndex].rarity} />
              <div>
                <p className="font-display text-lg font-bold text-white">
                  {items[viewerIndex].title}
                </p>
                <p className="text-xs text-white/45">{items[viewerIndex].author}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton id={items[viewerIndex].id} className="h-10 w-10" size={18} />
              <button
                type="button"
                onClick={() => openDetail(items[viewerIndex].id)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:text-cyan-soft"
              >
                详情
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="关闭"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-magenta/60 hover:text-magenta"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
            <button
              type="button"
              onClick={prev}
              aria-label="上一张"
              className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-white/80 backdrop-blur transition-colors hover:border-cyan/60 hover:text-cyan-soft"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="relative max-h-full max-w-6xl overflow-hidden rounded-2xl border border-white/10">
              <SmartImage
                src={artworkImage(items[viewerIndex]).src}
                fallbackSrc={artworkImage(items[viewerIndex]).fallback}
                alt={items[viewerIndex].title}
                eager
                className="max-h-[78vh] w-auto"
                imgClassName="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="下一张"
              className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-white/80 backdrop-blur transition-colors hover:border-cyan/60 hover:text-cyan-soft"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="px-5 pb-4 text-center font-mono text-xs text-white/30">
            {viewerIndex + 1} / {items.length} · 方向键切换 · Esc 关闭
          </div>
        </div>
      )}
    </>
  );
}
