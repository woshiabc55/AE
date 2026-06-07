import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  SkipBack,
  Plus,
  Square,
  Circle,
  Type,
  Triangle,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  Diamond,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Code2,
  FileCode2,
  Sparkles,
  Magnet,
  Copy,
  Hexagon,
  Layers as LayersIcon,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import type { SvgLayer, SvgProjectData, SvgTrack, SvgKeyframe } from '@/types';
import { uid, formatTime, cn, downloadFile } from '@/lib/utils';
import { renderLayer, resolveTransform, getProjectDuration } from '@/engine/svgRenderer';
import { exportSvgProject, exportSvgCss, exportProjectJson } from '@/lib/exporters';
import { SVG_TEMPLATES } from '@/lib/templates';

export default function SvgEditor() {
  const params = useParams();
  const navigate = useNavigate();
  const project = useProjectStore((s) => s.current);
  const isDirty = useProjectStore((s) => s.isDirty);
  const lastSavedAt = useProjectStore((s) => s.lastSavedAt);
  const openProject = useProjectStore((s) => s.openProject);
  const createSvgProject = useProjectStore((s) => s.createSvgProject);
  const saveCurrent = useProjectStore((s) => s.saveCurrent);
  const setCurrentName = useProjectStore((s) => s.setCurrentName);
  const addSvgLayer = useProjectStore((s) => s.addSvgLayer);
  const updateSvgLayer = useProjectStore((s) => s.updateSvgLayer);
  const removeSvgLayer = useProjectStore((s) => s.removeSvgLayer);
  const addSvgTrack = useProjectStore((s) => s.addSvgTrack);
  const updateSvgTrack = useProjectStore((s) => s.updateSvgTrack);
  const addSvgKeyframe = useProjectStore((s) => s.addSvgKeyframe);
  const updateSvgKeyframe = useProjectStore((s) => s.updateSvgKeyframe);
  const removeSvgKeyframe = useProjectStore((s) => s.removeSvgKeyframe);
  const setSvgDuration = useProjectStore((s) => s.setSvgDuration);
  const updateSvgData = useProjectStore((s) => s.updateSvgData);

  const playhead = useUIStore((s) => s.svgPlayhead);
  const playing = useUIStore((s) => s.svgPlaying);
  const setPlayhead = useUIStore((s) => s.setSvgPlayhead);
  const setPlaying = useUIStore((s) => s.setSvgPlaying);
  const zoom = useUIStore((s) => s.svgZoom);
  const setZoom = useUIStore((s) => s.setSvgZoom);
  const showGrid = useUIStore((s) => s.svgShowGrid);
  const toggleGrid = useUIStore((s) => s.toggleSvgGrid);
  const selectedLayerId = useUIStore((s) => s.svgSelectedLayerId);
  const setSelectedLayer = useUIStore((s) => s.setSvgSelectedLayer);
  const selectedKeyframeId = useUIStore((s) => s.svgSelectedKeyframeId);
  const setSelectedKeyframe = useUIStore((s) => s.setSvgSelectedKeyframe);
  const selectedTrackId = useUIStore((s) => s.svgSelectedTrackId);
  const setSelectedTrack = useUIStore((s) => s.setSvgSelectedTrack);
  const pushToast = useUIStore((s) => s.pushToast);

  // 初始化项目
  useEffect(() => {
    (async () => {
      if (params.projectId) {
        await openProject(params.projectId);
      } else if (!project) {
        await createSvgProject();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.projectId]);

  // 自动保存(2.5s debounce)
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => {
      saveCurrent();
      pushToast('info', '已自动保存');
    }, 2500);
    return () => clearTimeout(t);
  }, [isDirty, saveCurrent, pushToast]);

  // 播放循环
  useEffect(() => {
    if (!playing || !project || project.type !== 'svg') return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const data = project.data as SvgProjectData;
      const total = getProjectDuration(data);
      let next = playhead + dt;
      if (next > total) next = 0;
      setPlayhead(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, project]);

  if (!project || project.type !== 'svg') {
    return (
      <div className="h-[80vh] grid place-items-center text-fog">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 animate-spin text-neon-cyan" />
          正在准备编辑器…
        </div>
      </div>
    );
  }

  const data = project.data as SvgProjectData;
  const selectedLayer = data.layers.find((l) => l.id === selectedLayerId) ?? null;
  const selectedTrack = data.tracks.find((t) => t.id === selectedTrackId) ?? null;
  const selectedKeyframe = selectedTrack?.keyframes.find((k) => k.id === selectedKeyframeId) ?? null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <EditorToolbar
        projectName={project.name}
        onNameChange={setCurrentName}
        onBack={() => navigate('/')}
        onSave={async () => {
          await saveCurrent();
          pushToast('success', '已保存');
        }}
        onExportSvg={() => exportSvgProject(data, project.name)}
        onExportHtml={() => exportSvgCss(data, project.name)}
        onExportJson={() => exportProjectJson(project)}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        duration={data.duration}
        onDurationChange={setSvgDuration}
        playing={playing}
        onTogglePlay={() => setPlaying(!playing)}
        onReset={() => setPlayhead(0)}
        playhead={playhead}
        zoom={zoom}
        onZoom={setZoom}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
        onLoadTemplate={(id: string) => {
          const t = SVG_TEMPLATES.find((x) => x.id === id);
          if (!t) return;
          const built = t.build();
          updateSvgData(built.data);
          pushToast('success', `已加载模板:${t.name}`);
        }}
      />

      <div className="flex-1 grid grid-cols-[260px_1fr_300px] grid-rows-[1fr_220px] overflow-hidden">
        {/* 左: 图层 */}
        <div className="row-span-1 border-r border-white/5 bg-ink-800/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <PanelHeader icon={LayersIcon} title="图层" rightSlot={
            <LayerAddMenu onAdd={(kind) => {
              const layer = makeLayer(kind);
              addSvgLayer(layer);
              setSelectedLayer(layer.id);
            }} />
          } />
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.layers.length === 0 && (
              <div className="text-fog-dim text-[12px] text-center py-10 px-3">
                没有图层,点击右上 + 添加,或从模板载入
              </div>
            )}
            {data.layers.map((layer) => (
              <LayerRow
                key={layer.id}
                layer={layer}
                selected={layer.id === selectedLayerId}
                onSelect={() => setSelectedLayer(layer.id)}
                onToggleVisible={() => updateSvgLayer(layer.id, { visible: !layer.visible })}
                onToggleLock={() => updateSvgLayer(layer.id, { locked: !layer.locked })}
                onRemove={() => removeSvgLayer(layer.id)}
                onDuplicate={() => {
                  addSvgLayer({ ...layer, id: uid('ly'), name: layer.name + ' 副本' });
                }}
              />
            ))}
          </div>
          <div className="border-t border-white/5 p-2.5 space-y-2">
            <div className="text-[10px] font-mono text-fog-dim">模板</div>
            <div className="grid grid-cols-2 gap-1.5">
              {SVG_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    const built = t.build();
                    updateSvgData(built.data);
                    pushToast('success', `已载入「${t.name}」`);
                  }}
                  className="text-[11px] py-1.5 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/[0.06] truncate transition"
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 中: 画布 */}
        <CanvasStage
          data={data}
          time={playhead}
          zoom={zoom}
          showGrid={showGrid}
          selectedLayerId={selectedLayerId}
          onSelect={setSelectedLayer}
        />

        {/* 右: 属性 */}
        <div className="row-span-1 border-l border-white/5 bg-ink-800/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <PanelHeader icon={SlidersIcon} title="属性" />
          <div className="flex-1 overflow-y-auto">
            {selectedLayer ? (
              <PropertyPanel
                layer={selectedLayer}
                data={data}
                onChange={(patch) => updateSvgLayer(selectedLayer.id, patch)}
                onAddTrack={(property) => {
                  const track: SvgTrack = {
                    id: uid('tr'),
                    layerId: selectedLayer.id,
                    property,
                    keyframes: [
                      { id: uid('kf'), time: 0, value: getBaseValue(selectedLayer, property), easing: 'easeInOut' },
                    ],
                  };
                  addSvgTrack(track);
                  setSelectedTrack(track.id);
                  pushToast('info', `已为「${selectedLayer.name}」创建 ${property} 轨道`);
                }}
                onUpdateTrack={(trackId, patch) => updateSvgTrack(trackId, patch)}
                selectedTrackId={selectedTrackId}
                onSelectTrack={setSelectedTrack}
              />
            ) : (
              <div className="p-6 text-center text-fog-dim text-sm">
                选择一个图层以编辑属性
              </div>
            )}
          </div>
        </div>

        {/* 下: 时间线 */}
        <div className="col-span-3 border-t border-white/5 bg-ink-800/40 backdrop-blur-sm">
          <PanelHeader
            icon={Diamond}
            title="时间线"
            rightSlot={
              <div className="flex items-center gap-3 text-[11px] font-mono text-fog-dim">
                <span>{formatTime(playhead)} / {formatTime(getProjectDuration(data))}</span>
                <button
                  onClick={() => setPlayhead(0)}
                  className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5 text-fog hover:text-cream transition"
                  title="跳到开始"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="h-7 w-7 grid place-items-center rounded-md bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25 transition"
                  title={playing ? '暂停' : '播放'}
                >
                  {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            }
          />
          <Timeline
            data={data}
            time={playhead}
            onSeek={setPlayhead}
            selectedLayerId={selectedLayerId}
            selectedTrackId={selectedTrackId}
            selectedKeyframeId={selectedKeyframeId}
            onSelectLayer={setSelectedLayer}
            onSelectTrack={setSelectedTrack}
            onSelectKeyframe={setSelectedKeyframe}
            onAddKeyframe={(trackId: string, time: number, value: number | string) => {
              addSvgKeyframe(trackId, { id: uid('kf'), time, value, easing: 'easeInOut' });
            }}
            onUpdateKeyframe={(trackId: string, kfId: string, patch: Partial<SvgKeyframe>) => updateSvgKeyframe(trackId, kfId, patch)}
            onRemoveKeyframe={removeSvgKeyframe}
          />
        </div>
      </div>
    </div>
  );
}

