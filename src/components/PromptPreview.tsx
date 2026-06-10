// 提示词预览面板
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import { renderPrompt, estimateTokens } from "@/utils/prompt";
import { copyText } from "@/utils/format";

interface Props {
  tpl: string;
  systemPrompt: string;
  values: Record<string, string>;
  onValuesChange: (v: Record<string, string>) => void;
}

export function PromptPreview({ tpl, systemPrompt, values }: Props) {
  const [copied, setCopied] = useState<"sys" | "user" | "json" | null>(null);
  const rendered = renderPrompt(tpl, values);
  const tokens = estimateTokens(rendered + systemPrompt);

  const onCopy = async (which: "sys" | "user" | "json", text: string) => {
    await copyText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  };

  const highlightVars = (text: string) => {
    const re = /\{\{\s*([\w-]+)\s*\}\}/g;
    const parts: Array<{ t: "text" | "var"; v: string; filled?: boolean }> = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) parts.push({ t: "text", v: text.slice(last, m.index) });
      const key = m[1];
      const filled = !!(values[key] && values[key].trim());
      parts.push({ t: "var", v: m[0], filled });
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({ t: "text", v: text.slice(last) });
    return parts;
  };

  const parts = highlightVars(rendered);

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5 bg-ink-700/40">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-amber">
            ⌘ Preview
          </span>
          <span className="label-overline">User Prompt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="label-overline">≈ {tokens} tok</span>
          <button
            onClick={() => onCopy("user", rendered)}
            className="ghost-button text-[10px] py-1 px-2.5"
          >
            {copied === "user" ? <Check size={11} /> : <Copy size={11} />}
            {copied === "user" ? "已复制" : "复制"}
          </button>
          <button
            onClick={() => onCopy("json", JSON.stringify({ system: systemPrompt, user: rendered }, null, 2))}
            className="ghost-button text-[10px] py-1 px-2.5"
          >
            {copied === "json" ? <Check size={11} /> : <Download size={11} />}
            {copied === "json" ? "已导出" : "JSON"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 font-mono text-[12.5px] leading-[1.8] text-paper-200 whitespace-pre-wrap">
        {parts.length === 0 ? (
          <span className="text-ink-400">// 开始填写左侧字段，提示词会实时在此拼装…</span>
        ) : (
          parts.map((p, i) =>
            p.t === "var" ? (
              <span
                key={i}
                className={
                  p.filled
                    ? "text-amber bg-amber/10 px-0.5"
                    : "text-ink-400 bg-ink-700/50 px-0.5 line-through"
                }
              >
                {p.v}
              </span>
            ) : (
              <span key={i}>{p.v}</span>
            )
          )
        )}
      </div>

      <div className="border-t border-ink-600 bg-ink-700/30">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="label-overline">System</span>
          <button
            onClick={() => onCopy("sys", systemPrompt)}
            className="ghost-button text-[10px] py-0.5 px-2"
          >
            {copied === "sys" ? <Check size={10} /> : <Copy size={10} />}
            复制
          </button>
        </div>
        <div className="px-4 pb-3 max-h-28 overflow-auto font-mono text-[11.5px] leading-relaxed text-ink-300 whitespace-pre-wrap">
          {systemPrompt}
        </div>
      </div>
    </div>
  );
}
