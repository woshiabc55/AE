// 萤幕 v1 — 结构树画布
// 根据 beatModel 自动展开为节拍层级树，节点可拖拽重排、编辑、绑定字段
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TreePine,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Link2,
  ChevronDown,
  ChevronRight,
  Edit3,
  Check,
  X,
  Wand2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { BEAT_SKELETONS, BEAT_SKELETON_LABEL } from "@/data/beat-skeletons";
import type { BeatNodeRecord, BeatModel, TemplateRecord } from "@/types";
import { nanoid } from "nanoid";
import { toast } from "@/store/toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/utils/format";
import { expandMacros, extractMacros } from "@/utils/prompt";

interface TreeNode {
  node: BeatNodeRecord;
  children: TreeNode[];
}

function buildTree(nodes: BeatNodeRecord[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  for (const n of nodes) map.set(n.id, { node: n, children: [] });
  const roots: TreeNode[] = [];
  for (const t of map.values()) {
    if (t.node.parentId && map.has(t.node.parentId)) {
      map.get(t.node.parentId)!.children.push(t);
    } else {
      roots.push(t);
    }
  }
  const sortRec = (arr: TreeNode[]) => {
    arr.sort((a, b) => a.node.order - b.node.order);
    arr.forEach((t) => sortRec(t.children));
  };
  sortRec(roots);
  return roots;
}

function flattenTree(roots: TreeNode[]): BeatNodeRecord[] {
  const out: BeatNodeRecord[] = [];
  const dfs = (arr: TreeNode[]) => {
    arr.forEach((t) => {
      out.push(t.node);
      dfs(t.children);
    });
  };
  dfs(roots);
  return out;
}

export function StructureCanvas() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const templates = useAppStore((s) => s.templates);
  const allNodes = useAppStore((s) => s.beatNodes);
  const upsertNode = useAppStore((s) => s.upsertBeatNode);
  const removeNode = useAppStore((s) => s.removeBeatNode);
  const removeByTpl = useAppStore((s) => s.removeBeatNodesByTemplate);
  const skills = useAppStore((s) => s.skills);
  const tpl = useMemo<TemplateRecord | undefined>(
    () => (id ? templates.find((t) => t.id === id) : undefined),
    [templates, id]
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editFieldKey, setEditFieldKey] = useState<string>("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const myNodes = useMemo(
    () => (id ? allNodes.filter((n) => n.templateId === id) : []),
    [allNodes, id]
  );
  const tree = useMemo(() => buildTree(myNodes), [myNodes]);

  // 初始化：若没有节点，按 beatModel 生成骨架
  const initSkeleton = async () => {
    if (!tpl) return;
    const skeleton = BEAT_SKELETONS[tpl.beatModel as BeatModel] || [];
    let order = 0;
    const add = async (items: typeof skeleton, parentId: string | null, depth: number) => {
      for (const item of items) {
        const n: BeatNodeRecord = {
          id: "bn_" + nanoid(8),
          templateId: tpl.id,
          parentId,
          label: item.label,
          fieldKey: item.fieldKey,
          note: item.hint,
          x: 0,
          y: 0,
          depth,
          order: order++,
          createdAt: Date.now(),
        };
        await upsertNode(n);
        if (item.children) await add(item.children, n.id, depth + 1);
      }
    };
    await add(skeleton, null, 0);
    toast.success("已生成节拍骨架", BEAT_SKELETON_LABEL[tpl.beatModel as BeatModel]);
  };

  // 自动：首次进入若 tpl 存在但无节点，自动初始化
  useEffect(() => {
    if (tpl && myNodes.length === 0) {
      initSkeleton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tpl?.id]);

  if (!tpl) {
    return (
      <div className="panel p-10 text-center">
        <TreePine size={32} className="mx-auto text-ink-300 mb-3" />
        <p className="font-serif text-paper-200">未找到剧本模板。</p>
        <button
          onClick={() => nav("/library")}
          className="reel-button text-[10px] py-1.5 px-3 mt-4"
        >
          返回素材库
        </button>
      </div>
    );
  }

  const onAddChild = async (parentId: string | null, depth: number) => {
    const n: BeatNodeRecord = {
      id: "bn_" + nanoid(8),
      templateId: tpl.id,
      parentId,
      label: parentId ? "新节拍" : "新幕",
      x: 0,
      y: 0,
      depth,
      order: Date.now() % 100000,
      createdAt: Date.now(),
    };
    await upsertNode(n);
    setEditingId(n.id);
    setEditLabel(n.label);
    setEditNote("");
    setEditFieldKey("");
  };

  const onEdit = (n: BeatNodeRecord) => {
    setEditingId(n.id);
    setEditLabel(n.label);
    setEditNote(n.note ?? "");
    setEditFieldKey(n.fieldKey ?? "");
  };

  const onSaveEdit = async () => {
    if (!editingId) return;
    const orig = myNodes.find((n) => n.id === editingId);
    if (!orig) return;
    await upsertNode({
      ...orig,
      label: editLabel.trim() || orig.label,
      note: editNote.trim() || undefined,
      fieldKey: editFieldKey || undefined,
    });
    setEditingId(null);
  };

  const onDelete = async (n: BeatNodeRecord) => {
    const r = await confirmDialog({
      title: "删除节拍？",
      description: `将删除「${n.label}」及其所有子节拍。`,
      confirmText: "删除",
      danger: true,
    });
    if (!r.ok) return;
    // 递归删除子树
    const toDelete: string[] = [];
    const collect = (parentId: string) => {
      toDelete.push(parentId);
      myNodes
        .filter((x) => x.parentId === parentId)
        .forEach((c) => collect(c.id));
    };
    collect(n.id);
    for (const id of toDelete) await removeNode(id);
    toast.info("已删除", n.label);
  };

  const onReset = async () => {
    const r = await confirmDialog({
      title: "重置节拍骨架？",
      description: "会先清空当前所有节拍节点，再重新按节拍模型生成。",
      confirmText: "重置",
      danger: true,
    });
    if (!r.ok) return;
    await removeByTpl(tpl.id);
    await initSkeleton();
  };

  const onMove = async (n: BeatNodeRecord, dir: -1 | 1) => {
    const siblings = myNodes
      .filter((x) => x.parentId === n.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((x) => x.id === n.id);
    const target = siblings[idx + dir];
    if (!target) return;
    // 交换 order
    await upsertNode({ ...n, order: target.order });
    await upsertNode({ ...target, order: n.order });
  };

  const onApplyToPrompt = async (n: BeatNodeRecord) => {
    if (!n.fieldKey) {
      toast.warn("该节拍未绑定字段", "先在编辑里选一个 fieldKey");
      return;
    }
    const macroText = `【${n.label}】\n${n.note ?? ""}\n`;
    // 把这段追加到 promptTpl 末尾
    const next: TemplateRecord = {
      ...tpl,
      promptTpl: tpl.promptTpl + "\n\n" + macroText,
      updatedAt: Date.now(),
    };
    await useAppStore.getState().upsertTemplate(next);
    toast.success("已追加到提示词", n.label);
  };

  const toggleCollapse = (id: string) => {
    const s = new Set(collapsed);
    s.has(id) ? s.delete(id) : s.add(id);
    setCollapsed(s);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <TreePine size={20} className="text-amber" />
            <h1 className="font-display text-[36px] text-paper-50 leading-none">
              结构树画布
            </h1>
          </div>
          <p className="mt-2 font-serif text-paper-200 max-w-2xl">
            《{tpl.title}》 · {BEAT_SKELETON_LABEL[tpl.beatModel as BeatModel] ?? tpl.beatModel}
            ，共 {myNodes.length} 个节拍。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAddChild(null, 0)}
            className="ghost-button text-[10px] py-1.5 px-3"
          >
            <Plus size={11} /> 添加根节拍
          </button>
          <button
            onClick={onReset}
            className="ghost-button text-[10px] py-1.5 px-3"
          >
            <RefreshCw size={11} /> 重新生成骨架
          </button>
          <button
            onClick={() => nav(`/studio/${tpl.id}`)}
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Wand2 size={11} /> 打开 Studio
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        {/* 树画布 */}
        <div className="panel p-4 min-h-[500px]">
          {tree.length === 0 ? (
            <div className="text-center py-16 text-ink-300 font-serif">
              还没有节拍节点。点击"重新生成骨架"自动创建。
            </div>
          ) : (
            <ul className="space-y-1">
              {tree.map((t) => (
                <TreeRow
                  key={t.node.id}
                  t={t}
                  depth={0}
                  tpl={tpl}
                  editingId={editingId}
                  editLabel={editLabel}
                  editNote={editNote}
                  editFieldKey={editFieldKey}
                  setEditLabel={setEditLabel}
                  setEditNote={setEditNote}
                  setEditFieldKey={setEditFieldKey}
                  collapsed={collapsed}
                  toggleCollapse={toggleCollapse}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  setEditingId={setEditingId}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                  onMove={onMove}
                  onApply={onApplyToPrompt}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              ))}
            </ul>
          )}
        </div>

        {/* 侧边详情 / 提示词预览 */}
        <div className="space-y-4">
          <NodeDetail
            tpl={tpl}
            node={myNodes.find((n) => n.id === selectedId)}
            skills={skills}
          />
          <MacroPreview tpl={tpl} skills={skills} />
        </div>
      </div>
    </div>
  );
}

function TreeRow(props: {
  t: TreeNode;
  depth: number;
  tpl: TemplateRecord;
  editingId: string | null;
  editLabel: string;
  editNote: string;
  editFieldKey: string;
  setEditLabel: (v: string) => void;
  setEditNote: (v: string) => void;
  setEditFieldKey: (v: string) => void;
  collapsed: Set<string>;
  toggleCollapse: (id: string) => void;
  onEdit: (n: BeatNodeRecord) => void;
  onSaveEdit: () => Promise<void>;
  setEditingId: (id: string | null) => void;
  onAddChild: (parentId: string | null, depth: number) => Promise<void>;
  onDelete: (n: BeatNodeRecord) => Promise<void>;
  onMove: (n: BeatNodeRecord, dir: -1 | 1) => Promise<void>;
  onApply: (n: BeatNodeRecord) => Promise<void>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const {
    t,
    depth,
    tpl,
    editingId,
    editLabel,
    editNote,
    editFieldKey,
    setEditLabel,
    setEditNote,
    setEditFieldKey,
    collapsed,
    toggleCollapse,
    onEdit,
    onSaveEdit,
    setEditingId,
    onAddChild,
    onDelete,
    onMove,
    onApply,
    selectedId,
    setSelectedId,
  } = props;
  const isCollapsed = collapsed.has(t.node.id);
  const isEditing = editingId === t.node.id;
  const isSelected = selectedId === t.node.id;
  const hasChildren = t.children.length > 0;
  const field = t.node.fieldKey
    ? tpl.fields.find((f) => f.key === t.node.fieldKey)
    : undefined;

  return (
    <li
      style={{ marginLeft: depth * 18 }}
      className={cn(
        "border-l-2 pl-3 py-1.5 transition",
        isSelected
          ? "border-amber bg-amber/5"
          : "border-ink-700/40 hover:border-ink-500"
      )}
    >
      <div className="flex items-start gap-2 group">
        {hasChildren ? (
          <button
            onClick={() => toggleCollapse(t.node.id)}
            className="text-ink-300 hover:text-amber mt-0.5"
            aria-label={isCollapsed ? "展开" : "折叠"}
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </button>
        ) : (
          <span className="w-3" />
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1.5">
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="field-input font-display text-[14px]"
                autoFocus
              />
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="field-input font-serif text-[12px]"
                rows={2}
                placeholder="节点备注（可选）"
              />
              <div className="flex items-center gap-2">
                <span className="label-overline">绑定字段</span>
                <select
                  value={editFieldKey}
                  onChange={(e) => setEditFieldKey(e.target.value)}
                  className="field-input font-mono text-[11px] flex-1"
                >
                  <option value="">（不绑定）</option>
                  {tpl.fields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label} · {f.key}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onSaveEdit}
                  className="reel-button text-[10px] py-1 px-2"
                >
                  <Check size={10} /> 保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="ghost-button text-[10px] py-1 px-2"
                >
                  <X size={10} /> 取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "font-display text-[15px] cursor-pointer",
                    depth === 0
                      ? "text-paper-50 text-[18px]"
                      : depth === 1
                      ? "text-amber"
                      : "text-paper-200"
                  )}
                  onClick={() => setSelectedId(t.node.id)}
                >
                  {t.node.label}
                </span>
                {field && (
                  <span className="text-[10px] font-mono text-ink-200 border border-ink-700 px-1.5 py-0.5">
                    <Link2 size={9} className="inline mr-1" />
                    {field.key}
                  </span>
                )}
              </div>
              {t.node.note && (
                <div className="text-[11px] text-ink-300 font-serif italic mt-0.5">
                  {t.node.note}
                </div>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5">
            <button
              onClick={() => onMove(t.node, -1)}
              className="p-1 text-ink-300 hover:text-amber"
              title="上移"
            >
              ▲
            </button>
            <button
              onClick={() => onMove(t.node, 1)}
              className="p-1 text-ink-300 hover:text-amber"
              title="下移"
            >
              ▼
            </button>
            <button
              onClick={() => onAddChild(t.node.id, depth + 1)}
              className="p-1 text-ink-300 hover:text-amber"
              title="添加子节拍"
            >
              <Plus size={11} />
            </button>
            <button
              onClick={() => onEdit(t.node)}
              className="p-1 text-ink-300 hover:text-amber"
              title="编辑"
            >
              <Edit3 size={11} />
            </button>
            {t.node.fieldKey && (
              <button
                onClick={() => onApply(t.node)}
                className="p-1 text-ink-300 hover:text-amber"
                title="追加到提示词"
              >
                <Wand2 size={11} />
              </button>
            )}
            <button
              onClick={() => onDelete(t.node)}
              className="p-1 text-ink-300 hover:text-reel"
              title="删除"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {!isCollapsed && hasChildren && (
        <ul className="mt-1">
          {t.children.map((c) => (
            <TreeRow
              key={c.node.id}
              t={c}
              depth={depth + 1}
              tpl={tpl}
              editingId={editingId}
              editLabel={editLabel}
              editNote={editNote}
              editFieldKey={editFieldKey}
              setEditLabel={setEditLabel}
              setEditNote={setEditNote}
              setEditFieldKey={setEditFieldKey}
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              onEdit={onEdit}
              onSaveEdit={onSaveEdit}
              setEditingId={setEditingId}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onMove={onMove}
              onApply={onApply}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function NodeDetail({
  tpl,
  node,
  skills,
}: {
  tpl: TemplateRecord;
  node: BeatNodeRecord | undefined;
  skills: any[];
}) {
  return (
    <div className="panel p-4">
      <div className="label-overline">节点详情</div>
      {!node ? (
        <p className="text-[12px] text-ink-300 font-serif italic mt-2">
          点击左侧任一节拍查看详情。
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          <div>
            <div className="text-[10px] font-mono text-ink-400">节拍</div>
            <div className="font-display text-[20px] text-paper-50">
              {node.label}
            </div>
          </div>
          {node.note && (
            <div>
              <div className="text-[10px] font-mono text-ink-400">备注</div>
              <p className="font-serif text-[12px] text-paper-200">{node.note}</p>
            </div>
          )}
          {node.fieldKey && (
            <div>
              <div className="text-[10px] font-mono text-ink-400">绑定字段</div>
              <code className="font-mono text-amber text-[12px]">
                {node.fieldKey}
              </code>
            </div>
          )}
          <div>
            <div className="text-[10px] font-mono text-ink-400">深度 / 顺序</div>
            <div className="font-mono text-[12px] text-paper-200">
              depth {node.depth} · order {node.order}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroPreview({
  tpl,
  skills,
}: {
  tpl: TemplateRecord;
  skills: any[];
}) {
  const used = extractMacros(tpl.promptTpl);
  const [val, setVal] = useState<Record<string, string>>(() =>
    Object.fromEntries(tpl.fields.map((f) => [f.key, ""]))
  );
  const expanded = useMemo(
    () => expandMacros(tpl.promptTpl, skills, val),
    [tpl.promptTpl, skills, val]
  );
  return (
    <div className="panel p-4">
      <div className="label-overline">宏展开预览</div>
      {used.length === 0 ? (
        <p className="text-[12px] text-ink-300 font-serif italic mt-2">
          提示词里尚未使用 <code className="font-mono">@skill:xxx</code>。
        </p>
      ) : (
        <div className="mt-2 space-y-1">
          <div className="flex flex-wrap gap-1">
            {used.map((k) => {
              const s = skills.find((x: any) => x.key === k);
              return (
                <span
                  key={k}
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-mono border",
                    s
                      ? "border-amber text-amber"
                      : "border-reel text-reel"
                  )}
                >
                  @skill:{k}
                  {!s && " ✗"}
                </span>
              );
            })}
          </div>
          {expanded.missing.length > 0 && (
            <div className="text-[10px] text-reel font-mono">
              缺失：{expanded.missing.map((k) => "@skill:" + k).join(", ")}
            </div>
          )}
          <pre className="font-mono text-[11px] text-paper-200 bg-ink-900 border border-ink-700 p-2 mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap">
            {expanded.text.slice(0, 600)}
            {expanded.text.length > 600 ? "…" : ""}
          </pre>
        </div>
      )}
    </div>
  );
}