// =============== 子组件 ===============
function EditorToolbar({
  projectName,
  onNameChange,
  onBack,
  onSave,
  onExportSvg,
  onExportHtml,
  onExportJson,
  isDirty,
  lastSavedAt,
  duration,
  onDurationChange,
  playing,
  onTogglePlay,
  onReset,
  playhead,
  zoom,
  onZoom,
  showGrid,
  onToggleGrid,
  onLoadTemplate,
}: any) {
  return (
    <div className="border-b border-white/5 bg-ink-900/70 backdrop-blur-md px-4 h-12 flex items-center gap-3">
      <button
        onClick={onBack}
        className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5 text-fog hover:text-cream transition"
        title="返回"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="h-5 w-px bg-white/10" />
      <input
        value={projectName}
        onChange={(e) => onNameChange(e.target.value)}
        className="bg-transparent outline-none text-sm font-medium w-56 focus:bg-white/5 px-2 py-1 rounded"
      />
      <span className="text-[10px] font-mono text-fog-dim">
        {isDirty ? '● 未保存' : lastSavedAt ? `已保存 ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
      </span>
      <div className="h-5 w-px bg-white/10 mx-1" />
      <button onClick={onSave} className="btn-press h-8 px-3 rounded-md bg-white/5 hover:bg-white/10 text-sm flex items-center gap-1.5">
        <Save className="w-3.5 h-3.5" /> 保存
      </button>
      <div className="h-5 w-px bg-white/10 mx-1" />
      <div className="flex items-center gap-1">
        <button onClick={onExportSvg} className="btn-press h-8 px-3 rounded-md hover:bg-white/5 text-sm flex items-center gap-1.5 text-fog hover:text-cream">
          <Download className="w-3.5 h-3.5" /> SVG
        </button>
        <button onClick={onExportHtml} className="btn-press h-8 px-3 rounded-md hover:bg-white/5 text-sm flex items-center gap-1.5 text-fog hover:text-cream">
          <FileCode2 className="w-3.5 h-3.5" /> HTML
        </button>
        <button onClick={onExportJson} className="btn-press h-8 px-3 rounded-md hover:bg-white/5 text-sm flex items-center gap-1.5 text-fog hover:text-cream">
          <Code2 className="w-3.5 h-3.5" /> JSON
        </button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 text-[11px] font-mono text-fog-dim">
        时长
        <input
          type="number"
          min={0.5}
          max={60}
          step={0.5}
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="w-16 bg-ink-700 border border-white/10 rounded px-2 py-1 outline-none focus:border-neon-cyan"
        />
        s
      </div>
      <div className="h-5 w-px bg-white/10 mx-1" />
      <button onClick={onToggleGrid} className={cn('btn-press h-8 w-8 grid place-items-center rounded-md transition', showGrid ? 'bg-neon-cyan/15 text-neon-cyan' : 'text-fog hover:bg-white/5 hover:text-cream')} title="网格">
        <Grid3x3 className="w-4 h-4" />
      </button>
      <div className="flex items-center bg-ink-700 rounded-md border border-white/10">
        <button onClick={() => onZoom(zoom * 0.85)} className="h-8 w-8 grid place-items-center text-fog hover:text-cream"><ZoomOut className="w-3.5 h-3.5" /></button>
        <span className="text-[11px] font-mono px-1.5 text-fog-dim">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoom(zoom * 1.15)} className="h-8 w-8 grid place-items-center text-fog hover:text-cream"><ZoomIn className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

function PanelHeader({ icon: Icon, title, rightSlot }: { icon: any; title: string; rightSlot?: React.ReactNode }) {
  return (
    <div className="h-9 px-3 flex items-center gap-2 border-b border-white/5 text-[12px] font-medium text-fog">
      <Icon className="w-3.5 h-3.5 text-neon-cyan" />
      <span className="font-display tracking-wide">{title}</span>
      <span className="flex-1" />
      {rightSlot}
    </div>
  );
}

function LayerAddMenu({ onAdd }: { onAdd: (kind: SvgLayer['kind']) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-7 grid place-items-center rounded-md bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25 transition"
        title="添加图层"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 z-30 glass border border-white/10 rounded-lg p-1 w-36 shadow-panel">
          {[
            { k: 'rect' as const, label: '矩形', icon: Square },
            { k: 'circle' as const, label: '圆形', icon: Circle },
            { k: 'ellipse' as const, label: '椭圆', icon: Circle },
            { k: 'polygon' as const, label: '多边形', icon: Triangle },
            { k: 'path' as const, label: '路径', icon: Hexagon },
            { k: 'text' as const, label: '文字', icon: Type },
          ].map((it) => (
            <button
              key={it.k}
              onClick={() => {
                onAdd(it.k);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-fog hover:bg-white/5 hover:text-cream"
            >
              <it.icon className="w-3.5 h-3.5 text-neon-cyan" /> {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LayerRow({
  layer,
  selected,
  onSelect,
  onToggleVisible,
  onToggleLock,
  onRemove,
  onDuplicate,
}: {
  layer: SvgLayer;
  selected: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
  onToggleLock: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition border',
        selected
          ? 'bg-neon-cyan/10 border-neon-cyan/30 text-cream'
          : 'border-transparent text-fog hover:bg-white/5 hover:text-cream',
      )}
    >
      <span className="w-5 h-5 grid place-items-center">
        {layer.kind === 'rect' && <Square className="w-3 h-3" />}
        {layer.kind === 'circle' && <Circle className="w-3 h-3" />}
        {layer.kind === 'ellipse' && <Circle className="w-3 h-3" />}
        {layer.kind === 'polygon' && <Triangle className="w-3 h-3" />}
        {layer.kind === 'path' && <Hexagon className="w-3 h-3" />}
        {layer.kind === 'text' && <Type className="w-3 h-3" />}
      </span>
      <span className="text-[12px] truncate flex-1">{layer.name}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisible(); }}
        className="w-6 h-6 grid place-items-center opacity-60 hover:opacity-100 transition"
        title={layer.visible ? '隐藏' : '显示'}
      >
        {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-fog-dim" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
        className="w-6 h-6 grid place-items-center opacity-60 hover:opacity-100 transition"
        title={layer.locked ? '解锁' : '锁定'}
      >
        {layer.locked ? <Lock className="w-3 h-3 text-ember" /> : <Unlock className="w-3 h-3" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        className="w-6 h-6 grid place-items-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition"
        title="复制"
      >
        <Copy className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="w-6 h-6 grid place-items-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-rose-300"
        title="删除"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function CanvasStage({
  data,
  time,
  zoom,
  showGrid,
  selectedLayerId,
  onSelect,
}: {
  data: SvgProjectData;
  time: number;
  zoom: number;
  showGrid: boolean;
  selectedLayerId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const onLayerMouseDown = (e: React.MouseEvent, layer: SvgLayer) => {
    if (layer.locked) return;
    e.stopPropagation();
    onSelect(layer.id);
    const t = resolveTransform(layer, data.tracks, time);
    setDragging({ id: layer.id, startX: e.clientX, startY: e.clientY, baseX: t.x, baseY: t.y });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      // 直接修改 base transform
      const layer = data.layers.find((l) => l.id === dragging.id);
      if (!layer) return;
      layer.transform.x = dragging.baseX + dx;
      layer.transform.y = dragging.baseY + dy;
      // 触发 react 更新
      useProjectStore.setState((s) => ({
        current: s.current ? { ...s.current, data: { ...data, layers: [...data.layers] } } : s.current,
        isDirty: true,
      }));
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, data, zoom]);

  return (
    <div
      ref={containerRef}
      onClick={() => onSelect(null)}
      className="relative bg-ink-950 grid-bg overflow-auto"
      style={{
        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
      }}
    >
      <div
        className="relative mx-auto my-8"
        style={{
          width: data.width * zoom,
          height: data.height * zoom,
          background: data.background,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <svg
          viewBox={`0 0 ${data.width} ${data.height}`}
          width={data.width}
          height={data.height}
          style={{ position: 'absolute', inset: 0 }}
        >
          {showGrid && (
            <g opacity="0.4">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </g>
          )}
          {data.layers.map((layer) => {
            if (!layer.visible) return null;
            const t = resolveTransform(layer, data.tracks, time);
            const el = renderLayer(layer, t, data, data.tracks);
            return (
              <g
                key={layer.id}
                onMouseDown={(e) => onLayerMouseDown(e, layer)}
                style={{ cursor: layer.locked ? 'not-allowed' : 'move' }}
              >
                {el}
              </g>
            );
          })}
          {data.layers
            .filter((l) => l.visible)
            .map((layer) => {
              const t = resolveTransform(layer, data.tracks, time);
              const isSel = layer.id === selectedLayerId;
              if (!isSel) return null;
              return (
                <g key={'sel-' + layer.id} transform={`translate(${t.x} ${t.y}) rotate(${t.rotate})`} style={{ pointerEvents: 'none' }}>
                  <rect
                    x={-((layer.attrs.width as number) ?? 100) / 2 * Math.max(t.scaleX, 0.001) - 4}
                    y={-((layer.attrs.height as number) ?? 100) / 2 * Math.max(t.scaleY, 0.001) - 4}
                    width={((layer.attrs.width as number) ?? 100) * Math.max(t.scaleX, 0.001) + 8}
                    height={((layer.attrs.height as number) ?? 100) * Math.max(t.scaleY, 0.001) + 8}
                    fill="none"
                    stroke="#7CF9FF"
                    strokeDasharray="4 4"
                    strokeWidth={1.5 / zoom}
                  />
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}

function PropertyPanel({
  layer,
  data,
  onChange,
  onAddTrack,
  onUpdateTrack,
  selectedTrackId,
  onSelectTrack,
}: {
  layer: SvgLayer;
  data: SvgProjectData;
  onChange: (patch: Partial<SvgLayer>) => void;
  onAddTrack: (property: SvgTrack['property']) => void;
  onUpdateTrack: (trackId: string, patch: Partial<SvgTrack>) => void;
  selectedTrackId: string | null;
  onSelectTrack: (id: string | null) => void;
}) {
  const layerTracks = data.tracks.filter((t) => t.layerId === layer.id);
  return (
    <div className="p-3 space-y-4">
      <Section title="基础">
        <Field label="名称">
          <input
            value={layer.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
          />
        </Field>
        <Field label="填充">
          <ColorInput value={String(layer.style.fill ?? '#7CF9FF')} onChange={(v) => onChange({ style: { ...layer.style, fill: v } })} />
        </Field>
        <Field label="描边">
          <ColorInput value={String(layer.style.stroke ?? '#0B0B12')} onChange={(v) => onChange({ style: { ...layer.style, stroke: v } })} />
        </Field>
        <Field label="描边宽度">
          <input
            type="number"
            value={Number(layer.style.strokeWidth ?? 0)}
            onChange={(e) => onChange({ style: { ...layer.style, strokeWidth: Number(e.target.value) } })}
            className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
          />
        </Field>
      </Section>

      <Section title="变换 (基础)">
        <div className="grid grid-cols-2 gap-2">
          <Field label="X">
            <input
              type="number"
              value={layer.transform.x}
              onChange={(e) => onChange({ transform: { ...layer.transform, x: Number(e.target.value) } })}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
          <Field label="Y">
            <input
              type="number"
              value={layer.transform.y}
              onChange={(e) => onChange({ transform: { ...layer.transform, y: Number(e.target.value) } })}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
          <Field label="旋转 °">
            <input
              type="number"
              value={layer.transform.rotate}
              onChange={(e) => onChange({ transform: { ...layer.transform, rotate: Number(e.target.value) } })}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
          <Field label="不透明度">
            <input
              type="number" min={0} max={1} step={0.05}
              value={layer.transform.opacity}
              onChange={(e) => onChange({ transform: { ...layer.transform, opacity: Number(e.target.value) } })}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
        </div>
      </Section>

      {layer.kind === 'text' && (
        <Section title="文字">
          <Field label="内容">
            <textarea
              value={layer.text ?? ''}
              onChange={(e) => onChange({ text: e.target.value })}
              rows={2}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
          <Field label="字号">
            <input
              type="number"
              value={Number(layer.attrs.fontSize ?? 32)}
              onChange={(e) => onChange({ attrs: { ...layer.attrs, fontSize: Number(e.target.value) } })}
              className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
            />
          </Field>
        </Section>
      )}

      {(layer.kind === 'rect' || layer.kind === 'ellipse' || layer.kind === 'circle') && (
        <Section title="几何">
          <div className="grid grid-cols-2 gap-2">
            {layer.kind === 'rect' && (
              <>
                <Field label="宽"><NumberInput value={Number(layer.attrs.width)} onChange={(v) => onChange({ attrs: { ...layer.attrs, width: v } })} /></Field>
                <Field label="高"><NumberInput value={Number(layer.attrs.height)} onChange={(v) => onChange({ attrs: { ...layer.attrs, height: v } })} /></Field>
                <Field label="圆角"><NumberInput value={Number(layer.attrs.rx ?? 0)} onChange={(v) => onChange({ attrs: { ...layer.attrs, rx: v } })} /></Field>
              </>
            )}
            {layer.kind === 'circle' && (
              <Field label="半径"><NumberInput value={Number(layer.attrs.r)} onChange={(v) => onChange({ attrs: { ...layer.attrs, r: v } })} /></Field>
            )}
            {layer.kind === 'ellipse' && (
              <>
                <Field label="RX"><NumberInput value={Number(layer.attrs.rx)} onChange={(v) => onChange({ attrs: { ...layer.attrs, rx: v } })} /></Field>
                <Field label="RY"><NumberInput value={Number(layer.attrs.ry)} onChange={(v) => onChange({ attrs: { ...layer.attrs, ry: v } })} /></Field>
              </>
            )}
          </div>
        </Section>
      )}

      <Section title="动画轨道" rightSlot={
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onAddTrack(e.target.value as SvgTrack['property']);
              e.target.value = '';
            }
          }}
          className="text-[11px] bg-ink-700 border border-white/10 rounded px-2 py-1 outline-none focus:border-neon-cyan"
        >
          <option value="">+ 添加轨道</option>
          <option value="x">位置 X</option>
          <option value="y">位置 Y</option>
          <option value="rotate">旋转</option>
          <option value="scaleX">缩放 X</option>
          <option value="scaleY">缩放 Y</option>
          <option value="opacity">不透明度</option>
          <option value="fill">填充色</option>
        </select>
      }>
        <div className="space-y-1.5">
          {layerTracks.length === 0 && <div className="text-[11px] text-fog-dim text-center py-3">暂无轨道,点击右上 + 添加</div>}
          {layerTracks.map((tr) => (
            <button
              key={tr.id}
              onClick={() => onSelectTrack(tr.id === selectedTrackId ? null : tr.id)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] border transition',
                tr.id === selectedTrackId
                  ? 'bg-ember/10 border-ember/30 text-cream'
                  : 'bg-white/[0.02] border-white/[0.06] text-fog hover:bg-white/5',
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ember" />
              <span className="font-mono">{tr.property}</span>
              <span className="ml-auto text-[10px] text-fog-dim">{tr.keyframes.length} KF</span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Timeline({
  data,
  time,
  onSeek,
  selectedLayerId,
  selectedTrackId,
  selectedKeyframeId,
  onSelectLayer,
  onSelectTrack,
  onSelectKeyframe,
  onAddKeyframe,
  onUpdateKeyframe,
  onRemoveKeyframe,
}: any) {
  const total = getProjectDuration(data);
  const trackRows = useMemo(() => {
    return data.tracks.map((t: SvgTrack) => ({ ...t, layer: data.layers.find((l: SvgLayer) => l.id === t.layerId) }));
  }, [data]);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const onTimelineClick = (e: React.MouseEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left + (trackRef.current?.scrollLeft ?? 0);
    const seek = (x / rect.width) * total;
    onSeek(seek);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          <div className="w-44 shrink-0 border-r border-white/5">
            <div className="h-7" />
            {trackRows.length === 0 && (
              <div className="text-[11px] text-fog-dim text-center py-4">无轨道 · 在右侧面板添加</div>
            )}
            {trackRows.map((tr: any) => (
              <div
                key={tr.id}
                onClick={() => onSelectTrack(tr.id === selectedTrackId ? null : tr.id)}
                className={cn(
                  'h-7 flex items-center gap-1.5 px-3 border-b border-white/[0.04] cursor-pointer transition text-[11px]',
                  tr.id === selectedTrackId ? 'bg-ember/10 text-cream' : 'text-fog hover:bg-white/5',
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                <span className="font-mono text-[10px] w-12 text-ember">{tr.property}</span>
                <span className="truncate">{tr.layer?.name ?? '未命名'}</span>
                <span className="ml-auto text-[10px] text-fog-dim">{tr.keyframes.length}</span>
              </div>
            ))}
          </div>
          <div
            ref={trackRef}
            onClick={onTimelineClick}
            className="relative flex-1 tl-grid"
            style={{ minWidth: 600 }}
          >
            <div className="h-7 border-b border-white/5 relative">
              {Array.from({ length: Math.ceil(total) + 1 }).map((_, i) => (
                <div key={i} className="absolute top-0 bottom-0 border-l border-white/[0.06] text-[10px] font-mono text-fog-dim pl-1" style={{ left: `${(i / total) * 100}%` }}>
                  {i}s
                </div>
              ))}
            </div>
            {trackRows.map((tr: any) => (
              <div
                key={tr.id}
                className="h-7 relative border-b border-white/[0.04]"
                onDoubleClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const t = (x / rect.width) * total;
                  const baseValue = getBaseValue(tr.layer, tr.property);
                  onAddKeyframe(tr.id, Math.max(0, Math.min(total, t)), baseValue);
                }}
              >
                {/* 关键帧节点 */}
                {tr.keyframes.map((kf: SvgKeyframe) => (
                  <div
                    key={kf.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectKeyframe(kf.id);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${(kf.time / total) * 100}%` }}
                  >
                    <div className={cn('kf-diamond', selectedKeyframeId === kf.id && 'selected')} />
                  </div>
                ))}
              </div>
            ))}
            {/* 播放头 */}
            <div
              className="absolute top-0 bottom-0 w-px bg-ember pointer-events-none"
              style={{ left: `${(time / total) * 100}%` }}
            >
              <div className="absolute -top-1 -left-[7px] w-3.5 h-3.5 rotate-45 bg-ember rounded-[2px] shadow-ember" />
            </div>
          </div>
        </div>
      </div>
      {selectedKeyframeId && selectedTrackId && (() => {
        const tr = data.tracks.find((t: SvgTrack) => t.id === selectedTrackId);
        const kf = tr?.keyframes.find((k: SvgKeyframe) => k.id === selectedKeyframeId);
        if (!tr || !kf) return null;
        return (
          <KeyframeInspector
            track={tr}
            keyframe={kf}
            onUpdate={(patch) => onUpdateKeyframe(tr.id, kf.id, patch)}
            onRemove={() => onRemoveKeyframe(tr.id, kf.id)}
          />
        );
      })()}
    </div>
  );
}

