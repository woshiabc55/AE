import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { EraBanner } from "@/components/game/EraBanner";
import { FactionPanel } from "@/components/game/FactionPanel";
import { EventLog } from "@/components/game/EventLog";
import { HandArea } from "@/components/game/HandArea";
import { FeedbackIndicator } from "@/components/game/FeedbackIndicator";
import { DialogueOverlay } from "@/components/dialogue/DialogueOverlay";
import { SealButton } from "@/components/common/SealButton";
import { registerNPC, getNPC } from "@/systems/dialogueSystem";
import { NPC_TEMPLATES } from "@/game/factions";
import type { NPCModel } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { FastForward, MessageCircle, BookOpen, Network, Home } from "lucide-react";

/** 主游戏界面 — 编年史册式布局，左右分栏 + 底部手牌 */
export default function Game() {
  const navigate = useNavigate();
  const { ctx, busy, lastMessage, doAdvanceTurn, doStartDialogue } = useGameStore();

  // 进入对局时注册 NPC
  useEffect(() => {
    if (!ctx) {
      navigate("/");
      return;
    }
    const npcId = "npc_fanju";
    if (!getNPC(npcId)) {
      const tpl = NPC_TEMPLATES[0];
      const npc: NPCModel = {
        id: npcId,
        persona: { ...tpl.persona },
        goals: tpl.goals.map((g) => ({ ...g })),
        secrets: tpl.secrets.map((s) => ({ ...s, revealedTo: [] })),
        memory: { facts: [], summary: "", relationship: {} },
        theoryOfMind: {},
      };
      registerNPC(npc);
    }
  }, [ctx, navigate]);

  if (!ctx) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden px-4 py-4">
      <EraBanner />

      {/* 主体：左右分栏 */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px]">
        <FactionPanel />

        {/* 中央：状态 + 控制 */}
        <main className="scroll-gilt flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          <FeedbackIndicator />

          {/* 消息提示 */}
          <AnimatePresence mode="wait">
            {lastMessage && (
              <motion.div
                key={lastMessage}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="chronicle-frame border-vermillion-500/30 px-4 py-2"
              >
                <p className="vermillion-note text-sm">{lastMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 回合控制 */}
          <div className="chronicle-frame flex flex-wrap items-center gap-3 p-4">
            <SealButton
              variant="primary"
              onClick={() => doAdvanceTurn()}
              disabled={busy}
              className="px-6 py-2.5"
            >
              <FastForward size={14} /> 推进回合
            </SealButton>
            <SealButton
              onClick={() => doStartDialogue("npc_fanju")}
              disabled={busy}
              className="px-4 py-2.5"
            >
              <MessageCircle size={14} /> 与谋士对话
            </SealButton>
            <div className="ml-auto flex items-center gap-2">
              <SealButton onClick={() => navigate("/chronicle")} className="px-3 py-2 text-xs">
                <Network size={12} /> 因果图
              </SealButton>
              <SealButton onClick={() => navigate("/codex")} className="px-3 py-2 text-xs">
                <BookOpen size={12} /> 图鉴
              </SealButton>
              <SealButton onClick={() => navigate("/")} className="px-3 py-2 text-xs">
                <Home size={12} /> 退出
              </SealButton>
            </div>
          </div>

          {/* 设计哲学说明 */}
          <div className="chronicle-frame flex-1 p-4">
            <h3 className="gilt-title mb-2 font-serif text-sm uppercase tracking-widest">
              涌现 · 约束 · 演化
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
              <PhilCard
                title="涌现"
                desc="AI 生成有创意的提议（变异源）。无 LLM 时走规则兜底。"
                tag="非确定"
              />
              <PhilCard
                title="约束"
                desc="规则引擎三重校验：合法性 / 因果一致性 / 反馈结构。"
                tag="完全确定"
              />
              <PhilCard
                title="演化"
                desc="事件溯源累积历史，因果图谱留痕，可重放可回滚。"
                tag="可复现"
              />
            </div>
          </div>
        </main>

        <EventLog />
      </div>

      {/* 底部手牌 */}
      <div className="mt-4">
        <HandArea />
      </div>

      {/* 对话叠加层 */}
      <DialogueOverlay />
    </div>
  );
}

function PhilCard({
  title,
  desc,
  tag,
}: {
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <div className="border border-gold-500/20 bg-ink-900/50 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="gilt-title font-serif text-base">{title}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-bronze-400">
          {tag}
        </span>
      </div>
      <p className="font-serif text-[11px] italic leading-snug text-parchment-300/60">
        {desc}
      </p>
    </div>
  );
}
