import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { shots } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface DepthRulerProps {
  activeShotId: ShotId;
}

// 右侧细条深度指示器 — 与左侧 ShotCard 的深度信息呼应
// 展示摄影机在整个序列中的垂直位置
export default function DepthRuler({ activeShotId }: DepthRulerProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const activeIdx = shots.findIndex((s) => s.id === activeShotId);
  const activeShot = shots[activeIdx];

  // 用对数刻度映射深度到位置
  const maxDepth = 3800;
  const depthToY = (d: number, altitude?: number) => {
    if (altitude) return 0.05;
    if (d === 0) return 0.15;
    return 0.15 + (Math.abs(d) / maxDepth) * 0.8;
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed right-2 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center"
      style={{ height: "75vh" }}
    >
      {/* 顶部标签 */}
      <div className="font-mono text-[8px] text-fog/50 tracking-widest mb-2">CAM PATH</div>

      {/* 标尺容器 */}
      <div className="relative flex-1 w-1 dot-grid-vignette">
        {/* 5 镜头位置点 */}
        {shots.map((shot, i) => {
          const y = depthToY(shot.depth, shot.altitude) * 100;
          const isActive = shot.id === activeShotId;
          return (
            <div
              key={shot.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${y}%` }}
            >
              <div className="relative">
                {/* 外环 */}
                <div
                  className={`w-3 h-3 rounded-full border transition-all ${
                    isActive
                      ? "border-blood bg-blood scale-150"
                      : i < activeIdx
                      ? "border-bone/60 bg-bone/20"
                      : "border-fog/40 bg-abyss"
                  }`}
                />
                {/* 活动时的脉冲环 */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border border-blood animate-ping" />
                )}
              </div>
              {/* 标签 */}
              <div
                className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest whitespace-nowrap ${
                  isActive ? "text-blood" : "text-fog/40"
                }`}
              >
                {String(shot.index).padStart(2, "0")}
              </div>
            </div>
          );
        })}

        {/* 当前活动镜头 — 深度读数 */}
        {activeShot && (
          <motion.div
            key={activeShot.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute -left-16 -translate-x-1/2 font-mono text-[10px] text-blood tracking-widest"
            style={{
              top: `${depthToY(activeShot.depth, activeShot.altitude) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <div className="text-right">
              <div className="numeral text-base">
                {activeShot.altitude ? `+${activeShot.altitude}` : activeShot.depth}
              </div>
              <div className="text-fog/60 text-[8px]">METERS</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部标签 */}
      <div className="font-mono text-[8px] text-fog/50 tracking-widest mt-2">▼ TRENCH</div>
    </motion.aside>
  );
}
