import { useState } from "react";
import type { Skill } from "@/data/skills";
import { SP_TYPE_LABEL } from "@/data/skills";
import { useUIStore } from "@/store/ui";
import { SkillIcon } from "./SkillIcon";
import { SPBar } from "./SPBar";
import { Star, ChevronRight, Crosshair } from "lucide-react";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

/**
 * SkillCard —— 技能卡片
 * 包含：六边形图标 + 技能名 + 干员名 + 星级 + SP 条 + 释放态辉光
 */
export function SkillCard({ skill, index }: SkillCardProps) {
  const { selectSkill, selectedSkillId, activate, activatedIds } = useUIStore();
  const [hover, setHover] = useState(false);
  const active = activatedIds.has(skill.id);
  const isSelected = selectedSkillId === skill.id;
  const spMeta = SP_TYPE_LABEL[skill.spType];
  const rarity = skill.rarity;

  const rarityBar = {
    4: "from-[#D6DEE9] to-[#7B8493]",
    5: "from-[#5EE3FF] to-[#3A6CFF]",
    6: "from-[#E8C477] via-[#C15BFF] to-[#5EE3FF]",
  }[rarity];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        selectSkill(skill.id);
        void activate(skill.id);
      }}
      style={{
        animationDelay: `${index * 50}ms`,
        ["--card-glow" as never]: skill.color,
      }}
      className={[
        "group relative cursor-pointer select-none animate-rise",
        "clip-corner border bg-ark-1/70 backdrop-blur-sm",
        isSelected
          ? "border-ark-cyan glow-cyan"
          : "border-ark-line/60 hover:-translate-y-1 hover:border-ark-cyan/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.35)]",
        "transition-all duration-300",
      ].join(" ")}
    >
      {/* 顶部高光条 */}
      <div
        className={[
          "absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r",
          rarityBar,
        ].join(" ")}
      />
      {/* 角部装饰 */}
      <CornerDecor color={skill.color} />

      {/* 激活态辉光 */}
      {active && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 38%, ${skill.color}aa, transparent 60%)`,
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-burst rounded-full"
            style={{ background: `radial-gradient(circle, ${skill.color}, transparent 60%)` }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-cone"
            style={{
              background: `conic-gradient(from 0deg, ${skill.color}cc, transparent 25%, ${skill.color}cc 50%, transparent 75%, ${skill.color}cc)`,
              filter: "blur(6px)",
              mixBlendMode: "screen",
            }}
          />
        </>
      )}

      {/* 顶部：图标 + 职业代号 */}
      <div className="flex items-start justify-between px-3 pt-3">
        <div className="relative">
          <SkillIcon
            seed={skill.iconSeed}
            color={skill.color}
            size={48}
            rarity={skill.rarity}
            active={active}
          />
          {active && (
            <div
              className="absolute inset-0 blur-xl"
              style={{ background: `radial-gradient(circle, ${skill.color}, transparent 60%)` }}
            />
          )}
        </div>
        <div className="flex flex-col items-end">
          <div
            className="clip-tag border px-1.5 py-0.5 font-mono text-[9px] tracking-widest"
            style={{ borderColor: spMeta.color, color: spMeta.color }}
          >
            {spMeta.en}
          </div>
          <div className="mt-1.5 flex items-center gap-0.5">
            {Array.from({ length: rarity }).map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5"
                style={{
                  color: rarity >= 6 ? "#E8C477" : rarity >= 5 ? "#5EE3FF" : "#D6DEE9",
                  fill: rarity >= 6 ? "#E8C477" : rarity >= 5 ? "#5EE3FF" : "#D6DEE9",
                  filter:
                    rarity >= 6
                      ? "drop-shadow(0 0 4px rgba(232,196,119,0.7))"
                      : rarity >= 5
                      ? "drop-shadow(0 0 4px rgba(94,227,255,0.6))"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 中部：技能名 + 干员 */}
      <div className="mt-2 px-3">
        <div
          className="font-display text-[15px] font-bold leading-tight text-ark-white"
          style={{ textShadow: hover ? `0 0 12px ${skill.color}80` : "none" }}
        >
          {skill.name}
        </div>
        <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.25em] text-ark-silver/55">
          {skill.nameEn}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <Crosshair className="h-3 w-3 text-ark-silver/40" />
          <span className="text-[12px] text-ark-silver/85">{skill.operator}</span>
        </div>
      </div>

      {/* 下部：SP 条 + 标签 */}
      <div className="mt-3 px-3 pb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-ark-silver/55">SP</span>
          <span
            className={[
              "font-mono text-[9px] tracking-widest transition",
              active ? "text-ark-white" : "text-ark-silver/45",
            ].join(" ")}
          >
            {active ? "RELEASING" : "READY"}
          </span>
        </div>
        <SPBar cost={skill.spCost} active={active} color={skill.color} fill={active ? 1 : 0.55} />

        <div className="mt-2.5 flex flex-wrap gap-1">
          {skill.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="border border-ark-line/60 bg-ark-2/60 px-1.5 py-0.5 font-mono text-[9.5px] tracking-wider text-ark-silver/75"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 右上角“已选”标记 */}
      {isSelected && (
        <div className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center bg-ark-cyan text-ark-0">
          <ChevronRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

function CornerDecor({ color }: { color: string }) {
  return (
    <>
      <span
        className="absolute left-0 top-0 h-2 w-2 border-l border-t"
        style={{ borderColor: color, opacity: 0.65 }}
      />
      <span
        className="absolute right-0 bottom-0 h-2 w-2 border-r border-b"
        style={{ borderColor: color, opacity: 0.65 }}
      />
    </>
  );
}
