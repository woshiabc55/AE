import { useGameStore } from "@/store/useGameStore";
import { CardItem } from "./CardItem";
import { SealButton } from "@/components/common/SealButton";
import { useGameStore as useStore } from "@/store/useGameStore";
import { Layers, Plus } from "lucide-react";

/** 手牌区 — 底部扇形手牌，卡牌为羊皮纸卷轴+鎏金封缄 */
export function HandArea() {
  const { hand, busy } = useGameStore();
  const doPlayCard = useStore((s) => s.doPlayCard);
  const doDrawCard = useStore((s) => s.doDrawCard);

  return (
    <section className="chronicle-frame relative p-4">
      <div className="mb-3 flex items-center justify-between border-b border-gold-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-gold-300" />
          <h2 className="gilt-title font-serif text-sm uppercase tracking-widest">手牌</h2>
          <span className="font-mono text-[10px] text-parchment-300/50">({hand.count})</span>
        </div>
        <SealButton
          onClick={() => doDrawCard(1)}
          disabled={busy}
          className="px-3 py-1 text-xs"
        >
          <Plus size={12} /> 抽牌
        </SealButton>
      </div>
      <div className="scroll-hand flex gap-3 overflow-x-auto pb-2">
        {hand.cards.length === 0 ? (
          <p className="py-6 font-serif text-xs italic text-parchment-300/40">
            手中空空，点击"抽牌"获取历史命题。
          </p>
        ) : (
          hand.cards.map((card) => (
            <div key={card.id} className="w-44 shrink-0">
              <CardItem card={card} playable={!busy} onPlay={(c) => doPlayCard(c.id)} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
