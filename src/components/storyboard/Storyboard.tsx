import { useMemo, useState } from "react";
import { ACTS } from "@/data/acts";
import { SHOTS } from "@/data/shots";
import { ShotCard } from "./ShotCard";
import { BrushTitle } from "@/components/common/BrushTitle";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

export function Storyboard() {
  const [actId, setActId] = useState<string>("all");
  const list = useMemo(
    () => (actId === "all" ? SHOTS : SHOTS.filter((s) => s.actId === actId)),
    [actId],
  );

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <BrushTitle
          zh="分镜表"
          en="STORYBOARD · 24 SHOTS"
          seal="贰"
        />
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-mo-600" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-mo-600">
            FILTER / 幕
          </span>
          <select
            value={actId}
            onChange={(e) => setActId(e.target.value)}
            className="font-xiao text-sm tracking-[0.18em] bg-xuan-100 border border-mo-800/40 px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-zhu-500"
          >
            <option value="all">全部 · ALL</option>
            {ACTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.index} · {a.subtitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="font-serif text-sm text-mo-700 max-w-[68ch] mb-6">
        每一张分镜卡都包含：<span className="text-zhu-500">镜号 · 景别 · 运镜 · 画面描述 · AI 提示词 · 配乐情绪 · 关联人物 / 特效</span>。
        可将英文 Prompt 一键复制到 Midjourney / Sora / Runway / Pika 等模型。
      </p>

      <div className="relative">
        {/* 横向时间轴标尺 */}
        <div className="flex items-end gap-1 mb-3 overflow-x-auto pb-2 h-track">
          {list.map((s) => (
            <div
              key={s.id}
              className="shrink-0 w-[320px] flex flex-col items-center"
            >
              <div className="font-mono text-[9px] text-mo-600 tracking-[0.2em]">
                {s.number}
              </div>
              <div className="w-px h-2 bg-mo-800/40" />
            </div>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 h-track pr-12">
          {list.map((s, i) => (
            <ShotCard key={s.id} shot={s} index={i} />
          ))}
        </div>
      </div>

      {/* 镜头使用说明 */}
      <div className="card-paper p-5 mt-4">
        <h4 className="font-xiao tracking-[0.18em] text-mo-900 mb-2">
          使用说明
        </h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm font-serif text-mo-700">
          <li>
            选定一个镜头后，点击卡片底部的「COPY」即可复制英文提示词。
          </li>
          <li>
            镜头顺序对应原文叙事顺序；可按需挑选组合。
            <span className="text-zhu-500">建议每段 5 — 8 个镜头为一组</span>。
          </li>
          <li>
            带「特效」标签的镜头，可在 <a href="/fx" className="link-ink">特效页</a> 查看其 HTML 动效模板，直接复用。
          </li>
          <li>
            人物标签可点击跳转到「卷轴人物志」，复制角色立绘 Prompt 与该镜头叠加使用。
          </li>
        </ol>
      </div>
    </section>
  );
}
