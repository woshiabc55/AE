import { motion } from "framer-motion";
import { shots } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface FilmStripProps {
  activeShotId: ShotId;
  onJump: (id: ShotId) => void;
}

// 底部胶片条 — 5 个镜头缩略的连续胶片 + 上下齿孔
// 比 FooterTimeline 更视觉化，类似电影胶片
export default function FilmStrip({ activeShotId, onJump }: FilmStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed left-12 right-12 z-30 pointer-events-none"
      style={{ bottom: "76px" }}
    >
      <div className="relative metal rounded-xl p-2 pointer-events-auto" style={{ perspective: "1500px", transform: "rotateX(8deg)" }}>
        {/* 顶部齿孔带 */}
        <div className="absolute top-1 left-2 right-2 flex justify-between pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`t-${i}`}
              className="w-2 h-1.5 rounded-sm bg-abyss/80"
              style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.5)" }}
            />
          ))}
        </div>

        {/* 5 格镜头缩略 */}
        <div className="grid grid-cols-5 gap-2 py-2.5">
          {shots.map((shot, i) => {
            const isActive = shot.id === activeShotId;
            const isPast = shots.findIndex(s => s.id === activeShotId) > i;
            return (
              <button
                key={shot.id}
                onClick={() => onJump(shot.id)}
                className="group relative"
              >
                {/* 缩略画面 */}
                <div
                  className="relative aspect-[3/2] rounded overflow-hidden border transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${shot.palette.bg} 0%, #050810 100%)`,
                    borderColor: isActive ? "rgba(230,57,70,0.6)" : isPast ? "rgba(232,232,232,0.2)" : "rgba(232,232,232,0.1)",
                    boxShadow: isActive
                      ? "0 0 16px rgba(230,57,70,0.4), inset 0 1px 0 rgba(255,200,200,0.2)"
                      : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  {/* 内部光晕 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at ${shot.gpsMark.x * 100}% ${shot.gpsMark.y * 100}%, ${shot.palette.accent}50 0%, transparent 50%)`,
                    }}
                  />
                  <div className="absolute inset-0 dot-grid-dense opacity-30" />
                  {/* motif */}
                  <div
                    className="absolute inset-0 flex items-center justify-center numeral"
                    style={{
                      color: shot.palette.accent,
                      fontSize: "20px",
                      textShadow: `0 0 8px ${shot.palette.accent}80`,
                    }}
                  >
                    {shot.motif}
                  </div>
                  {/* 镜号 */}
                  <div className="absolute top-0.5 left-1 font-mono text-[7px] text-bone/80 tracking-widest">
                    {String(shot.index).padStart(2, "0")}
                  </div>
                  {/* 时间码 */}
                  <div className="absolute bottom-0.5 right-1 font-mono text-[7px] text-fog/70 tracking-widest">
                    {shot.timecode.start}
                  </div>
                  {/* 活动标记 */}
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-blood animate-glow pointer-events-none" />
                  )}
                </div>
                {/* 标题 */}
                <div
                  className={`mt-1 text-center font-mono text-[8px] tracking-widest truncate ${
                    isActive ? "text-blood" : isPast ? "text-fog/60" : "text-fog/40"
                  }`}
                >
                  {shot.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* 底部齿孔带 */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`b-${i}`}
              className="w-2 h-1.5 rounded-sm bg-abyss/80"
              style={{ boxShadow: "inset 0 1px 0 rgba(0,0,0,0.5)" }}
            />
          ))}
        </div>

        {/* 胶片号 */}
        <div className="absolute -top-2 left-2 font-mono text-[7px] text-rust/60 tracking-widest bg-abyss/80 px-1 rounded">
          KODAK 5219 · 35MM
        </div>
        <div className="absolute -top-2 right-2 font-mono text-[7px] text-rust/60 tracking-widest bg-abyss/80 px-1 rounded">
          REEL A · 5 FRAMES
        </div>
      </div>
    </motion.div>
  );
}
