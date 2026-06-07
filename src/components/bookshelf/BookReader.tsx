import type { Act } from "@/data/acts";
import { cn } from "@/lib/utils";
import { SHOTS } from "@/data/shots";
import { useCopy } from "@/hooks/useCopy";
import { Check, Copy, Music, Sparkles, X } from "lucide-react";
import { Seal } from "@/components/common/Seal";

type Props = {
  act: Act;
  onClose: () => void;
};

// 打开的剧本：右侧 / 下方展开的阅读面板
export function BookReader({ act, onClose }: Props) {
  const { copied, copy } = useCopy();
  const shots = SHOTS.filter((s) => s.actId === act.id);
  const paragraphs = act.body.split("\n\n");

  return (
    <article className="card-paper rounded-sm overflow-hidden animate-fadeUp">
      {/* 顶条 */}
      <header className="px-6 py-3 flex items-center justify-between border-b border-mo-800/15 bg-xuan-200/40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
            READING · ACT {String(act.index).padStart(2, "0")}
          </span>
          <span className="font-xiao text-lg text-mo-900 tracking-[0.18em]">
            {act.subtitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Seal text={act.year} size="sm" />
          <button
            onClick={onClose}
            aria-label="合上剧本"
            className="ml-2 size-7 grid place-items-center text-mo-700 hover:text-zhu-500 hover:bg-mo-900/5 rounded-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* 内文：双栏古籍版式 */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* 左侧：原文 */}
        <div className="md:col-span-7 px-6 py-6 border-r border-mo-800/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
              SCRIPT · 原文
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600 ml-auto">
              {act.body.length} 字 · {act.duration}″
            </span>
          </div>
          <div className="script-body max-h-[420px] overflow-y-auto pr-2">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* 关键词 + 情绪 */}
          <div className="mt-4 pt-4 border-t border-mo-800/15 flex flex-wrap gap-2 items-center">
            {act.keyWords.map((k) => (
              <span key={k} className="chip">
                {k}
              </span>
            ))}
            <span className="chip text-zhu-500 border-zhu-500/40 ml-auto">
              <Music className="size-3" />
              情绪 · {act.tone}
            </span>
          </div>
        </div>

        {/* 右侧：情绪条 + 镜头摘要 + 提示词 */}
        <div className="md:col-span-5 px-6 py-6 bg-xuan-200/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
              MOOD · 情绪曲线
            </span>
            <Sparkles className="size-3 text-jin-500" />
          </div>
          <div className="flex items-end gap-1 h-20">
            {shots.map((s, i) => {
              const h =
                s.shotType === "特写" || s.shotType === "主观"
                  ? 38
                  : s.shotType === "近景"
                    ? 54
                    : s.shotType === "中景"
                      ? 72
                      : 95;
              return (
                <div key={s.id} className="flex-1" title={s.summary}>
                  <div
                    className="w-full bg-gradient-to-t from-mo-800 to-zhu-500 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                  <div className="mt-1 text-[9px] font-mono text-mo-600 text-center">
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 镜头摘要 */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
                SHOTS · 关联镜头
              </span>
              <span className="ml-auto font-mono text-[10px] text-mo-600">
                {shots.length} 镜
              </span>
            </div>
            <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-2">
              {shots.map((s) => (
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

          {/* AI 提示词 */}
          <div className="mt-5 p-3 bg-mo-900 text-xuan-100 rounded-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-xuan-300">
                AI Prompt · EN
              </span>
              <button
                onClick={() => copy(buildPrompt(act))}
                className="text-jin-300 hover:text-xuan-100 inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.2em]"
              >
                {copied ? (
                  <>
                    <Check className="size-3" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy className="size-3" /> COPY
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-[10.5px] leading-relaxed text-xuan-100/90 whitespace-pre-wrap break-words line-clamp-[10]">
{buildPrompt(act)}
            </pre>
          </div>
        </div>
      </div>
    </article>
  );
}

function buildPrompt(act: Act) {
  return `Act ${act.index} · ${act.subtitle}, ${act.year}
Mood: ${act.tone}
Style: Tang-Song dynasty painted scroll aesthetic, ink-wash + cinnabar red + imperial gold, cinematic 4K, dramatic rim light, dust and smoke, war banners.
Keywords: ${act.keyWords.join(", ")}.`;
}
