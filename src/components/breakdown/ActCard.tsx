import { useState } from "react";
import { ChevronRight, Clock, Hash, Music, Wand2 } from "lucide-react";
import { SHOTS } from "@/data/shots";
import type { Act } from "@/data/acts";
import { Seal } from "@/components/common/Seal";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";
import { Check, Copy } from "lucide-react";

type Props = {
  act: Act;
  isActive: boolean;
  onActivate: (id: string) => void;
};

export function ActCard({ act, isActive, onActivate }: Props) {
  const [open, setOpen] = useState(act.index === 0);
  const { copied, copy } = useCopy();
  const linkedShots = SHOTS.filter((s) => s.actId === act.id);

  return (
    <article
      id={act.id}
      onClick={() => onActivate(act.id)}
      className={cn(
        "scroll-paper rounded-sm my-12 transition-shadow",
        isActive && "ring-2 ring-zhu-500/30",
      )}
    >
      {/* 幕头 */}
      <header className="px-10 pt-10 pb-4 flex flex-wrap items-end gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mo-600">
          ACT · {String(act.index).padStart(2, "0")}
        </div>
        <div className="font-xiao text-3xl text-mo-900 tracking-[0.16em]">
          {act.title}
        </div>
        <div className="font-brush text-2xl text-zhu-500 ml-2">
          {act.subtitle}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs font-mono text-mo-600">
          <Clock className="size-3.5" /> {act.year} · {act.duration}″
        </div>
      </header>

      {/* 关键词带 */}
      <div className="px-10 pb-4 flex flex-wrap gap-2 items-center">
        {act.keyWords.map((k) => (
          <span key={k} className="chip">
            <Hash className="size-3" />
            {k}
          </span>
        ))}
        <span className="chip text-zhu-500 border-zhu-500/40">
          <Music className="size-3" />
          情绪：{act.tone}
        </span>
      </div>

      <div className="ink-divider mx-10" />

      {/* 剧本正文（始终可见首段） */}
      <div className="px-10 pt-6 pb-2">
        <div className="script-body max-w-[68ch]">
          {open
            ? act.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
            : <p>{act.body.split("\n\n")[0]}</p>}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="mt-4 inline-flex items-center gap-2 text-sm font-xiao tracking-[0.2em] text-zhu-500 hover:text-zhu-400"
        >
          {open ? "收起原文" : "展开剧本"}
          <ChevronRight
            className={cn("size-4 transition-transform", open && "rotate-90")}
          />
        </button>
      </div>

      {/* 展开：镜头情绪条 + 关联镜头 */}
      {open && (
        <div className="px-10 pb-10">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 镜头情绪条 */}
            <div className="card-paper p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-xiao tracking-[0.18em] text-mo-900">
                  镜头情绪曲线
                </h4>
                <Seal text="MOOD BAR" size="sm" />
              </div>
              <div className="flex items-end gap-1 h-24">
                {linkedShots.map((s, i) => {
                  const h =
                    s.shotType === "特写" || s.shotType === "主观"
                      ? 40
                      : s.shotType === "近景"
                        ? 55
                        : s.shotType === "中景"
                          ? 75
                          : 95;
                  return (
                    <div
                      key={s.id}
                      title={`${s.number} · ${s.shotType}`}
                      className="flex-1 group cursor-help"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-mo-800 to-zhu-500 rounded-sm transition-all group-hover:from-zhu-500 group-hover:to-jin-400"
                        style={{ height: `${h}%` }}
                      />
                      <div className="mt-1 text-[9px] font-mono text-mo-600 text-center">
                        {i + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-serif text-mo-700">
                {act.tone}。从起伏曲线可看到情绪最高点位于本幕
                中后段——往往是悲剧高潮。
              </p>
            </div>

            {/* 关联镜头摘要 */}
            <div className="card-paper p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-xiao tracking-[0.18em] text-mo-900">
                  关联镜头 · 镜头情绪
                </h4>
                <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
                  {linkedShots.length} SHOTS
                </span>
              </div>
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {linkedShots.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-2 text-sm font-serif"
                  >
                    <span className="font-mono text-[10px] text-zhu-500 w-10">
                      {s.number}
                    </span>
                    <span className="text-mo-800 truncate flex-1">
                      {s.summary}
                    </span>
                    <span className="chip text-[10px]">{s.shotType}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 整幕提示词 */}
          <div className="mt-6">
            <div className="card-paper p-5 bg-mo-900/5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-xiao tracking-[0.18em] text-mo-900 flex items-center gap-2">
                  <Wand2 className="size-4" />
                  AI 提示词 · 整幕风格
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(buildActPrompt(act));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-xiao tracking-[0.2em] text-zhu-500 hover:text-zhu-400"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> 复制
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-[11px] leading-relaxed text-mo-800 whitespace-pre-wrap break-words">
{buildActPrompt(act)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function buildActPrompt(act: Act) {
  return `Act ${act.index} · ${act.subtitle}, ${act.year}
Mood: ${act.tone}
Style: Tang-Song dynasty painted scroll aesthetic, ink-wash + cinnabar red + imperial gold, cinematic 4K, dramatic rim light, dust and smoke, war banners.
Keywords: ${act.keyWords.join(", ")}.
Key visual references: ${linkedShotKeywords(act.id)}.
Negative prompt: modern clothing, neon, low quality, blurry text.`;
}

function linkedShotKeywords(actId: string) {
  const ks = SHOTS.filter((s) => s.actId === actId)
    .map((s) => `${s.shotType}(${s.movement}) → ${s.summary}`)
    .join("; ");
  return ks || "—";
}
