import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Trash2, Copy, GripVertical, ChevronRight, ChevronDown, Save, Download, Share2,
  Sparkles, FileText, Settings2, X, Eye, Edit3, Maximize2, ArrowLeft
} from 'lucide-react';
import { useScriptStore } from '@/stores/scriptStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { templatesApi } from '@/api/templates';
import { generateId, formatRelative } from '@/utils/format';
import { parsePrompt, extractVariableKeys, estimateTokens, renderPromptText } from '@/utils/promptRenderer';
import type { Template, Scene, SceneType, Variable } from '@/types';

const sceneTypeLabel: Record<SceneType, string> = {
  opening: '开场',
  conflict: '冲突',
  climax: '高潮',
  ending: '结局',
  custom: '自定义',
};

const sceneTypeColor: Record<SceneType, string> = {
  opening: 'border-l-moss',
  conflict: 'border-l-wine',
  climax: 'border-l-gold-500',
  ending: 'border-l-cream-100/40',
  custom: 'border-l-ink-500',
};

const editorFonts = {
  sm: 'text-sm',
  md: 'text-[15px]',
  lg: 'text-base',
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptStore = useScriptStore();
  const settings = useSettingsStore();
  const showToast = useUIStore((s) => s.showToast);

  const [script, setScript] = useState(() => {
    if (id) return scriptStore.getScript(id);
    return undefined;
  });
  const [template, setTemplate] = useState<Template | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [collapsedScenes, setCollapsedScenes] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'edit' | 'preview' | 'split'>(settings.editorMode);
  const [varPanelOpen, setVarPanelOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = scriptStore.getScript(id);
    if (found) {
      setScript(found);
      setActiveSceneId(found.scenes[0]?.id || null);
      if (found.templateId) {
        templatesApi.byId(found.templateId).then((t) => setTemplate(t || null));
      }
    } else {
      showToast('剧本不存在', 'error');
      navigate('/scripts');
    }
  }, [id]);

  // 自动保存
  useEffect(() => {
    if (!script) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      scriptStore.updateScript(script.id, script);
      setIsSaving(false);
    }, settings.autoSaveInterval * 1000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [script]);

  if (!script) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="font-display text-2xl text-cream-200/40">正在加载剧本...</p>
      </div>
    );
  }

  const activeScene = script.scenes.find((s) => s.id === activeSceneId) || script.scenes[0];

  const allVars = useMemo(() => {
    // 合并模板定义的变量 + 剧本中提取出的变量
    const fromTemplate = template?.variables || [];
    const keysInScript = new Set<string>();
    script.scenes.forEach((s) => {
      extractVariableKeys(s.prompt).forEach((k) => keysInScript.add(k));
    });
    const templateKeys = new Set(fromTemplate.map((v) => v.key));
    const customVars: Variable[] = [];
    keysInScript.forEach((k) => {
      if (!templateKeys.has(k)) {
        customVars.push({
          key: k,
          label: k,
          defaultValue: script.variables[k] || '',
          type: 'text',
        });
      }
    });
    return [...fromTemplate, ...customVars];
  }, [template, script]);

  // —— 剧本树操作 ——
  const updateScene = (sceneId: string, patch: Partial<Scene>) => {
    setScript({ ...script, scenes: script.scenes.map((s) => (s.id === sceneId ? { ...s, ...patch } : s)) });
  };

  const deleteScene = (sceneId: string) => {
    if (script.scenes.length === 1) {
      showToast('至少需要保留一个场景', 'error');
      return;
    }
    const newScenes = script.scenes
      .filter((s) => s.id !== sceneId)
      .map((s, i) => ({ ...s, order: i + 1 }));
    setScript({ ...script, scenes: newScenes });
    if (activeSceneId === sceneId) {
      setActiveSceneId(newScenes[0]?.id || null);
    }
  };

  const addScene = (type: SceneType = 'custom') => {
    const newScene: Scene = {
      id: generateId('scene'),
      order: script.scenes.length + 1,
      title: `新场景 ${script.scenes.length + 1}`,
      type,
      prompt: '在这里写下提示词... 使用 {{变量名}} 插入占位符。',
      duration: 0,
    };
    setScript({ ...script, scenes: [...script.scenes, newScene] });
    setActiveSceneId(newScene.id);
  };

  const moveScene = (from: number, to: number) => {
    if (to < 0 || to >= script.scenes.length) return;
    const newScenes = [...script.scenes];
    const [moved] = newScenes.splice(from, 1);
    newScenes.splice(to, 0, moved);
    setScript({ ...script, scenes: newScenes.map((s, i) => ({ ...s, order: i + 1 })) });
  };

  const toggleCollapse = (sceneId: string) => {
    setCollapsedScenes((prev) => {
      const next = new Set(prev);
      if (next.has(sceneId)) next.delete(sceneId);
      else next.add(sceneId);
      return next;
    });
  };

  // —— 变量操作 ——
  const updateVariable = (key: string, value: string) => {
    setScript({ ...script, variables: { ...script.variables, [key]: value } });
  };

  // —— 整体操作 ——
  const handleSave = () => {
    scriptStore.updateScript(script.id, script);
    showToast('已保存到云端', 'success');
  };

  const handleExport = () => {
    const text = script.scenes
      .map((s) => `## ${s.title}\n\n${renderPromptText(s.prompt, script.variables)}`)
      .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已导出 Markdown');
  };

  const handleCopy = () => {
    const text = script.scenes
      .map((s) => `## ${s.title}\n\n${renderPromptText(s.prompt, script.variables)}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  };

  const handleSendToAI = () => {
    showToast('已发送至 AI 模型（演示版）', 'info');
  };

  const totalTokens = useMemo(() => {
    const allText = script.scenes.map((s) => renderPromptText(s.prompt, script.variables)).join('\n');
    return estimateTokens(allText);
  }, [script.scenes, script.variables]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-ink-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gold-500/20 bg-ink-800/60 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={() => navigate('/scripts')}
            className="btn-ghost"
            title="返回"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
          </button>
          <div className="hidden h-5 w-px bg-ink-500 sm:block" />
          <input
            type="text"
            value={script.title}
            onChange={(e) => setScript({ ...script, title: e.target.value })}
            className="min-w-0 flex-1 bg-transparent font-display text-lg font-semibold text-cream-50 outline-none placeholder:text-cream-200/30"
            placeholder="未命名剧本"
          />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-cream-200/30 lg:inline">
            · 上次更新 {formatRelative(script.updatedAt)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 rounded-none border border-ink-500 p-0.5 md:flex">
            <button
              onClick={() => setView('edit')}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${view === 'edit' ? 'bg-gold-500 text-ink-900' : 'text-cream-200/60 hover:text-cream-100'}`}
              title="仅编辑"
            >
              <Edit3 size={12} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setView('split')}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${view === 'split' ? 'bg-gold-500 text-ink-900' : 'text-cream-200/60 hover:text-cream-100'}`}
              title="分屏"
            >
              <Maximize2 size={12} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setView('preview')}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${view === 'preview' ? 'bg-gold-500 text-ink-900' : 'text-cream-200/60 hover:text-cream-100'}`}
              title="仅预览"
            >
              <Eye size={12} strokeWidth={1.5} />
            </button>
          </div>
          <button onClick={handleCopy} className="btn-ghost" title="复制">
            <Copy size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">复制</span>
          </button>
          <button onClick={handleExport} className="btn-ghost" title="导出">
            <Download size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">导出</span>
          </button>
          <button onClick={handleSave} className="btn-outline">
            <Save size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">保存</span>
          </button>
          <button onClick={handleSendToAI} className="btn-primary">
            <Sparkles size={14} strokeWidth={2} />
            <span className="hidden sm:inline">投递 AI</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Scene Tree */}
        <div className="hidden w-72 flex-shrink-0 overflow-y-auto border-r border-gold-500/15 bg-ink-800/40 p-3 md:block">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
              · 剧本树
            </p>
            <span className="font-mono text-[10px] text-cream-200/40">
              {script.scenes.length} 场景
            </span>
          </div>

          <div className="space-y-1.5">
            {script.scenes.map((scene, idx) => {
              const isActive = scene.id === activeSceneId;
              const isCollapsed = collapsedScenes.has(scene.id);
              return (
                <div
                  key={scene.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', String(idx))}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = Number(e.dataTransfer.getData('text/plain'));
                    moveScene(from, idx);
                  }}
                  className={`group relative cursor-pointer border-l-2 ${sceneTypeColor[scene.type]} transition-all ${
                    isActive
                      ? 'bg-gold-500/10'
                      : 'bg-ink-700/40 hover:bg-ink-700/70'
                  }`}
                  onClick={() => setActiveSceneId(scene.id)}
                >
                  <div className="flex items-start gap-2 p-2.5">
                    <GripVertical size={12} className="mt-1 flex-shrink-0 cursor-grab text-cream-200/20 active:cursor-grabbing" />
                    <div className="scene-badge flex-shrink-0 !min-w-[24px] !h-6 text-[10px]">
                      {String(scene.order).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={scene.title}
                        onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full truncate bg-transparent text-sm font-medium text-cream-100 outline-none"
                      />
                      <p className="mt-0.5 truncate font-mono text-[10px] text-cream-200/40">
                        {sceneTypeLabel[scene.type]}
                        {scene.duration ? ` · ${scene.duration < 60 ? scene.duration + 's' : Math.round(scene.duration / 60) + 'min'}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(scene.id);
                      }}
                      className="text-cream-200/30 hover:text-cream-100"
                    >
                      {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                  {!isCollapsed && (
                    <div className="border-t border-ink-600 px-2.5 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="line-clamp-2 font-mono text-[10px] leading-relaxed text-cream-200/40">
                        {scene.prompt.slice(0, 80)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => addScene('custom')}
            className="mt-3 flex w-full items-center justify-center gap-1.5 border border-dashed border-ink-500 px-3 py-2 text-xs text-cream-200/40 transition-all hover:border-gold-500 hover:text-gold-500"
          >
            <Plus size={12} strokeWidth={1.5} />
            添加场景
          </button>

          <div className="mt-6 border-t border-ink-600 pt-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
              · 元数据
            </p>
            <div className="space-y-2 text-xs text-cream-200/60">
              <div className="flex justify-between">
                <span>场景</span>
                <span className="text-cream-100">{script.scenes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>变量</span>
                <span className="text-cream-100">{Object.keys(script.variables).length}</span>
              </div>
              <div className="flex justify-between">
                <span>预估 Token</span>
                <span className="text-gold-500">~{totalTokens}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Editor */}
        {view !== 'preview' && activeScene && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-600 bg-ink-800/30 px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="scene-badge">{String(activeScene.order).padStart(2, '0')}</span>
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={(e) => updateScene(activeScene.id, { title: e.target.value })}
                  className="bg-transparent font-display text-xl font-bold text-cream-50 outline-none"
                />
                <select
                  value={activeScene.type}
                  onChange={(e) => updateScene(activeScene.id, { type: e.target.value as SceneType })}
                  className="input-base !w-auto !py-1 !text-xs"
                >
                  {(Object.keys(sceneTypeLabel) as SceneType[]).map((t) => (
                    <option key={t} value={t}>
                      {sceneTypeLabel[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const idx = script.scenes.findIndex((s) => s.id === activeScene.id);
                    if (idx > 0) moveScene(idx, idx - 1);
                  }}
                  className="btn-ghost !p-1.5"
                  title="上移"
                >
                  <ChevronDown size={14} className="rotate-180" />
                </button>
                <button
                  onClick={() => {
                    const idx = script.scenes.findIndex((s) => s.id === activeScene.id);
                    if (idx < script.scenes.length - 1) moveScene(idx, idx + 1);
                  }}
                  className="btn-ghost !p-1.5"
                  title="下移"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => {
                    const copy = { ...activeScene, id: generateId('scene') };
                    const idx = script.scenes.findIndex((s) => s.id === activeScene.id);
                    const newScenes = [...script.scenes];
                    newScenes.splice(idx + 1, 0, { ...copy, order: idx + 2 });
                    setScript({ ...script, scenes: newScenes.map((s, i) => ({ ...s, order: i + 1 })) });
                    showToast('场景已复制');
                  }}
                  className="btn-ghost !p-1.5"
                  title="复制"
                >
                  <Copy size={14} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => deleteScene(activeScene.id)}
                  className="btn-ghost !p-1.5 hover:!text-wine"
                  title="删除"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl">
                <div className="mb-2 flex items-center gap-2 text-xs text-cream-200/40">
                  <FileText size={12} strokeWidth={1.5} />
                  <span>提示词正文</span>
                  <span className="ml-auto font-mono text-[10px]">
                    {activeScene.prompt.length} 字符
                  </span>
                </div>
                <textarea
                  value={activeScene.prompt}
                  onChange={(e) => updateScene(activeScene.id, { prompt: e.target.value })}
                  className={`input-base min-h-[300px] resize-none !bg-ink-800/40 font-mono ${editorFonts[settings.fontSize]} leading-relaxed`}
                  placeholder="在这里写下你的提示词... 使用 {{变量名}} 插入占位符"
                />
                <div className="mt-3 flex items-center gap-3 text-xs text-cream-200/40">
                  <input
                    type="number"
                    value={activeScene.duration || 0}
                    onChange={(e) => updateScene(activeScene.id, { duration: Number(e.target.value) })}
                    className="input-base !w-24 !py-1"
                    placeholder="时长"
                  />
                  <span>秒（0 表示不限制）</span>
                </div>

                <div className="mt-6 border-t border-ink-600 pt-4">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                    · 提取的变量
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(extractVariableKeys(activeScene.prompt))).map((key) => {
                      const defined = allVars.find((v) => v.key === key);
                      return (
                        <span
                          key={key}
                          className="tag"
                          title={defined?.label || '未定义变量'}
                        >
                          {`{{${key}}}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Variable Panel / Preview */}
        <div
          className={`flex flex-shrink-0 flex-col border-l border-gold-500/15 bg-ink-800/40 ${
            view === 'edit' ? 'w-80' : 'w-[480px]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5">
            <div className="flex items-center gap-3">
              {view === 'edit' ? (
                <>
                  <Settings2 size={13} className="text-gold-500" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                    · 变量面板
                  </p>
                </>
              ) : (
                <>
                  <Eye size={13} className="text-gold-500" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
                    · 实时预览
                  </p>
                </>
              )}
            </div>
            {view === 'edit' && (
              <button
                onClick={() => setVarPanelOpen(!varPanelOpen)}
                className="btn-ghost !p-1"
              >
                {varPanelOpen ? <X size={12} /> : <Settings2 size={12} />}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {view === 'edit' && varPanelOpen && (
              <div className="space-y-4 p-4">
                {allVars.length === 0 && (
                  <p className="font-mono text-xs text-cream-200/30">剧本中暂未定义变量</p>
                )}
                {allVars.map((v) => (
                  <div key={v.key}>
                    <label className="mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold-500">
                        {`{{${v.key}}}`}
                      </span>
                      <span className="text-[10px] text-cream-200/40">{v.label}</span>
                    </label>
                    {v.type === 'select' && v.options ? (
                      <select
                        value={script.variables[v.key] ?? v.defaultValue}
                        onChange={(e) => updateVariable(v.key, e.target.value)}
                        className="input-base"
                      >
                        {v.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : v.type === 'textarea' ? (
                      <textarea
                        value={script.variables[v.key] ?? v.defaultValue}
                        onChange={(e) => updateVariable(v.key, e.target.value)}
                        className="input-base min-h-[80px] resize-none"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={script.variables[v.key] ?? v.defaultValue}
                        onChange={(e) => updateVariable(v.key, e.target.value)}
                        className="input-base"
                        placeholder={v.defaultValue}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {(view === 'preview' || view === 'split') && activeScene && (
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">
                    渲染结果 · 场景 {String(activeScene.order).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] text-gold-500">
                    ~{estimateTokens(activeScene.prompt)} tokens
                  </span>
                </div>
                <div className="rounded-none border border-ink-600 bg-ink-900/60 p-4 font-mono text-sm leading-relaxed text-cream-200/90">
                  {parsePrompt(activeScene.prompt, script.variables).map((part) =>
                    part.type === 'variable' ? (
                      <span key={part.key} className={`variable-chip ${part.missing ? 'missing' : ''}`}>
                        {part.value}
                      </span>
                    ) : (
                      <span key={part.key} className="whitespace-pre-wrap">{part.value}</span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-ink-600 px-4 py-3 text-[10px] text-cream-200/30">
            <div className="flex items-center justify-between">
              <span>合计 ~{totalTokens} tokens</span>
              <span>· {script.scenes.length} 场景</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
