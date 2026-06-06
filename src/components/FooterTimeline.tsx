import { motion } from "framer-motion";
import { shots, projectMeta } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface FooterTimelineProps {
  activeShotId: ShotId;
  scrollProgress: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onJump: (id: ShotId) => void;
}

// 底部 PPT 风格时间轴 — 大圆点 + 进度条
export default function FooterTimeline({
  activeShotId,
  scrollProgress,
  isMuted,
  onToggleMute,
  onJump,
}: FooterTimelineProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-abyss/90 backdrop-blur-sm border-t border-bone/15">
      <div className="px-12 py-3 flex items-center gap-8">
        {/* 左侧：音频开关 + 当前时间码 */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={onToggleMute}
            className="font-mono text-[10px] text-fog hover:text-bone tracking-widest flex items-center gap-2 transition-colors"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isMuted ? "bg-fog/50" : "bg-blood"}`} />
            AUDIO · {isMuted ? "OFF" : "ON"}
          </button>
          <div className="w-px h-3 bg-bone/15" />
          <div className="font-mono text-[10px] text-bone tracking-widest">
            {shots.find((s) => s.id === activeShotId)?.timecode.start}
            <span className="text-fog/40 mx-1">/</span>
            <span className="text-fog/60">{projectMeta.timecode}</span>
          </div>
        </div>

        {/* 中部：PPT 风格时间轴 */}
        <div className="flex-1 relative h-8 flex items-center">
          {/* 进度条底 */}
          <div className="absolute left-0 right-0 h-px bg-bone/15" />
          {/* 进度条填充 */}
          <motion.div
            className="absolute left-0 h-px bg-blood"
            style={{ width: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.2 }}
          />
          {/* 5 镜头大圆点 */}
          {shots.map((shot, i) => {
            const isActive = shot.id === activeShotId;
            const passed = shots.findIndex(s => s.id === activeShotId) > i;
            return (
              <button
                key={shot.id}
                onClick={() => onJump(shot.id)}
                className="absolute group/dot"
                style={{ left: `${(i / (shots.length - 1)) * 100}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    isActive
                      ? "bg-blood border-blood scale-150"
                      : passed
                      ? "bg-bone/40 border-bone/40"
                      : "bg-abyss border-fog/40 group-hover/dot:border-bone"
                  }`}
                />
                {/* 标签 — 鼠标悬停时显示 */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity">
                  <div className="font-mono text-[9px] text-bone tracking-widest">
                    SHOT {shot.index}
                  </div>
                  <div className="font-mono text-[8px] text-fog tracking-widest">
                    {shot.timecode.start}
                  </div>
                </div>
                {/* 当前活动镜头 — 持续显示 */}
                {isActive && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="font-mono text-[9px] text-blood tracking-widest">
                      ▾ SHOT {shot.index}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧：进度百分比 + 总时长 */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="font-mono text-[10px] text-bone tracking-widest tabular-nums">
            {Math.round(scrollProgress * 100).toString().padStart(2, "0")}%
          </div>
          <div className="w-px h-3 bg-bone/15" />
          <div className="font-mono text-[10px] text-fog tracking-widest">
            {projectMeta.duration}.00s
          </div>
        </div>
      </div>
    </footer>
  );
}
