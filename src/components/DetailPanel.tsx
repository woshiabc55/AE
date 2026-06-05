import { useEffect, useState } from "react";
import { useUIStore } from "@/store/ui";
import { SKILLS, SP_TYPE_LABEL, CLASS_META } from "@/data/skills";
import { SkillIconLarge } from "./SkillIcon";
import { X, Clock, RefreshCcw, Timer, Activity, Cpu } from "lucide-react";

/**
 * DetailPanel —— 右侧/底部详情抽屉
 */
export function DetailPanel() {
  const { selectedSkillId, selectSkill, activate, activatedIds } = useUIStore();
  const skill = SKILLS.find((s) => s.id === selectedSkillId) || null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (skill) {
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [skill]);

  if (!skill) {
    return (
      <aside
        className="hidden h-full w-[380px] shrink-0 flex-col items-center justify-center gap-3 border-l border-ark-line/60 bg-ark-1/50 backdrop-blur-sm xl:flex"
        style={{ minHeight: 320 }}
      >
        <div className="font-display text-[10px] tracking-[0.4em] text-ark-silver/50">DETAIL</div>
        <div className="font-display text-2xl font-bold tracking-[0.2em] text-ark-silver/30">
          ░ NO SELECTION ░
        </div>
        <div className="max-w-[260px] text-center text-[12px] tracking-wider text-ark-silver/40">
          从左侧网格中选中任意技能以加载完整参数与释放态展示
        </div>
      </aside>
    );
  }

  const cls = CLASS_META.find((c) => c.key === skill.className)!;
  const spMeta = SP_TYPE_LABEL[skill.spType];
  const active = activatedIds.has(skill.id);

  return (
    <aside
      className={[
        "relative flex w-full shrink-0 flex-col border-l border-ark-line/60 bg-ark-1/70 backdrop-blur-md xl:w-[420px]",
        "transition-all duration-300",
        visible ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
      ].join(" ")}
      style={{ minHeight: 320 }}
    >
      {/* 背景六边形 + 径向辉光 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${skill.color}30, transparent 60%)`,
        }}
      />
      <HexBackdrop color={skill.color} />

      {/* 关闭 */}
      <button
        onClick={() => selectSkill(null)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-ark-line/70 text-ark-silver/70 transition hover:border-ark-cyan hover:text-ark-cyan"
      >
        <X className="h-4 w-4" />
      </button>

      {/* 头部 */}
      <div className="relative flex items-center gap-4 border-b border-ark-line/60 p-5">
        <div className="relative">
          <SkillIconLarge skill={skill} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="clip-tag inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em]"
            style={{ borderColor: cls.color, color: cls.color }}
          >
            <span
              className="h-1.5 w-1.5"
              style={{ background: cls.color, boxShadow: `0 0 6px ${cls.color}` }}
            />
            {cls.en} · {cls.cn}
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold leading-none text-ark-white">
            {skill.name}
          </h3>
          <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-ark-silver/60">
            {skill.nameEn}
          </div>
          <div className="mt-1 text-[12px] tracking-wider text-ark-silver/75">
            OPERATOR · <span className="text-ark-white">{skill.operator}</span>
          </div>
        </div>
      </div>

      {/* 释放态光效 */}
      <div className="relative h-44 overflow-hidden border-b border-ark-line/60">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${skill.color}55, transparent 60%)`,
          }}
        />
        {active && (
          <>
            <div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-burst rounded-full"
              style={{ background: `radial-gradient(circle, ${skill.color}, transparent 60%)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-cone"
              style={{
                background: `conic-gradient(from 0deg, ${skill.color}, transparent 25%, ${skill.color} 50%, transparent 75%, ${skill.color})`,
                filter: "blur(8px)",
                mixBlendMode: "screen",
              }}
            />
          </>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={[
              "font-display text-[10px] tracking-[0.5em] transition",
              active ? "text-ark-white" : "text-ark-silver/60",
            ].join(" ")}
          >
            {active ? "RELEASING" : "STANDBY"}
          </div>
          <div
            className="mt-1 font-display text-3xl font-black tracking-[0.15em]"
            style={{ color: active ? skill.color : "#3a4458", textShadow: active ? `0 0 18px ${skill.color}` : "none" }}
          >
            {skill.spCost}
          </div>
          <div className="font-mono text-[9px] tracking-widest text-ark-silver/55">SP COST</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-ark-cyan/60 to-transparent" />
      </div>

      {/* 参数表 */}
      <div className="relative grid grid-cols-2 gap-2 p-4">
        <Param icon={<Timer className="h-3.5 w-3.5" />} label="持续" value={skill.duration} />
        <Param icon={<RefreshCcw className="h-3.5 w-3.5" />} label="冷却" value={skill.cooldown} />
        <Param icon={<Activity className="h-3.5 w-3.5" />} label="类型" value={spMeta.cn} color={spMeta.color} />
        <Param icon={<Cpu className="h-3.5 w-3.5" />} label="稀有度" value={`★ × ${skill.rarity}`} color={skill.color} />
      </div>

      {/* 描述 */}
      <div className="relative flex-1 overflow-y-auto px-4 pb-4">
        <div className="font-mono text-[10px] tracking-widest text-ark-cyan/80">▸ DESCRIPTION</div>
        <p className="mt-2 text-[13px] leading-relaxed text-ark-silver/90">{skill.description}</p>
        <div className="mt-3 font-mono text-[10px] tracking-widest text-ark-cyan/80">▸ TRIGGER</div>
        <p className="mt-1.5 text-[12px] text-ark-silver/75">{skill.trigger}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {skill.tags.map((t) => (
            <span
              key={t}
              className="border border-ark-line/60 bg-ark-2/60 px-2 py-0.5 font-mono text-[10px] tracking-wider text-ark-silver/75"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 触发按钮 */}
      <div className="relative border-t border-ark-line/60 p-3">
        <button
          onClick={() => void activate(skill.id)}
          disabled={active}
          className={[
            "w-full clip-corner-sm border px-4 py-3 font-display text-[12px] font-bold tracking-[0.3em] transition",
            active
              ? "border-ark-line/60 bg-ark-2/40 text-ark-silver/50"
              : "border-ark-cyan/80 bg-ark-cyan/10 text-ark-cyan hover:bg-ark-cyan/20 hover:shadow-[0_0_22px_rgba(94,227,255,0.45)]",
          ].join(" ")}
        >
          {active ? "RELEASING…" : "▶ ACTIVATE SKILL"}
        </button>
      </div>
    </aside>
  );
}

function Param({
  icon,
  label,
  value,
  color = "#d6dee9",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="border border-ark-line/50 bg-ark-2/40 p-2.5">
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-ark-silver/55">
        <span className="text-ark-cyan/80">{icon}</span>
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-bold tracking-wider" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function HexBackdrop({ color }: { color: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hex-detail" x="0" y="0" width="40" height="46.2" patternUnits="userSpaceOnUse">
          <path
            d="M20 0 L40 11 L40 35 L20 46 L0 35 L0 11 Z"
            fill="none"
            stroke={color}
            strokeOpacity="0.4"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-detail)" />
    </svg>
  );
}
