// 萤幕 v1 — Style Studio：风格预设 + 一键全局布置
import { useMemo, useState } from "react";
import {
  Palette,
  Sparkles,
  Check,
  Crown,
  Wand2,
  Sun,
  X,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { StylePreset, TemplateRecord } from "@/types";
import { toast } from "@/store/toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/utils/format";
import { PackIO } from "@/components/PackIO";

export function StyleStudio() {
  const styles = useAppStore((s) => s.styles);
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const templates = useAppStore((s) => s.templates);
  const upsertTemplate = useAppStore((s) => s.upsertTemplate);
  const upsertStyle = useAppStore((s) => s.upsertStyle);

  const [active, setActive] = useState<string | null>(null);
  const [previewTpl, setPreviewTpl] = useState<string>("");
  const [applyTargets, setApplyTargets] = useState<Set<string>>(new Set());

  const activeStyle = useMemo(
    () => styles.find((s) => s.id === active) || styles.find((s) => s.key === settings.activeStyleKey) || null,
    [active, styles, settings.activeStyleKey]
  );

  const onApply = async () => {
    if (!activeStyle) {
      toast.warn("请选择一个风格");
      return;
    }
    if (applyTargets.size === 0) {
      toast.warn("请选择至少一个应用目标");
      return;
    }
    const r = await confirmDialog({
      title: "应用「" + activeStyle.name + "」？",
      description: `将向 ${applyTargets.size} 个剧本注入风格指令（视觉 + 剧本风格）。原有提示词保留，仅追加风格段落。`,
      confirmText: "应用",
    });
    if (!r.ok) return;
    for (const tplId of applyTargets) {
      const tpl = templates.find((t) => t.id === tplId);
      if (!tpl) continue;
      const next: TemplateRecord = {
        ...tpl,
        promptTpl: tpl.promptTpl + activeStyle.promptSuffix,
        systemPrompt:
          (tpl.systemPrompt || "") +
          (tpl.systemPrompt ? "\n\n" : "") +
          activeStyle.scriptDirective,
        updatedAt: Date.now(),
      };
      await upsertTemplate(next);
    }
    // 全局默认风格
    saveSettings({ activeStyleKey: activeStyle.key });
    // 视觉主题
    document.documentElement.style.setProperty("--accent-color", activeStyle.visual.primary);
    document.documentElement.style.setProperty("--accent-font", activeStyle.visual.font);
    toast.success("已布置", `${activeStyle.name} 已应用到 ${applyTargets.size} 个剧本`);
  };

  const toggleTarget = (id: string) => {
    const s = new Set(applyTargets);
    s.has(id) ? s.delete(id) : s.add(id);
    setApplyTargets(s);
  };

  const selectAll = () => {
    if (applyTargets.size === templates.length) setApplyTargets(new Set());
    else setApplyTargets(new Set(templates.map((t) => t.id)));
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Palette size={20} className="text-amber" />
              <h1 className="font-display text-[36px] text-paper-50 leading-none">
                Style 风格工作室
              </h1>
            </div>
            <p className="mt-2 font-serif text-paper-200 max-w-2xl">
              一键把视觉主题（颜色 / 字体）与剧本风格（导演指令）同时布置到任意剧本。
              选一个 Style，决定它要覆盖哪些剧本，一键完成。
            </p>
          </div>
          <PackIO
            kind="style"
            styles={styles}
            upsertSkill={async () => {}}
            upsertStyle={upsertStyle}
          />
        </div>
      </header>

      {/* Style 卡片墙 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="label-overline">选择风格预设</h2>
          {settings.activeStyleKey && (
            <span className="text-[10px] font-mono text-amber">
              当前全局默认：{settings.activeStyleKey}
            </span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {styles.map((s) => (
            <StyleCard
              key={s.id}
              style={s}
              selected={active === s.id || (!active && settings.activeStyleKey === s.key)}
              onSelect={() => setActive(s.id)}
            />
          ))}
        </div>
      </section>

      {/* 应用目标 */}
      {activeStyle && (
        <section className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="label-overline">应用目标</h2>
            <button
              onClick={selectAll}
              className="ghost-button text-[10px] py-1 px-2"
            >
              {applyTargets.size === templates.length ? "取消全选" : "全选"}
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="text-[12px] text-ink-300 font-serif italic">
              还没有任何剧本。先去新建一个。
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-2">
              {templates.map((t) => {
                const checked = applyTargets.has(t.id);
                return (
                  <label
                    key={t.id}
                    className={cn(
                      "flex items-center gap-2 p-2 border cursor-pointer transition",
                      checked
                        ? "border-amber bg-amber/5"
                        : "border-ink-700 hover:border-ink-500"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTarget(t.id)}
                      className="accent-amber"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[14px] text-paper-50 truncate">
                        {t.title}
                      </div>
                      <div className="text-[10px] font-mono text-ink-300 truncate">
                        {t.genre} · v{t.version}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 一键应用 */}
      {activeStyle && (
        <section className="panel p-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="label-overline">准备就绪</div>
              <h3 className="font-display text-[24px] text-paper-50 mt-1">
                把「{activeStyle.name}」应用到 {applyTargets.size} 个剧本
              </h3>
              <p className="text-[12px] font-serif text-paper-200 mt-2 max-w-2xl">
                系统将：① 注入风格指令到 system prompt；② 追加风格清单到 promptTpl；③
                把视觉主色与字体写入全局 CSS 变量；④ 设为全局默认风格。
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // 视觉预览
                  const preview = document.getElementById("style-preview");
                  if (preview) {
                    preview.style.setProperty("--preview-primary", activeStyle.visual.primary);
                    preview.style.setProperty("--preview-font", activeStyle.visual.font);
                    preview.style.color = activeStyle.visual.primary;
                  }
                }}
                className="ghost-button text-[10px] py-1.5 px-3"
              >
                <Sun size={11} /> 视觉预览
              </button>
              <button onClick={onApply} className="reel-button text-[10px] py-1.5 px-3">
                <Wand2 size={11} /> 一键全局布置
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 详情：当前选中风格 */}
      {activeStyle && (
        <section className="panel p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="label-overline">导演指令（注入到 system prompt）</h3>
              <pre className="mt-2 font-serif text-[12px] text-paper-100 whitespace-pre-wrap leading-relaxed bg-ink-900 border border-ink-700 p-3">
                {activeStyle.scriptDirective}
              </pre>
            </div>
            <div>
              <h3 className="label-overline">提示词后缀（追加到 promptTpl）</h3>
              <pre className="mt-2 font-mono text-[11px] text-paper-100 whitespace-pre-wrap leading-relaxed bg-ink-900 border border-ink-700 p-3">
                {activeStyle.promptSuffix}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StyleCard({
  style,
  selected,
  onSelect,
}: {
  style: StylePreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const v = style.visual;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative panel p-4 text-left transition group",
        selected ? "ring-2 ring-amber" : "panel-hover"
      )}
      style={{
        // @ts-expect-error 自定义 CSS
        "--card-primary": v.primary,
      }}
    >
      {style.isBuiltin ? (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-mono text-amber border border-amber/40 px-1.5 py-0.5">
          <Crown size={9} /> 内置
        </span>
      ) : null}
      {selected && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-mono text-amber border border-amber/40 px-1.5 py-0.5 bg-amber/10">
          <Check size={9} /> 已选
        </span>
      )}

      <div className="flex items-center gap-2">
        <span
          className="w-6 h-6 border border-ink-700"
          style={{ background: v.primary }}
        />
        <h3 className="font-display text-[20px] text-paper-50">{style.name}</h3>
      </div>
      <p className="mt-2 text-[12px] font-serif italic text-paper-200">
        {v.vibe}
      </p>
      <div className="mt-3 flex gap-2">
        {["hook", "scene", "ending"].map((k) => (
          <span
            key={k}
            className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest2 border border-ink-700 text-ink-200"
            style={{ color: v.primary }}
          >
            {k}
          </span>
        ))}
      </div>
    </button>
  );
}
