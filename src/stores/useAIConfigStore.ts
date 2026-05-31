import { create } from "zustand";
import type { AIModelConfig } from "@/types";

const defaultModels: AIModelConfig[] = [
  {
    id: "gpt-4",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 4096,
    isActive: true,
  },
  {
    id: "claude-3",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 4096,
    isActive: false,
  },
  {
    id: "deepseek",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    apiKey: "",
    temperature: 0.5,
    maxTokens: 4096,
    isActive: false,
  },
  {
    id: "qwen",
    name: "Qwen Max",
    provider: "Alibaba",
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 4096,
    isActive: false,
  },
];

interface AIConfigStore {
  models: AIModelConfig[];
  activeModelId: string;
  isConfigVisible: boolean;
  connectionStatus: "connected" | "disconnected" | "testing";
  setActiveModel: (id: string) => void;
  updateModel: (id: string, updates: Partial<AIModelConfig>) => void;
  addModel: (model: AIModelConfig) => void;
  removeModel: (id: string) => void;
  toggleConfigVisibility: () => void;
  testConnection: (id: string) => void;
  getActiveModel: () => AIModelConfig | undefined;
}

export const useAIConfigStore = create<AIConfigStore>((set, get) => ({
  models: defaultModels,
  activeModelId: "gpt-4",
  isConfigVisible: false,
  connectionStatus: "disconnected",
  setActiveModel: (id) =>
    set((state) => ({
      models: state.models.map((m) => ({ ...m, isActive: m.id === id })),
      activeModelId: id,
    })),
  updateModel: (id, updates) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  removeModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
      activeModelId: state.activeModelId === id ? state.models[0]?.id || "" : state.activeModelId,
    })),
  toggleConfigVisibility: () =>
    set((state) => ({ isConfigVisible: !state.isConfigVisible })),
  testConnection: (id) => {
    set({ connectionStatus: "testing" });
    setTimeout(() => {
      const model = get().models.find((m) => m.id === id);
      if (model?.apiKey) {
        set({ connectionStatus: "connected" });
      } else {
        set({ connectionStatus: "disconnected" });
      }
    }, 1500);
  },
  getActiveModel: () => get().models.find((m) => m.id === get().activeModelId),
}));
