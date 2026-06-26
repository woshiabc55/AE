import { useEffect, useRef, useCallback } from 'react';
import { useTimelineStore } from '../../store/useTimelineStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import PlaybackControls from './PlaybackControls';
import EasingEditor from './EasingEditor';
import type { Keyframe } from '../../types';

const FRAME_W = 8;
const LAYER_LABEL_W = 100;
const TICK_INTERVAL = 10;

export default function TimelinePanel() {
  const {
    currentFrame, totalFrames, isPlaying, isLooping, fps,
    setCurrentFrame, setIsPlaying,
  } = useTimelineStore();

  const { project, addKeyframe, removeKeyframe, selectedLayerId, selectLayer } = useProjectStore();
  const timelineHeight = useUIStore((s) => s.timelineHeight);

  const rafRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 播放循环
  const tick = useCallback((time: number) => {
    if (!prevTimeRef.current) prevTimeRef.current = time;
    const delta = time - prevTimeRef.current;
    const frameDuration = 1000 / fps;

    if (delta >= frameDuration) {
      prevTimeRef.current = time - (delta % frameDuration);
      const store = useTimelineStore.getState();
      const next = store.currentFrame + 1;
      if (next >= store.totalFrames) {
        if (store.isLooping) {
          store.setCurrentFrame(0);
        } else {
          store.setIsPlaying(false);
          return;
        }
      } else {
        store.setCurrentFrame(next);
      }
    }

    if (useTimelineStore.getState().isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [fps]);

  useEffect(() => {
    if (isPlaying) {
      prevTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, tick]);

  // 点击标尺定位帧
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.max(0, Math.min(totalFrames - 1, Math.floor(x / FRAME_W)));
    setCurrentFrame(frame);
  };

  // 双击轨道添加关键帧
  const handleTrackDoubleClick = (layerId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.max(0, Math.min(totalFrames - 1, Math.floor(x / FRAME_W)));
    const layer = project.layers.find((l) => l.id === layerId);
    if (!layer || layer.elementIds.length === 0) return;

    const kf: Keyframe = {
      id: `kf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      layerId,
      elementId: layer.elementIds[0],
      frame,
      properties: {},
      easing: useTimelineStore.getState().selectedEasing,
    };
    addKeyframe(kf);
  };

  // 右键删除关键帧
  const handleKeyframeContextMenu = (kfId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeKeyframe(kfId);
  };

  const timelineW = totalFrames * FRAME_W;
  const sortedLayers = [...project.layers].sort((a, b) => a.order - b.order);

  // 标尺刻度
  const ticks: number[] = [];
  for (let f = 0; f < totalFrames; f += TICK_INTERVAL) ticks.push(f);

  return (
    <div
      className="flex flex-col bg-[#1a1d27] border-t border-white/10 select-none"
      style={{ height: timelineHeight }}
    >
      {/* 控制栏 */}
      <PlaybackControls />

      {/* 主体区域 */}
      <div className="flex flex-1 min-h-0">
        {/* 图层名列表（固定左侧） */}
        <div
          className="shrink-0 border-r border-white/10 flex flex-col"
          style={{ width: LAYER_LABEL_W }}
        >
          {/* 标尺占位 */}
          <div className="h-6 border-b border-white/5 shrink-0" />

          {sortedLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => selectLayer(layer.id)}
              className={`flex items-center h-7 px-2 border-b border-white/5 cursor-pointer transition-colors ${
                selectedLayerId === layer.id
                  ? 'bg-[#00e5ff]/10 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full mr-1.5 shrink-0"
                style={{ backgroundColor: layer.colorTag }}
              />
              <span className="text-[10px] truncate">{layer.name}</span>
            </div>
          ))}
        </div>

        {/* 时间线滚动区域 */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
          <div style={{ width: timelineW, position: 'relative' }}>
            {/* 标尺 */}
            <div
              className="h-6 border-b border-white/5 relative cursor-pointer shrink-0"
              onClick={handleRulerClick}
            >
              {ticks.map((f) => (
                <div
                  key={f}
                  className="absolute top-0 h-full"
                  style={{ left: f * FRAME_W }}
                >
                  <div className="w-px h-2 bg-white/20 absolute bottom-0" />
                  <span className="text-[8px] text-gray-500 absolute bottom-2 left-0.5">
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* 轨道 */}
            {sortedLayers.map((layer) => {
              const layerKfs = project.keyframes.filter((kf) => kf.layerId === layer.id);
              return (
                <div
                  key={layer.id}
                  className="h-7 border-b border-white/5 relative"
                  onDoubleClick={(e) => handleTrackDoubleClick(layer.id, e)}
                >
                  {/* 关键帧菱形 */}
                  {layerKfs.map((kf) => (
                    <div
                      key={kf.id}
                      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#00e5ff] hover:bg-white cursor-pointer z-10"
                      style={{ left: kf.frame * FRAME_W - 5 }}
                      onContextMenu={(e) => handleKeyframeContextMenu(kf.id, e)}
                      title={`帧 ${kf.frame}`}
                    />
                  ))}
                </div>
              );
            })}

            {/* 播放头 */}
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500 pointer-events-none z-20"
              style={{ left: currentFrame * FRAME_W }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full -translate-x-[3px]" />
            </div>
          </div>
        </div>
      </div>

      <EasingEditor />
    </div>
  );
}
