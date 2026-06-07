import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  SkipBack,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Diamond,
  Code2,
  Sliders,
  Layers3,
  Sparkles,
  Square,
  Circle,
  Hand,
  HandMetal,
  Pencil,
  Move3d,
  Grid3x3,
  Wand2,
  MousePointerClick,
  Heart,
  Smile,
  Activity,
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { cn, uid, formatTime, downloadFile } from '@/lib/utils';
import Live2DStage from '@/components/live2d/Live2DStage';
import { buildDefaultVertices, createDefaultCharacter, defaultAnchorFor, evalExpression } from '@/engine/live2d';
import type {
  Live2DMotion,
  Live2DPart,
  Live2DProjectData,
  Live2DParameter,
  Live2DKeyframe,
  EasingPreset,
} from '@/types';
import { exportCubismJson, exportProjectJson } from '@/lib/exporters';
import { LIVE2D_TEMPLATES } from '@/lib/templates';
import { applyMotions } from '@/engine/live2d-runtime';
import { sampleKeyframes } from '@/engine/easing';

const PART_PRESETS: { kind: Live2DPart['kind']; label: string; color: string }[] = [
  { kind: 'head', label: '头部', color: '#FFE0CC' },
  { kind: 'eye', label: '眼睛', color: '#7CF9FF' },
  { kind: 'mouth', label: '嘴巴', color: '#FF6A3D' },
  { kind: 'hair', label: '头发', color: '#FF6A3D' },
  { kind: 'body', label: '身体', color: '#2A2A38' },
  { kind: 'arm', label: '手臂', color: '#FFE0CC' },
  { kind: 'leg', label: '腿部', color: '#2A2A38' },
  { kind: 'accessory', label: '配饰', color: '#B47CFF' },
];

