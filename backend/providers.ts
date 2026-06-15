// 大模型 Provider 抽象
export interface LLMRequest {
  provider: string;
  model: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMToken {
  type: 'token' | 'done' | 'error';
  text?: string;
  meta?: { totalTokens?: number; latencyMs?: number };
  error?: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  health(): Promise<{ ok: boolean; latencyMs: number; message?: string }>;
  stream(req: LLMRequest): AsyncGenerator<LLMToken, void, void>;
}

// 模拟 Provider —— 不依赖外部网络,保证 demo 体验
export class MockProvider implements LLMProvider {
  id = 'mock';
  name = 'Mock Engine';
  models = ['mock-fast', 'mock-pro', 'mock-vision'];

  async health() {
    const t0 = Date.now();
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 60));
    return { ok: true, latencyMs: Date.now() - t0 };
  }

  async *stream(req: LLMRequest): AsyncGenerator<LLMToken, void, void> {
    const t0 = Date.now();
    const model = req.model;
    const prompt = (req.prompt || '').trim();

    // 模拟流式输出
    const canned =
      `> [${model}] 已接收 ${prompt.length} 字符的指令。\n` +
      `正在分析拓扑结构...\n` +
      `识别到 ${Math.max(1, Math.min(prompt.length / 12, 9))} 个关键节点。\n` +
      `生成结果:这是一段由 FlowForge 模拟引擎基于提示词「${prompt.slice(0, 24)}${
        prompt.length > 24 ? '…' : ''
      }」构造的流式输出。\n` +
      `---\n` +
      `✔ 节点编排 OK\n✔ 模型路由 OK\n✔ 工具链路 OK\n`;

    const chunks = canned.match(/.{1,3}/g) || [];
    for (const c of chunks) {
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 28));
      yield { type: 'token', text: c };
    }
    yield {
      type: 'done',
      meta: { totalTokens: chunks.length, latencyMs: Date.now() - t0 },
    };
  }
}

// 真实 Provider 留作接口,目前不直接调用,避免外部依赖
export class OpenAIProvider implements LLMProvider {
  id = 'openai';
  name = 'OpenAI';
  models = ['gpt-4o-mini', 'gpt-4o', 'o1-preview'];
  async health() {
    return { ok: true, latencyMs: 120, message: '配置 API Key 后可启用' };
  }
  async *stream(): AsyncGenerator<LLMToken, void, void> {
    yield { type: 'error', error: 'OpenAI Provider 未启用,请配置 API Key' };
  }
}

export class AnthropicProvider implements LLMProvider {
  id = 'anthropic';
  name = 'Anthropic';
  models = ['claude-3-5-sonnet', 'claude-3-5-haiku'];
  async health() {
    return { ok: true, latencyMs: 140, message: '配置 API Key 后可启用' };
  }
  async *stream(): AsyncGenerator<LLMToken, void, void> {
    yield { type: 'error', error: 'Anthropic Provider 未启用' };
  }
}

export class OllamaProvider implements LLMProvider {
  id = 'ollama';
  name = 'Ollama(本地)';
  models = ['llama3.1', 'qwen2.5', 'mistral'];
  async health() {
    return { ok: true, latencyMs: 60, message: '本地模型未启动' };
  }
  async *stream(): AsyncGenerator<LLMToken, void, void> {
    yield { type: 'error', error: 'Ollama Provider 未启用' };
  }
}

export class Router {
  private providers: Map<string, LLMProvider>;
  constructor() {
    this.providers = new Map();
    [new MockProvider(), new OpenAIProvider(), new AnthropicProvider(), new OllamaProvider()].forEach(
      (p) => this.providers.set(p.id, p),
    );
  }
  list() {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      models: p.models,
    }));
  }
  get(id: string) {
    return this.providers.get(id);
  }
  async health(id: string) {
    const p = this.providers.get(id);
    if (!p) return { ok: false, latencyMs: 0, message: '未知 Provider' };
    return p.health();
  }
  stream(req: LLMRequest) {
    const p = this.providers.get(req.provider) || this.providers.get('mock')!;
    return p.stream(req);
  }
}
