import { motion } from "framer-motion";
import { shots } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface ZAxisIndicatorProps {
  activeShotId: ShotId;
  scrollProgress: number;
}

// 3D 立体深度指示器 — 5 个圆球在 Z 轴上排列
// 模拟"摄影机下沉到海沟"的视觉
export default function ZAxisIndicator({ activeShotId }: ZAxisIndicatorProps) {
  const activeIdx = shots.findIndex((s) => s.id === activeShotId);
  const maxDepth = 3800;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:block"
      style={{ perspective: "1500px" }}
    >
      <div className="relative" style={{ transformStyle: "preserve-3d", height: "75vh", width: "120px" }}>
        {/* 顶部标签 */}
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-between">
          <div className="font-mono text-[8px] text-fog/50 tracking-widest">CAM PATH</div>
          <div className="font-mono text-[8px] text-rust/80 tracking-widest">Z-AXIS</div>
        </div>

        {/* 中心线 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-sun/40 via-bone/20 to-rust/40" />

        {/* 5 镜头 Z 轴节点 */}
        {shots.map((shot, i) => {
          const y = shot.altitude
            ? 5
            : 15 + (Math.abs(shot.depth) / maxDepth) * 75;
          const z = shot.depth === 0 ? 20 : -Math.abs(shot.depth) / 200; // 越深越靠后
          const isActive = shot.id === activeShotId;
          const isPast = activeIdx > i;

          return (
            <div
              key={shot.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: `${y}%`,
                transform: `translate(-50%, 0) translateZ(${z}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* 节点圆球 */}
              <div className="relative">
                {/* 投影 */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: "16px",
                    height: "16px",
                    background: isActive
                      ? "rgba(201, 90, 43, 0.3)"
                      : "rgba(0, 0, 0, 0.3)",
                    filter: "blur(6px)",
                    transform: "translateY(8px) scale(1.5)",
                  }}
                />
                {/* 主球体 */}
                <div
                  className="rounded-full transition-all"
                  style={{
                    width: isActive ? "20px" : "14px",
                    height: isActive ? "20px" : "14px",
                    background: isActive
                      ? "radial-gradient(circle at 30% 30%, #FFB280 0%, #C95A2B 40%, #5C1A08 100%)"
                      : isPast
                      ? "radial-gradient(circle at 30% 30%, #B0B0B0 0%, #404040 60%, #1A1A1A 100%)"
                      : "radial-gradient(circle at 30% 30%, #2A2A2A 0%, #0A0A0A 100%)",
                    boxShadow: isActive
                      ? "0 0 24px rgba(201, 90, 43, 0.7), inset 0 2px 0 rgba(255, 200, 150, 0.5), inset 0 -2px 0 rgba(0, 0, 0, 0.5)"
                      : isPast
                      ? "inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.5)"
                      : "inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.5)",
                    border: isActive ? "1px solid rgba(255, 200, 150, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full border-2 border-rust/60"
                    style={{ animation: "ping 1.5s ease-out infinite" }}
                  />
                )}
              </div>

              {/* 标签 */}
              <div
                className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-widest whitespace-nowrap ${
                  isActive ? "text-rust font-bold" : isPast ? "text-fog/60" : "text-fog/30"
                }`}
                style={{
                  textShadow: isActive ? "0 0 12px rgba(201, 90, 43, 0.6)" : "none",
                }}
              >
                SHOT {String(shot.index).padStart(2, "0")}
                <div className="text-[7px] mt-0.5 opacity-70">
                  {shot.altitude ? `+${shot.altitude}M` : `${shot.depth}M`}
                </div>
              </div>
            </div>
          );
        })}

        {/* 当前活动深度读数 */}
        {activeIdx >= 0 && (
          <motion.div
            key={activeShotId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute -left-8 top-1/2 -translate-y-1/2 glass-rust rounded px-2 py-1 text-right"
            style={{ transform: "translate(-100%, -50%)" }}
          >
            <div className="font-mono text-[8px] text-rust tracking-widest">DEPTH</div>
            <div className="numeral text-bone text-sm">
              {shots[activeIdx].altitude
                ? `+${shots[activeIdx].altitude}`
                : shots[activeIdx].depth}
            </div>
            <div className="font-mono text-[7px] text-fog tracking-widest">METERS</div>
          </motion.div>
        )}

        {/* 底部 — 海沟标识 */}
        <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-between">
          <div className="font-mono text-[8px] text-rust/60 tracking-widest">▼ TRENCH</div>
          <div className="font-mono text-[8px] text-fog/40 tracking-widest">-3800M</div>
        </div>
      </div>
    </motion.aside>
  );
}
