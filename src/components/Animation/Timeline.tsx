// 动画时间轴与播放控制

import { useCallback, useEffect, useRef } from "react";
import { Play, Pause, Plus, Trash2, Repeat, SkipBack, SkipForward } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import { samplePose, sortKeyframes } from "@/engine/animation";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";

const PLAYBACK_DURATION = 3000; // 3 秒一个循环

export function Timeline() {
  const isPlaying = useUIStore((s) => s.isPlaying);
  const setPlaying = useUIStore((s) => s.setPlaying);
  const currentTime = useUIStore((s) => s.currentTime);
  const setCurrentTime = useUIStore((s) => s.setCurrentTime);
  const loop = useUIStore((s) => s.loop);
  const toggleLoop = useUIStore((s) => s.toggleLoop);

  const keyframes = useArtworkStore((s) => s.keyframes);
  const currentPose = useArtworkStore((s) => s.currentPose);
  const setPose = useArtworkStore((s) => s.setPose);
  const addKeyframeAt = useArtworkStore((s) => s.addKeyframeAt);
  const removeKeyframe = useArtworkStore((s) => s.removeKeyframe);
  const resetPose = useArtworkStore((s) => s.resetPose);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const sortedKfs = sortKeyframes(keyframes);

  // 播放循环
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    lastTsRef.current = performance.now();
    const tick = (ts: number) => {
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      const advance = dt / PLAYBACK_DURATION;
      const uiState = useUIStore.getState();
      let next = uiState.currentTime + advance;
      if (next >= 1) {
        if (uiState.loop) {
          next = next % 1;
        } else {
          next = 1;
          setPlaying(false);
        }
      }
      setCurrentTime(next);
      const pose = samplePose(useArtworkStore.getState().keyframes, next);
      setPose(pose);
      if (useUIStore.getState().isPlaying) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, loop, setCurrentTime, setPose, setPlaying]);

  // 拖动时间轴时实时更新姿态
  const handleScrub = useCallback(
    (t: number) => {
      setCurrentTime(t);
      setPlaying(false);
      const pose = samplePose(keyframes, t);
      setPose(pose);
    },
    [setCurrentTime, setPlaying, keyframes, setPose],
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    updateFromEvent(e);
  };

  const updateFromEvent = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width;
    handleScrub(Math.max(0, Math.min(1, t)));
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width;
      handleScrub(Math.max(0, Math.min(1, t)));
    };
    const up = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [handleScrub]);

  return (
    <div className="p-3 space-y-3">
      {/* 播放控制 */}
      <div className="flex items-center gap-2">
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => {
            handleScrub(0);
            resetPose();
          }}
        >
          <SkipBack size={14} />
        </PixelButton>
        <PixelButton
          variant={isPlaying ? "primary" : "mint"}
          size="md"
          className="flex-1"
          onClick={() => setPlaying(!isPlaying)}
          disabled={keyframes.length === 0}
        >
          <span className="flex items-center justify-center gap-2">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "暂停" : "播放"}
          </span>
        </PixelButton>
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => {
            handleScrub(1);
          }}
        >
          <SkipForward size={14} />
        </PixelButton>
        <button
          onClick={toggleLoop}
          className={cn(
            "p-2 rounded-lg border transition-all",
            loop
              ? "bg-mint-500/20 border-mint-500 text-mint-400"
              : "bg-ink-700 border-ink-600 text-ink-300",
          )}
          title="循环播放"
        >
          <Repeat size={16} />
        </button>
      </div>

      {/* 时间轴轨道 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-ink-300 font-mono uppercase tracking-wider">
            时间轴
          </span>
          <span className="text-[10px] text-ember-400 font-mono">
            {(currentTime * 100).toFixed(0)}%
          </span>
        </div>
        <div
          ref={trackRef}
          onMouseDown={handleTrackMouseDown}
          className="relative h-12 bg-ink-900 rounded-lg border border-ink-600 cursor-pointer overflow-hidden"
        >
          {/* 进度条 */}
          <div
            className="absolute top-0 left-0 h-full bg-ember-500/15"
            style={{ width: `${currentTime * 100}%` }}
          />
          {/* 关键帧标记 */}
          {sortedKfs.map((kf, idx) => (
            <button
              key={kf.id}
              onClick={(e) => {
                e.stopPropagation();
                handleScrub(kf.time);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                removeKeyframe(kf.id);
              }}
              title={`关键帧 ${idx + 1} · ${(kf.time * 100).toFixed(0)}% (右键删除)`}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group"
              style={{ left: `${kf.time * 100}%` }}
            >
              <div className="w-3 h-3 rotate-45 bg-sun-500 border border-ink-900 group-hover:scale-125 transition-transform" />
            </button>
          ))}
          {/* 播放头 */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-ember-500 pointer-events-none"
            style={{ left: `${currentTime * 100}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-ember-500 rounded-full shadow-glow" />
          </div>
        </div>
        {/* 刻度 */}
        <div className="flex justify-between mt-1 text-[9px] text-ink-400 font-mono">
          <span>0</span>
          <span>0.25</span>
          <span>0.5</span>
          <span>0.75</span>
          <span>1</span>
        </div>
      </div>

      {/* 关键帧操作 */}
      <div className="flex gap-2">
        <PixelButton
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => addKeyframeAt(currentTime)}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Plus size={12} />
            录制关键帧 @ {(currentTime * 100).toFixed(0)}%
          </span>
        </PixelButton>
      </div>

      {/* 关键帧列表 */}
      {sortedKfs.length > 0 && (
        <div>
          <div className="text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
            关键帧列表 ({sortedKfs.length})
          </div>
          <div className="space-y-1 max-h-40 overflow-auto">
            {sortedKfs.map((kf, idx) => (
              <div
                key={kf.id}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer",
                  Math.abs(kf.time - currentTime) < 0.02
                    ? "bg-ember-500/15 border-ember-500"
                    : "bg-ink-900/40 border-ink-600/40 hover:border-ink-500",
                )}
                onClick={() => handleScrub(kf.time)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-sun-500/20 text-sun-500 text-[10px] font-mono flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-xs text-ink-200">
                    {(kf.time * 100).toFixed(0)}%
                  </span>
                  <span className="font-mono text-[10px] text-ink-400">
                    {Object.keys(kf.jointPositions).length} 关节
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeKeyframe(kf.id);
                  }}
                  className="text-ink-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 当前姿态信息 */}
      <div className="bg-ink-900/40 rounded-lg p-2.5 border border-ink-600/30">
        <div className="text-[10px] text-ink-300 font-mono">
          当前姿态 · {Object.keys(currentPose).length} 个关节
        </div>
        <div className="text-[10px] text-ink-400 font-mono mt-1">
          {keyframes.length === 0
            ? "先拖拽关节摆出姿势，再点击「录制关键帧」"
            : "拖拽关节调整姿势，或拖动时间轴预览动画"}
        </div>
      </div>
    </div>
  );
}
