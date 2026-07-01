import { useGameStore } from "@/store/useGameStore";
import type { FactionView } from "@/projection/views/factionView";
import { StatBar } from "@/components/common/StatBar";
import { Crown, Sword, Coins, Wheat, Sparkles, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/** 势力面板 — 左栏，每势力以印章+组件数值条呈现 */
export function FactionPanel() {
  const { factions } = useGameStore();
  return (
    <section className="chronicle-frame scroll-cap flex h-full flex-col p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
        <Crown size={14} className="text-gold-300" />
        <h2 className="gilt-title font-serif text-sm uppercase tracking-widest">列国</h2>
      </div>
      <div className="scroll-bronze flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {factions.map((f) => (
          <FactionSeal key={f.entityId} faction={f} />
        ))}
      </div>
    </section>
  );
}

function FactionSeal({ faction }: { faction: FactionView }) {
  return (
    <div
      className={cn(
        "relative border-l-2 bg-ink-900/60 p-3 transition-all",
        faction.isPlayer ? "border-gold-300" : "border-gold-500/30"
      )}
    >
      {/* 势力印章 */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rotate-45 border"
          style={{ borderColor: faction.color, background: faction.color }}
        />
        <span className="gilt-title font-serif text-base">{faction.name}</span>
        {faction.isPlayer && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-gold-300">
            · 玩家
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <StatLine icon={<Sword size={9} />} label="兵力" value={faction.troops} max={150} color="bg-vermillion-500" />
        <StatLine icon={<Sparkles size={9} />} label="士气" value={faction.morale} max={100} color="bg-gold-300" />
        <StatLine icon={<Coins size={9} />} label="黄金" value={faction.gold} max={300} color="bg-gold-400" />
        <StatLine icon={<Wheat size={9} />} label="粮草" value={faction.food} max={150} color="bg-bronze-400" />
        <StatLine icon={<Users size={9} />} label="人口" value={faction.population} max={120} color="bg-green-700" />
        <StatLine icon={<Heart size={9} />} label="民心" value={faction.happiness} max={100} color="bg-rose-500" />
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-gold-500/10 pt-1">
        <span className="font-mono text-[9px] text-parchment-300/50">
          威望 {faction.prestige} · 科技 T{faction.techLevel}
        </span>
        <span className="font-mono text-[9px] text-bronze-400">熵 {faction.entropy}</span>
      </div>
    </div>
  );
}

function StatLine({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gold-500/50">{icon}</span>
      <span className="w-8 shrink-0 font-mono text-[9px] text-parchment-300/60">{label}</span>
      <StatBar value={value} max={max} color={color} />
    </div>
  );
}
