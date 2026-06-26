import { useEffect, useRef, useCallback } from 'react';
import { useTimelineStore } from '../../store/useTimelineStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import PlaybackControls from './PlaybackControls';
import EasingEditor from './EasingEditor';
import type { Keyframe } from '../../types';

const FRAME_W = 8;
const LAYER_LABEL_W = 110;
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
      className="flex flex-col bg-[#13151e] select-none"
      style={{ height: timelineHeight }}
    >
      {/* 3D 顶部高光条 - 模拟光源 */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent shrink-0" />

      {/* 控制栏 */}
      <PlaybackControls />

      {/* 主体区域 */}
      <div className="flex flex-1 min-h-0">
        {/* 图层名列表（固定左侧） - 3D 浮雕效果 */}
        <div
          className="shrink-0 border-r border-[#0a0c14] flex flex-col bg-[#15171f]"
          style={{ width: LAYER_LABEL_W }}
        >
          {/* 左上角内嵌阴影 */}
          <div className="h-px bg-white/5 shrink-0" />
          {/* 标尺占位 */}
          <div className="h-7 border-b border-[#0a0c14] shrink-0 flex items-center px-2">
            <span className="text-[8px] text-white/20 uppercase tracking-wider font-medium">图层</span>
          </div>

          {sortedLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => selectLayer(layer.id)}
              className={`flex items-center h-8 px-2 border-b border-[#0a0c14] cursor-pointer transition-all duration-150 ${
                selectedLayerId === layer.id
                  ? 'bg-[#00e5ff]/10 text-white shadow-[inset_2px_0_0_#00e5ff]'
                  : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full mr-2 shrink-0 shadow-sm"
                style={{ backgroundColor: layer.colorTag }}
              />
              <span className="text-[10px] truncate">{layer.name}</span>
            </div>
          ))}

          {/* 空图层占位 */}
          {sortedLayers.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[9px] text-white/15">创建图形以添加图层</span>
            </div>
          )}
        </div>

        {/* 时间线滚动区域 */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto bg-[#13151e]">
          <div style={{ width: timelineW, position: 'relative' }}>
            {/* 标尺 - 3D 压缩效果 */}
            <div
              className="h-7 border-b border-[#0a0c14] relative cursor-pointer shrink-0 bg-[#15171f]"
              onClick={handleRulerClick}
            >
              {ticks.map((f) => (
                <div
                  key={f}
                  className="absolute top-0 h-full"
                  style={{ left: f * FRAME_W }}
                >
                  <div className="w-px h-3 bg-white/15 absolute bottom-0" />
                  <span className="text-[7px] text-white/25 absolute bottom-3 left-0.5 font-mono">
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* 轨道 - 压缩深度效果 */}
            {sortedLayers.map((layer, layerIdx) => {
              const layerKfs = project.keyframes.filter((kf) => kf.layerId === layer.id);
              // 根据图层顺序计算深度色调
              const depthFactor = Math.min(layerIdx * 0.03, 0.15);
              return (
                <div
                  key={layer.id}
                  className="h-8 border-b border-[#0a0c14] relative"
                  style={{ backgroundColor: `rgba(15, 17, 23, ${1 - depthFactor})` }}
                  onDoubleClick={(e) => handleTrackDoubleClick(layer.id, e)}
                >
                  {/* 轨道水平参考线 */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.03]" />

                  {/* 关键帧菱形 - 3D 立体效果 */}
                  {layerKfs.map((kf) => (
                    <div
                      key={kf.id}
                      className="absolute top-1/2 -translate-y-1/2 z-10"
                      style={{ left: kf.frame * FRAME_W - 6 }}
                      onContextMenu={(e) => handleKeyframeContextMenu(kf.id, e)}
                      title={`帧 ${kf.frame}`}
                    >
                      {/* 阴影层 */}
                      <div
                        className="w-3 h-3 rotate-45 bg-black/40 absolute top-[2px] left-[2px]"
                      />
                      {/* 主体 */}
                      <div
                        className="w-3 h-3 rotate-45 bg-[#00e5ff] hover:bg-white cursor-pointer transition-colors relative z-10"
                        style={{ boxShadow: '0 0 4px rgba(0,229,255,0.4)' }}
                      />
                      {/* 高光 */}
                      <div
                        className="w-3 h-3 rotate-45 absolute top-0 left-0 z-20 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              );
            })}

            {/* 播放头 - 3D 立体效果 */}
            <div
              className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-30"
              style={{
                left: currentFrame * FRAME_W,
                background: 'linear-gradient(to bottom, #ff4444, #ff6666)',
                boxShadow: '0 0 8px rgba(255,68,68,0.4), 2px 0 4px rgba(0,0,0,0.3)',
              }}
            >
              {/* 顶部圆点 */}
              <div
                className="w-3 h-3 rounded-full -translate-x-[5px] -translate-y-0.5"
                style={{
                  background: 'radial-gradient(circle at 40% 35%, #ff8888, #ff4444)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.4), 0 0 6px rgba(255,68,68,0.3)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 缓动编辑器 */}
      <EasingEditor />

      {/* 底部3D 阴影线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/40 to-transparent shrink-0" />
    </div>
  );
}
