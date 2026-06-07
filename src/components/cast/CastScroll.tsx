import { useState } from "react";
import { CAST } from "@/data/cast";
import { CastCard } from "./CastCard";
import { BrushTitle } from "@/components/common/BrushTitle";
import { cn } from "@/lib/utils";

const FACTIONS = [
  { id: "all", label: "全部", color: "from-mo-700 to-mo-800" },
  { id: "宋", label: "宋", color: "from-zhu-500 to-zhu-600" },
  { id: "辽", label: "辽", color: "from-qi-500 to-qi-600" },
  { id: "北汉", label: "北汉", color: "from-jin-400 to-jin-500" },
] as const;

export function CastScroll() {
  const [faction, setFaction] =
    useState<(typeof FACTIONS)[number]["id"]>("all");
  const list =
    faction === "all" ? CAST : CAST.filter((c) => c.faction === faction);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <BrushTitle
          zh="卷轴人物志"
          en="CAST DESIGN · 8 ROLES"
          seal="叁"
        />
        <div className="flex items-center gap-2">
          {FACTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFaction(f.id)}
              className={cn(
                "font-xiao text-sm tracking-[0.18em] px-3 py-1.5 rounded-sm border transition-colors",
                faction === f.id
                  ? cn(
                      "bg-gradient-to-b text-xuan-100 border-transparent",
                      f.color,
                    )
                  : "bg-transparent text-mo-800 border-mo-800/40 hover:bg-mo-800/5",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="font-serif text-sm text-mo-700 max-w-[68ch] mb-6">
        悬停或聚焦人物卡片，可翻面查看「英文 Prompt」与详细设定；
        <span className="text-zhu-500">复制后可与分镜卡 Prompt 叠加使用</span>，
        保证整支短片角色形象一致。
      </p>

      <div className="flex gap-5 overflow-x-auto pb-8 h-track pr-8">
        {list.map((c) => (
          <CastCard key={c.id} data={c} />
        ))}
      </div>
    </section>
  );
}
