import { shots, projectMeta } from "@/data/shots";
import type { ShotId } from "@/data/shots";

interface FooterTimelineProps {
  activeShotId: ShotId;
  scrollProgress: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onJump: (id: ShotId) => void;
}

export default function FooterTimeline({
  activeShotId,
  scrollProgress,
  isMuted,
  onToggleMute,
  onJump,
}: FooterTimelineProps) {
  const total = projectMeta.duration;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-abyss/85 backdrop-blur-sm border-t border-bone/10">
      <div className="px-6 py-3 flex items-center gap-4">
        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className="font-mono text-[10px] text-fog/70 hover:text-bone tracking-widest flex items-center gap-2"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isMuted ? "bg-fog/50" : "bg-blood"}`} />
          {isMuted ? "AUDIO · OFF" : "AUDIO · ON"}
        </button>

        {/* Time display */}
        <div className="font-mono text-[10px] text-bone tracking-widest">
          {shots.find((s) => s.id === activeShotId)?.timecode.start}{" "}
          <span className="text-fog/50">/ {projectMeta.timecode}</span>
        </div>

        {/* Timeline track */}
        <div className="flex-1 relative h-6 flex items-center group">
          {/* Base line */}
          <div className="absolute left-0 right-0 h-px bg-bone/20" />
          {/* Progress */}
          <div
            className="absolute left-0 h-px bg-blood"
            style={{ width: `${scrollProgress * 100}%` }}
          />
          {/* Shot markers */}
          {shots.map((shot) => {
            const startPct = ((shot.timecode.start === "3:00" ? 0 : parseInt(shot.timecode.start.split(":")[1]) - 0) / total) * 100;
            return (
              <button
                key={shot.id}
                onClick={() => onJump(shot.id)}
                className="absolute group/mark"
                style={{ left: `${startPct}%`, transform: "translateX(-50%)" }}
                title={`Shot ${shot.index} · ${shot.timecode.start}`}
              >
                <div
                  className={`w-2 h-2 rotate-45 border ${
                    shot.id === activeShotId
                      ? "bg-blood border-blood scale-150"
                      : "bg-abyss border-bone/50 group-hover/mark:border-bone"
                  } transition-all`}
                />
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-fog/70 tracking-widest opacity-0 group-hover/mark:opacity-100 transition-opacity">
                  {shot.index}
                </div>
              </button>
            );
          })}
        </div>

        {/* End mark */}
        <div className="font-mono text-[10px] text-fog/50 tracking-widest">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>
    </footer>
  );
}
