import { Play, Pause, Square, Repeat, Repeat1, ZoomIn, ZoomOut } from 'lucide-react';
import { useTimelineStore } from '../../store/useTimelineStore';

interface Props {
  frameW: number;
  setFrameW: (w: number) => void;
}

export default function PlaybackControls({ frameW, setFrameW }: Props) {
  const {
    currentFrame, totalFrames, isPlaying, isLooping, fps,
    togglePlay, setIsPlaying, toggleLoop, setCurrentFrame,
  } = useTimelineStore();

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const zoomIn = () => setFrameW(Math.min(40, frameW + 2));
  const zoomOut = () => setFrameW(Math.max(4, frameW - 2));

  return (
    <div className="flex items-center gap-2 px-3 h-9 border-b border-white/10 shrink-0">
      {/* 播放/暂停 */}
      <button
        title={isPlaying ? '暂停' : '播放'}
        onClick={togglePlay}
        className="p-1.5 rounded text-gray-300 hover:text-[#00e5ff] hover:bg-white/10 transition-colors"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>

      {/* 停止 */}
      <button
        title="停止"
        onClick={handleStop}
        className="p-1.5 rounded text-gray-300 hover:text-[#00e5ff] hover:bg-white/10 transition-colors"
      >
        <Square size={12} />
      </button>

      {/* 循环 */}
      <button
        title={isLooping ? '关闭循环' : '开启循环'}
        onClick={toggleLoop}
        className={`p-1.5 rounded transition-colors ${
          isLooping
            ? 'text-[#00e5ff] bg-[#00e5ff]/10'
            : 'text-gray-400 hover:text-[#00e5ff] hover:bg-white/10'
        }`}
      >
        {isLooping ? <Repeat1 size={14} /> : <Repeat size={14} />}
      </button>

      {/* 分隔 */}
      <div className="w-px h-4 bg-white/10 mx-1" />

      {/* 帧计数 */}
      <span className="text-xs text-gray-300 tabular-nums whitespace-nowrap">
        帧 {currentFrame} / {totalFrames}
      </span>

      {/* 分隔 */}
      <div className="w-px h-4 bg-white/10 mx-1" />

      {/* FPS */}
      <span className="text-xs text-gray-500 tabular-nums">
        {fps} FPS
      </span>

      <div className="flex-1" />

      {/* 时间轴缩放 */}
      <div className="flex items-center gap-0.5">
        <button
          title="缩小时间轴"
          onClick={zoomOut}
          className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut size={12} />
        </button>
        <span className="text-[10px] text-gray-500 w-8 text-center font-mono">{Math.round(frameW)}px</span>
        <button
          title="放大时间轴"
          onClick={zoomIn}
          className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn size={12} />
        </button>
      </div>
    </div>
  );
}
