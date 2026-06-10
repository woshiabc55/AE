// 模板市场 - 公共模板精选 / 投稿 / 评分
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Star,
  TrendingUp,
  Sparkles,
  Filter,
  Upload,
  ChevronDown,
  Heart,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/store";
import { TemplateCard } from "@/components/TemplateCard";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { cn, timeAgo } from "@/utils/format";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { toast } from "@/store/toast";
import { Modal } from "@/components/ui/Modal";
import { validate, TemplateRecordSchema } from "@/utils/validate";
import type { TemplateRecord } from "@/types";

const SORTS = [
  { key: "trending", label: "趋势", icon: TrendingUp },
  { key: "newest", label: "最新", icon: Sparkles },
  { key: "top", label: "高分", icon: Star },
  { key: "mine", label: "我的投稿", icon: Upload },
] as const;

export function Marketplace() {
  const templates = useAppStore((s) => s.templates);
  const ratings = useLiveQuery(() => db.ratings.toArray(), []);
  const [genre, setGenre] = useState("all");
  const [beat, setBeat] = useState("all");
  const [sort, setSort] = useState<typeof SORTS[number]["key"]>("trending");
  const [publishOpen, setPublishOpen] = useState(false);

  const publicTpls = templates.filter((t) => t.isPublic);
  const myDrafts = templates.filter((t) => t.authorId === "me");

  const rated = useMemo(() => {
    const map = new Map<string, { avg: number; count: number }>();
    (ratings ?? []).forEach((r) => {
      const cur = map.get(r.templateId) ?? { avg: 0, count: 0 };
      cur.avg = (cur.avg * cur.count + r.stars) / (cur.count + 1);
      cur.count += 1;
      map.set(r.templateId, cur);
    });
    return map;
  }, [ratings]);

  const list = useMemo(() => {
    let l = publicTpls.filter(
      (t) =>
        (genre === "all" || t.genre === genre) &&
        (beat === "all" || t.beatModel === beat) &&
        (sort !== "mine" || t.authorId === "me")
    );
    if (sort === "trending") l.sort((a, b) => b.usageCount - a.usageCount);
    else if (sort === "newest") l.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sort === "top")
      l.sort(
        (a, b) =>
          (rated.get(b.id)?.avg ?? 0) - (rated.get(a.id)?.avg ?? 0) ||
          (rated.get(b.id)?.count ?? 0) - (rated.get(a.id)?.count ?? 0)
      );
    return l;
  }, [publicTpls, genre, beat, sort, rated]);

  const stats = {
    public: publicTpls.length,
    mine: myDrafts.length,
    avgRating:
      Array.from(rated.values()).reduce((s, r) => s + r.avg, 0) /
      Math.max(1, rated.size),
  };

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10 py-10">
      <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
        <div>
          <span className="scene-tag">SCENE 08 · MARKETPLACE</span>
          <h1 className="mt-3 font-display text-[56px] leading-[1] text-paper-50">
            萤幕<span className="italic text-amber">市场</span>
          </h1>
          <p className="mt-3 font-serif text-paper-200 max-w-xl">
            社区投稿的剧本模板，按体裁 / 节拍 / 评分筛选。一键派生到你自己的工作台。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPublishOpen(true)} className="reel-button">
            <Upload size={12} /> 投稿模板
          </button>
          <Link to="/studio" className="ghost-button">
            <Plus size={12} /> 新建
          </Link>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard label="公共模板" value={stats.public.toString()} />
        <StatCard label="我的草稿" value={stats.mine.toString()} />
        <StatCard
          label="社区均分"
          value={isFinite(stats.avgRating) ? stats.avgRating.toFixed(2) : "—"}
        />
      </div>

      {/* 筛选条 */}
      <div className="panel p-4 mb-6 flex flex-wrap items-center gap-3">
        <Filter size={13} className="text-amber" />
        <span className="label-overline">体裁</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { k: "all", l: "All" },
            ...Object.entries(GENRE_LABEL).map(([k, l]) => ({ k, l })),
          ].map((g) => (
            <button
              key={g.k}
              onClick={() => setGenre(g.k)}
              className={cn("tag-pill", genre === g.k && "tag-pill-active")}
            >
              {g.l}
            </button>
          ))}
        </div>
        <span className="label-overline ml-2">节拍</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { k: "all", l: "All" },
            ...Object.entries(BEAT_MODEL_LABEL).map(([k, l]) => ({ k, l })),
          ].map((b) => (
            <button
              key={b.k}
              onClick={() => setBeat(b.k)}
              className={cn("tag-pill", beat === b.k && "tag-pill-active")}
            >
              {b.l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn("tag-pill", sort === s.key && "tag-pill-active")}
            >
              <s.icon size={11} /> {s.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-ink-600 py-20 text-center">
          <Store size={32} className="text-ink-500 mx-auto mb-3" />
          <h3 className="font-display text-[24px] text-paper-50">市场暂无符合筛选的模板</h3>
          <p className="mt-2 font-serif italic text-ink-300">试试改变筛选条件，或提交你的第一个模板。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((t, i) => {
            const r = rated.get(t.id);
            return (
              <div key={t.id} className="relative">
                <TemplateCard tpl={t} index={i} />
                {r && (
                  <div className="absolute top-3 left-3 panel border-amber bg-ink-900/85 px-2 py-1 flex items-center gap-1.5 z-10">
                    <Star size={11} className="text-amber fill-amber" />
                    <span className="font-mono text-[11px] text-amber">
                      {r.avg.toFixed(1)}
                    </span>
                    <span className="text-ink-400 text-[10px]">({r.count})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <div className="label-overline">{label}</div>
      <div className="mt-2 font-display text-[32px] text-paper-50 leading-none">
        {value}
      </div>
    </div>
  );
}

function PublishModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // 仅在 open=true 时才订阅草稿列表，避免每次 render 返回新数组
  const templates = useAppStore((s) => s.templates);
  const myDrafts = useMemo(
    () =>
      open
        ? templates.filter((t) => t.authorId === "me" && !t.isPublic)
        : [],
    [open, templates]
  );
  const publish = useAppStore((s) => s.publishTemplate);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="投稿到萤幕市场"
      subtitle="选择一个草稿发布。发布的模板将对所有用户可见，并出现在公共库与 Discover 页。"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            取消
          </button>
          <button
            disabled={!selected}
            onClick={async () => {
              if (!selected) return;
              const t = myDrafts.find((x) => x.id === selected);
              if (!t) return;
              // 校验模板完整性
              const r = validate(TemplateRecordSchema, t);
              if (r.ok === false) {
                toast.error("模板校验未通过", r.errors[0]);
                return;
              }
              await publish(selected);
              toast.success("已发布", "模板已发布到萤幕市场");
              onClose();
            }}
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Upload size={11} /> 发布
          </button>
        </>
      }
    >
      <div className="p-5">
        {myDrafts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-paper-200">你还没有可发布的草稿模板。</p>
            <Link
              to="/studio"
              onClick={onClose}
              className="reel-button mt-4 inline-flex"
            >
              <Plus size={12} /> 去创建
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {myDrafts.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "w-full panel panel-hover p-4 flex items-center gap-4 text-left",
                  selected === t.id && "!border-amber bg-ink-700"
                )}
              >
                <div
                  className="w-12 h-12 shrink-0 border border-amber"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,168,87,0.45), rgba(200,16,46,0.35))",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[16px] text-paper-50 truncate">
                    {t.title}
                  </div>
                  <div className="font-mono text-[10px] text-ink-300 mt-0.5">
                    {GENRE_LABEL[t.genre]} · {BEAT_MODEL_LABEL[t.beatModel]} · v{t.version}
                  </div>
                  <div className="font-serif italic text-[12px] text-paper-200 mt-1 truncate">
                    "{t.logline || "（无 Logline）"}"
                  </div>
                </div>
                {selected === t.id && <div className="w-2 h-2 rounded-full bg-amber" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
