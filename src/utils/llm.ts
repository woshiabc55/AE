// LLM 流式调用 - 支持重试、可中止、详细错误
import type { AppSettings } from "@/types";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCallOptions {
  settings: AppSettings;
  messages: LLMMessage[];
  onDelta: (delta: string) => void;
  signal?: AbortSignal;
  onRetry?: (attempt: number, delay: number, reason: string) => void;
}

export interface LLMResult {
  ok: boolean;
  content: string;
  error?: string;
  latencyMs: number;
  attempts: number;
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((res, rej) => {
    if (signal?.aborted) return rej(new DOMException("aborted", "AbortError"));
    const t = setTimeout(res, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      rej(new DOMException("aborted", "AbortError"));
    });
  });
}

function isRetryable(err: string): boolean {
  if (!err) return false;
  return /network|fetch|timeout|429|5\d\d|ETIMEDOUT|ENOTFOUND|aborted/i.test(err);
}

export async function streamChat(opts: LLMCallOptions): Promise<LLMResult> {
  const { settings, messages, onDelta, signal, onRetry } = opts;
  if (!settings.llmApiKey) {
    return {
      ok: false,
      content: "",
      error: "未配置 API Key，请前往「设置」页面填入 OpenAI 兼容服务的 API Key。",
      latencyMs: 0,
      attempts: 0,
    };
  }
  const url = settings.llmBaseUrl.replace(/\/+$/, "") + "/chat/completions";
  const maxAttempts = Math.max(1, (settings.retryCount ?? 2) + 1);
  const baseDelay = settings.retryDelay ?? 1200;
  let lastError = "";
  let totalLatency = 0;
  let fullContent = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal?.aborted) break;
    const t0 = performance.now();
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.llmApiKey}`,
        },
        body: JSON.stringify({
          model: settings.llmModel,
          messages,
          temperature: settings.temperature,
          top_p: settings.topP,
          max_tokens: settings.maxTokens,
          stream: true,
        }),
        signal,
      });
      totalLatency += performance.now() - t0;
      if (!resp.ok || !resp.body) {
        const text = await resp.text().catch(() => "");
        lastError = `请求失败 ${resp.status}: ${text.slice(0, 240)}`;
        if (attempt < maxAttempts && isRetryable(lastError)) {
          const delay = baseDelay * attempt;
          onRetry?.(attempt, delay, lastError);
          await sleep(delay, signal);
          continue;
        }
        return { ok: false, content: "", error: lastError, latencyMs: totalLatency, attempts: attempt };
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buf = "";
      let content = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            fullContent = content;
            return { ok: true, content, latencyMs: totalLatency, attempts: attempt };
          }
          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              onDelta(delta);
            }
          } catch {
            // 忽略坏包
          }
        }
      }
      fullContent = content;
      return { ok: true, content, latencyMs: totalLatency, attempts: attempt };
    } catch (e) {
      totalLatency += performance.now() - t0;
      if ((e as Error).name === "AbortError") {
        return {
          ok: false,
          content: fullContent,
          error: "已中止",
          latencyMs: totalLatency,
          attempts: attempt,
        };
      }
      lastError = (e as Error).message;
      if (attempt < maxAttempts && isRetryable(lastError)) {
        const delay = baseDelay * attempt;
        onRetry?.(attempt, delay, lastError);
        try {
          await sleep(delay, signal);
        } catch {
          return { ok: false, content: fullContent, error: "已中止", latencyMs: totalLatency, attempts: attempt };
        }
        continue;
      }
      return {
        ok: false,
        content: fullContent,
        error: lastError || "未知错误",
        latencyMs: totalLatency,
        attempts: attempt,
      };
    }
  }
  return {
    ok: false,
    content: fullContent,
    error: lastError || "已达最大重试次数",
    latencyMs: totalLatency,
    attempts: maxAttempts,
  };
}

// 非流式单次调用，用于评分 / 改写
export async function callOnce(
  settings: AppSettings,
  messages: LLMMessage[],
  signal?: AbortSignal
): Promise<{ ok: boolean; content: string; error?: string }> {
  if (!settings.llmApiKey) {
    return { ok: false, content: "", error: "未配置 API Key" };
  }
  const url = settings.llmBaseUrl.replace(/\/+$/, "") + "/chat/completions";
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.llmApiKey}`,
      },
      body: JSON.stringify({
        model: settings.llmModel,
        messages,
        temperature: settings.temperature,
        top_p: settings.topP,
        stream: false,
      }),
      signal,
    });
    if (!r.ok) {
      return { ok: false, content: "", error: `HTTP ${r.status}` };
    }
    const data = await r.json();
    return {
      ok: true,
      content: data?.choices?.[0]?.message?.content ?? "",
    };
  } catch (e) {
    return { ok: false, content: "", error: (e as Error).message };
  }
}
