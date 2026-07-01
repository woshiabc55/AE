import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import type { GameEvent } from "@/types";
import { GitBranch, User, Bot, Scale, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_META: Record<GameEvent["source"], { icon: typeof User; color: string }> = {
  player: { icon: User, color: "text-gold-300" },
  ai: { icon: Bot, color: "text-vermillion-400" },
  rule: { icon: Scale, color: "text-bronze-400" },
  system: { icon: Cog, color: "text-parchment-300/60" },
};

/** 事件日志 — 右栏，编年史条目式滚动，含 causedBy 金线标记 */
export function EventLog() {
  const { eventLog } = useGameStore();
  return (
    <section className="chronicle-frame flex h-full flex-col p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-gold-500/20 pb-2">
        <GitBranch size={14} className="text-gold-300" />
        <h2 className="gilt-title font-serif text-sm uppercase tracking-widest">编年史</h2>
        <span className="ml-auto font-mono text-[9px] text-parchment-300/40">
          {eventLog.length} 条
        </span>
      </div>
      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {eventLog.map((event) => (
            <EventEntry key={event.id} event={event} />
          ))}
        </AnimatePresence>
        {eventLog.length === 0 && (
          <p className="font-serif text-xs italic text-parchment-300/40">
            历史的卷轴尚未展开…
          </p>
        )}
      </div>
    </section>
  );
}

function EventEntry({ event }: { event: GameEvent }) {
  const meta = SOURCE_META[event.source];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="chronicle-entry group relative"
    >
      <div className="flex items-start gap-2">
        <Icon size={11} className={cn("mt-0.5 shrink-0", meta.color)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-gold-500/60">
              T{event.turn}
            </span>
            <span className="font-mono text-[9px] text-parchment-300/40">{event.type}</span>
          </div>
          {event.narrative && (
            <p className="mt-0.5 font-serif text-xs leading-snug text-parchment-200/85">
              {event.narrative}
            </p>
          )}
          {event.causedBy && (
            <div className="mt-1 flex items-center gap-1 font-mono text-[9px] text-gold-500/40">
              <span className="h-px w-3 bg-gold-500/30" />
              因承 {event.causedBy.slice(-8)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
