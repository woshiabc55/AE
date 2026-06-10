// AI 提示词优化器 - 调用 LLM 分析并给出修改建议
import type { AppSettings } from "@/types";
import { callOnce } from "@/utils/llm";

export interface PromptIssue {
  severity: "info" | "warn" | "critical";
  category: string;
  message: string;
  suggestion?: string;
  fieldKey?: string;
}

export interface PromptAnalysis {
  score: number; // 0-100
  summary: string;
  issues: PromptIssue[];
  rewrittenPrompt?: string;
  rewrittenSystem?: string;
}

const SYSTEM = `你是一位资深 AI Prompt 工程师，擅长诊断与重写面向大语言模型的中文剧本提示词。
你的输出必须严格遵循以下 JSON Schema：
{
  "score": number,         // 0-100 综合评分
  "summary": string,       // 一句话总评
  "issues": [
    { "severity": "info" | "warn" | "critical",
      "category": "clarity" | "specificity" | "structure" | "ambiguity" | "completeness" | "format" | "other",
      "message": string,    // 问题简述
      "suggestion": string, // 修改建议
      "fieldKey"?: string   // 关联的字段 key（如果能定位）
    }
  ],
  "rewrittenPrompt"?: string,    // 重写后的 user 提示词（可选）
  "rewrittenSystem"?: string      // 重写后的 system 提示词（可选）
}
不要输出任何 JSON 之外的文字。`;

export async function analyzePrompt(opts: {
  settings: AppSettings;
  promptTpl: string;
  systemPrompt: string;
  fields: Array<{ key: string; label: string; type: string; helper?: string; required?: boolean }>;
  filledKeys: string[];
  signal?: AbortSignal;
}): Promise<PromptAnalysis | { error: string }> {
  const fieldsList = opts.fields
    .map(
      (f) =>
        `- ${f.key} (${f.type}${f.required ? ", 必填" : ""}, 标签: ${f.label})${
          f.helper ? " | 提示: " + f.helper : ""
        }`
    )
    .join("\n");
  const missing = opts.fields
    .filter((f) => f.required && !opts.filledKeys.includes(f.key))
    .map((f) => f.key);
  const user = `请诊断并重写以下剧本提示词模板（如果有可重写空间）。

# 字段定义
${fieldsList}

# 已填写的字段
${opts.filledKeys.length ? opts.filledKeys.join(", ") : "（暂无）"}

# 必填但未填写的字段
${missing.length ? missing.join(", ") : "（无）"}

# System Prompt
${opts.systemPrompt}

# Prompt Template
${opts.promptTpl}

# 任务
1. 评估整体质量（0-100）。
2. 列出所有问题，按 critical > warn > info 排序。
3. 给出可操作的具体修改建议。
4. 如果可以明显改进，附带重写后的 user / system 提示词。`;

  const r = await callOnce(
    opts.settings,
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: user },
    ],
    opts.signal
  );
  if (!r.ok) return { error: r.error ?? "调用失败" };
  // 提取 JSON
  const m = r.content.match(/\{[\s\S]*\}/);
  if (!m) return { error: "LLM 未返回有效 JSON" };
  try {
    const obj = JSON.parse(m[0]);
    return {
      score: typeof obj.score === "number" ? obj.score : 0,
      summary: String(obj.summary ?? ""),
      issues: Array.isArray(obj.issues) ? obj.issues : [],
      rewrittenPrompt: obj.rewrittenPrompt,
      rewrittenSystem: obj.rewrittenSystem,
    };
  } catch (e) {
    return { error: "解析失败：" + (e as Error).message };
  }
}
