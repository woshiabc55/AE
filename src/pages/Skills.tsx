// 萤幕 v1 — Skill 库：剧本片段 + 宏 统一管理
import { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  Hash,
  Tag,
  Copy,
  Wand2,
} from "lucide-react";
import { useAppStore } from "@/store";
import { SKILL_CATEGORY_LABEL, SEED_SKILLS } from "@/data/seed-skills";
import type { SkillRecord, SkillCategory } from "@/types";
import { nanoid } from "nanoid";
import { toast } from "@/store/toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn, copyText } from "@/utils/format";
import { Modal } from "@/components/ui/Modal";
import { PackIO } from "@/components/PackIO";

const CATS: SkillCategory[] = [
  "hook",
  "character",
  "scene",
  "twist",
  "climax",
  "ending",
  "monologue",
  "dialogue",
  "world",
  "pacing",
  "other",
];

export function Skills() {
  const skills = useAppStore((s) => s.skills);
  const upsert = useAppStore((s) => s.upsertSkill);
  const remove = useAppStore((s) => s.removeSkill);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SkillCategory | "all">("all");
  const [type, setType] = useState<"all" | "fragment" | "macro">("all");
  const [editing, setEditing] = useState<SkillRecord | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (type !== "all" && s.type !== type) return false;
      if (q) {
        const lq = q.toLowerCase();
        if (
          !s.name.toLowerCase().includes(lq) &&
          !s.key.toLowerCase().includes(lq) &&
          !(s.tags || []).some((t) => t.toLowerCase().includes(lq))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [skills, q, cat, type]);

  const onDelete = async (s: SkillRecord) => {
    const r = await confirmDialog({
      title: "删除技能？",
      description: `将删除「${s.name}」(@skill:${s.key})，此操作不可撤销。`,
      confirmText: "删除",
      danger: true,
    });
    if (!r.ok) return;
    await remove(s.id);
    toast.info("已删除", s.name);
  };

  const onCopy = async (s: SkillRecord) => {
    try {
      await copyText(`@skill:${s.key}`);
      toast.success("已复制", `@skill:${s.key} 已到剪贴板`);
    } catch (e) {
      toast.error("复制失败", (e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 size={20} className="text-amber" />
            <h1 className="font-display text-[36px] text-paper-50 leading-none">
              剧本 Skill 库
            </h1>
          </div>
          <p className="mt-2 font-serif text-paper-200 max-w-2xl">
            剧本的"零件库"：用片段（Fragment）填实剧本肌理，用宏（Macro）让模板动态生长。
            在任意提示词中插入 <code className="font-mono text-amber">@skill:key</code>，
            渲染时会自动展开。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PackIO
            kind="skill"
            skills={skills}
            upsertSkill={upsert}
            upsertStyle={async () => {}}
          />
          <button
            onClick={() => setCreating(true)}
            className="reel-button text-[11px] py-2 px-4"
          >
            <Plus size={12} /> 新建技能
          </button>
        </div>
      </header>

      {/* 过滤栏 */}
      <div className="panel p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索技能名 / key / 标签…"
            className="field-input pl-7 font-mono text-[12px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={cat === "all"}
            onClick={() => setCat("all")}
            label="全部"
          />
          {CATS.map((c) => (
            <FilterChip
              key={c}
              active={cat === c}
              onClick={() => setCat(c)}
              label={SKILL_CATEGORY_LABEL[c]}
            />
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {(["all", "fragment", "macro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-2 py-1 text-[10px] font-mono uppercase tracking-widest2 border transition",
                type === t
                  ? "border-amber text-amber bg-amber/10"
                  : "border-ink-700 text-ink-300 hover:border-ink-500"
              )}
            >
              {t === "all" ? "全部类型" : t === "fragment" ? "片段" : "宏"}
            </button>
          ))}
        </div>
      </div>

      {/* 列表 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-ink-300 font-serif">
            没有任何匹配的技能。试试新建一个吧。
          </div>
        )}
        {filtered.map((s) => (
          <article
            key={s.id}
            className="panel panel-hover p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border",
                      s.type === "macro"
                        ? "border-violet-500 text-violet-300"
                        : "border-amber text-amber"
                    )}
                  >
                    {s.type === "macro" ? "宏" : "片段"}
                  </span>
                  <span className="text-[10px] font-mono text-ink-300">
                    {SKILL_CATEGORY_LABEL[s.category]}
                  </span>
                  {s.isBuiltin ? (
                    <span className="text-[9px] font-mono text-ink-400">
                      内置
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 font-display text-[18px] text-paper-50">
                  {s.name}
                </h3>
                <code
                  onClick={() => onCopy(s)}
                  className="inline-flex items-center gap-1 mt-1 font-mono text-[11px] text-amber bg-ink-900 border border-ink-700 px-1.5 py-0.5 cursor-pointer hover:border-amber transition"
                  title="点击复制"
                >
                  <Hash size={9} />@skill:{s.key}
                </code>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setEditing(s)}
                  className="p-1 text-ink-300 hover:text-amber"
                  aria-label="编辑"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => onDelete(s)}
                  className="p-1 text-ink-300 hover:text-reel"
                  aria-label="删除"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            {s.description && (
              <p className="text-[12px] text-paper-200 font-serif leading-relaxed">
                {s.description}
              </p>
            )}
            <pre
              className={cn(
                "font-serif text-[12px] text-paper-100 whitespace-pre-wrap break-words max-h-40 overflow-hidden relative",
                "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-10 before:bg-gradient-to-t before:from-ink-900/95 before:to-transparent before:pointer-events-none"
              )}
            >
              {s.content}
            </pre>
            {s.tags && s.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-ink-200 border border-ink-700"
                  >
                    <Tag size={8} />
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-1 pt-2 border-t border-ink-700/50 flex items-center justify-between text-[10px] font-mono text-ink-400">
              <button
                onClick={() => onCopy(s)}
                className="inline-flex items-center gap-1 hover:text-amber"
              >
                <Copy size={10} /> 复制 @skill:{s.key}
              </button>
              <span>v{s.content.length}c</span>
            </div>
          </article>
        ))}
      </div>

      {/* 编辑/新建 Modal */}
      {(editing || creating) && (
        <SkillEditor
          initial={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={async (s) => {
            await upsert(s);
            toast.success("已保存", s.name);
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      {/* 内置恢复 */}
      <div className="panel p-4 flex items-center justify-between">
        <div>
          <div className="font-display text-[16px] text-paper-50">
            恢复内置 Skill 集
          </div>
          <p className="text-[12px] text-paper-200 font-serif">
            重置时会从 seed 重新写入 {SEED_SKILLS.length} 条内置技能。
          </p>
        </div>
        <button
          onClick={async () => {
            const r = await confirmDialog({
              title: "恢复内置 Skill？",
              description: "将保留你自建的 Skill，仅补充缺失的内置项。",
              confirmText: "恢复",
            });
            if (!r.ok) return;
            for (const sk of SEED_SKILLS) {
              if (!skills.find((s) => s.key === sk.key)) {
                await upsert({ ...sk, createdAt: Date.now(), updatedAt: Date.now() });
              }
            }
            toast.success("已恢复", "内置 Skill 已就绪");
          }}
          className="ghost-button text-[10px] py-1.5 px-3"
        >
          <Sparkles size={11} /> 恢复
        </button>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-1 text-[10px] font-serif border transition",
        active
          ? "border-amber text-amber bg-amber/10"
          : "border-ink-700 text-ink-300 hover:border-ink-500"
      )}
    >
      {label}
    </button>
  );
}

function SkillEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: SkillRecord | null;
  onClose: () => void;
  onSave: (s: SkillRecord) => Promise<void>;
}) {
  const [form, setForm] = useState<SkillRecord>(
    initial ?? {
      id: "sk_" + nanoid(8),
      name: "",
      key: "",
      category: "other",
      type: "fragment",
      content: "",
      description: "",
      tags: [],
      isBuiltin: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );
  const [tagsText, setTagsText] = useState((form.tags || []).join(", "));

  const isValid =
    form.name.trim() && form.key.trim() && /^[a-z0-9-]+$/.test(form.key);

  return (
    <Modal
      open
      onClose={onClose}
      title={initial ? "编辑技能" : "新建技能"}
      subtitle="片段是纯文本块；宏可包含 {{var}} 引用字段。"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 取消
          </button>
          <button
            disabled={!isValid || !form.content.trim()}
            onClick={() =>
              onSave({
                ...form,
                tags: tagsText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Save size={11} /> 保存
          </button>
        </>
      }
    >
      <div className="p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label-overline">名称</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="field-input mt-1 font-serif text-[14px]"
              placeholder="冷开场 · 三秒抓住"
            />
          </div>
          <div>
            <label className="label-overline">Key（用于 @skill:key）</label>
            <input
              value={form.key}
              onChange={(e) =>
                setForm({
                  ...form,
                  key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                })
              }
              className="field-input mt-1 font-mono text-[13px]"
              placeholder="cold-open"
            />
            {!form.key || /^[a-z0-9-]+$/.test(form.key) ? null : (
              <div className="text-[10px] text-reel mt-1">
                key 仅允许小写字母、数字、横线
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label-overline">类型</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as any })
              }
              className="field-input mt-1 font-mono text-[12px]"
            >
              <option value="fragment">片段（fragment）</option>
              <option value="macro">宏（macro · 可含 {"{{var}}"})</option>
            </select>
          </div>
          <div>
            <label className="label-overline">分类</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as any })
              }
              className="field-input mt-1 font-mono text-[12px]"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {SKILL_CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-overline">标签（逗号分隔）</label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="field-input mt-1 font-mono text-[12px]"
              placeholder="开场, 短片, 高密度"
            />
          </div>
        </div>

        <div>
          <label className="label-overline">简介</label>
          <input
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="field-input mt-1 font-serif text-[13px]"
            placeholder="一句话说清这个技能做什么。"
          />
        </div>

        <div>
          <label className="label-overline">内容（Markdown / 自由文本）</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="field-input mt-1 font-mono text-[12px] leading-relaxed"
            rows={12}
            placeholder={
              form.type === "macro"
                ? "## 节拍 {{beat_name}}\n- 时长：约 {{duration}} 秒"
                : "# 冷开场\n用一句极具画面感的台词开场…"
            }
          />
        </div>
      </div>
    </Modal>
  );
}
