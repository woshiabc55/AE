// 动画时间轴与播放控制 — 支持动画片段、可拉伸缩放、动作表

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Plus, Trash2, Repeat, SkipBack, SkipForward, ZoomIn, ZoomOut, Film, ChevronDown } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import { samplePose, sortKeyframes } from "@/engine/animation";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";

const MIN_DURATION = 1000;
const MAX_DURATION = 8000;

export const Timeline = memo(function Timeline() {
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
  const animationClips = useArtworkStore((s) => s.animationClips);
  const activeClipId = useArtworkStore((s) => s.activeClipId);
  const addClip = useArtworkStore((s) => s.addClip);
  const removeClip = useArtworkStore((s) => s.removeClip);
  const renameClip = useArtworkStore((s) => s.renameClip);
  const setActiveClip = useArtworkStore((s) => s.setActiveClip);

  const [playbackDuration, setPlaybackDuration] = useState(3000);
  const [showClipMenu, setShowClipMenu] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const sortedKfs = sortKeyframes(keyframes);
  const activeClip = animationClips.find((c) => c.id === activeClipId);

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
      const advance = dt / playbackDuration;
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
  }, [isPlaying, loop, playbackDuration, setCurrentTime, setPose, setPlaying]);

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
      {/* 动画片段选择 */}
      <div className="relative">
        <button
          onClick={() => setShowClipMenu(!showClipMenu)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-ink-600 bg-ink-900/60 hover:bg-ink-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Film size={12} className="text-ember-400" />
            <span className="font-mono text-xs text-ink-200">
              {activeClip?.name ?? "默认动作"}
            </span>
            <span className="text-[10px] text-ink-500">
              ({sortedKfs.length} 帧)
            </span>
          </div>
          <ChevronDown
            size={12}
            className={cn("text-ink-400 transition-transform", showClipMenu && "rotate-180")}
          />
        </button>
        {showClipMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-ink-800 border border-ink-600 rounded-lg shadow-xl overflow-hidden">
            {animationClips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => {
                  setActiveClip(clip.id);
                  setShowClipMenu(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-ink-700/60 transition-colors",
                  clip.id === activeClipId && "bg-ember-500/15",
                )}
              >
                <span className="font-mono text-xs text-ink-200">{clip.name}</span>
                <span className="text-[10px] text-ink-500">{clip.keyframes.length} 帧</span>
              </div>
            ))}
            <div className="border-t border-ink-600/60 flex">
              <button
                onClick={() => {
                  addClip();
                  setShowClipMenu(false);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-mono text-mint-400 hover:bg-ink-700/60 transition-colors"
              >
                <Plus size={10} />
                新建片段
              </button>
              {animationClips.length > 1 && (
                <button
                  onClick={() => {
                    removeClip(activeClipId);
                    setShowClipMenu(false);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-mono text-red-400 hover:bg-ink-700/60 transition-colors border-l border-ink-600/60"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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

      {/* 时间轴伸缩控制 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-ink-300 font-mono uppercase tracking-wider">
          时间轴
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPlaybackDuration((d) => Math.max(MIN_DURATION, d - 500))}
            className="p-1 rounded hover:bg-ink-700 text-ink-400 hover:text-ink-200 transition-colors"
            title="缩短时间轴（加速）"
          >
            <ZoomIn size={12} />
          </button>
          <span className="text-[10px] text-ember-400 font-mono min-w-[40px] text-center">
            {(playbackDuration / 1000).toFixed(1)}s
          </span>
          <button
            onClick={() => setPlaybackDuration((d) => Math.min(MAX_DURATION, d + 500))}
            className="p-1 rounded hover:bg-ink-700 text-ink-400 hover:text-ink-200 transition-colors"
            title="拉长时间轴（减速）"
          >
            <ZoomOut size={12} />
          </button>
        </div>
      </div>

      {/* 时间轴轨道 */}
      <div>
        <div
          ref={trackRef}
          onMouseDown={handleTrackMouseDown}
          className="relative h-14 bg-ink-900 rounded-lg border border-ink-600 cursor-pointer overflow-hidden"
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
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
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

      {/* 关键帧动作表 */}
      {sortedKfs.length > 0 && (
        <div>
          <div className="text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
            动作表 ({sortedKfs.length} 帧)
          </div>
          <div className="space-y-1 max-h-52 overflow-auto">
            <div className="grid grid-cols-[28px_1fr_40px_28px] gap-1 text-[9px] text-ink-400 font-mono px-1">
              <span>#</span>
              <span>时间</span>
              <span>关节</span>
              <span></span>
            </div>
            {sortedKfs.map((kf, idx) => (
              <div
                key={kf.id}
                className={cn(
                  "grid grid-cols-[28px_1fr_40px_28px] gap-1 items-center px-2 py-1.5 rounded-lg border transition-all cursor-pointer",
                  Math.abs(kf.time - currentTime) < 0.02
                    ? "bg-ember-500/15 border-ember-500"
                    : "bg-ink-900/40 border-ink-600/40 hover:border-ink-500",
                )}
                onClick={() => handleScrub(kf.time)}
              >
                <span className="w-5 h-5 rounded bg-sun-500/20 text-sun-500 text-[10px] font-mono flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-mono text-xs text-ink-200">
                  {(kf.time * 100).toFixed(0)}% · {(kf.time * playbackDuration / 1000).toFixed(1)}s
                </span>
                <span className="font-mono text-[10px] text-ink-400">
                  {Object.keys(kf.jointPositions).length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeKeyframe(kf.id);
                  }}
                  className="text-ink-400 hover:text-red-400 transition-colors flex justify-center"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 当前姿态信息 */}
      <div className="bg-ink-900/40 rounded-lg p-2.5 border border-ink-600/30">
        <div className="text-[10px] text-ink-300 font-mono">
          当前姿态 · {Object.keys(currentPose).length} 个关节 · {playbackDuration / 1000}s 循环
        </div>
        <div className="text-[10px] text-ink-400 font-mono mt-1">
          {keyframes.length === 0
            ? "先拖拽关节摆出姿势，再点击「录制关键帧」"
            : "拖拽关节调整姿势，或拖动时间轴预览动画"}
        </div>
      </div>
    </div>
  );
});