export default function Live2DStudio() {
  const params = useParams();
  const navigate = useNavigate();
  const project = useProjectStore((s) => s.current);
  const isDirty = useProjectStore((s) => s.isDirty);
  const lastSavedAt = useProjectStore((s) => s.lastSavedAt);
  const openProject = useProjectStore((s) => s.openProject);
  const createLive2DProject = useProjectStore((s) => s.createLive2DProject);
  const saveCurrent = useProjectStore((s) => s.saveCurrent);
  const setCurrentName = useProjectStore((s) => s.setCurrentName);

  const selectedPartId = useUIStore((s) => s.live2dSelectedPartId);
  const setSelectedPart = useUIStore((s) => s.setLive2dSelectedPart);
  const selectedParamId = useUIStore((s) => s.live2dSelectedParamId);
  const setSelectedParam = useUIStore((s) => s.setLive2dSelectedParam);
  const paramValues = useUIStore((s) => s.live2dParamValues);
  const setLive2dParam = useUIStore((s) => s.setLive2dParam);
  const playing = useUIStore((s) => s.live2dPlaying);
  const setPlaying = useUIStore((s) => s.setLive2dPlaying);
  const showMesh = useUIStore((s) => s.live2dShowMesh);
  const toggleMesh = useUIStore((s) => s.toggleLive2dMesh);
  const pushToast = useUIStore((s) => s.pushToast);

  const [time, setTime] = useState(0);
  const [tapTrigger, setTapTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      if (params.projectId) {
        await openProject(params.projectId);
        // 如果打开的项目没有部件,填充默认角色
        const cur = useProjectStore.getState().current;
        if (cur && cur.type === 'live2d') {
          const data = cur.data as Live2DProjectData;
          if (data.parts.length === 0) {
            useProjectStore.setState({
              current: { ...cur, data: createDefaultCharacter(data.canvas) },
              isDirty: true,
            });
            await useProjectStore.getState().saveCurrent();
          }
        }
      } else if (!project) {
        const p = await createLive2DProject();
        useProjectStore.setState({
          current: { ...p, data: createDefaultCharacter((p.data as Live2DProjectData).canvas) },
          isDirty: true,
        });
        await useProjectStore.getState().saveCurrent();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.projectId]);

  // 自动保存
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => {
      saveCurrent();
    }, 2500);
    return () => clearTimeout(t);
  }, [isDirty, saveCurrent]);

  // 播放循环
  useEffect(() => {
    if (!playing || !project || project.type !== 'live2d') return;
    let raf = 0;
    let last = performance.now();
    const start = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTime((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, project]);

  if (!project || project.type !== 'live2d') {
    return (
      <div className="h-[80vh] grid place-items-center text-fog">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 animate-spin text-neon-cyan" /> 正在准备 Live2D 工作台…
        </div>
      </div>
    );
  }

  const data = project.data as Live2DProjectData;
  const selectedPart = data.parts.find((p) => p.id === selectedPartId) ?? null;
  const selectedParam = data.parameters.find((p) => p.id === selectedParamId) ?? null;

  // 应用动作并混合
  const liveValues = useMemo(() => {
    const fromMotions = applyMotions(data.motions, time + tapTrigger * 10, paramValues);
    // 应用表情
    return fromMotions;
  }, [data.motions, time, tapTrigger, paramValues]);

  const updateData = (patch: Partial<Live2DProjectData>) => {
    useProjectStore.setState({
      current: { ...project, data: { ...data, ...patch } },
      isDirty: true,
    });
  };

  const updatePart = (id: string, patch: Partial<Live2DPart>) => {
    const parts = data.parts.map((p) => (p.id === id ? { ...p, ...patch } : p));
    updateData({ parts });
  };

  const addPart = (kind: Live2DPart['kind']) => {
    const preset = PART_PRESETS.find((p) => p.kind === kind)!;
    const part: Live2DPart = {
      id: uid('p'),
      name: `${preset.label} ${data.parts.length + 1}`,
      kind,
      z: data.parts.length * 10 + 10,
      visible: true,
      path: '',
      fill: preset.color,
      stroke: kind === 'body' ? '#0B0B12' : '#FFB4A0',
      meshRows: kind === 'body' ? 4 : kind === 'head' ? 5 : 2,
      meshCols: kind === 'head' ? 4 : kind === 'body' ? 3 : 3,
      vertices: [],
      anchor: defaultAnchorFor({ id: '', name: '', kind, z: 0, visible: true, path: '', fill: '', stroke: '', meshRows: 2, meshCols: 2, vertices: [], anchor: { x: 0, y: 0 }, bindings: [] } as Live2DPart, data.canvas.height),
      bindings: [],
    };
    part.vertices = buildDefaultVertices(part, data.canvas.width, data.canvas.height);
    updateData({ parts: [...data.parts, part] });
    setSelectedPart(part.id);
    pushToast('info', `已添加 ${preset.label}`);
  };

  const removePart = (id: string) => {
    updateData({ parts: data.parts.filter((p) => p.id !== id) });
  };

  const addParameter = () => {
    const id = uid('par');
    const idx = data.parameters.length + 1;
    const par: Live2DParameter = {
      id,
      name: `ParamCustom${idx}`,
      min: -1,
      max: 1,
      default: 0,
    };
    updateData({ parameters: [...data.parameters, par] });
    setSelectedParam(id);
  };

  const updateParameter = (id: string, patch: Partial<Live2DParameter>) => {
    updateData({ parameters: data.parameters.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  };

  const removeParameter = (id: string) => {
    updateData({ parameters: data.parameters.filter((p) => p.id !== id) });
  };

  const triggerMotion = (motionId: string) => {
    const m = data.motions.find((m) => m.id === motionId);
    if (!m) return;
    setTapTrigger((v) => v + 1);
    pushToast('info', `触发动作: ${m.name}`);
    // 简单实现:将动作中第一个 track 的关键帧写入 paramValues 一段时间
    const period = m.tracks.reduce((max, t) => {
      const last = t.keyframes[t.keyframes.length - 1]?.time ?? 0;
      return Math.max(max, last);
    }, 0);
    if (period <= 0) return;
    const start = performance.now();
    const apply = () => {
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed > period + 0.5) return;
      const local = Math.min(elapsed, period);
      const updates: Record<string, number> = {};
      for (const tr of m.tracks) {
        const v = sampleKeyframes(tr.keyframes, local);
        if (typeof v === 'number') updates[tr.parameterId] = v;
      }
      for (const [k, v] of Object.entries(updates)) {
        setLive2dParam(k, v);
      }
      if (elapsed < period + 0.5) requestAnimationFrame(apply);
    };
    requestAnimationFrame(apply);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Toolbar
        name={project.name}
        onName={setCurrentName}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        onBack={() => navigate('/')}
        onSave={async () => { await saveCurrent(); pushToast('success', '已保存'); }}
        onExportCubism={() => exportCubismJson(data, project.name)}
        onExportJson={() => exportProjectJson(project)}
        onResetTime={() => setTime(0)}
        time={time}
        playing={playing}
        onTogglePlay={() => setPlaying(!playing)}
        showMesh={showMesh}
        onToggleMesh={toggleMesh}
        onLoadTemplate={(id: string) => {
          const t = LIVE2D_TEMPLATES.find((x) => x.id === id);
          if (!t) return;
          updateData(t.build());
          pushToast('success', `已加载模板:${t.name}`);
        }}
      />

      <div className="flex-1 grid grid-cols-[260px_1fr_320px] grid-rows-[1fr_220px] overflow-hidden">
        {/* 左: 部件 */}
        <div className="row-span-1 border-r border-white/5 bg-ink-800/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <PanelHeader icon={Layers3} title="部件" rightSlot={
            <div className="relative">
              <button className="h-7 w-7 grid place-items-center rounded-md bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25 transition" title="添加部件">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1 z-30 glass border border-white/10 rounded-lg p-1 w-36 shadow-panel hidden group-hover:block" />
              <select
                onChange={(e) => {
                  if (e.target.value) addPart(e.target.value as Live2DPart['kind']);
                  e.target.value = '';
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="">+</option>
                {PART_PRESETS.map((p) => <option key={p.kind} value={p.kind}>{p.label}</option>)}
              </select>
            </div>
          } />
          <div className="p-2 grid grid-cols-2 gap-1 border-b border-white/5">
            {PART_PRESETS.map((p) => (
              <button
                key={p.kind}
                onClick={() => addPart(p.kind)}
                className="text-[11px] py-1.5 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/[0.06] text-fog hover:text-cream transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: p.color }} /> {p.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.parts.length === 0 && <div className="text-fog-dim text-[12px] text-center py-10 px-3">尚无部件,点击上方添加或载入模板</div>}
            {[...data.parts].sort((a, b) => b.z - a.z).map((p) => (
              <PartRow
                key={p.id}
                part={p}
                selected={p.id === selectedPartId}
                onSelect={() => setSelectedPart(p.id)}
                onToggleVisible={() => updatePart(p.id, { visible: !p.visible })}
                onRemove={() => removePart(p.id)}
              />
            ))}
          </div>
          <div className="border-t border-white/5 p-2.5 space-y-2">
            <div className="text-[10px] font-mono text-fog-dim">模板</div>
            <div className="grid grid-cols-1 gap-1.5">
              {LIVE2D_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    updateData(t.build());
                    pushToast('success', `已载入「${t.name}」`);
                  }}
                  className="text-[11px] py-1.5 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/[0.06] truncate text-left transition"
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 中: 画板 */}
        <div className="bg-ink-950 relative overflow-hidden grid place-items-center" onClick={() => {
          // 点击画板触发 tap 动作
          const tap = data.motions.find((m) => m.trigger === 'tap');
          if (tap) triggerMotion(tap.id);
        }}>
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative" style={{ width: data.canvas.width, height: data.canvas.height, maxHeight: 'calc(100vh - 16rem)' }}>
            <Live2DStage
              data={data}
              paramValues={liveValues}
              showMesh={showMesh}
              time={time}
              className="rounded-2xl shadow-panel"
            />
            <div className="absolute top-3 left-3 right-3 flex items-center gap-2 text-[10px] font-mono text-fog-dim">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
              LIVE2D STAGE · {data.parts.length} parts · {data.parameters.length} params
              <span className="flex-1" />
              <span>{Math.round(time * 100) / 100}s</span>
            </div>
            {/* 网格叠加 */}
            {showMesh && (
              <div className="absolute inset-0 pointer-events-none border border-ember/30 rounded-2xl">
                <div className="absolute inset-0 grid place-items-center text-ember/40 text-[10px] font-mono">MESH EDIT MODE</div>
              </div>
            )}
          </div>
        </div>

        {/* 右: 参数/动作/表达式 */}
        <div className="row-span-1 border-l border-white/5 bg-ink-800/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="h-9 border-b border-white/5 flex items-center text-[12px] font-medium text-fog">
            <TabButton active label="参数" />
            <TabButton label="动作" />
            <TabButton label="表情" />
            <TabButton label="部件" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* 参数面板 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-fog-dim">参数表</div>
                <button onClick={addParameter} className="h-6 px-2 rounded text-[10px] bg-white/5 hover:bg-white/10 text-fog hover:text-cream transition flex items-center gap-1">
                  <Plus className="w-3 h-3" /> 新增
                </button>
              </div>
              <div className="space-y-1.5">
                {data.parameters.map((p) => (
                  <ParameterRow
                    key={p.id}
                    parameter={p}
                    selected={p.id === selectedParamId}
                    value={liveValues[p.id] ?? p.default}
                    onSelect={() => setSelectedParam(p.id)}
                    onUpdate={(patch) => updateParameter(p.id, patch)}
                    onChangeValue={(v) => setLive2dParam(p.id, v)}
                    onRemove={() => removeParameter(p.id)}
                  />
                ))}
              </div>
              {selectedParam && (
                <ParameterInspector
                  parameter={selectedParam}
                  onUpdate={(patch) => updateParameter(selectedParam.id, patch)}
                />
              )}
            </div>

            {/* 动作列表 */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-fog-dim mb-2">动作</div>
              <div className="space-y-1.5">
                {data.motions.map((m) => (
                  <MotionRow
                    key={m.id}
                    motion={m}
                    onTrigger={() => triggerMotion(m.id)}
                    onUpdate={(patch) => updateData({ motions: data.motions.map((x) => (x.id === m.id ? { ...x, ...patch } : x)) })}
                    onRemove={() => updateData({ motions: data.motions.filter((x) => x.id !== m.id) })}
                    parameters={data.parameters}
                  />
                ))}
                <button
                  onClick={() => {
                    const m: Live2DMotion = {
                      id: uid('m'),
                      name: `动作 ${data.motions.length + 1}`,
                      trigger: 'tap',
                      fadeIn: 0.2,
                      fadeOut: 0.2,
                      loop: false,
                      tracks: [],
                    };
                    updateData({ motions: [...data.motions, m] });
                  }}
                  className="w-full text-[11px] py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-fog hover:text-cream border border-dashed border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> 新建动作
                </button>
              </div>
            </div>

            {/* 表达式 */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-fog-dim mb-2">表情</div>
              <div className="grid grid-cols-2 gap-1.5">
                {data.expressions.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      for (const sp of e.setParameters) {
                        setLive2dParam(sp.id, sp.value);
                      }
                      pushToast('success', `切换表情: ${e.name}`);
                    }}
                    className="text-[11px] py-2 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/[0.06] transition flex items-center gap-1.5"
                  >
                    <Smile className="w-3 h-3 text-neon-cyan" /> {e.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const id = uid('e');
                    updateData({
                      expressions: [...data.expressions, {
                        id,
                        name: `表情 ${data.expressions.length + 1}`,
                        setParameters: [],
                      }],
                    });
                  }}
                  className="text-[11px] py-2 px-2 rounded-md bg-white/[0.03] hover:bg-white/5 text-fog-dim border border-dashed border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> 新增
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 下: 时间线 + 部件属性 */}
        <div className="col-span-3 border-t border-white/5 bg-ink-800/40 backdrop-blur-sm">
          <PanelHeader
            icon={selectedPart ? Sliders : Diamond}
            title={selectedPart ? `部件属性 · ${selectedPart.name}` : '关键帧时间线'}
            rightSlot={
              <div className="flex items-center gap-3 text-[11px] font-mono text-fog-dim">
                <span>{formatTime(time)}</span>
                <button onClick={() => setTime(0)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5 text-fog hover:text-cream" title="重置">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPlaying(!playing)} className="h-7 w-7 grid place-items-center rounded-md bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25" title="播放/暂停">
                  {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            }
          />
          {selectedPart ? (
            <PartPropertyEditor
              part={selectedPart}
              parameters={data.parameters}
              onUpdate={(patch) => updatePart(selectedPart.id, patch)}
              onSelectParameter={(id) => setSelectedParam(id)}
            />
          ) : (
            <div className="p-6 text-center text-fog-dim text-sm">选择一个部件以编辑属性 / 关键帧</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toolbar(props: any) {
  return (
    <div className="border-b border-white/5 bg-ink-900/70 backdrop-blur-md px-4 h-12 flex items-center gap-3">
      <button onClick={props.onBack} className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5 text-fog hover:text-cream" title="返回">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="h-5 w-px bg-white/10" />
      <input
        value={props.name}
        onChange={(e) => props.onName(e.target.value)}
        className="bg-transparent outline-none text-sm font-medium w-56 focus:bg-white/5 px-2 py-1 rounded"
      />
      <span className="text-[10px] font-mono text-fog-dim">
        {props.isDirty ? '● 未保存' : props.lastSavedAt ? `已保存 ${new Date(props.lastSavedAt).toLocaleTimeString()}` : ''}
      </span>
      <div className="h-5 w-px bg-white/10" />
      <button onClick={props.onSave} className="btn-press h-8 px-3 rounded-md bg-white/5 hover:bg-white/10 text-sm flex items-center gap-1.5">
        <Save className="w-3.5 h-3.5" /> 保存
      </button>
      <button onClick={props.onExportCubism} className="btn-press h-8 px-3 rounded-md hover:bg-white/5 text-sm flex items-center gap-1.5 text-fog hover:text-cream">
        <Download className="w-3.5 h-3.5" /> Cubism JSON
      </button>
      <button onClick={props.onExportJson} className="btn-press h-8 px-3 rounded-md hover:bg-white/5 text-sm flex items-center gap-1.5 text-fog hover:text-cream">
        <Code2 className="w-3.5 h-3.5" /> 完整 JSON
      </button>
      <div className="flex-1" />
      <button
        onClick={props.onToggleMesh}
        className={cn(
          'btn-press h-8 px-3 rounded-md text-sm flex items-center gap-1.5 transition',
          props.showMesh ? 'bg-ember/20 text-ember' : 'bg-white/5 text-fog hover:bg-white/10',
        )}
      >
        <Grid3x3 className="w-3.5 h-3.5" /> 网格 {props.showMesh ? 'ON' : 'OFF'}
      </button>
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

function TabButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={cn('h-9 px-3.5 transition border-b-2', active ? 'text-cream border-neon-cyan' : 'text-fog border-transparent hover:text-cream')}>
      {label}
    </button>
  );
}

function PartRow({ part, selected, onSelect, onToggleVisible, onRemove }: any) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition border',
        selected
          ? 'bg-ember/10 border-ember/30 text-cream'
          : 'border-transparent text-fog hover:bg-white/5 hover:text-cream',
      )}
    >
      <span className="w-3 h-3 rounded-sm" style={{ background: part.fill, border: '1px solid rgba(255,255,255,0.1)' }} />
      <span className="text-[12px] truncate flex-1">{part.name}</span>
      <span className="text-[10px] font-mono text-fog-dim">z{part.z}</span>
      <button onClick={(e) => { e.stopPropagation(); onToggleVisible(); }} className="w-6 h-6 grid place-items-center opacity-60 hover:opacity-100">
        {part.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      </button>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="w-6 h-6 grid place-items-center opacity-0 group-hover:opacity-60 hover:!opacity-100 text-rose-300">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function ParameterRow({
  parameter,
  selected,
  value,
  onSelect,
  onUpdate,
  onChangeValue,
  onRemove,
}: {
  parameter: Live2DParameter;
  selected: boolean;
  value: number;
  onSelect: () => void;
  onUpdate: (patch: Partial<Live2DParameter>) => void;
  onChangeValue: (v: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group rounded-md border transition px-2.5 py-1.5 cursor-pointer',
        selected ? 'bg-neon-cyan/10 border-neon-cyan/30' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/5',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono">{parameter.name}</span>
        <span className="text-[10px] text-fog-dim font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={parameter.min}
        max={parameter.max}
        step={0.01}
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
        onClick={(e) => e.stopPropagation()}
        className="af-range mt-1"
      />
      <div className="flex items-center justify-between text-[10px] font-mono text-fog-dim">
        <span>{parameter.min}</span>
        <span>{parameter.max}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="mt-1 text-[10px] text-rose-300/0 group-hover:text-rose-300/80 hover:!text-rose-300 transition"
      >
        删除
      </button>
    </div>
  );
}

function ParameterInspector({ parameter, onUpdate }: { parameter: Live2DParameter; onUpdate: (patch: Partial<Live2DParameter>) => void }) {
  return (
    <div className="mt-3 glass rounded-lg border border-white/10 p-3 space-y-2">
      <div className="text-[10px] font-mono uppercase text-fog-dim">参数详情</div>
      <Field label="名称 (Cubism 风格)">
        <input
          value={parameter.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] font-mono outline-none focus:border-neon-cyan"
        />
      </Field>
      <div className="grid grid-cols-3 gap-1.5">
        <Field label="最小">
          <input type="number" value={parameter.min} onChange={(e) => onUpdate({ min: Number(e.target.value) })} className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
        </Field>
        <Field label="默认">
          <input type="number" value={parameter.default} onChange={(e) => onUpdate({ default: Number(e.target.value) })} className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
        </Field>
        <Field label="最大">
          <input type="number" value={parameter.max} onChange={(e) => onUpdate({ max: Number(e.target.value) })} className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
        </Field>
      </div>
      <Field label="表达式 (可选)">
        <input
          value={parameter.expression ?? ''}
          placeholder="例: ParamAngleX * 0.5 + 0.2"
          onChange={(e) => onUpdate({ expression: e.target.value })}
          className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] font-mono outline-none focus:border-neon-cyan"
        />
      </Field>
    </div>
  );
}

function MotionRow({ motion, onTrigger, onUpdate, onRemove, parameters }: { motion: Live2DMotion; onTrigger: () => void; onUpdate: (patch: Partial<Live2DMotion>) => void; onRemove: () => void; parameters: Live2DParameter[] }) {
  return (
    <div className="rounded-md bg-white/[0.02] border border-white/[0.06] p-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onTrigger}
          className="h-6 px-2 rounded text-[10px] font-mono bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25 flex items-center gap-1"
        >
          <Play className="w-3 h-3" /> 触发
        </button>
        <input
          value={motion.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="bg-transparent flex-1 text-[12px] outline-none focus:bg-white/5 px-1.5 py-0.5 rounded"
        />
        <select
          value={motion.trigger}
          onChange={(e) => onUpdate({ trigger: e.target.value as Live2DMotion['trigger'] })}
          className="text-[10px] bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 outline-none"
        >
          {['idle', 'tap', 'flick', 'shake', 'custom'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-1 text-[10px] text-fog-dim">
          <input type="checkbox" checked={motion.loop} onChange={(e) => onUpdate({ loop: e.target.checked })} />
          循环
        </label>
        <button onClick={onRemove} className="w-6 h-6 grid place-items-center text-rose-300/60 hover:text-rose-300">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {motion.tracks.length > 0 && (
        <div className="mt-2 space-y-1">
          {motion.tracks.map((tr, i) => {
            const par = parameters.find((p) => p.id === tr.parameterId);
            return (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-fog-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                <span className="text-ember">{par?.name ?? tr.parameterId}</span>
                <span className="ml-2">→</span>
                <span className="text-fog">{tr.keyframes.length} 关键帧</span>
                <button
                  onClick={() => onUpdate({ tracks: motion.tracks.filter((_, idx) => idx !== i) })}
                  className="ml-auto w-4 h-4 grid place-items-center text-rose-300/60 hover:text-rose-300"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => {
          const used = new Set(motion.tracks.map((t) => t.parameterId));
          const available = parameters.find((p) => !used.has(p.id));
          if (!available) return;
          onUpdate({
            tracks: [
              ...motion.tracks,
              {
                parameterId: available.id,
                keyframes: [
                  { time: 0, value: available.default, easing: 'easeInOut' },
                  { time: 0.5, value: available.default + (available.max - available.default) * 0.5, easing: 'easeOutBack' },
                ],
              },
            ],
          });
        }}
        className="mt-2 w-full text-[10px] py-1 rounded bg-white/5 hover:bg-white/10 text-fog hover:text-cream transition flex items-center justify-center gap-1"
      >
        <Plus className="w-3 h-3" /> 添加参数轨道
      </button>
    </div>
  );
}

function PartPropertyEditor({ part, parameters, onUpdate, onSelectParameter }: { part: Live2DPart; parameters: Live2DParameter[]; onUpdate: (patch: Partial<Live2DPart>) => void; onSelectParameter: (id: string) => void }) {
  return (
    <div className="p-3 grid grid-cols-3 gap-3 overflow-y-auto" style={{ maxHeight: 200 }}>
      <Field2 label="名称">
        <input value={part.name} onChange={(e) => onUpdate({ name: e.target.value })} className="w-full bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
      </Field2>
      <Field2 label="填充">
        <input type="color" value={part.fill} onChange={(e) => onUpdate({ fill: e.target.value })} className="w-10 h-7 rounded border border-white/10 bg-transparent" />
      </Field2>
      <Field2 label="描边">
        <input type="color" value={part.stroke} onChange={(e) => onUpdate({ stroke: e.target.value })} className="w-10 h-7 rounded border border-white/10 bg-transparent" />
      </Field2>
      <Field2 label="网格 行×列">
        <div className="flex items-center gap-1.5">
          <input type="number" min={1} max={10} value={part.meshRows} onChange={(e) => onUpdate({ meshRows: Number(e.target.value), vertices: buildDefaultVertices({ ...part, meshRows: Number(e.target.value) }, 600, 720) })} className="w-14 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
          <span className="text-fog-dim">×</span>
          <input type="number" min={1} max={10} value={part.meshCols} onChange={(e) => onUpdate({ meshCols: Number(e.target.value), vertices: buildDefaultVertices({ ...part, meshCols: Number(e.target.value) }, 600, 720) })} className="w-14 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
        </div>
      </Field2>
      <Field2 label="锚点 X / Y">
        <div className="flex items-center gap-1.5">
          <input type="number" value={part.anchor.x} onChange={(e) => onUpdate({ anchor: { ...part.anchor, x: Number(e.target.value) } })} className="w-16 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
          <input type="number" value={part.anchor.y} onChange={(e) => onUpdate({ anchor: { ...part.anchor, y: Number(e.target.value) } })} className="w-16 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
        </div>
      </Field2>
      <Field2 label="Z 序">
        <input type="number" value={part.z} onChange={(e) => onUpdate({ z: Number(e.target.value) })} className="w-20 bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-neon-cyan" />
      </Field2>

      <div className="col-span-3">
        <div className="text-[10px] font-mono uppercase text-fog-dim mb-1.5">参数绑定</div>
        <div className="space-y-1">
          {part.bindings.map((b, i) => {
            const par = parameters.find((p) => p.id === b.parameterId);
            return (
              <div key={i} className="flex items-center gap-2 text-[12px] bg-white/[0.02] border border-white/[0.05] rounded px-2 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                <button onClick={() => par && onSelectParameter(par.id)} className="font-mono text-ember hover:underline">{par?.name ?? b.parameterId}</button>
                <span className="text-fog-dim text-[10px]">mode:</span>
                <select
                  value={b.mode}
                  onChange={(e) => {
                    const newBindings = [...part.bindings];
                    newBindings[i] = { ...b, mode: e.target.value as any };
                    onUpdate({ bindings: newBindings });
                  }}
                  className="bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 text-[10px] outline-none"
                >
                  {['translate', 'scale', 'rotate', 'vertex'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="text-fog-dim text-[10px]">权重</span>
                <input
                  type="number" step={0.05} value={b.weight}
                  onChange={(e) => {
                    const newBindings = [...part.bindings];
                    newBindings[i] = { ...b, weight: Number(e.target.value) };
                    onUpdate({ bindings: newBindings });
                  }}
                  className="w-16 bg-ink-700 border border-white/10 rounded px-1.5 py-0.5 text-[12px] outline-none"
                />
                <button
                  onClick={() => onUpdate({ bindings: part.bindings.filter((_, idx) => idx !== i) })}
                  className="ml-auto w-5 h-5 grid place-items-center text-rose-300/60 hover:text-rose-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          <button
            onClick={() => {
              const used = new Set(part.bindings.map((b) => b.parameterId));
              const available = parameters.find((p) => !used.has(p.id));
              if (!available) return;
              onUpdate({
                bindings: [...part.bindings, { parameterId: available.id, mode: 'translate', weight: 1 }],
              });
            }}
            className="w-full text-[11px] py-1.5 rounded bg-white/5 hover:bg-white/10 text-fog hover:text-cream border border-dashed border-white/10 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> 绑定参数
          </button>
        </div>
      </div>
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

function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono text-fog-dim">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
