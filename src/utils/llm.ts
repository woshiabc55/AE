// LLM 流式调用
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
}

export async function streamChat(opts: LLMCallOptions): Promise<{
  ok: boolean;
  content: string;
  error?: string;
  latencyMs: number;
}> {
  const { settings, messages, onDelta, signal } = opts;
  const start = performance.now();
  if (!settings.llmApiKey) {
    return {
      ok: false,
      content: "",
      error: "未配置 API Key，请前往「设置」页面填入 OpenAI 兼容服务的 API Key。",
      latencyMs: 0,
    };
  }
  const url = settings.llmBaseUrl.replace(/\/+$/, "") + "/chat/completions";
  let resp: Response;
  try {
    resp = await fetch(url, {
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
  } catch (e) {
    return {
      ok: false,
      content: "",
      error: "网络错误：" + (e as Error).message,
      latencyMs: performance.now() - start,
    };
  }
  if (!resp.ok || !resp.body) {
    const text = await resp.text().catch(() => "");
    return {
      ok: false,
      content: "",
      error: `请求失败 ${resp.status}: ${text.slice(0, 300)}`,
      latencyMs: performance.now() - start,
    };
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
        return {
          ok: true,
          content,
          latencyMs: performance.now() - start,
        };
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
  return { ok: true, content, latencyMs: performance.now() - start };
}
