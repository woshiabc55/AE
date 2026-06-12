import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  ArrowLeft,
  Plus,
  Play,
  Download,
  Settings,
  Trash2,
  Copy,
  Film,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/storyboardStore';
import { PROJECT_TYPE_LABELS } from '@/lib/types';
import { downloadJson, formatDuration, totalDuration } from '@/lib/utils';
import PanelCard from '@/components/PanelCard';
import PanelForm from '@/components/PanelForm';

export default function Editor() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const project = useStore((s) => s.projects.find((p) => p.id === projectId));
  const addPanel = useStore((s) => s.addPanel);
  const updatePanel = useStore((s) => s.updatePanel);
  const deletePanel = useStore((s) => s.deletePanel);
  const duplicatePanel = useStore((s) => s.duplicatePanel);
  const reorderPanels = useStore((s) => s.reorderPanels);
  const updateProject = useStore((s) => s.updateProject);
  const deleteProject = useStore((s) => s.deleteProject);
  const duplicateProject = useStore((s) => s.duplicateProject);
  const exportToJson = useStore((s) => s.exportToJson);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(project?.title ?? '');

  useEffect(() => {
    if (project) {
      setDraftTitle(project.title);
      // 默认选中第一张
      if (!selectedId && project.panels[0]) {
        setSelectedId(project.panels[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const totalDur = useMemo(() => (project ? totalDuration(project.panels) : 0), [project]);

  if (!project) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-paper-100">
        <p className="serif text-2xl text-ink-700">项目不存在</p>
        <Link to="/" className="btn-outline mt-4">
          <ArrowLeft className="w-4 h-4" /> 返回笔记本
        </Link>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = project.panels.findIndex((p) => p.id === active.id);
    const newIndex = project.panels.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    // 立即更新 UI(本地)
    arrayMove(project.panels, oldIndex, newIndex);
    reorderPanels(project.id, oldIndex, newIndex);
  };

  const selectedPanel = project.panels.find((p) => p.id === selectedId);
  const selectedIndex = project.panels.findIndex((p) => p.id === selectedId);

  return (
    <div className="h-full w-full flex flex-col bg-paper-100">
      {/* 顶部条 */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-ink-900/15 bg-paper-50">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link to="/" className="text-ink-500 hover:text-ink-900 transition-colors p-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span
            className="w-1 h-6 rounded-sm shrink-0"
            style={{ background: project.color }}
          />
          <div className="min-w-0 flex-1">
            {editingTitle ? (
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={() => {
                  updateProject(project.id, { title: draftTitle.trim() || '未命名项目' });
                  setEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  if (e.key === 'Escape') {
                    setDraftTitle(project.title);
                    setEditingTitle(false);
                  }
                }}
                autoFocus
                className="serif text-xl font-semibold bg-transparent border-b border-ink-900 outline-none text-ink-900 w-full max-w-md"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="serif text-xl font-semibold text-ink-900 truncate hover:underline decoration-1 underline-offset-4 text-left"
              >
                {project.title}
              </button>
            )}
            <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] text-ink-400 uppercase mt-0.5">
              <span style={{ color: project.color }}>{PROJECT_TYPE_LABELS[project.type]}</span>
              <span className="text-ink-400/40">·</span>
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span className="num">{project.panels.length}</span>
                <span>镜</span>
              </span>
              <span className="text-ink-400/40">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="num">{formatDuration(totalDur)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="btn-outline"
            onClick={() => addPanel(project.id)}
          >
            <Plus className="w-4 h-4" /> 加一镜
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate(`/projects/${project.id}/present`)}
            disabled={project.panels.length === 0}
          >
            <Play className="w-4 h-4" /> 演示
          </button>
          <button
            className="btn-ink"
            onClick={() =>
              downloadJson(
                `${project.title.replace(/[^\w一-龥]+/g, '-')}.json`,
                JSON.parse(exportToJson(project.id))
              )
            }
          >
            <Download className="w-4 h-4" /> 导出
          </button>
        </div>
      </header>

      {/* 主体三栏 */}
      <div className="flex-1 flex min-h-0">
        {/* 中部画布 */}
        <main className="flex-1 overflow-y-auto">
          <div className="notebook-bg min-h-full px-8 py-6">
            {project.panels.length === 0 ? (
              <div className="max-w-md mx-auto mt-20 text-center">
                <svg
                  viewBox="0 0 200 140"
                  className="mx-auto mb-3 w-40 h-28 text-ink-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="30" y="30" width="140" height="90" strokeOpacity="0.5" strokeDasharray="4 3" />
                  <line x1="50" y1="60" x2="150" y2="60" strokeOpacity="0.4" />
                  <line x1="50" y1="75" x2="120" y2="75" strokeOpacity="0.4" />
                  <line x1="50" y1="90" x2="130" y2="90" strokeOpacity="0.4" />
                  <path d="M150 100 L185 65 L195 75 L160 110 Z" strokeOpacity="0.85" />
                </svg>
                <h3 className="serif text-2xl font-semibold text-ink-900">开始你的第一镜</h3>
                <p className="text-sm text-ink-500 mt-1.5">
                  想一想:这一场戏的第一个画面是什么?
                </p>
                <button
                  className="btn-ink mt-5"
                  onClick={() => addPanel(project.id)}
                >
                  <Plus className="w-4 h-4" /> 加一镜
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={project.panels.map((p) => p.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
                    {project.panels.map((panel, idx) => (
                      <div
                        key={panel.id}
                        style={{
                          animationDelay: `${idx * 50}ms`,
                          // 错位旋转,营造手作感
                          transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 0.18}deg)`,
                        }}
                      >
                        <PanelCard
                          panel={panel}
                          index={idx}
                          color={project.color}
                          selected={selectedId === panel.id}
                          onSelect={() => setSelectedId(panel.id)}
                          onDelete={() => {
                            deletePanel(project.id, panel.id);
                            if (selectedId === panel.id) {
                              const next = project.panels[idx + 1] || project.panels[idx - 1];
                              setSelectedId(next ? next.id : null);
                            }
                          }}
                          onDuplicate={() => duplicatePanel(project.id, panel.id)}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="mt-8 max-w-7xl mx-auto">
              <button
                onClick={() => addPanel(project.id)}
                className="w-full py-4 border-2 border-dashed border-ink-900/20 text-ink-500 hover:border-ink-900 hover:text-ink-900 hover:bg-paper-50 transition-colors flex items-center justify-center gap-2 text-sm font-mono tracking-wider"
              >
                <Plus className="w-4 h-4" /> 加一镜
              </button>
            </div>
          </div>
        </main>

        {/* 右侧详情面板 */}
        {selectedPanel ? (
          <div className="w-[420px] shrink-0 animate-slideRight">
            <PanelForm
              panel={selectedPanel}
              index={selectedIndex}
              color={project.color}
              onChange={(patch) => updatePanel(project.id, selectedPanel.id, patch)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        ) : (
          <aside className="w-[280px] shrink-0 border-l border-ink-900/15 bg-paper-50 p-5 hidden lg:flex flex-col">
            <ProjectMeta
              project={project}
              onUpdateProject={(patch) => updateProject(project.id, patch)}
              onDeleteProject={() => {
                if (confirm(`确定要删除「${project.title}」?此操作不可撤销。`)) {
                  deleteProject(project.id);
                  navigate('/');
                }
              }}
              onDuplicateProject={() => {
                const newId = duplicateProject(project.id);
                if (newId) navigate(`/projects/${newId}`);
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function ProjectMeta({
  project,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: {
  project: { id: string; title: string; type: string; description: string; color: string; createdAt: number; updatedAt: number };
  onUpdateProject: (patch: { description?: string; color?: string }) => void;
  onDeleteProject: () => void;
  onDuplicateProject: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-ink-400 uppercase flex items-center gap-2">
          <Settings className="w-3 h-3" /> 元信息
        </div>
        <h3 className="serif text-lg font-semibold text-ink-900 mt-1">关于这个本子</h3>
      </div>

      <div>
        <div className="text-[10px] text-ink-400 tracking-wider mb-1">简介</div>
        <textarea
          className="input-ink"
          rows={4}
          placeholder="写两句项目的简介..."
          value={project.description}
          onChange={(e) => onUpdateProject({ description: e.target.value })}
        />
      </div>

      <div>
        <div className="text-[10px] text-ink-400 tracking-wider mb-1">主色</div>
        <div className="flex items-center gap-2 flex-wrap">
          {['#7A1F1F', '#B8741A', '#1F2D5C', '#2F4A2D', '#5A2A82', '#1A1814'].map((c) => (
            <button
              key={c}
              onClick={() => onUpdateProject({ color: c })}
              className={[
                'w-6 h-6 rounded-sm border transition-transform',
                project.color === c ? 'border-ink-900 scale-110' : 'border-ink-900/20 hover:scale-110',
              ].join(' ')}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-dashed border-ink-900/15 space-y-2">
        <button
          onClick={onDuplicateProject}
          className="w-full text-left px-3 py-2 text-xs hover:bg-paper-100 rounded-sm flex items-center gap-2 text-ink-700"
        >
          <Copy className="w-3.5 h-3.5" /> 复制项目
        </button>
        <button
          onClick={onDeleteProject}
          className="w-full text-left px-3 py-2 text-xs hover:bg-oxblood-500 hover:text-paper-50 rounded-sm flex items-center gap-2 text-ink-700"
        >
          <Trash2 className="w-3.5 h-3.5" /> 删除项目
        </button>
      </div>

      <div className="pt-4 border-t border-dashed border-ink-900/15 text-[10px] font-mono text-ink-400 space-y-1">
        <div>ID: {project.id.slice(0, 8)}</div>
        <div>创建: {new Date(project.createdAt).toLocaleString()}</div>
        <div>更新: {new Date(project.updatedAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
