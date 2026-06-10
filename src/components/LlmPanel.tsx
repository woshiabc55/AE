// 大模型调用面板
import { useRef, useState } from "react";
import { Send, Square, Settings2, AlertTriangle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store";
import { streamChat } from "@/utils/llm";
import { renderPrompt, estimateTokens } from "@/utils/prompt";
import { timeAgo } from "@/utils/format";
import type { TemplateRecord } from "@/types";
import { db } from "@/db";
import { nanoid } from "nanoid";

interface Props {
  tpl: TemplateRecord;
  values: Record<string, string>;
  streaming: boolean;
  setStreaming: (b: boolean) => void;
}

export function LlmPanel({ tpl, values, streaming, setStreaming }: Props) {
  const settings = useAppStore((s) => s.settings);
  const [output, setOutput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  const rendered = renderPrompt(tpl.promptTpl, values);
  const pt = estimateTokens(tpl.systemPrompt);
  const ut = estimateTokens(rendered);

  const onCall = async () => {
    setErr(null);
    setOutput("");
    setStreaming(true);
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    const res = await streamChat({
      settings,
      messages: [
        { role: "system", content: tpl.systemPrompt },
        { role: "user", content: rendered },
      ],
      signal: ctrl.signal,
      onDelta: (d) => setOutput((prev) => prev + d),
    });
    setStreaming(false);
    if (!res.ok) {
      setErr(res.error || "调用失败");
    } else {
      setLastLatency(res.latencyMs);
      await db.callLogs.put({
        id: "cl_" + nanoid(8),
        templateId: tpl.id,
        model: settings.llmModel,
        promptTokens: ut + pt,
        completionTokens: estimateTokens(res.content),
        latencyMs: res.latencyMs,
        status: "ok",
        createdAt: Date.now(),
      });
    }
  };

  const onStop = () => {
    ctrlRef.current?.abort();
    setStreaming(false);
  };

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5 bg-ink-700/40">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
            ◉ Roll
          </span>
          <span className="label-overline">Live LLM</span>
        </div>
        <Link
          to="/settings"
          className="ghost-button text-[10px] py-1 px-2.5"
          title="设置 API Key 与模型"
        >
          <Settings2 size={11} /> 模型
        </Link>
      </div>

      {/* 模型信息条 */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-ink-600 bg-ink-800/50">
        <div>
          <div className="label-overline">Model</div>
          <div className="font-mono text-[12px] text-amber truncate">
            {settings.llmModel}
          </div>
        </div>
        <div>
          <div className="label-overline">Temp / TopP</div>
          <div className="font-mono text-[12px] text-paper-200">
            {settings.temperature.toFixed(2)} / {settings.topP.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="label-overline">Tokens</div>
          <div className="font-mono text-[12px] text-paper-200">
            {pt + ut} <span className="text-ink-400">in</span>
          </div>
        </div>
      </div>

      {/* 输出区 */}
      <div className="flex-1 overflow-auto p-5 font-serif text-[13.5px] leading-[1.85] text-paper-100 whitespace-pre-wrap">
        {streaming && !output && (
          <div className="flex items-center gap-2 text-ink-300">
            <Sparkles size={14} className="text-amber" /> 编剧正在构思第一笔……
            <span className="cursor inline-block" />
          </div>
        )}
        {output ? (
          <div className={streaming ? "cursor" : ""}>{output}</div>
        ) : (
          !streaming && (
            <div className="text-ink-400 italic">
              填写左侧字段后点击「开拍」，将由「{settings.llmModel}」接棒输出剧本。
            </div>
          )
        )}
      </div>

      {err && (
        <div className="mx-4 mb-3 border border-reel/50 bg-reel/10 text-reel px-3 py-2 text-[12px] flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* 操作栏 */}
      <div className="border-t border-ink-600 bg-ink-800/50 px-4 py-3 flex items-center gap-3">
        {!streaming ? (
          <button onClick={onCall} className="reel-button flex-1">
            <Send size={12} strokeWidth={2} /> 开拍 · Action
          </button>
        ) : (
          <button onClick={onStop} className="reel-button-red flex-1">
            <Square size={12} fill="currentColor" /> 停机 · Cut
          </button>
        )}
        {lastLatency !== null && !streaming && (
          <span className="label-overline whitespace-nowrap">
            {timeAgo(Date.now() - lastLatency)} · {Math.round(lastLatency)} ms
          </span>
        )}
      </div>
    </div>
  );
}
