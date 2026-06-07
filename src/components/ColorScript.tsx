import { motion } from "framer-motion";
import { shots } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface ColorScriptProps {
  activeShotId: ShotId;
  onJump: (id: ShotId) => void;
}

// 色彩脚本条 — 横向 5 色块，色彩旅程
// 工业金属 + 渐变 + 镜号标注
export default function ColorScript({ activeShotId, onJump }: ColorScriptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="fixed left-3 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:block"
      style={{ writingMode: "vertical-rl" }}
    >
      <div className="flex items-center gap-1.5">
        {/* 标签 */}
        <div className="metal rounded px-1.5 py-3 flex flex-col items-center gap-1.5">
          <div className="font-mono text-[7px] text-rust/80 tracking-widest" style={{ writingMode: "horizontal-tb" }}>
            COLOR SCRIPT
          </div>
          <div className="font-mono text-[7px] text-fog/50 tracking-widest" style={{ writingMode: "horizontal-tb" }}>
            5 STOPS
          </div>
        </div>

        {/* 5 色块 — 横向排列（vertical-rl 反转后实际为竖向） */}
        <div className="flex flex-col gap-0.5">
          {shots.map((shot) => {
            const isActive = shot.id === activeShotId;
            return (
              <button
                key={shot.id}
                onClick={() => onJump(shot.id)}
                className="group relative"
                style={{ writingMode: "horizontal-tb" }}
              >
                <div
                  className={`w-10 h-10 rounded border transition-all ${
                    isActive ? "border-blood scale-110 shadow-rust" : "border-bone/20 hover:border-rust/60"
                  }`}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${shot.palette.accent} 0%, ${shot.palette.bg} 70%, #050810 100%)`,
                    boxShadow: isActive
                      ? `inset 0 1px 0 rgba(255,200,150,0.3), 0 0 16px ${shot.palette.accent}80, 0 4px 12px rgba(0,0,0,0.5)`
                      : "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 6px rgba(0,0,0,0.4)",
                  }}
                />
                {/* 镜号 */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 left-12 font-mono text-[8px] tracking-widest whitespace-nowrap transition-opacity ${
                    isActive ? "text-blood opacity-100" : "text-fog/60 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {String(shot.index).padStart(2, "0")} · {shot.altitude ? `+${shot.altitude}` : shot.depth}M
                </div>
                {/* 活动指针 */}
                {isActive && (
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 numeral text-blood text-sm">
                    ▸
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
