import { Link } from "react-router-dom";
import { Eye, Heart, Film, Tag } from "lucide-react";
import type { TemplateRecord } from "@/types";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { timeAgo } from "@/utils/format";

interface Props {
  tpl: TemplateRecord;
  index?: number;
  featured?: boolean;
}

const COVERS: Record<string, string> = {
  "from-amber/40 via-ink-700 to-reel/30":
    "linear-gradient(135deg, rgba(212,168,87,0.45) 0%, rgba(28,28,36,0.6) 50%, rgba(200,16,46,0.35) 100%)",
  "from-reel/40 via-ink-700 to-amber/30":
    "linear-gradient(135deg, rgba(200,16,46,0.45) 0%, rgba(28,28,36,0.6) 50%, rgba(212,168,87,0.35) 100%)",
  "from-amber/30 via-ink-700 to-reel/40":
    "linear-gradient(135deg, rgba(212,168,87,0.35) 0%, rgba(28,28,36,0.6) 50%, rgba(200,16,46,0.45) 100%)",
  "from-reel/50 via-ink-700 to-amber/30":
    "linear-gradient(135deg, rgba(200,16,46,0.55) 0%, rgba(28,28,36,0.6) 50%, rgba(212,168,87,0.35) 100%)",
  "from-amber/40 via-ink-700 to-amber/10":
    "linear-gradient(135deg, rgba(212,168,87,0.45) 0%, rgba(28,28,36,0.6) 50%, rgba(212,168,87,0.15) 100%)",
  "from-amber/30 via-ink-700 to-amber/40":
    "linear-gradient(135deg, rgba(212,168,87,0.35) 0%, rgba(28,28,36,0.6) 50%, rgba(212,168,87,0.45) 100%)",
  "from-reel/30 via-ink-700 to-amber/30":
    "linear-gradient(135deg, rgba(200,16,46,0.35) 0%, rgba(28,28,36,0.6) 50%, rgba(212,168,87,0.35) 100%)",
  "from-amber/40 via-ink-700 to-reel/40":
    "linear-gradient(135deg, rgba(212,168,87,0.45) 0%, rgba(28,28,36,0.6) 50%, rgba(200,16,46,0.45) 100%)",
};

export function TemplateCard({ tpl, index = 0, featured }: Props) {
  const gradient = COVERS[tpl.cover] ?? COVERS["from-amber/40 via-ink-700 to-reel/30"];
  return (
    <Link
      to={`/library/${tpl.id}`}
      className="group block relative panel clapper-card panel-hover"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 封面 */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: gradient }}
        />
        {/* 胶片孔装饰 */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-3 py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-paper-100/80" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-paper-100/80" />
          ))}
        </div>

        {/* 角标 */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <span className="scene-tag bg-ink-900/80 border-amber text-amber">
            {BEAT_MODEL_LABEL[tpl.beatModel]}
          </span>
          {featured && (
            <span className="reel-button-red text-[9px] py-0.5 px-2 mt-1">
              精选
            </span>
          )}
        </div>

        {/* 中央 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Film size={20} className="text-paper-100/40 mb-3" strokeWidth={1} />
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-paper-100/80">
            {GENRE_LABEL[tpl.genre]} · {BEAT_MODEL_LABEL[tpl.beatModel]}
          </div>
          <div className="mt-3 font-display text-paper-50 text-2xl leading-tight">
            {tpl.title}
          </div>
          <div className="mt-2 font-serif italic text-paper-200/80 text-[13px] line-clamp-2 max-w-[90%]">
            "{tpl.logline}"
          </div>
        </div>

        {/* 底部作者条 */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest2 text-paper-100/70">
          <span>by {tpl.authorName}</span>
          <span>v{tpl.version.toString().padStart(2, "0")}</span>
        </div>
      </div>

      {/* 信息区 */}
      <div className="px-4 py-3 border-t border-ink-600 bg-ink-800">
        <div className="flex items-center gap-3 label-overline">
          <span className="flex items-center gap-1.5">
            <Eye size={11} strokeWidth={1.5} />
            {tpl.usageCount.toLocaleString()}
          </span>
          <span className="stat-divider" />
          <span>{timeAgo(tpl.updatedAt)}</span>
          <span className="ml-auto flex items-center gap-1">
            <Tag size={11} strokeWidth={1.5} />
            {tpl.tags.length}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tpl.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest2 text-ink-300 border border-ink-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
