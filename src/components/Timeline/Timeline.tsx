import { useRef } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { formatTimeShort } from "@/utils/time";
import { Play } from "lucide-react";

export default function Timeline() {
  const {
    project,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
  } = useProjectStore();
  const trackRef = useRef<HTMLDivElement>(null);

  const duration = project.video.duration || 0;
  if (!duration) {
    return (
      <footer className="h-16 border-t border-line bg-panel/60 flex items-center justify-center text-xs text-dim">
        请先导入视频
      </footer>
    );
  }

  const ratio = (t: number) => Math.max(0, Math.min(1, t / duration));
  const onTrack = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const r = (clientX - rect.left) / rect.width;
    setCurrentTime(Math.max(0, Math.min(duration, r * duration)));
  };

  // 刻度
  const tickStep = duration > 120 ? 10 : duration > 30 ? 5 : 1;
  const ticks: number[] = [];
  for (let t = 0; t <= duration; t += tickStep) ticks.push(t);

  return (
    <footer className="border-t border-line bg-panel/60 animate-draw-x origin-left">
      {/* 顶部控制条 */}
      <div className="flex items-center gap-3 px-3 h-10 border-b border-line">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-7 h-7 rounded-full border border-mint text-mint hover:bg-mint hover:text-bg transition flex items-center justify-center"
        >
          {isPlaying ? (
            <span className="block w-2.5 h-2.5 border-l-2 border-r-2 border-current" />
          ) : (
            <Play size={11} className="ml-0.5" fill="currentColor" />
          )}
        </button>
        <div className="tabular text-xs text-fg">
          {formatTimeShort(currentTime)}
        </div>
        <div className="text-dim text-xs">/</div>
        <div className="tabular text-xs text-mute">
          {formatTimeShort(duration)}
        </div>
        <div className="ml-auto text-[10px] text-dim tracking-widest tabular">
          {project.video.width}×{project.video.height} ·{" "}
          {project.video.fps}fps
        </div>
      </div>

      {/* 时间轴主体 */}
      <div className="px-3 py-2 select-none">
        {/* 标尺 */}
        <div className="relative h-4 mb-1">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 h-3 border-l border-line"
              style={{ left: `${ratio(t) * 100}%` }}
            >
              <span className="absolute top-3.5 left-1 text-[9px] tabular text-dim">
                {formatTimeShort(t)}
              </span>
            </div>
          ))}
        </div>

        {/* 轨道 */}
        <div
          ref={trackRef}
          onClick={(e) => onTrack(e.clientX)}
          className="relative h-9 rounded bg-panel2 border border-line cursor-pointer overflow-hidden"
        >
          {/* 章节色块 */}
          {project.chapters.map((c) => (
            <div
              key={c.id}
              className="absolute top-1 bottom-1 rounded-sm flex items-center px-2"
              style={{
                left: `${ratio(c.start) * 100}%`,
                width: `${Math.max(0.5, ratio(c.end - c.start) * 100)}%`,
                background: c.color + "22",
                borderLeft: `2px solid ${c.color}`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(c.start);
              }}
            >
              <span
                className="text-[10px] font-semibold truncate"
                style={{ color: c.color }}
              >
                {c.title}
              </span>
            </div>
          ))}

          {/* 注释标记 */}
          {project.annotations.map((a) => (
            <div
              key={a.id}
              className="absolute top-0.5 w-1.5 h-1.5 rotate-45"
              style={{
                left: `${ratio(a.t) * 100}%`,
                background:
                  a.kind === "facial" ? "#FF5DA2" : "#7CFFB2",
                transform: "translateX(-50%) rotate(45deg)",
                boxShadow: "0 0 6px currentColor",
              }}
              title={a.kind === "bone" ? (a as any).label : (a as any).control}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(a.t);
              }}
            />
          ))}

          {/* 播放头 */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-mint pointer-events-none"
            style={{ left: `${ratio(currentTime) * 100}%` }}
          >
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-mint shadow-glow" />
            <div className="absolute top-0 bottom-0 -left-2 w-4 playhead-glow pointer-events-none" />
          </div>
        </div>
      </div>
    </footer>
  );
}
