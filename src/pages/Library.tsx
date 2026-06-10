import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowRight, Clapperboard, Pen } from "lucide-react";
import { useAppStore } from "@/store";
import { TemplateCard } from "@/components/TemplateCard";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { cn } from "@/utils/format";

const GENRES: Array<{ key: string; label: string }> = [
  { key: "all", label: "All Genres" },
  { key: "movie", label: "电影" },
  { key: "short", label: "短剧" },
  { key: "video", label: "短视频" },
  { key: "interactive", label: "互动" },
];

const BEATS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All Beats" },
  { key: "three-act", label: "三幕" },
  { key: "hero-journey", label: "英雄之旅" },
  { key: "save-the-cat", label: "救猫咪" },
  { key: "short-form", label: "短篇" },
  { key: "interactive", label: "互动" },
];

const SORTS = [
  { key: "popular", label: "热门" },
  { key: "fresh", label: "最新" },
  { key: "alpha", label: "A-Z" },
] as const;

export function Library() {
  const templates = useAppStore((s) => s.templates);
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const [beat, setBeat] = useState("all");
  const [sort, setSort] = useState<typeof SORTS[number]["key"]>("popular");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let list = templates.filter(
      (t) =>
        (genre === "all" || t.genre === genre) &&
        (beat === "all" || t.beatModel === beat) &&
        (!ql ||
          t.title.toLowerCase().includes(ql) ||
          t.logline.toLowerCase().includes(ql) ||
          t.tags.some((tg) => tg.toLowerCase().includes(ql)) ||
          t.description.toLowerCase().includes(ql))
    );
    if (sort === "popular") list.sort((a, b) => b.usageCount - a.usageCount);
    else if (sort === "fresh") list.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sort === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [templates, q, genre, beat, sort]);

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <span className="scene-tag">SCENE 02 · LIBRARY</span>
          <h1 className="mt-3 font-display text-[56px] leading-[1] text-paper-50">
            公共<span className="italic text-amber">模板库</span>
          </h1>
          <p className="mt-3 font-serif text-paper-200 max-w-xl">
            按体裁 × 节拍 × 关键字筛选，找到你下一部戏的开场模板。点击任意海报进入剧本阅读视图。
          </p>
        </div>
        <Link to="/studio" className="reel-button shrink-0">
          <Pen size={12} /> 新建模板
        </Link>
      </div>

      {/* 搜索 + 筛选 */}
      <div className="panel p-5 mb-8">
        <div className="flex items-center gap-3 border-b border-ink-600 pb-3">
          <Search size={16} className="text-amber" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索片名、Logline、标签、字段……"
            className="flex-1 bg-transparent outline-none font-mono text-[14px] text-paper-100 placeholder:text-ink-400"
          />
          <span className="label-overline">{filtered.length} / {templates.length}</span>
        </div>
        <div className="pt-4 space-y-3">
          <div className="flex items-start gap-3 flex-wrap">
            <span className="label-overline shrink-0 mt-2 w-20">
              <Filter size={11} className="inline mr-1" /> 体裁
            </span>
            <div className="flex flex-wrap gap-2 flex-1">
              {GENRES.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setGenre(g.key)}
                  className={cn("tag-pill", genre === g.key && "tag-pill-active")}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3 flex-wrap">
            <span className="label-overline shrink-0 mt-2 w-20">节拍</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {BEATS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBeat(b.key)}
                  className={cn("tag-pill", beat === b.key && "tag-pill-active")}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-ink-700">
            <span className="label-overline shrink-0">排序</span>
            <div className="flex gap-2 flex-wrap">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={cn("tag-pill", sort === s.key && "tag-pill-active")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 列表 */}
      {filtered.length === 0 ? (
        <div className="border border-dashed border-ink-600 py-20 text-center">
          <Clapperboard size={32} className="text-ink-500 mx-auto mb-3" />
          <div className="font-display text-[24px] text-paper-200">没有匹配的剧本</div>
          <p className="mt-2 font-serif italic text-ink-300">
            试试改变筛选条件，或创建一个新模板。
          </p>
          <Link to="/studio" className="reel-button mt-6 inline-flex">
            前往 Studio <ArrowRight size={11} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} tpl={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
