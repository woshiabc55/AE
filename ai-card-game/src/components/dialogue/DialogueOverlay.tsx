import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { SealButton } from "@/components/common/SealButton";
import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

/** 对话界面 — NPC 卷轴 + 对话气泡羊皮纸条目 + 选项分支 */
export function DialogueOverlay() {
  const { currentDialogue, activeNPCId, busy, doChooseOption, closeDialogue } = useGameStore();
  const [revealSecret, setRevealSecret] = useState(false);

  return (
    <AnimatePresence>
      {currentDialogue && activeNPCId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm"
          onClick={closeDialogue}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="chronicle-frame relative w-full max-w-2xl bg-ink-900/95 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDialogue}
              className="absolute right-3 top-3 text-parchment-300/50 transition-colors hover:text-gold-300"
            >
              <X size={18} />
            </button>

            {/* NPC 卷轴立绘位 */}
            <div className="mb-4 flex items-center gap-4 border-b border-gold-500/20 pb-3">
              <div className="flex h-16 w-16 items-center justify-center border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-950">
                <span className="gilt-title font-serif text-2xl">
                  {currentDialogue.speaker.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="gilt-title font-serif text-lg">{currentDialogue.speaker}</h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gold-500/60">
                  NPC · 对话博弈方
                </p>
              </div>
            </div>

            {/* 对话气泡 */}
            <div className="mb-4 chronicle-entry border-gold-300/40">
              <p className="font-serif text-sm italic leading-relaxed text-parchment-200/90">
                "{currentDialogue.text}"
              </p>
            </div>

            {/* 选项分支 */}
            <div className="scroll-vermillion flex max-h-[40vh] flex-col gap-2 overflow-y-auto pr-1">
              {currentDialogue.options?.map((option) => (
                <button
                  key={option.id}
                  disabled={busy}
                  onClick={() => doChooseOption(option.id)}
                  className="group flex items-center justify-between border border-gold-500/20 bg-ink-800/60 px-4 py-2.5 text-left transition-all hover:border-gold-300/60 hover:bg-gold-500/5 disabled:opacity-50"
                >
                  <span className="font-serif text-sm text-parchment-200/90 group-hover:text-gold-200">
                    {option.text}
                  </span>
                  <span className="flex items-center gap-2">
                    {option.asymmetricInfo && (
                      <span
                        className="font-mono text-[9px] text-vermillion-400/70"
                        title="信息不对称：玩家未知的信息"
                      >
                        {revealSecret ? <Eye size={11} /> : <EyeOff size={11} />}
                      </span>
                    )}
                    {option.consequences && (
                      <span className="font-mono text-[9px] text-parchment-300/40">
                        → {option.consequences}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gold-500/20 pt-3">
              <SealButton
                onClick={() => setRevealSecret((v) => !v)}
                className="px-3 py-1 text-xs"
              >
                <Eye size={12} /> {revealSecret ? "隐藏" : "洞察"}信息
              </SealButton>
              {revealSecret && currentDialogue.options && (
                <span className="font-serif text-xs italic text-vermillion-400/80">
                  {currentDialogue.options.find((o) => o.asymmetricInfo)?.asymmetricInfo ??
                    "无可揭露之秘。"}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
