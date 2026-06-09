// 剧本编辑器
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Eye, Play, History, Plus, X, Wand2, ChevronRight,
  ArrowLeft, Sparkles, Trash2, Edit3, Settings2, Type, Hash, AlignLeft, ListOrdered, CheckSquare,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, IconButton, Modal, CopyButton } from '../components/ui';
import { TemplateService } from '../services/template';
import { useApp } from '../store/useApp';
import { extractVariableKeys, uid, formatRelative } from '../lib/utils';
import { SCRIPT_FRAGMENTS, FRAGMENT_CATEGORIES } from '../data/fragments';
import { CATEGORIES } from '../data/templates.seed';
import type { Template, Variable, VariableType, ScriptFragment, Category } from '../types';
import { cn } from '../lib/utils';

const VAR_TYPE_LABEL: Record<VariableType, string> = {
  text: '文本',
  textarea: '长文本',
  enum: '枚举',
  number: '数字',
  slider: '滑块',
};

const VAR_TYPE_ICON: Record<VariableType, React.ReactNode> = {
  text: <Type size={12} />,
  textarea: <AlignLeft size={12} />,
  enum: <ListOrdered size={12} />,
  number: <Hash size={12} />,
  slider: <Settings2 size={12} />,
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const nav = useNavigate();
  const { user, pushToast, loginDemo } = useApp();

  const [title, setTitle] = useState('未命名模板');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('short-video');
  const [tagsStr, setTagsStr] = useState('');
  const [body, setBody] = useState(`# 角色
你是一位资深的{{role}}。

# 任务
请围绕 {{topic}} 创作一段{{style}}脚本，目标受众是{{audience}}。

# 输出要求
- 风格：{{tone}}
- 字数：{{word_count}}字左右
`);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [preview, setPreview] = useState(false);
  const [fragmentOpen, setFragmentOpen] = useState(false);
  const [editingVar, setEditingVar] = useState<Variable | null>(null);
  const [varModalOpen, setVarModalOpen] = useState(false);
  const [existing, setExisting] = useState<Template | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 加载已有模板
  useEffect(() => {
    if (!id) return;
    TemplateService.get(id).then((t) => {
      if (!t) return;
      setExisting(t);
      setTitle(t.title);
      setDescription(t.description);
      setCategory(t.category);
      setTagsStr(t.tags.join(', '));
      setBody(t.body);
      setVariables(t.variables);
    });
  }, [id]);

  // 自动从 body 抽取未声明的变量
  useEffect(() => {
    const keys = extractVariableKeys(body);
    setVariables((prev) => {
      const map = new Map(prev.map((v) => [v.key, v]));
      keys.forEach((k) => {
        if (!map.has(k)) {
          map.set(k, { key: k, label: k, type: 'text', required: true });
        }
      });
      return [...map.values()].filter((v) => keys.includes(v.key));
    });
  }, [body]);

  // 自动保存草稿
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(`ps_editor_${id ?? 'new'}`, JSON.stringify({ title, description, category, tagsStr, body, variables }));
        setSavedAt(new Date());
      } catch { /* ignore */ }
    }, 800);
    return () => clearTimeout(t);
  }, [title, description, category, tagsStr, body, variables, id]);

  const insertFragment = (frag: ScriptFragment) => {
    const ta = taRef.current;
    if (!ta) {
      setBody((b) => b + '\n' + frag.body);
      setFragmentOpen(false);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = body.slice(0, start);
    const after = body.slice(end);
    setBody(before + (start > 0 && !before.endsWith('\n') ? '\n' : '') + frag.body + after);
    setFragmentOpen(false);
    pushToast({ kind: 'info', message: `已插入「${frag.label}」` });
  };

  const insertVarAtCursor = (key: string) => {
    const ta = taRef.current;
    const token = `{{${key}}}`;
    if (!ta) {
      setBody((b) => b + token);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = body.slice(0, start);
    const after = body.slice(end);
    setBody(before + token + after);
    pushToast({ kind: 'info', message: `已插入 {{${key}}}` });
  };

  const handleSave = async () => {
    if (!user) {
      pushToast({ kind: 'warn', message: '请先登录后再保存到云端' });
      return;
    }
    if (!title.trim()) {
      pushToast({ kind: 'warn', message: '请先给模板起个名字' });
      return;
    }
    const tags = tagsStr.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
    if (existing) {
      await TemplateService.update(existing.id, {
        title, description, category, tags, body, variables,
      } as Partial<Template>, '手动保存');
      pushToast({ kind: 'success', message: '已更新到云端' });
    } else {
      const t = await TemplateService.create(
        { title, description, category, tags, body, variables, isPublic: false },
        user.id, user.name
      );
      pushToast({ kind: 'success', message: '已保存到我的剧库' });
      nav(`/editor/${t.id}`, { replace: true });
      setExisting(t);
    }
  };

  const handleUseNow = () => {
    if (!existing) {
      pushToast({ kind: 'warn', message: '请先保存后再使用' });
      return;
    }
    nav(`/workshop/${existing.id}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* 顶部工具栏 */}
      <div className="border-b border-[var(--ink-4)] bg-[var(--ink-1)]">
        <div className="max-w-[1600px] mx-auto px-5 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => nav(-1)}
              className="w-8 h-8 inline-flex items-center justify-center rounded-[6px] text-[var(--paper-3)] hover:text-[var(--paper-1)] hover:bg-[var(--ink-3)]"
            >
              <ArrowLeft size={14} />
            </button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="未命名模板"
              className="!h-8 !text-[14px] !font-medium !bg-transparent !border-transparent hover:!border-[var(--ink-4)] focus:!border-[var(--ink-4)] max-w-[280px]"
            />
            <Badge variant={existing ? 'amber' : 'default'}>
              {existing ? '已同步' : '草稿'}
            </Badge>
            {savedAt && (
              <span className="text-[11px] text-[var(--paper-3)] mono hidden md:inline">
                {formatRelative(savedAt.toISOString())}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" icon={<Eye size={14} />} onClick={() => setPreview((p) => !p)}>
              {preview ? '编辑' : '预览'}
            </Button>
            <Button size="sm" variant="secondary" icon={<Save size={14} />} onClick={handleSave}>
              保存
            </Button>
            <Button size="sm" variant="primary" icon={<Play size={14} fill="currentColor" />} onClick={handleUseNow}>
              立即使用
            </Button>
          </div>
        </div>
      </div>

      {/* 主体三栏 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左：片段库 */}
        <aside className="w-60 border-r border-[var(--ink-4)] bg-[var(--ink-1)] overflow-y-auto shrink-0 hidden md:block">
          <div className="px-4 py-3 border-b border-[var(--ink-4)]">
            <div className="eyebrow text-[10px]">FRAGMENTS · 片段库</div>
          </div>
          {FRAGMENT_CATEGORIES.map((cat) => {
            const list = SCRIPT_FRAGMENTS.filter((f) => f.category === cat.key);
            return (
              <div key={cat.key} className="px-4 py-3 border-b border-[var(--ink-4)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-[var(--paper-1)] font-medium">{cat.label}</span>
                  <span className="text-[10px] text-[var(--paper-3)] mono">{cat.sub}</span>
                </div>
                <div className="space-y-1">
                  {list.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => insertFragment(f)}
                      className="w-full text-left p-2 rounded-[6px] hover:bg-[var(--ink-3)] transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-[var(--paper-1)] group-hover:text-[var(--amber-1)] transition-colors">{f.label}</span>
                        <Plus size={11} className="text-[var(--paper-3)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[10px] text-[var(--paper-3)] mono line-clamp-2 leading-relaxed">{f.body.slice(0, 30)}…</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </aside>

        {/* 中：剧本画布 */}
        <div className="flex-1 overflow-y-auto bg-[var(--ink-1)]">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
            {preview ? (
              <div className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-8">
                <div className="eyebrow eyebrow-amber mb-3">预览</div>
                <h1 className="display text-3xl text-[var(--paper-0)] mb-2">{title || '未命名模板'}</h1>
                <p className="text-[14px] text-[var(--paper-2)] mb-6">{description}</p>
                <div className="hairline mb-6" />
                <pre className="text-[14px] leading-[1.9] text-[var(--paper-1)] whitespace-pre-wrap font-mono">
                  {body.split(/(\{\{[^}]+\}\})/g).map((p, i) => {
                    const m = p.match(/^\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}$/);
                    if (m) {
                      const text = `{{${m[1]}}}`;
                      return <span key={i} className="variable-text">{text}</span>;
                    }
                    return <span key={i}>{p}</span>;
                  })}
                </pre>
              </div>
            ) : (
              <>
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="eyebrow text-[10px] mb-2 block">描述</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="一句话说明这个模板解决什么问题、给谁用"
                      rows={2}
                      showCount
                      maxLength={140}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="分类"
                      value={category}
                      onChange={(v) => setCategory(v as Category)}
                      options={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
                    />
                    <Input
                      label="标签"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder="逗号分隔, 如: 钩子, 带货"
                    />
                  </div>
                </div>

                <div className="rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[var(--ink-4)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit3 size={14} className="text-[var(--amber-2)]" />
                      <span className="text-[12px] text-[var(--paper-1)] font-medium">剧本正文</span>
                      <span className="text-[10px] text-[var(--paper-3)] mono">· 使用 {'{{变量}}'} 标记插槽</span>
                    </div>
                    <Button size="sm" variant="ghost" icon={<Sparkles size={12} />} onClick={() => setFragmentOpen(true)}>
                      插入片段
                    </Button>
                  </div>
                  <textarea
                    ref={taRef}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full min-h-[500px] bg-transparent p-6 text-[14px] leading-[1.9] text-[var(--paper-1)] font-mono outline-none resize-none"
                    placeholder="# 角色
你是一位资深的..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右：变量面板 */}
        <aside className="w-72 border-l border-[var(--ink-4)] bg-[var(--ink-1)] overflow-y-auto shrink-0 hidden lg:block">
          <div className="px-4 py-3 border-b border-[var(--ink-4)] flex items-center justify-between">
            <div>
              <div className="eyebrow text-[10px]">VARIABLES · 变量</div>
              <div className="text-[10px] text-[var(--paper-3)] mt-1">共 {variables.length} 个 · 检测自正文</div>
            </div>
            <button
              onClick={() => { setEditingVar({ key: '', label: '', type: 'text', required: true }); setVarModalOpen(true); }}
              className="w-7 h-7 inline-flex items-center justify-center rounded-[6px] text-[var(--amber-1)] hover:bg-[rgba(232,177,74,0.1)]"
              title="新增变量"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {variables.length === 0 && (
              <div className="text-[12px] text-[var(--paper-3)] text-center py-10 leading-relaxed">
                在正文里写 <span className="variable-text !text-[10px]">{'{{key}}'}</span><br />自动检测并加入此面板
              </div>
            )}
            {variables.map((v) => (
              <div
                key={v.key}
                className="group rounded-[8px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-3 hover:border-[var(--ink-5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="variable-text !text-[11px] !py-0.5" onClick={() => insertVarAtCursor(v.key)} title="点击插入到正文">
                    {`{{${v.key}}}`}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    <button
                      onClick={() => { setEditingVar(v); setVarModalOpen(true); }}
                      className="w-6 h-6 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--paper-1)] hover:bg-[var(--ink-3)]"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => {
                        setBody((b) => b.replaceAll(`{{${v.key}}}`, `[${v.label || v.key}]`));
                        setVariables((prev) => prev.filter((x) => x.key !== v.key));
                        pushToast({ kind: 'info', message: '已移除变量' });
                      }}
                      className="w-6 h-6 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--vermilion)] hover:bg-[var(--ink-3)]"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[var(--paper-1)] truncate flex-1">{v.label || v.key}</div>
                  <span className="tag shrink-0 !text-[9px] !py-0">{VAR_TYPE_LABEL[v.type]}</span>
                </div>
                {v.required && (
                  <div className="mt-1.5 text-[9px] text-[var(--vermilion)] uppercase tracking-wider">必填</div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* 片段库抽屉（移动端备用） */}
      <Modal open={fragmentOpen} onClose={() => setFragmentOpen(false)} title="插入剧本片段">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {FRAGMENT_CATEGORIES.map((cat) => {
            const list = SCRIPT_FRAGMENTS.filter((f) => f.category === cat.key);
            return (
              <div key={cat.key}>
                <div className="eyebrow text-[10px] mb-2">{cat.label}</div>
                <div className="grid grid-cols-2 gap-2">
                  {list.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => insertFragment(f)}
                      className="text-left p-2.5 rounded-[6px] bg-[var(--ink-3)] border border-[var(--ink-4)] hover:border-[var(--amber-2)] transition-colors"
                    >
                      <div className="text-[12px] text-[var(--paper-0)] mb-1">{f.label}</div>
                      <div className="text-[10px] text-[var(--paper-3)] mono line-clamp-2">{f.body}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* 变量编辑 */}
      <Modal open={varModalOpen} onClose={() => setVarModalOpen(false)} title={editingVar?.key ? `编辑变量 · ${editingVar.key}` : '新增变量'}>
        {editingVar && (
          <div className="space-y-4">
            <Input
              label="变量名 (key)"
              value={editingVar.key}
              onChange={(e) => setEditingVar({ ...editingVar, key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '_') })}
              placeholder="如: product_name"
            />
            <Input
              label="显示名"
              value={editingVar.label}
              onChange={(e) => setEditingVar({ ...editingVar, label: e.target.value })}
              placeholder="如: 产品名称"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="类型"
                value={editingVar.type}
                onChange={(v) => setEditingVar({ ...editingVar, type: v as VariableType })}
                options={(Object.keys(VAR_TYPE_LABEL) as VariableType[]).map((k) => ({ value: k, label: VAR_TYPE_LABEL[k] }))}
              />
              <Input
                label="默认值"
                value={editingVar.defaultValue ?? ''}
                onChange={(e) => setEditingVar({ ...editingVar, defaultValue: e.target.value })}
                placeholder="可选"
              />
            </div>
            {editingVar.type === 'enum' && (
              <Input
                label="枚举选项 (逗号分隔)"
                value={(editingVar.options ?? []).join(', ')}
                onChange={(e) => setEditingVar({ ...editingVar, options: e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean) })}
              />
            )}
            <Input
              label="分组"
              value={editingVar.group ?? ''}
              onChange={(e) => setEditingVar({ ...editingVar, group: e.target.value })}
              placeholder="如: 基础信息"
            />
            <Textarea
              label="提示说明"
              value={editingVar.hint ?? ''}
              onChange={(e) => setEditingVar({ ...editingVar, hint: e.target.value })}
              rows={2}
              placeholder="给使用者的填写提示"
            />
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[12px] text-[var(--paper-1)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingVar.required}
                  onChange={(e) => setEditingVar({ ...editingVar, required: e.target.checked })}
                  className="w-4 h-4 accent-[var(--amber-2)]"
                />
                必填
              </label>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setVarModalOpen(false)}>取消</Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!editingVar.key.trim()) {
                      pushToast({ kind: 'warn', message: '请填写变量名' });
                      return;
                    }
                    setVariables((prev) => {
                      const i = prev.findIndex((v) => v.key === editingVar.key);
                      if (i === -1) return [...prev, editingVar];
                      const next = [...prev];
                      next[i] = editingVar;
                      return next;
                    });
                    // 同步到 body（如果该 key 在 body 中不存在）
                    if (!body.includes(`{{${editingVar.key}}}`)) {
                      setBody((b) => b + `\n{{${editingVar.key}}}`);
                    }
                    setVarModalOpen(false);
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
