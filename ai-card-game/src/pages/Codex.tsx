import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CARD_TEMPLATES, evolutionChain } from "@/game/cards";
import { ERA_ORDER, ERA_LABELS } from "@/types";
import type { Era, CardType } from "@/types";
import { SealButton } from "@/components/common/SealButton";
import { CardItem } from "@/components/game/CardItem";
import { motion } from "framer-motion";
import { BookOpen, Home, GitBranch, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_FILTERS: { value: CardType | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "military", label: "军事" },
  { value: "economic", label: "经济" },
  { value: "cultural", label: "文化" },
  { value: "event", label: "事件" },
];

/** 卡牌图鉴 — 演化树 + 语义网络 + 历史原型注解 */
export default function Codex() {
  const navigate = useNavigate();
  const [era, setEra] = useState<Era | "all">("all");
  const [type, setType] = useState<CardType | "all">("all");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      CARD_TEMPLATES.filter(
        (c) => (era === "all" || c.era === era) && (type === "all" || c.type === type)
      ),
    [era, type]
  );

  const chain = selectedCard ? evolutionChain(selectedCard) : [];

  return (
    <div className="flex min-h-screen flex-col px-4 py-4">
      <header className="chronicle-frame mb-4 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gold-300" />
          <h1 className="gilt-title font-serif text-2xl">卡牌图鉴</h1>
          <span className="font-mono text-[10px] uppercase tracking-wider text-gold-500/60">
            Codex · {CARD_TEMPLATES.length} 张 · 卡牌即历史命题
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SealButton onClick={() => navigate("/chronicle")} className="px-3 py-1.5 text-xs">
            <Network size={12} /> 因果图
          </SealButton>
          <SealButton onClick={() => navigate("/")} className="px-3 py-1.5 text-xs">
            <Home size={12} /> 返回
          </SealButton>
        </div>
      </header>

      {/* 筛选 */}
      <div className="chronicle-frame mb-4 flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
            时代
          </span>
          <div className="flex border border-gold-500/30">
            {[{ value: "all" as const, label: "全部" }, ...ERA_ORDER.map((e) => ({ value: e, label: ERA_LABELS[e] }))].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEra(opt.value as Era | "all")}
                className={cn(
                  "px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                  era === opt.value
                    ? "bg-gold-500/20 text-gold-200"
                    : "text-parchment-300/60 hover:text-gold-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
            类型
          </span>
          <div className="flex border border-gold-500/30">
            {TYPE_FILTERS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={cn(
                  "px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                  type === opt.value
                    ? "bg-gold-500/20 text-gold-200"
                    : "text-parchment-300/60 hover:text-gold-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* 卡牌网格 */}
        <section className="chronicle-frame scroll-cap flex max-h-[calc(100vh-220px)] flex-col p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
            <span className="gilt-title font-serif text-sm uppercase tracking-widest">卡牌卷</span>
            <span className="ml-auto font-mono text-[9px] text-parchment-300/40">
              {filtered.length} / {CARD_TEMPLATES.length}
            </span>
          </div>
          <div className="scroll-gilt grid flex-1 grid-cols-2 gap-3 overflow-y-auto pr-2 md:grid-cols-3">
            {filtered.map((card) => (
              <div key={card.id} className="h-56">
                <CardItem
                  card={card}
                  onPlay={(c) => setSelectedCard(c.id)}
                  playable={selectedCard !== card.id}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 演化树 */}
        <aside className="chronicle-frame scroll-cap flex max-h-[calc(100vh-220px)] flex-col p-4">
          {selectedCard && chain.length > 0 ? (
            <motion.div
              key={selectedCard}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="scroll-gilt flex-1 overflow-y-auto pr-2"
            >
              <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
                <GitBranch size={14} className="text-gold-300" />
                <h3 className="gilt-title font-serif text-sm uppercase tracking-widest">
                  演化谱系
                </h3>
              </div>
              <div className="flex flex-col gap-1">
                {chain.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center gap-2 border-l-2 px-2 py-1.5",
                      c.id === selectedCard
                        ? "border-gold-300 bg-gold-500/10"
                        : "border-gold-500/30 bg-ink-900/40"
                    )}
                  >
                    <span className="font-mono text-[9px] text-gold-500/50">{i + 1}</span>
                    <span className="gilt-title font-serif text-sm">{c.name}</span>
                    <span className="ml-auto font-mono text-[9px] text-parchment-300/40">
                      {ERA_LABELS[c.era]}
                    </span>
                  </div>
                ))}
              </div>

              {/* 语义网络 */}
              <div className="mt-4 border-t border-gold-500/20 pt-3">
                <h4 className="gilt-title font-serif text-xs uppercase tracking-widest">
                  语义关系
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CARD_TEMPLATES.find((c) => c.id === selectedCard)?.semanticEdges.map(
                    (edge) => (
                      <span
                        key={edge.to + edge.relation}
                        className="inline-flex items-center gap-1 border border-gold-500/20 bg-ink-900/60 px-2 py-1 font-mono text-[9px] text-parchment-300/70"
                      >
                        {edge.relation}
                        <span className="text-gold-300">→</span>
                        {edge.to.replace(/_/g, " ")}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* 历史原型 */}
              {CARD_TEMPLATES.find((c) => c.id === selectedCard)?.historicalRef && (
                <div className="mt-4 border-t border-gold-500/20 pt-3">
                  <h4 className="gilt-title font-serif text-xs uppercase tracking-widest">
                    历史原型
                  </h4>
                  <p className="mt-2 font-serif text-xs italic leading-relaxed text-parchment-300/70">
                    {CARD_TEMPLATES.find((c) => c.id === selectedCard)?.historicalRef}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <GitBranch size={24} className="text-gold-500/40" />
              <p className="font-serif text-xs italic text-parchment-300/50">
                点击卡牌
                <br />
                查看演化谱系与历史原型
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
