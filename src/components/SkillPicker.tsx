// 萤幕 v1 — 内联 Skill 选择器
// 在 Studio / 提示词编辑时使用：从左侧列表选，右侧实时插入
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Hash,
  Wand2,
  Plus,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store";
import { SKILL_CATEGORY_LABEL } from "@/data/seed-skills";
import type { SkillRecord, SkillCategory } from "@/types";
import { cn } from "@/utils/format";
import { Modal } from "@/components/ui/Modal";

const CATS: Array<SkillCategory | "all"> = [
  "all",
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

interface Props {
  open: boolean;
  onClose: () => void;
  // 当前正在编辑的提示词内容（用于在末尾追加或追加到指定位置）
  currentTpl: string;
  // 当用户选定一个或多个技能后回调
  onInsert: (newTpl: string, inserted: SkillRecord[]) => void;
}

export function SkillPicker({ open, onClose, currentTpl, onInsert }: Props) {
  const skills = useAppStore((s) => s.skills);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SkillCategory | "all">("all");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPicked(new Set());
      setActive(null);
      setQ("");
      setCat("all");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
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
  }, [skills, q, cat]);

  const togglePick = (s: SkillRecord) => {
    const ns = new Set(picked);
    if (ns.has(s.id)) ns.delete(s.id);
    else ns.add(s.id);
    setPicked(ns);
  };

  const insertAll = () => {
    const list = skills.filter((s) => picked.has(s.id));
    if (list.length === 0) return;
    const block = list
      .map((s) => `@skill:${s.key}`)
      .join("\n");
    const newTpl = (currentTpl.trimEnd() + "\n\n" + block).trim() + "\n";
    onInsert(newTpl, list);
    onClose();
  };

  // 键盘导航
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const list = filtered;
      if (list.length === 0) return;
      const idx = active ? list.findIndex((s) => s.id === active) : -1;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(list[(idx + 1) % list.length].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(list[(idx - 1 + list.length) % list.length].id);
      } else if (e.key === " " && active) {
        e.preventDefault();
        togglePick(list.find((s) => s.id === active)!);
      } else if (e.key === "Enter" && active) {
        e.preventDefault();
        togglePick(list.find((s) => s.id === active)!);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, filtered, onClose]);

  const pickedList = skills.filter((s) => picked.has(s.id));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="剧本 Skill 选择器"
      subtitle="挑选 Skill 插入到你的提示词中。多选后将一并写入。"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 取消
          </button>
          <button
            disabled={picked.size === 0}
            onClick={insertAll}
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Plus size={11} /> 插入 {picked.size} 个 Skill
          </button>
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-0 max-h-[60vh]">
        {/* 左：选择列表 */}
        <div className="border-r border-ink-700 flex flex-col">
          <div className="p-3 border-b border-ink-700 space-y-2">
            <div className="relative">
              <Search
                size={11}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300"
              />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索技能名 / key / 标签…"
                className="field-input pl-7 font-mono text-[12px]"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-serif border transition",
                    cat === c
                      ? "border-amber text-amber bg-amber/10"
                      : "border-ink-700 text-ink-300 hover:border-ink-500"
                  )}
                >
                  {c === "all" ? "全部" : SKILL_CATEGORY_LABEL[c as SkillCategory]}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-6 text-center text-[12px] text-ink-300 font-serif">
                没有任何匹配的技能
              </li>
            ) : (
              filtered.map((s) => {
                const checked = picked.has(s.id);
                const isActive = active === s.id;
                return (
                  <li
                    key={s.id}
                    onClick={() => {
                      setActive(s.id);
                      togglePick(s);
                    }}
                    onMouseEnter={() => setActive(s.id)}
                    className={cn(
                      "px-3 py-2 border-b border-ink-700/50 cursor-pointer transition flex items-start gap-2",
                      isActive && "bg-ink-700/40",
                      checked && "border-l-2 border-l-amber"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePick(s)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-amber mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-1 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border",
                            s.type === "macro"
                              ? "border-violet-500 text-violet-300"
                              : "border-amber text-amber"
                          )}
                        >
                          {s.type === "macro" ? "宏" : "片段"}
                        </span>
                        <span className="font-display text-[14px] text-paper-50">
                          {s.name}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-ink-300 truncate">
                        <Hash size={9} className="inline" />
                        @skill:{s.key}
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
          <div className="border-t border-ink-700 px-3 py-1.5 label-overline">
            {filtered.length} 个结果 · 已选 {picked.size}
          </div>
        </div>

        {/* 右：预览 */}
        <div className="p-4 overflow-y-auto">
          {pickedList.length === 0 ? (
            <div className="text-center py-12 text-ink-300 font-serif">
              <Wand2 size={28} className="mx-auto mb-3 text-amber/40" />
              <p className="text-[13px]">勾选左侧技能，</p>
              <p className="text-[13px]">它们会出现在这里预览。</p>
              <p className="mt-4 text-[10px] font-mono text-ink-400">
                提示：可多选后批量插入
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pickedList.map((s) => (
                <div
                  key={s.id}
                  className="panel p-3 border-l-2 border-l-amber"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "px-1 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border",
                        s.type === "macro"
                          ? "border-violet-500 text-violet-300"
                          : "border-amber text-amber"
                      )}
                    >
                      {s.type === "macro" ? "宏" : "片段"}
                    </span>
                    <span className="font-display text-[15px] text-paper-50">
                      {s.name}
                    </span>
                    <button
                      onClick={() => togglePick(s)}
                      className="ml-auto p-0.5 text-ink-300 hover:text-reel"
                      title="移除"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <code className="inline-block font-mono text-[10px] text-amber bg-ink-900 border border-ink-700 px-1 py-0.5">
                    @skill:{s.key}
                  </code>
                  {s.description && (
                    <p className="mt-2 text-[12px] text-paper-200 font-serif italic">
                      {s.description}
                    </p>
                  )}
                </div>
              ))}
              <div className="border-t border-ink-700 pt-3 mt-3">
                <div className="label-overline flex items-center gap-1.5 mb-2">
                  <Sparkles size={10} /> 插入预览
                </div>
                <pre className="font-mono text-[11px] text-paper-200 bg-ink-900 border border-ink-700 p-2 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {pickedList.map((s) => `@skill:${s.key}`).join("\n")}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
