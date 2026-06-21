import { useStudioStore } from "@/stores/studioStore";
import { Play, Pause, Square, Plus, SkipBack, SkipForward } from "lucide-react";

export default function Timeline() {
  const {
    keyframes,
    currentFrame,
    animLength,
    fps,
    loop,
    isPlaying,
    setPlaying,
    goToFrame,
    addKeyframe,
    removeKeyframe,
    setFps,
    setAnimLength,
    toggleLoop,
  } = useStudioStore();

  const sortedKfs = [...keyframes].sort((a, b) => a.frame - b.frame);

  return (
    <div className="flex h-28 flex-col border-t border-ink-600 bg-ink-800/95 px-3 py-2">
      {/* 控制条 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToFrame(0)}
          className="tool-btn h-7 w-7"
          title="回到起点"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setPlaying(!isPlaying)}
          disabled={keyframes.length < 2}
          className="btn-bead btn-bead-primary h-7 w-7 p-0"
          title={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            goToFrame(0);
          }}
          className="tool-btn h-7 w-7"
          title="停止"
        >
          <Square className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => goToFrame(animLength)}
          className="tool-btn h-7 w-7"
          title="跳到结尾"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>

        <div className="mx-2 h-5 w-px bg-ink-600" />

        <button
          onClick={addKeyframe}
          className="btn-bead btn-bead-volt h-7 px-2 py-0 text-[10px]"
          title="在当前帧添加关键帧"
        >
          <Plus className="h-3 w-3" />
          关键帧
        </button>

        <div className="mx-2 h-5 w-px bg-ink-600" />

        {/* FPS */}
        <label className="flex items-center gap-1 font-mono text-[10px] text-ink-400">
          FPS
          <select
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className="rounded bg-ink-700 px-1 py-0.5 text-cream"
          >
            {[6, 8, 12, 15, 24, 30].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        {/* 长度 */}
        <label className="flex items-center gap-1 font-mono text-[10px] text-ink-400">
          LEN
          <input
            type="number"
            min={1}
            max={120}
            value={animLength}
            onChange={(e) => setAnimLength(Number(e.target.value))}
            className="w-12 rounded bg-ink-700 px-1 py-0.5 text-cream"
          />
        </label>

        <button
          onClick={toggleLoop}
          className={`chip ${loop ? "chip-mint" : ""}`}
          title="循环"
        >
          {loop ? "LOOP" : "ONCE"}
        </button>

        <div className="ml-auto font-mono text-[10px] text-ink-400">
          帧 <span className="text-volt">{currentFrame}</span> / {animLength}
        </div>
      </div>

      {/* 时间轴轨道 */}
      <div className="relative mt-2 flex-1 overflow-hidden rounded-bead border border-ink-600 bg-ink-900">
        {/* 帧刻度 */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: animLength + 1 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-ink-700/50"
              style={{ minWidth: 4 }}
            >
              {i % Math.max(1, Math.floor(animLength / 12)) === 0 && (
                <span className="block px-0.5 font-mono text-[8px] text-ink-500">
                  {i}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 关键帧标记 */}
        {sortedKfs.map((kf) => {
          const left = (kf.frame / animLength) * 100;
          return (
            <button
              key={kf.id}
              onClick={() => goToFrame(kf.frame)}
              onContextMenu={(e) => {
                e.preventDefault();
                removeKeyframe(kf.id);
              }}
              className="group absolute top-3 z-10 -translate-x-1/2"
              style={{ left: `${left}%` }}
              title={`帧 ${kf.frame}（右键删除）`}
            >
              <div className="h-3 w-3 rotate-45 bg-coral shadow-glow-coral transition-transform group-hover:scale-125" />
            </button>
          );
        })}

        {/* 当前帧游标 */}
        <div
          className="absolute top-0 z-20 h-full w-0.5 bg-volt shadow-glow"
          style={{ left: `${(currentFrame / animLength) * 100}%` }}
        >
          <div className="absolute -top-0 -left-1.5 h-3 w-3 rotate-45 bg-volt" />
        </div>

        {/* 点击轨道跳转 */}
        <input
          type="range"
          min={0}
          max={animLength}
          value={currentFrame}
          onChange={(e) => goToFrame(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="mt-1 flex items-center gap-2 font-mono text-[9px] text-ink-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rotate-45 bg-coral" />
          关键帧（点击跳转 / 右键删除）
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-volt" />
          当前帧
        </span>
        <span className="ml-auto">
          {sortedKfs.length} 个关键帧
        </span>
      </div>
    </div>
  );
}
