import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Heart,
  History,
  Wand2,
  Eye,
  Edit3,
} from "lucide-react";
import { useAppStore } from "@/store";
import { FieldEditor } from "@/components/FieldEditor";
import { PromptPreview } from "@/components/PromptPreview";
import { LlmPanel } from "@/components/LlmPanel";
import { SkillPicker } from "@/components/SkillPicker";
import { Modal } from "@/components/ui/Modal";
import { extractVars, renderPrompt, estimateTokens } from "@/utils/prompt";
import { copyText, timeAgo } from "@/utils/format";
import { BEAT_MODEL_LABEL, GENRE_LABEL } from "@/data/seed";
import { nanoid } from "nanoid";
import { useAutoSave, loadDraft, clearDraft } from "@/hooks/useAutoSave";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useToast, toast } from "@/store/toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { validate, TemplateDraftSchema } from "@/utils/validate";
import type { TemplateRecord } from "@/types";
import { Link } from "react-router-dom";

export function Studio() {
  const params = useParams();
  const nav = useNavigate();
  const [search] = useSearchParams();
  const templates = useAppStore((s) => s.templates);
  const upsert = useAppStore((s) => s.upsertTemplate);
  const remove = useAppStore((s) => s.removeTemplate);
  const isFav = useAppStore((s) => s.isFavorite);
  const toggleFav = useAppStore((s) => s.toggleFavorite);
  const listVersions = useAppStore.getState().listVersions;
  const [versionCount, setVersionCount] = useState<number>(0);
  const [skillPickerOpen, setSkillPickerOpen] = useState(false);
  const [editPromptOpen, setEditPromptOpen] = useState(false);

  const seed = useMemo<TemplateRecord | null>(() => {
    if (params.id) {
      return templates.find((t) => t.id === params.id) ?? null;
    }
    return null;
  }, [params.id, templates]);

  const [tpl, setTplRaw] = useState<TemplateRecord>(() => {
    if (params.id) {
      const found = templates.find((t) => t.id === params.id);
      if (found) return found;
    }
    // 加载草稿
    const draft = loadDraft<TemplateRecord>("studio.new");
    if (draft && Array.isArray(draft.fields) && typeof draft.promptTpl === "string") {
      return { ...newTemplate(), ...draft, fields: draft.fields };
    }
    return newTemplate();
  });
  // 包装 setTpl：保证 fields 永远是数组，避免下游 .forEach/.map 崩溃
  const setTpl: typeof setTplRaw = useCallback((updater) => {
    setTplRaw((prev) => {
      const next = typeof updater === "function" ? (updater as any)(prev) : updater;
      if (next && !Array.isArray(next.fields)) {
        return { ...next, fields: [] };
      }
      return next;
    });
  }, []);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    (Array.isArray(tpl.fields) ? tpl.fields : []).forEach((f) => {
      initial[f.key] = defaultFor(f.key);
    });
    return initial;
  });
  const [streaming, setStreaming] = useState(false);
  const [savedTip, setSavedTip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "roll">("edit");
  const lastSavedRef = useRef<string>(JSON.stringify({ tpl, values }));

  // 自动保存草稿
  useAutoSave(
    seed ? `studio.${seed.id}` : "studio.new",
    { tpl, values }
  );

  // 从 ScriptView 通过 ?opt= 跳来时，应用 patch
  useEffect(() => {
    const opt = search.get("opt");
    if (opt) {
      try {
        const json = decodeURIComponent(escape(atob(opt)));
        const patch = JSON.parse(json);
        setTpl((prev) => ({
          ...prev,
          ...(patch.promptTpl ? { promptTpl: patch.promptTpl } : {}),
          ...(patch.systemPrompt ? { systemPrompt: patch.systemPrompt } : {}),
        }));
        toast.success("已应用优化结果", "记得点击「保存为版本」以生成新快照");
      } catch {
        toast.error("无法应用优化结果");
      }
    }
  }, [search]);

  // 加载版本数
  useEffect(() => {
    if (seed) {
      listVersions(seed.id).then((vs) => setVersionCount(vs.length));
    }
  }, [seed?.id]);

  const vars = useMemo(() => extractVars(tpl.promptTpl), [tpl.promptTpl]);
  const rendered = useMemo(() => renderPrompt(tpl.promptTpl, values), [tpl.promptTpl, values]);
  const tokens = estimateTokens(rendered + tpl.systemPrompt);
  const dirty = JSON.stringify({ tpl, values }) !== lastSavedRef.current;

  const onSave = async (snapshot = false, changelog?: string) => {
    // 校验草稿
    const result = validate(TemplateDraftSchema, {
      title: tpl.title,
      slug: tpl.slug,
      logline: tpl.logline ?? "",
      genre: tpl.genre,
      beatModel: tpl.beatModel,
      tone: tpl.tone ?? "",
      cover: tpl.cover ?? "",
      fields: tpl.fields,
      promptTpl: tpl.promptTpl,
      systemPrompt: tpl.systemPrompt ?? "",
      tags: tpl.tags ?? [],
      description: tpl.description ?? "",
    });
    if (result.ok === false) {
      toast.error("保存失败", result.errors[0]);
      return;
    }
    const next: TemplateRecord = {
      ...tpl,
      updatedAt: Date.now(),
    };
    await upsert(next, { snapshot, changelog });
    setTpl(next);
    lastSavedRef.current = JSON.stringify({ tpl: next, values });
    setSavedTip(snapshot ? "已保存为新版本" : "已保存");
    if (!seed) {
      clearDraft("studio.new");
      nav(`/studio/${next.id}`, { replace: true });
    } else {
      clearDraft(`studio.${seed.id}`);
    }
    setTimeout(() => setSavedTip(null), 2200);
  };

  useShortcuts([
    {
      combo: "Mod+S",
      description: "save",
      handler: () => onSave(false),
      allowInInputs: true,
    },
    {
      combo: "Mod+Shift+S",
      description: "save as version",
      handler: async () => {
        const r = await confirmDialog({
          title: "保存为新版本快照？",
          description: "将创建一个版本历史节点，可随时回滚。",
          input: {
            label: "Changelog（修改说明）",
            placeholder: "优化节拍表 / 修复字段类型 / …",
          },
          confirmText: "保存",
        });
        if (r.ok) onSave(true, r.value || "snapshot");
      },
      allowInInputs: true,
    },
  ]);

  const onSaveAsNew = async () => {
    const next: TemplateRecord = {
      ...tpl,
      id: "tpl_" + nanoid(8),
      title: tpl.title + " · 副本",
      slug: tpl.slug + "-copy",
      authorId: "me",
      authorName: "You",
      isPublic: 0,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0,
    };
    await upsert(next);
    toast.success("已另存", `「${next.title}」`);
    nav(`/studio/${next.id}`);
  };

  const onDelete = async () => {
    if (!seed) return;
    const r = await confirmDialog({
      title: "确定删除该模板？",
      description: `「${seed.title}」将被永久删除，且无法恢复。`,
      danger: true,
      confirmText: "确认删除",
      input: {
        label: "输入模板名以确认",
        placeholder: seed.title,
        validate: (v) => (v === seed.title ? null : "名称不匹配"),
      },
    });
    if (!r.ok) return;
    await remove(seed.id);
    toast.success("已删除", seed.title);
    nav("/workshop");
  };

  const isFavorited = isFav(tpl.id);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem-1px)] min-h-[700px]">
      {/* 顶部条 */}
      <div className="border-b border-ink-700 bg-ink-900/70 backdrop-blur px-6 lg:px-10 py-3 flex items-center gap-4 flex-wrap">
        <button
          onClick={() => nav(-1)}
          className="ghost-button text-[10px] py-1.5 px-3"
        >
          <ArrowLeft size={11} /> 返回
        </button>

        <div className="flex-1 min-w-[200px]">
          <input
            value={tpl.title}
            onChange={(e) => setTpl({ ...tpl, title: e.target.value })}
            className="bg-transparent outline-none font-display text-[22px] text-paper-50 w-full"
            placeholder="未命名模板"
          />
          <div className="flex items-center gap-2 label-overline mt-0.5">
            <span className="text-amber">{GENRE_LABEL[tpl.genre]}</span>
            <span className="stat-divider" />
            <span>{BEAT_MODEL_LABEL[tpl.beatModel]}</span>
            <span className="stat-divider" />
            <span>v{tpl.version.toString().padStart(2, "0")}</span>
            <span className="stat-divider" />
            <span>≈ {tokens} tok</span>
            {dirty && (
              <>
                <span className="stat-divider" />
                <span className="text-amber">● 未保存</span>
              </>
            )}
            {!seed && (
              <>
                <span className="stat-divider" />
                <span className="text-ink-300">草稿已自动暂存</span>
              </>
            )}
          </div>
        </div>

        <div className="flex md:hidden border border-ink-600">
          {[
            { k: "edit", l: "字段" },
            { k: "preview", l: "提示词" },
            { k: "roll", l: "开拍" },
          ].map((tab) => (
            <button
              key={tab.k}
              onClick={() => setActiveTab(tab.k as any)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest2 ${
                activeTab === tab.k
                  ? "bg-amber text-ink-900"
                  : "text-ink-300"
              }`}
            >
              {tab.l}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSave(false)}
          className="reel-button text-[10px] py-1.5 px-3"
        >
          <Save size={11} /> {savedTip ?? "保存"}
        </button>

        {seed && (
          <>
            <button
              onClick={async () => {
                const r = await confirmDialog({
                  title: "保存为版本快照？",
                  description: "将记录当前全部字段到版本历史。",
                  input: {
                    label: "Changelog",
                    placeholder: "修改了节拍 / 风格调整 / …",
                  },
                  confirmText: "保存版本",
                });
                if (r.ok) onSave(true, r.value || "snapshot");
              }}
              className="ghost-button text-[10px] py-1.5 px-3"
              title="保存为新版本（⌘⇧S）"
            >
              <History size={11} /> 快照
            </button>
            {versionCount > 0 && (
              <Link
                to={`/library/${seed.id}/versions`}
                className="ghost-button text-[10px] py-1.5 px-3"
              >
                <History size={11} /> {versionCount}
              </Link>
            )}
            <button
              onClick={() => toggleFav(tpl.id)}
              className={`ghost-button text-[10px] py-1.5 px-3 ${
                isFavorited ? "border-reel text-reel" : ""
              }`}
            >
              <Heart size={11} fill={isFavorited ? "#C8102E" : "none"} />
              {isFavorited ? "已收藏" : "收藏"}
            </button>
          </>
        )}
      </div>

      {/* 桌面三栏 / 移动 tab */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
        <section
          className={`md:col-span-4 border-r border-ink-700 overflow-auto ${
            activeTab !== "edit" ? "hidden md:block" : ""
          }`}
        >
          <div className="sticky top-0 z-10 border-b border-ink-700 bg-ink-900/85 backdrop-blur px-5 py-3 flex items-center justify-between">
            <span className="label-overline">Scene 01 · 字段卡</span>
            <span className="label-overline">{tpl.fields.length} 个</span>
          </div>
          <div className="px-5 py-6 space-y-7">
            <div className="space-y-3 pb-5 border-b border-ink-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-overline">体裁</label>
                  <select
                    value={tpl.genre}
                    onChange={(e) =>
                      setTpl({ ...tpl, genre: e.target.value as any })
                    }
                    className="field-input text-[13px]"
                  >
                    {Object.entries(GENRE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-overline">节拍模型</label>
                  <select
                    value={tpl.beatModel}
                    onChange={(e) =>
                      setTpl({ ...tpl, beatModel: e.target.value as any })
                    }
                    className="field-input text-[13px]"
                  >
                    {Object.entries(BEAT_MODEL_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-overline">Logline（一句话）</label>
                <textarea
                  value={tpl.logline}
                  onChange={(e) => setTpl({ ...tpl, logline: e.target.value })}
                  rows={2}
                  className="field-input font-serif italic text-[14px]"
                />
              </div>
            </div>

            {tpl.fields.map((f) => (
              <div key={f.key}>
                <FieldEditor
                  field={f}
                  value={values[f.key] ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [f.key]: v }))
                  }
                />
              </div>
            ))}

            <div className="pt-4 border-t border-ink-700 flex flex-wrap items-center gap-2">
              <button onClick={onSaveAsNew} className="ghost-button text-[10px] py-1.5 px-3">
                <Copy size={11} /> 另存为
              </button>
              <button
                onClick={() => setSkillPickerOpen(true)}
                className="ghost-button text-[10px] py-1.5 px-3"
                title="从 Skill 库挑选并插入到提示词"
              >
                <Wand2 size={11} /> 插入 Skill
              </button>
              <button
                onClick={() => setEditPromptOpen(true)}
                className="ghost-button text-[10px] py-1.5 px-3"
                title="编辑原始提示词模板"
              >
                <Edit3 size={11} /> 编辑提示词
              </button>
              <button
                onClick={async () => {
                  await copyText(rendered);
                  toast.success("提示词已复制");
                }}
                className="ghost-button text-[10px] py-1.5 px-3"
              >
                <Download size={11} /> 导出当前提示词
              </button>
              {seed && (
                <button
                  onClick={onDelete}
                  className="ghost-button text-[10px] py-1.5 px-3 ml-auto hover:!border-reel hover:!text-reel"
                >
                  <Trash2 size={11} /> 删除
                </button>
              )}
            </div>
          </div>
        </section>

        <section
          className={`md:col-span-4 border-r border-ink-700 overflow-hidden ${
            activeTab !== "preview" ? "hidden md:block" : ""
          }`}
        >
          <PromptPreview
            tpl={tpl.promptTpl}
            systemPrompt={tpl.systemPrompt}
            values={values}
            onValuesChange={setValues}
          />
        </section>

        <section
          className={`md:col-span-4 overflow-hidden ${
            activeTab !== "roll" ? "hidden md:block" : ""
          }`}
        >
          <LlmPanel
            tpl={tpl}
            values={values}
            streaming={streaming}
            setStreaming={setStreaming}
          />
        </section>
      </div>

      {/* 底部变量条 */}
      <div className="border-t border-ink-700 bg-ink-900/85 backdrop-blur px-6 lg:px-10 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="label-overline shrink-0 text-amber">Vars ·</span>
        {vars.map((v) => {
          const filled = !!(values[v] && values[v].trim());
          return (
            <span
              key={v}
              onClick={() => {
                const el = document.querySelector(
                  `[data-field-key="${v}"]`
                ) as HTMLElement | null;
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`shrink-0 px-2 py-0.5 font-mono text-[10px] border cursor-pointer ${
                filled
                  ? "border-amber text-amber"
                  : "border-ink-600 text-ink-400 line-through"
              }`}
            >
              {v}
            </span>
          );
        })}
        <span className="ml-auto label-overline shrink-0">
          {vars.filter((v) => values[v] && values[v].trim()).length}/{vars.length} filled
        </span>
      </div>

      {/* 提示词编辑器 Modal */}
      <PromptEditor
        open={editPromptOpen}
        onClose={() => setEditPromptOpen(false)}
        tpl={tpl}
        onSave={(newTpl, newSys) => {
          setTpl({ ...tpl, promptTpl: newTpl, systemPrompt: newSys });
          setEditPromptOpen(false);
          toast.success("提示词已更新", "记得 ⌘S 保存到草稿");
        }}
      />

      {/* Skill 选择器 */}
      <SkillPicker
        open={skillPickerOpen}
        onClose={() => setSkillPickerOpen(false)}
        currentTpl={tpl.promptTpl}
        onInsert={(newTpl, list) => {
          setTpl({ ...tpl, promptTpl: newTpl });
          toast.success(`已插入 ${list.length} 个 Skill`, list.map((s) => "@" + s.key).join(" "));
        }}
      />
    </div>
  );
}

function PromptEditor({
  open,
  onClose,
  tpl,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  tpl: TemplateRecord;
  onSave: (promptTpl: string, systemPrompt: string) => void;
}) {
  const [promptTpl, setPromptTpl] = useState(tpl.promptTpl);
  const [systemPrompt, setSystemPrompt] = useState(tpl.systemPrompt ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setPromptTpl(tpl.promptTpl);
      setSystemPrompt(tpl.systemPrompt ?? "");
    }
  }, [open, tpl.promptTpl, tpl.systemPrompt]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="编辑提示词模板"
        subtitle="支持 {{var}} 引用字段，以及 @skill:key 插入剧本技能。"
        size="lg"
        footer={
          <>
            <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
              取消
            </button>
            <button
              onClick={() => onSave(promptTpl, systemPrompt)}
              className="reel-button text-[10px] py-1.5 px-3"
            >
              <Save size={11} /> 保存到模板
            </button>
          </>
        }
      >
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label-overline">User Prompt Template</label>
              <button
                onClick={() => setPickerOpen(true)}
                className="ghost-button text-[10px] py-1 px-2"
                title="从 Skill 库插入"
              >
                <Wand2 size={10} /> 插入 Skill
              </button>
            </div>
            <textarea
              value={promptTpl}
              onChange={(e) => setPromptTpl(e.target.value)}
              className="field-input font-mono text-[12px] leading-relaxed"
              rows={14}
            />
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-ink-300">
              <span>≈ {estimateTokens(promptTpl)} tok</span>
              <span>
                {promptTpl.match(/\{\{\s*[\w-]+\s*\}\}/g)?.length ?? 0} vars ·{" "}
                {promptTpl.match(/@skill:[\w-]+/g)?.length ?? 0} skills
              </span>
            </div>
          </div>
          <div>
            <label className="label-overline">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="field-input font-mono text-[12px] leading-relaxed mt-1"
              rows={5}
              placeholder="设定模型的角色与风格…"
            />
          </div>
        </div>
      </Modal>
      <SkillPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentTpl={promptTpl}
        onInsert={(newTpl) => {
          setPromptTpl(newTpl);
          setPickerOpen(false);
        }}
      />
    </>
  );
}

function newTemplate(): TemplateRecord {
  return {
    id: "tpl_" + nanoid(8),
    title: "未命名剧本模板",
    slug: "untitled-" + nanoid(4),
    logline: "",
    genre: "movie",
    beatModel: "three-act",
    tone: "",
    cover: "from-amber/40 via-ink-700 to-reel/30",
    authorId: "me",
    authorName: "You",
    isPublic: 0,
    usageCount: 0,
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fields: [
      { key: "title", label: "片名", type: "text", required: true, placeholder: "《回声巷》" },
      { key: "logline", label: "Logline", type: "longtext", required: true, helper: "一句话故事，不超过 30 字。" },
      { key: "world", label: "世界观", type: "longtext", required: true },
      { key: "protagonist", label: "主角", type: "struct", required: true },
      { key: "beats", label: "节拍表", type: "list", required: true },
      { key: "twist", label: "反转 / 钩子", type: "longtext" },
    ],
    promptTpl: `# 任务
请基于以下结构化字段，撰写一部中文剧本的开场 5 场戏。

# 信息
- 片名：{{title}}
- Logline：{{logline}}
- 世界观：{{world}}
- 风格：{{tone}}
- 反转：{{twist}}

# 角色
{{protagonist}}

# 节拍
{{beats}}

# 要求
1. 标准剧本格式输出。
2. 中文，电影感。`,
    systemPrompt:
      "你是一位资深编剧，擅长将结构化提示词转化为高完成度的中文剧本。输出语言：中文，画面感优先，台词锋利。",
    tags: ["草稿"],
    description: "",
  };
}

function defaultFor(key: string): string {
  const map: Record<string, string> = {
    title: "",
    logline: "",
    world: "",
    protagonist:
      "姓名：\n年龄：\n外在：\n内在：\n欲望：\n伤口：\n弧光：",
    antagonist: "",
    beats: JSON.stringify([
      "第一幕开场 · 建立世界",
      "触发事件 · 打破平衡",
      "第一情节点 · 主角接受召唤",
    ]),
    turn: "",
    hook: "",
    tone: "",
    twist: "",
    scene: "",
    conflict: "",
    ending: "",
    duration: "60 秒",
    turns: JSON.stringify(["惊讶", "反转", "落点"]),
    structure: JSON.stringify(["钩子 · 三秒抓住", "痛点 · 真实场景", "案例 · 一正一反", "总结 · 金句", "CTA · 行动号召"]),
    cta: "评论区告诉我你的答案。",
    niche: "",
    platform: "",
    branches: JSON.stringify([
      "节点 A · 医生选择公开真相",
      "节点 B · 医生选择隐瞒",
      "节点 C · 医生选择离开",
    ]),
    endings: "3 个结局：真相 / 谎言 / 救赎",
    stakes: "所有人无法离开医院，否则将死。",
    form: "互动影视",
  };
  return map[key] ?? "";
}
