import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3X3, List, Copy, Trash2, Eye, EyeOff, MoreVertical, FileText, Clock, Tag, FolderOpen } from 'lucide-react';
import { useScriptStore } from '@/stores/scriptStore';
import { useUIStore } from '@/stores/uiStore';
import { formatRelative } from '@/utils/format';
import type { Script } from '@/types';

type ViewMode = 'grid' | 'list';
type Filter = 'all' | 'public' | 'private' | 'draft';

export default function Scripts() {
  const navigate = useNavigate();
  const { scripts, deleteScript, duplicateScript, togglePublic, createBlank } = useScriptStore();
  const showToast = useUIStore((s) => s.showToast);
  const [view, setView] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    let result = scripts;
    if (filter === 'public') result = result.filter((s) => s.isPublic);
    if (filter === 'private') result = result.filter((s) => !s.isPublic);
    if (filter === 'draft') result = result.filter((s) => s.tags.includes('草稿'));
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    return result;
  }, [scripts, filter, q]);

  const handleNew = () => {
    const id = createBlank();
    navigate(`/editor/${id}`);
  };

  const filterBtns: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: '全部', count: scripts.length },
    { value: 'public', label: '已发布', count: scripts.filter((s) => s.isPublic).length },
    { value: 'private', label: '私密', count: scripts.filter((s) => !s.isPublic).length },
    { value: 'draft', label: '草稿', count: scripts.filter((s) => s.tags.includes('草稿')).length },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
            · 我的剧本库
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-cream-50 sm:text-5xl">
            云端剧本
          </h1>
          <p className="mt-2 text-sm text-cream-200/50">
            共 {filtered.length} 个剧本 · 自动保存至 localStorage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-200/30" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索标题、标签..."
              className="input-base w-64 pl-9"
            />
          </div>
          <div className="hidden items-center gap-1 border border-ink-500 p-0.5 sm:flex">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 ${view === 'grid' ? 'bg-gold-500 text-ink-900' : 'text-cream-200/50 hover:text-cream-100'}`}
              title="卡片视图"
            >
              <Grid3X3 size={13} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 ${view === 'list' ? 'bg-gold-500 text-ink-900' : 'text-cream-200/50 hover:text-cream-100'}`}
              title="列表视图"
            >
              <List size={13} />
            </button>
          </div>
          <button onClick={handleNew} className="btn-primary">
            <Plus size={14} strokeWidth={2} />
            新建空白剧本
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filterBtns.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-all ${
              filter === btn.value
                ? 'bg-gold-500 text-ink-900'
                : 'border border-ink-500 text-cream-200/60 hover:border-gold-500 hover:text-gold-500'
            }`}
          >
            {btn.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-60">{btn.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex h-72 flex-col items-center justify-center gap-3">
          <FolderOpen size={32} className="text-cream-200/20" strokeWidth={1} />
          <p className="font-display text-2xl text-cream-200/40">这里还空着呢</p>
          <p className="text-sm text-cream-200/30">从模板开始，或创建一个空白剧本</p>
          <div className="mt-3 flex gap-2">
            <Link to="/templates" className="btn-outline">浏览模板</Link>
            <button onClick={handleNew} className="btn-primary">
              <Plus size={14} strokeWidth={2} />
              新建空白剧本
            </button>
          </div>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onOpen={() => navigate(`/editor/${script.id}`)}
              onDuplicate={() => {
                duplicateScript(script.id);
                showToast('已复制剧本');
              }}
              onDelete={() => {
                if (confirm(`确定删除「${script.title}」?`)) {
                  deleteScript(script.id);
                  showToast('已删除');
                }
              }}
              onTogglePublic={() => {
                togglePublic(script.id);
                showToast(script.isPublic ? '已设为私密' : '已发布到广场');
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {filtered.map((script, i) => (
            <div
              key={script.id}
              className={`group flex items-center gap-4 p-4 transition-colors hover:bg-ink-700/40 ${
                i < filtered.length - 1 ? 'border-b border-ink-600' : ''
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-gold-500/30 bg-ink-800 text-gold-500">
                <FileText size={16} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/editor/${script.id}`}
                  className="block truncate font-display text-lg font-semibold text-cream-50 hover:text-gold-500"
                >
                  {script.title}
                </Link>
                <div className="mt-1 flex items-center gap-3 text-xs text-cream-200/40">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {formatRelative(script.updatedAt)}
                  </span>
                  <span>·</span>
                  <span>{script.scenes.length} 场景</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    {script.isPublic ? (
                      <>
                        <Eye size={11} /> 已发布
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} /> 私密
                      </>
                    )}
                  </span>
                  {script.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Tag size={11} />
                        {script.tags.join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link to={`/editor/${script.id}`} className="btn-ghost !p-1.5" title="编辑">
                  <FileText size={13} strokeWidth={1.5} />
                </Link>
                <button
                  onClick={() => {
                    duplicateScript(script.id);
                    showToast('已复制');
                  }}
                  className="btn-ghost !p-1.5"
                  title="复制"
                >
                  <Copy size={13} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`确定删除「${script.title}」?`)) {
                      deleteScript(script.id);
                      showToast('已删除');
                    }
                  }}
                  className="btn-ghost !p-1.5 hover:!text-wine"
                  title="删除"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ScriptCardProps {
  script: Script;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
}

function ScriptCard({ script, onOpen, onDuplicate, onDelete, onTogglePublic }: ScriptCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="card group p-5">
      <div className="mb-3 flex items-start justify-between">
        <button
          onClick={onOpen}
          className="flex-1 text-left font-display text-lg font-bold leading-tight text-cream-50 transition-colors hover:text-gold-500"
        >
          {script.title}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-ghost !p-1"
          >
            <MoreVertical size={14} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-7 z-20 w-32 border border-ink-500 bg-ink-800 py-1 shadow-xl">
                <button
                  onClick={() => { onOpen(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-cream-200/80 hover:bg-ink-700"
                >
                  <FileText size={11} /> 打开
                </button>
                <button
                  onClick={() => { onDuplicate(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-cream-200/80 hover:bg-ink-700"
                >
                  <Copy size={11} /> 复制
                </button>
                <button
                  onClick={() => { onTogglePublic(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-cream-200/80 hover:bg-ink-700"
                >
                  {script.isPublic ? <EyeOff size={11} /> : <Eye size={11} />}
                  {script.isPublic ? '设为私密' : '发布'}
                </button>
                <div className="my-1 border-t border-ink-600" />
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-wine hover:bg-ink-700"
                >
                  <Trash2 size={11} /> 删除
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 border-y border-ink-600 py-3 text-center">
        <div>
          <p className="font-mono text-base text-cream-100">{script.scenes.length}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">场景</p>
        </div>
        <div>
          <p className="font-mono text-base text-cream-100">{Object.keys(script.variables).length}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">变量</p>
        </div>
        <div>
          <p className="font-mono text-base text-gold-500">{script.isPublic ? '公开' : '私密'}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">状态</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono text-[10px] text-cream-200/40">
          <Clock size={10} /> {formatRelative(script.updatedAt)}
        </span>
        <button onClick={onOpen} className="btn-ghost !p-0 text-xs text-gold-500">
          打开 →
        </button>
      </div>
    </div>
  );
}