function KeyframeInspector({
  track,
  keyframe,
  onUpdate,
  onRemove,
}: {
  track: SvgTrack;
  keyframe: SvgKeyframe;
  onUpdate: (patch: Partial<SvgKeyframe>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="h-12 border-t border-white/5 bg-ink-700/40 flex items-center gap-3 px-3 text-[12px]">
      <Diamond className="w-3.5 h-3.5 text-ember" />
      <span className="font-mono text-fog-dim">关键帧 · {track.property}</span>
      <div className="h-5 w-px bg-white/10" />
      <label className="flex items-center gap-1.5 text-fog">
        时间
        <input
          type="number" step={0.05} value={keyframe.time}
          onChange={(e) => onUpdate({ time: Number(e.target.value) })}
          className="w-16 bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 outline-none focus:border-neon-cyan"
        />
        s
      </label>
      <label className="flex items-center gap-1.5 text-fog">
        值
        <input
          type="text" value={String(keyframe.value)}
          onChange={(e) => {
            const v = e.target.value;
            const num = Number(v);
            onUpdate({ value: !isNaN(num) && v !== '' ? num : v });
          }}
          className="w-20 bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 outline-none focus:border-neon-cyan"
        />
      </label>
      <label className="flex items-center gap-1.5 text-fog">
        缓动
        <select
          value={typeof keyframe.easing === 'string' ? keyframe.easing : 'bezier'}
          onChange={(e) => onUpdate({ easing: e.target.value as any })}
          className="bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 outline-none focus:border-neon-cyan"
        >
          {['linear', 'easeIn', 'easeOut', 'easeInOut', 'easeOutBack', 'easeOutElastic'].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>
      <EasingPreview easing={keyframe.easing} />
      <span className="flex-1" />
      <button onClick={onRemove} className="text-rose-300 hover:text-rose-200 transition flex items-center gap-1">
        <Trash2 className="w-3.5 h-3.5" /> 删除
      </button>
    </div>
  );
}

function EasingPreview({ easing }: { easing: SvgKeyframe['easing'] }) {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const path = ref.current.querySelector('path') as SVGPathElement | null;
    if (!path) return;
    // 采样 32 个点
    const pts: string[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      const e = resolveEasingSafe(easing, t);
      pts.push(`${(t * 60).toFixed(1)} ${(30 - e * 28).toFixed(1)}`);
    }
    path.setAttribute('d', `M ${pts.join(' L ')}`);
  }, [easing]);
  return (
    <svg ref={ref} viewBox="0 0 60 32" className="w-16 h-8 bg-ink-700 rounded border border-white/10">
      <line x1="0" y1="30" x2="60" y2="30" stroke="rgba(255,255,255,0.1)" />
      <line x1="0" y1="2" x2="0" y2="30" stroke="rgba(255,255,255,0.1)" />
      <path d="" fill="none" stroke="#7CF9FF" strokeWidth="1.5" />
    </svg>
  );
}

