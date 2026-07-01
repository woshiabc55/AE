import { motion } from "framer-motion";
import type { CardTemplate } from "@/types";
import { cn } from "@/lib/utils";
import { Sword, Coins, Crown, Handshake, Sparkles } from "lucide-react";

const TYPE_META: Record<
  CardTemplate["type"],
  { label: string; color: string; icon: typeof Sword }
> = {
  military: { label: "军事", color: "text-vermillion-400 border-vermillion-500/40", icon: Sword },
  economic: { label: "经济", color: "text-gold-300 border-gold-500/40", icon: Coins },
  cultural: { label: "文化", color: "text-bronze-400 border-bronze-500/40", icon: Crown },
  diplomatic: { label: "外交", color: "text-parchment-200 border-parchment-300/30", icon: Handshake },
  event: { label: "事件", color: "text-gold-200 border-gold-300/50", icon: Sparkles },
};

interface CardItemProps {
  card: CardTemplate;
  playable?: boolean;
  onPlay?: (card: CardTemplate) => void;
  compact?: boolean;
}

/** 卡牌卷轴 — 羊皮纸卷轴 + 鎏金封缄，卡牌即历史命题的可玩化封装 */
export function CardItem({ card, playable, onPlay, compact }: CardItemProps) {
  const meta = TYPE_META[card.type];
  const Icon = meta.icon;

  return (
    <motion.div
      whileHover={playable ? { y: -8, scale: 1.03 } : {}}
      whileTap={playable ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => playable && onPlay?.(card)}
      className={cn(
        "card-scroll group flex h-full w-full flex-col p-3",
        playable && "cursor-pointer hover:shadow-seal-hover"
      )}
    >
      {/* 顶部：类型印记 + 时代 */}
      <div className="flex items-center justify-between border-b border-gold-500/20 pb-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
            meta.color
          )}
        >
          <Icon size={10} />
          {meta.label}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-gold-500/60">
          {card.era}
        </span>
      </div>

      {/* 卡名 */}
      <div className="flex flex-1 flex-col py-2">
        <h3 className="gilt-title font-serif text-base leading-tight">{card.name}</h3>
        {!compact && card.flavor && (
          <p className="mt-1 font-serif text-[11px] italic leading-snug text-parchment-300/60">
            {card.flavor}
          </p>
        )}
      </div>

      {/* 消耗 */}
      <div className="flex flex-wrap items-center gap-2 border-t border-gold-500/20 pt-2">
        {card.cost.gold ? (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gold-300">
            <Coins size={10} /> {card.cost.gold}
          </span>
        ) : null}
        {card.cost.food ? (
          <span className="font-mono text-[10px] text-bronze-400">粮 {card.cost.food}</span>
        ) : null}
        {card.cost.prestige ? (
          <span className="font-mono text-[10px] text-parchment-200">威 {card.cost.prestige}</span>
        ) : null}
      </div>

      {/* 演化谱系标记 */}
      {card.evolvesFrom && (
        <div className="mt-1 font-mono text-[9px] text-gold-500/50">
          ← 演化自 {card.evolvesFrom.replace(/_/g, " ")}
        </div>
      )}

      {/* 历史原型（悬停展开） */}
      {!compact && card.historicalRef && (
        <div className="mt-2 hidden border-t border-gold-500/10 pt-2 font-serif text-[10px] italic leading-snug text-parchment-300/40 group-hover:block">
          {card.historicalRef}
        </div>
      )}
    </motion.div>
  );
}
