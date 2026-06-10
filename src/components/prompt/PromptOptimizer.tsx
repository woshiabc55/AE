// AI 提示词优化器组件
import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  RefreshCw,
  X,
  Wand2,
  Save,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/store";
import { analyzePrompt, type PromptAnalysis, type PromptIssue } from "@/utils/prompt-optimizer";
import { extractVars } from "@/utils/prompt";
import { toast } from "@/store/toast";
import { copyText } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TemplateRecord } from "@/types";
import { cn } from "@/utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  tpl: TemplateRecord;
  values: Record<string, string>;
  onApply: (patch: { promptTpl?: string; systemPrompt?: string }) => void;
}

const SEV: Record<PromptIssue["severity"], { color: string; icon: any }> = {
  info: { color: "text-paper-300 border-ink-600", icon: Info },
  warn: { color: "text-amber border-amber/50", icon: AlertTriangle },
  critical: { color: "text-reel border-reel/50", icon: AlertTriangle },
};

export function PromptOptimizer({ open, onClose, tpl, values, onApply }: Props) {
  const settings = useAppStore((s) => s.settings);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showRewrite, setShowRewrite] = useState(false);

  const filledKeys = Object.entries(values)
    .filter(([, v]) => v && v.trim())
    .map(([k]) => k);
  const allVars = extractVars(tpl.promptTpl);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setAnalysis(null);
    if (!settings.llmApiKey) {
      setErr("未配置 API Key。请先在「设置」填入。");
      setLoading(false);
      return;
    }
    const r = await analyzePrompt({
      settings,
      promptTpl: tpl.promptTpl,
      systemPrompt: tpl.systemPrompt,
      fields: tpl.fields,
      filledKeys,
    });
    setLoading(false);
    if ("error" in r) {
      setErr(r.error);
      toast.error("分析失败", r.error);
    } else {
      setAnalysis(r);
    }
  };

  const apply = (which: "user" | "system" | "both") => {
    const patch: { promptTpl?: string; systemPrompt?: string } = {};
    if (analysis?.rewrittenPrompt && (which === "user" || which === "both")) {
      patch.promptTpl = analysis.rewrittenPrompt;
    }
    if (analysis?.rewrittenSystem && (which === "system" || which === "both")) {
      patch.systemPrompt = analysis.rewrittenSystem;
    }
    onApply(patch);
    toast.success("已应用", "提示词已更新到 Studio");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="提示词优化器"
      subtitle="由 LLM 评估并给出诊断与重写建议"
      size="xl"
      footer={
        <>
          <button onClick={onClose} className="ghost-button text-[10px] py-1.5 px-3">
            <X size={11} /> 关闭
          </button>
          <button onClick={run} className="ghost-button text-[10px] py-1.5 px-3">
            <RefreshCw size={11} /> 重新分析
          </button>
        </>
      }
    >
      <div className="p-5 space-y-5">
        {/* 元信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="panel p-3">
            <div className="label-overline">字段数</div>
            <div className="font-display text-[24px] text-paper-50">
              {tpl.fields.length}
            </div>
          </div>
          <div className="panel p-3">
            <div className="label-overline">变量数</div>
            <div className="font-display text-[24px] text-paper-50">{allVars.length}</div>
          </div>
          <div className="panel p-3">
            <div className="label-overline">已填</div>
            <div className="font-display text-[24px] text-amber">
              {filledKeys.length}
              <span className="text-ink-400 text-[14px]">/{allVars.length}</span>
            </div>
          </div>
          <div className="panel p-3">
            <div className="label-overline">字数</div>
            <div className="font-display text-[24px] text-paper-50">
              {tpl.promptTpl.length + tpl.systemPrompt.length}
            </div>
          </div>
        </div>

        {err && (
          <div className="border border-reel/40 bg-reel/10 text-reel px-4 py-3 text-[13px] flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-display">无法分析</div>
              <div className="opacity-80 mt-0.5">{err}</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber">
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-mono text-[11px]">AI 正在诊断你的提示词……</span>
            </div>
            <Skeleton className="h-24" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        )}

        {!loading && !analysis && !err && (
          <div className="text-center py-12">
            <Wand2 size={28} className="text-amber mx-auto mb-3" />
            <h3 className="font-display text-[22px] text-paper-50">
              一键诊断你的提示词
            </h3>
            <p className="mt-2 font-serif text-paper-200 max-w-md mx-auto">
              我们会让 LLM 从「清晰度 / 具体性 / 结构 / 完整性 / 模糊性 / 格式」6 个维度评估你的提示词，
              并给出可操作的修改建议与重写版本。
            </p>
            <button onClick={run} className="reel-button mt-5 mx-auto">
              <Sparkles size={12} /> 开始分析
            </button>
          </div>
        )}

        {!loading && analysis && (
          <>
            {/* 评分 */}
            <div className="panel p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="label-overline">综合评分</div>
                  <div className="mt-1 font-display text-[64px] leading-none text-amber">
                    {analysis.score}
                    <span className="text-ink-400 text-[24px]">/100</span>
                  </div>
                </div>
                <p className="font-serif italic text-paper-200 max-w-md text-right">
                  "{analysis.summary}"
                </p>
              </div>
              {/* 进度条 */}
              <div className="mt-4 h-1.5 bg-ink-700 overflow-hidden">
                <div
                  className="h-full bg-amber origin-left"
                  style={{
                    width: `${Math.max(0, Math.min(100, analysis.score))}%`,
                    transition: "width 0.6s ease-out",
                  }}
                />
              </div>
            </div>

            {/* 问题列表 */}
            {analysis.issues.length > 0 && (
              <div className="panel">
                <div className="border-b border-ink-700 px-4 py-2.5 flex items-center justify-between">
                  <span className="label-overline">诊断 · {analysis.issues.length} 项</span>
                  <div className="flex gap-2 label-overline">
                    {(["critical", "warn", "info"] as const).map((s) => {
                      const n = analysis.issues.filter((i) => i.severity === s).length;
                      return (
                        <span key={s} className={SEV[s].color}>
                          {s} · {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="divide-y divide-ink-700 max-h-80 overflow-auto">
                  {analysis.issues
                    .sort((a, b) => {
                      const order = { critical: 0, warn: 1, info: 2 } as const;
                      return order[a.severity] - order[b.severity];
                    })
                    .map((iss, i) => {
                      const Style = SEV[iss.severity];
                      const Icon = Style.icon;
                      return (
                        <div key={i} className="px-4 py-3 flex items-start gap-3">
                          <Icon size={14} className={cn("mt-0.5 shrink-0", Style.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn("font-mono text-[10px] uppercase", Style.color)}>
                                {iss.category}
                              </span>
                              {iss.fieldKey && (
                                <span className="font-mono text-[10px] text-ink-300">
                                  @ {iss.fieldKey}
                                </span>
                              )}
                            </div>
                            <div className="font-serif text-[14px] text-paper-100">
                              {iss.message}
                            </div>
                            {iss.suggestion && (
                              <div className="mt-1.5 font-mono text-[12px] text-amber/80 pl-3 border-l border-amber/40">
                                → {iss.suggestion}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 重写建议 */}
            {(analysis.rewrittenPrompt || analysis.rewrittenSystem) && (
              <div className="panel">
                <button
                  onClick={() => setShowRewrite((s) => !s)}
                  className="w-full flex items-center justify-between border-b border-ink-700 px-4 py-2.5 hover:bg-ink-700/40"
                >
                  <span className="label-overline">✍️ 重写建议</span>
                  <span className="font-mono text-[10px] text-amber">
                    {showRewrite ? "收起" : "展开"}
                  </span>
                </button>
                {showRewrite && (
                  <div className="p-4 space-y-4">
                    {analysis.rewrittenPrompt && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="label-overline">User Prompt</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyText(analysis.rewrittenPrompt!)}
                              className="ghost-button text-[10px] py-1 px-2"
                            >
                              <Copy size={10} /> 复制
                            </button>
                            <button
                              onClick={() => apply("user")}
                              className="reel-button text-[10px] py-1 px-2"
                            >
                              <Save size={10} /> 应用
                            </button>
                          </div>
                        </div>
                        <pre className="bg-ink-900/60 border border-ink-600 p-3 font-mono text-[12px] leading-[1.7] text-paper-200 whitespace-pre-wrap max-h-60 overflow-auto">
                          {analysis.rewrittenPrompt}
                        </pre>
                      </div>
                    )}
                    {analysis.rewrittenSystem && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="label-overline">System Prompt</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyText(analysis.rewrittenSystem!)}
                              className="ghost-button text-[10px] py-1 px-2"
                            >
                              <Copy size={10} /> 复制
                            </button>
                            <button
                              onClick={() => apply("system")}
                              className="reel-button text-[10px] py-1 px-2"
                            >
                              <Save size={10} /> 应用
                            </button>
                          </div>
                        </div>
                        <pre className="bg-ink-900/60 border border-ink-600 p-3 font-mono text-[12px] leading-[1.7] text-paper-200 whitespace-pre-wrap max-h-40 overflow-auto">
                          {analysis.rewrittenSystem}
                        </pre>
                      </div>
                    )}
                    <button
                      onClick={() => apply("both")}
                      className="reel-button w-full justify-center"
                    >
                      <CheckCircle2 size={12} /> 应用全部重写
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