function resolveEasingSafe(easing: SvgKeyframe['easing'], t: number) {
  if (typeof easing === 'string') {
    const map: Record<string, (t: number) => number> = {
      linear: (t) => t,
      easeIn: (t) => t * t,
      easeOut: (t) => 1 - (1 - t) * (1 - t),
      easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
      easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      easeOutElastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      },
    };
    return map[easing]?.(t) ?? t;
  }
  return t;
}

function Section({ title, rightSlot, children }: { title: string; rightSlot?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-fog-dim">{title}</div>
        {rightSlot}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono text-fog-dim">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan"
    />
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan font-mono"
      />
    </div>
  );
}

function SlidersIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function makeLayer(kind: SvgLayer['kind']): SvgLayer {
  const baseStyle = { fill: '#7CF9FF', stroke: 'none', strokeWidth: 0 };
  const transform = { x: 400, y: 250, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 };
  switch (kind) {
    case 'rect':
      return { id: uid('ly'), name: '矩形', kind, visible: true, locked: false, attrs: { x: 0, y: 0, width: 140, height: 100, rx: 8 }, style: baseStyle, transform };
    case 'circle':
      return { id: uid('ly'), name: '圆形', kind, visible: true, locked: false, attrs: { cx: 0, cy: 0, r: 60 }, style: { ...baseStyle, fill: '#FF6A3D' }, transform };
    case 'ellipse':
      return { id: uid('ly'), name: '椭圆', kind, visible: true, locked: false, attrs: { cx: 0, cy: 0, rx: 80, ry: 40 }, style: { ...baseStyle, fill: '#B47CFF' }, transform };
    case 'polygon':
      return { id: uid('ly'), name: '三角形', kind, visible: true, locked: false, attrs: { points: '0,-50 50,40 -50,40' }, style: baseStyle, transform };
    case 'path':
      return { id: uid('ly'), name: '路径', kind, visible: true, locked: false, d: 'M 0 -50 C 50 -50 50 50 0 50 C -50 50 -50 -50 0 -50', attrs: {}, style: baseStyle, transform };
    case 'text':
      return { id: uid('ly'), name: '文字', kind, visible: true, locked: false, attrs: { x: 0, y: 0, fontSize: 56 }, style: { fill: '#F5F5F7', fontWeight: 700 }, transform, text: 'AniForge' };
    default:
      return { id: uid('ly'), name: '图层', kind: 'rect', visible: true, locked: false, attrs: { x: 0, y: 0, width: 100, height: 100 }, style: baseStyle, transform };
  }
}

function getBaseValue(layer: SvgLayer, property: SvgTrack['property']): number | string {
  switch (property) {
    case 'x':
      return layer.transform.x;
    case 'y':
      return layer.transform.y;
    case 'rotate':
      return layer.transform.rotate;
    case 'scaleX':
      return layer.transform.scaleX;
    case 'scaleY':
      return layer.transform.scaleY;
    case 'opacity':
      return layer.transform.opacity;
    case 'fill':
      return String(layer.style.fill ?? '#7CF9FF');
    default:
      return 0;
  }
}
