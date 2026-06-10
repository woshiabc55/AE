// 萤幕 v1.2 — Resource Pack I/O
// 共享组件：导出向导 + 导入向导 + 差异预览
import { useMemo, useRef, useState } from "react";
import {
  Package,
  Download,
  Upload,
  X,
  Check,
  FileJson,
  AlertTriangle,
  Sparkles,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/store/toast";
import { cn } from "@/utils/format";
import {
  analyzePack,
  buildPack,
  downloadPack,
  mergePack,
  packFilename,
  parsePack,
  type MergePolicy,
  type PackAnalysis,
  type PackConflict,
  type ResourcePack,
} from "@/utils/pack";
import type { SkillRecord, StylePreset } from "@/types";

export type PackKind = "skill" | "style" | "mixed";

interface PackIOProps {
  kind: PackKind;
  skills?: SkillRecord[];
  styles?: StylePreset[];
  upsertSkill: (s: SkillRecord) => Promise<void> | void;
  upsertStyle: (s: StylePreset) => Promise<void> | void;
  /** 当 kind=single 时，限制导入也只导入同 kind */
}

export function PackIO(props: PackIOProps) {
  const { kind, skills, styles, upsertSkill, upsertStyle } = props;
  const [mode, setMode] = useState<"closed" | "export" | "import">("closed");

  return (
    <>
      <div className="inline-flex items-center gap-1 border border-ink-700">
        <button
          onClick={() => setMode("export")}
          className="ghost-button text-[10px] py-1.5 px-3 !border-0"
          title="导出资源包"
        >
          <Download size={11} /> 导出 Pack
        </button>
        <span className="w-px h-4 bg-ink-700" />
        <button
          onClick={() => setMode("import")}
          className="ghost-button text-[10px] py-1.5 px-3 !border-0"
          title="导入资源包"
        >
          <Upload size={11} /> 导入 Pack
        </button>
      </div>

      {mode === "export" && (
        <ExportWizard
          kind={kind}
          skills={skills}
          styles={styles}
          onClose={() => setMode("closed")}
        />
      )}
      {mode === "import" && (
        <ImportWizard
          kind={kind}
          existingSkills={skills ?? []}
          existingStyles={styles ?? []}
          upsertSkill={upsertSkill}
          upsertStyle={upsertStyle}
          onClose={() => setMode("closed")}
        />
      )}
    </>
  );
}

// =====================================================
//                       EXPORT
// =====================================================
function ExportWizard({
  kind,
  skills,
  styles,
  onClose,
}: {
  kind: PackKind;
  skills?: SkillRecord[];
  styles?: StylePreset[];
  onClose: () => void;
}) {
  const [name, setName] = useState("我的资源包");
  const [desc, setDesc] = useState("");
  const [includeBuiltin, setIncludeBuiltin] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    () => new Set((skills ?? []).filter((s) => includeBuiltin || !s.isBuiltin).map((s) => s.id))
  );
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(
    () => new Set((styles ?? []).filter((s) => includeBuiltin || !s.isBuiltin).map((s) => s.id))
  );

  const filteredSkills = useMemo(
    () => (skills ?? []).filter((s) => includeBuiltin || !s.isBuiltin),
    [skills, includeBuiltin]
  );
  const filteredStyles = useMemo(
    () => (styles ?? []).filter((s) => includeBuiltin || !s.isBuiltin),
    [styles, includeBuiltin]
  );

  const canExport =
    (kind === "skill" && selectedSkills.size > 0) ||
    (kind === "style" && selectedStyles.size > 0) ||
    (kind === "mixed" && (selectedSkills.size > 0 || selectedStyles.size > 0));

  const onConfirm = () => {
    if (!canExport) {
      toast.warn("请至少选一项");
      return;
    }
    const pack = buildPack({
      name,
      description: desc,
      skills:
        kind === "style"
          ? undefined
          : filteredSkills.filter((s) => selectedSkills.has(s.id)),
      styles:
        kind === "skill"
          ? undefined
          : filteredStyles.filter((s) => selectedStyles.has(s.id)),
    });
    downloadPack(pack);
    toast.success("已导出", packFilename(pack));
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="导出资源包"
      subtitle="把 Skill / Style 打包成 JSON，跨设备 / 跨人分享。"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 取消
          </button>
          <button
            disabled={!canExport || !name.trim()}
            onClick={onConfirm}
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Download size={11} /> 导出 ({selectedSkills.size + selectedStyles.size} 项)
          </button>
        </>
      }
    >
      <div className="p-5 space-y-4">
        {/* 名称 + 描述 */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label-overline">Pack 名</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input mt-1 font-display text-[14px]"
              placeholder="我的剧本语料库"
            />
          </div>
          <div>
            <label className="label-overline">说明（可选）</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="field-input mt-1 font-serif text-[12px]"
              placeholder="一句话描述这个 Pack 的风格…"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-[11px] font-mono text-ink-200 cursor-pointer">
          <input
            type="checkbox"
            checked={includeBuiltin}
            onChange={(e) => setIncludeBuiltin(e.target.checked)}
            className="accent-amber"
          />
          同时包含内置项（一般不需要，勾上后对方也会收到你的内置版本）
        </label>

        {/* Skills 选择 */}
        {(kind === "skill" || kind === "mixed") && (
          <Section
            title="Skill 技能"
            icon={<Sparkles size={11} />}
            items={filteredSkills}
            selected={selectedSkills}
            onChange={setSelectedSkills}
            renderItem={(s) => (
              <span className="font-mono text-[10px] text-amber mr-1">
                @skill:{s.key}
              </span>
            )}
          />
        )}

        {/* Styles 选择 */}
        {(kind === "style" || kind === "mixed") && (
          <Section
            title="Style 风格"
            icon={<Palette size={11} />}
            items={filteredStyles}
            selected={selectedStyles}
            onChange={setSelectedStyles}
            renderItem={(s) => (
              <span
                className="inline-block w-3 h-3 border border-ink-700 mr-1"
                style={{ background: s.visual.primary }}
              />
            )}
          />
        )}

        {/* 摘要 */}
        <div className="border-t border-ink-700 pt-3 text-[11px] font-mono text-ink-300 flex flex-wrap gap-3">
          <span>
            预计导出：<b className="text-paper-50">{selectedSkills.size + selectedStyles.size}</b> 项
          </span>
          {kind !== "style" && selectedSkills.size > 0 && (
            <span>
              <Sparkles size={10} className="inline mr-1 text-amber" />
              {selectedSkills.size} 个 Skill
            </span>
          )}
          {kind !== "skill" && selectedStyles.size > 0 && (
            <span>
              <Palette size={10} className="inline mr-1 text-amber" />
              {selectedStyles.size} 个 Style
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Section<T extends { id: string; name: string }>(props: {
  title: string;
  icon: React.ReactNode;
  items: T[];
  selected: Set<string>;
  onChange: (s: Set<string>) => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  const { title, icon, items, selected, onChange, renderItem } = props;
  const allSelected = items.length > 0 && items.every((x) => selected.has(x.id));
  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    onChange(s);
  };
  const toggleAll = () => {
    if (allSelected) onChange(new Set());
    else onChange(new Set(items.map((x) => x.id)));
  };
  return (
    <div className="border border-ink-700">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ink-700 bg-ink-900/40">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest2 text-ink-200">
          {icon} {title} · {selected.size}/{items.length}
        </div>
        <button
          onClick={toggleAll}
          className="text-[10px] font-mono text-ink-300 hover:text-amber"
        >
          {allSelected ? "全不选" : "全选"}
        </button>
      </div>
      <ul className="max-h-60 overflow-y-auto">
        {items.length === 0 && (
          <li className="px-3 py-3 text-[11px] font-serif italic text-ink-300">
            没有可选项。
          </li>
        )}
        {items.map((it) => {
          const checked = selected.has(it.id);
          return (
            <li
              key={it.id}
              onClick={() => toggle(it.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[12px] transition",
                checked
                  ? "bg-amber/5 text-paper-50"
                  : "text-paper-200 hover:bg-ink-900/30"
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(it.id)}
                onClick={(e) => e.stopPropagation()}
                className="accent-amber"
              />
              <span className="flex-1 truncate font-serif">
                {renderItem(it)}
                {it.name}
              </span>
              {checked && <Check size={11} className="text-amber shrink-0" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// =====================================================
//                       IMPORT
// =====================================================
function ImportWizard({
  kind,
  existingSkills,
  existingStyles,
  upsertSkill,
  upsertStyle,
  onClose,
}: {
  kind: PackKind;
  existingSkills: SkillRecord[];
  existingStyles: StylePreset[];
  upsertSkill: (s: SkillRecord) => Promise<void> | void;
  upsertStyle: (s: StylePreset) => Promise<void> | void;
  onClose: () => void;
}) {
  const [pack, setPack] = useState<ResourcePack | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [rawText, setRawText] = useState("");
  const [policy, setPolicy] = useState<MergePolicy>("skip");
  const fileRef = useRef<HTMLInputElement>(null);

  const analysis: PackAnalysis | null = useMemo(() => {
    if (!pack) return null;
    return analyzePack(pack, {
      skills: existingSkills,
      styles: existingStyles,
    });
  }, [pack, existingSkills, existingStyles]);

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setRawText(text);
    consume(text);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onPaste = (text: string) => {
    setRawText(text);
    consume(text);
  };

  const consume = (text: string) => {
    const r = parsePack(text);
    if (r.ok === false) {
      setErrors(r.errors);
      setPack(null);
      toast.error("无法解析", r.errors[0] ?? "未知错误");
      return;
    }
    setErrors([]);
    // kind 过滤
    if (kind === "skill" && r.data.styles?.length) {
      setPack({ ...r.data, styles: undefined });
    } else if (kind === "style" && r.data.skills?.length) {
      setPack({ ...r.data, skills: undefined });
    } else {
      setPack(r.data);
    }
  };

  const onConfirm = async () => {
    if (!pack || !analysis) return;
    const r = await mergePack({
      pack,
      analysis,
      policy,
      upsertSkill,
      upsertStyle,
    });
    const summary = [
      r.addedSkills && `新增 ${r.addedSkills} 技能`,
      r.updatedSkills && `更新 ${r.updatedSkills} 技能`,
      r.addedStyles && `新增 ${r.addedStyles} 风格`,
      r.updatedStyles && `更新 ${r.updatedStyles} 风格`,
      r.skipped && `跳过 ${r.skipped}`,
      r.builtinProtected && `保护内置 ${r.builtinProtected}`,
    ]
      .filter(Boolean)
      .join("，");
    toast.success("导入完成", summary || "无变更");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="导入资源包"
      subtitle="支持 JSON 拖拽、选择、粘贴。导入前会预览差异。"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 取消
          </button>
          <button
            disabled={!pack || !analysis || analysis.totalWillImport === 0}
            onClick={onConfirm}
            className="reel-button text-[10px] py-1.5 px-3"
          >
            <Upload size={11} /> 确认导入
          </button>
        </>
      }
    >
      <div className="p-5 space-y-4">
        {!pack && (
          <div className="space-y-3">
            {/* 文件选择 */}
            <div
              onClick={onPickFile}
              className="border-2 border-dashed border-ink-700 hover:border-amber cursor-pointer transition p-6 text-center"
            >
              <FileJson size={28} className="mx-auto text-ink-300 mb-2" />
              <div className="font-display text-[15px] text-paper-50">
                点击选择 .json 文件
              </div>
              <div className="text-[11px] font-mono text-ink-300 mt-1">
                或拖拽到此处 / 直接粘贴
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {/* 粘贴 */}
            <details className="border border-ink-700">
              <summary className="px-3 py-2 text-[11px] font-mono text-ink-200 cursor-pointer hover:text-amber">
                直接粘贴 JSON 文本
              </summary>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onBlur={(e) => e.target.value.trim() && onPaste(e.target.value)}
                className="w-full bg-ink-900 border-0 font-mono text-[11px] p-3 h-32 focus:outline-none"
                placeholder='{"meta": {...}, "skills": [...], "styles": [...]}'
              />
            </details>

            {errors.length > 0 && (
              <div className="panel p-3 border-reel bg-reel/5">
                <div className="text-[11px] font-mono text-reel flex items-center gap-1">
                  <AlertTriangle size={11} /> 解析失败
                </div>
                <ul className="mt-1 text-[10px] font-mono text-paper-200 list-disc pl-4">
                  {errors.slice(0, 5).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {pack && analysis && (
          <div className="space-y-4">
            {/* Pack 头 */}
            <div className="panel p-3">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-amber" />
                <div className="font-display text-[16px] text-paper-50">
                  {analysis.meta.name}
                </div>
                <span className="text-[10px] font-mono text-ink-300 ml-auto">
                  v{analysis.meta.version} ·{" "}
                  {new Date(analysis.meta.exportedAt).toLocaleString()}
                </span>
              </div>
              {analysis.meta.description && (
                <p className="text-[11px] font-serif italic text-paper-200 mt-1">
                  {analysis.meta.description}
                </p>
              )}
            </div>

            {/* 差异摘要 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <StatBox label="新增" value={analysis.skills.newItems.length + analysis.styles.newItems.length} color="text-paper-50" />
              <StatBox label="覆盖" value={analysis.skills.differentItems.length + analysis.styles.differentItems.length} color="text-amber" />
              <StatBox label="跳过" value={analysis.skills.sameItems.length + analysis.styles.sameItems.length} color="text-ink-300" />
              <StatBox label="内置保护" value={analysis.skills.builtinShadow.length + analysis.styles.builtinShadow.length} color="text-reel" />
            </div>

            {/* 冲突策略 */}
            <div>
              <div className="label-overline">冲突策略</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([
                  ["skip", "跳过", "保留本地，不同就忽略"],
                  ["overwrite", "覆盖", "用 Pack 内容覆盖本地"],
                  ["duplicate", "并存", "另存为新条目（自动改名）"],
                ] as [MergePolicy, string, string][]).map(([k, l, d]) => (
                  <button
                    key={k}
                    onClick={() => setPolicy(k)}
                    className={cn(
                      "border p-2 text-left transition",
                      policy === k
                        ? "border-amber bg-amber/5"
                        : "border-ink-700 hover:border-ink-500"
                    )}
                  >
                    <div className="font-display text-[13px] text-paper-50">
                      {l}
                    </div>
                    <div className="text-[10px] font-mono text-ink-300 mt-0.5">
                      {d}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 详细列表 */}
            <DiffList
              title="Skill 技能"
              icon={<Sparkles size={11} />}
              newItems={analysis.skills.newItems}
              diffItems={analysis.skills.differentItems}
              sameItems={analysis.skills.sameItems}
              builtinItems={analysis.skills.builtinShadow}
              renderItem={(it) => (
                <span className="font-mono text-[10px] text-amber mr-1">
                  @skill:{it.incoming.key}
                </span>
              )}
            />
            <DiffList
              title="Style 风格"
              icon={<Palette size={11} />}
              newItems={analysis.styles.newItems}
              diffItems={analysis.styles.differentItems}
              sameItems={analysis.styles.sameItems}
              builtinItems={analysis.styles.builtinShadow}
              renderItem={(it) => (
                <span
                  className="inline-block w-3 h-3 border border-ink-700 mr-1"
                  style={{ background: (it.incoming as any).visual?.primary ?? "#999" }}
                />
              )}
            />

            <button
              onClick={() => {
                setPack(null);
                setRawText("");
                setErrors([]);
              }}
              className="ghost-button text-[10px] py-1 px-2"
            >
              <ArrowRight size={10} className="rotate-180" /> 换一份 Pack
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="panel p-2">
      <div className="text-[10px] font-mono text-ink-300 uppercase tracking-widest2">
        {label}
      </div>
      <div className={cn("font-display text-[24px] mt-1", color)}>{value}</div>
    </div>
  );
}

function DiffList<T>(props: {
  title: string;
  icon: React.ReactNode;
  newItems: PackConflict<T>[];
  diffItems: PackConflict<T>[];
  sameItems: PackConflict<T>[];
  builtinItems: PackConflict<T>[];
  renderItem: (it: PackConflict<T>) => React.ReactNode;
}) {
  const {
    title,
    icon,
    newItems,
    diffItems,
    sameItems,
    builtinItems,
    renderItem,
  } = props;
  const total = newItems.length + diffItems.length + sameItems.length + builtinItems.length;
  if (total === 0) return null;
  return (
    <div className="border border-ink-700">
      <div className="px-3 py-2 border-b border-ink-700 bg-ink-900/40 flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest2 text-ink-200">
        {icon} {title} · {total} 项
      </div>
      <ul className="max-h-48 overflow-y-auto text-[12px]">
        {newItems.map((it) => (
          <li
            key={it.key}
            className="px-3 py-1.5 flex items-center gap-2 border-b border-ink-700/30"
          >
            <span className="text-paper-50 text-[10px] font-mono shrink-0">新增</span>
            <span className="flex-1 truncate font-serif">
              {renderItem(it)}
              {(it.incoming as any).name}
            </span>
            <Check size={10} className="text-paper-200 shrink-0" />
          </li>
        ))}
        {diffItems.map((it) => (
          <li
            key={it.key}
            className="px-3 py-1.5 flex items-center gap-2 border-b border-ink-700/30"
          >
            <span className="text-amber text-[10px] font-mono shrink-0">覆盖</span>
            <span className="flex-1 truncate font-serif">
              {renderItem(it)}
              {(it.incoming as any).name}
            </span>
            <ArrowRight size={10} className="text-amber shrink-0" />
          </li>
        ))}
        {sameItems.map((it) => (
          <li
            key={it.key}
            className="px-3 py-1.5 flex items-center gap-2 border-b border-ink-700/30"
          >
            <span className="text-ink-400 text-[10px] font-mono shrink-0">无变化</span>
            <span className="flex-1 truncate font-serif text-ink-300">
              {renderItem(it)}
              {(it.incoming as any).name}
            </span>
          </li>
        ))}
        {builtinItems.map((it) => (
          <li
            key={it.key}
            className="px-3 py-1.5 flex items-center gap-2 border-b border-ink-700/30"
          >
            <span className="text-reel text-[10px] font-mono shrink-0">内置</span>
            <span className="flex-1 truncate font-serif text-paper-200">
              {renderItem(it)}
              {(it.incoming as any).name}
            </span>
            <AlertTriangle size={10} className="text-reel shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

