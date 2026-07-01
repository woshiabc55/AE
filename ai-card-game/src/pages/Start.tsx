import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { FACTION_TEMPLATES } from "@/game/factions";
import { ERA_ORDER, ERA_LABELS } from "@/types";
import { ERAS } from "@/game/eras";
import { SealButton } from "@/components/common/SealButton";
import { cn } from "@/lib/utils";
import { ScrollText, Swords, BookOpen, FlaskConical } from "lucide-react";

/** 开始界面 — 时代卷轴 + 势力印章 + 落印开局 */
export default function Start() {
  const navigate = useNavigate();
  const startGame = useGameStore((s) => s.startGame);
  const [selectedEra, setSelectedEra] = useState<typeof ERA_ORDER[number]>("ancient");
  const [selectedFaction, setSelectedFaction] = useState<string>(FACTION_TEMPLATES[0].id);
  const [opponentCount, setOpponentCount] = useState(3);

  const handleStart = () => {
    startGame(selectedFaction, opponentCount);
    navigate("/game");
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-500/60">
            AI 驱动历史推演 · 卡牌即历史命题 · 对话即博弈
          </p>
          <h1 className="gilt-title mt-2 font-serif text-6xl">编年史</h1>
          <p className="mt-2 font-serif text-sm italic text-parchment-300/60">
            涌现 · 约束 · 演化 — 让 AI 负责涌现，让规则负责约束，让事件负责演化
          </p>
        </motion.div>

        {/* 时代卷轴 */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="chronicle-frame mb-6 p-5"
        >
          <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
            <ScrollText size={14} className="text-gold-300" />
            <h2 className="gilt-title font-serif text-sm uppercase tracking-widest">
              起始时代
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {ERA_ORDER.map((era) => {
              const def = ERAS[era];
              const selected = selectedEra === era;
              return (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={cn(
                    "group relative border p-3 text-left transition-all",
                    selected
                      ? "border-gold-300 bg-gold-500/10 shadow-seal"
                      : "border-gold-500/20 bg-ink-900/50 hover:border-gold-500/50"
                  )}
                >
                  <div className="gilt-title font-serif text-lg">{ERA_LABELS[era]}</div>
                  <p className="mt-1 font-serif text-[11px] italic leading-snug text-parchment-300/60">
                    {def.description}
                  </p>
                  {selected && (
                    <motion.div
                      layoutId="era-seal"
                      className="absolute -right-1 -top-1 h-3 w-3 rotate-45 bg-gold-300"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* 势力印章 */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="chronicle-frame mb-6 p-5"
        >
          <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
            <Swords size={14} className="text-gold-300" />
            <h2 className="gilt-title font-serif text-sm uppercase tracking-widest">
              选择势力
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {FACTION_TEMPLATES.map((f) => {
              const selected = selectedFaction === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFaction(f.id)}
                  className={cn(
                    "group relative flex flex-col border p-3 transition-all",
                    selected
                      ? "border-gold-300 bg-gold-500/10 shadow-seal"
                      : "border-gold-500/20 bg-ink-900/50 hover:border-gold-500/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rotate-45 border"
                      style={{ borderColor: f.color, background: f.color }}
                    />
                    <span className="gilt-title font-serif text-xl">{f.name}</span>
                  </div>
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-gold-500/60">
                    {f.title}
                  </span>
                  <p className="mt-1 font-serif text-[11px] italic leading-snug text-parchment-300/60">
                    {f.description}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* 配置 + 开局 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chronicle-frame flex flex-col items-center gap-4 p-5 md:flex-row md:justify-between"
        >
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
                对手数
              </span>
              <input
                type="range"
                min={1}
                max={3}
                value={opponentCount}
                onChange={(e) => setOpponentCount(Number(e.target.value))}
                className="accent-gold-300"
              />
              <span className="gilt-title font-serif text-lg">{opponentCount}</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <SealButton onClick={() => navigate("/codex")} className="px-4 py-2 text-xs">
              <BookOpen size={12} /> 卡牌图鉴
            </SealButton>
            <SealButton onClick={() => navigate("/chronicle")} className="px-4 py-2 text-xs">
              <FlaskConical size={12} /> 因果图谱
            </SealButton>
            <SealButton
              variant="primary"
              onClick={handleStart}
              className="px-8 py-2.5"
            >
              落印开局
            </SealButton>
          </div>
        </motion.section>

        <p className="mt-6 text-center font-mono text-[10px] text-parchment-300/30">
          无 LLM 端点时自动走规则兜底，保证纯规则路径可复现
        </p>
      </div>
    </div>
  );
}
