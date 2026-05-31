import { useState } from "react";
import { Settings, ChevronDown, Wifi, WifiOff, Loader2, Eye, EyeOff, Plus, Trash2, TestTube } from "lucide-react";
import { useAIConfigStore } from "@/stores/useAIConfigStore";

function ModelCard({ model }: { model: AIModelConfig }) {
  const { activeModelId, setActiveModel, updateModel, removeModel, testConnection, connectionStatus } = useAIConfigStore();
  const [showKey, setShowKey] = useState(false);
  const isActive = model.id === activeModelId;

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        isActive
          ? "border-neon-cyan bg-neon-cyan/5 glow-cyan"
          : "border-border-gray bg-panel-gray/30 hover:border-border-gray/80"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setActiveModel(model.id)}
          className="flex items-center gap-2 text-left"
        >
          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-neon-cyan animate-pulse-glow" : "bg-muted"}`} />
          <span className={`text-sm font-display font-semibold ${isActive ? "text-neon-cyan" : "text-foreground"}`}>
            {model.name}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => testConnection(model.id)}
            className="p-1 text-muted hover:text-neon-cyan transition-colors"
            title="测试连接"
          >
            {connectionStatus === "testing" && isActive ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <TestTube className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => removeModel(model.id)}
            className="p-1 text-muted hover:text-amber-orange transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-muted block mb-0.5">API 端点</label>
          <input
            value={model.endpoint}
            onChange={(e) => updateModel(model.id, { endpoint: e.target.value })}
            className="w-full bg-deep-black border border-border-gray rounded px-2 py-1 text-xs font-mono text-foreground outline-none focus:border-neon-cyan transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-muted block mb-0.5">API 密钥</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={model.apiKey}
              onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-deep-black border border-border-gray rounded px-2 py-1 pr-7 text-xs font-mono text-foreground outline-none focus:border-neon-cyan transition-colors"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted block mb-0.5">温度: {model.temperature}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={model.temperature}
              onChange={(e) => updateModel(model.id, { temperature: parseFloat(e.target.value) })}
              className="w-full h-1 bg-border-gray rounded appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted block mb-0.5">最大令牌</label>
            <input
              type="number"
              value={model.maxTokens}
              onChange={(e) => updateModel(model.id, { maxTokens: parseInt(e.target.value) || 4096 })}
              className="w-full bg-deep-black border border-border-gray rounded px-2 py-1 text-xs font-mono text-foreground outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          {model.apiKey ? (
            <>
              <Wifi className="w-3 h-3 text-neon-cyan" />
              <span className="text-xs text-neon-cyan">已配置</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-orange" />
              <span className="text-xs text-amber-orange">未配置密钥</span>
            </>
          )}
          <span className="text-xs text-muted ml-auto">{model.provider}</span>
        </div>
      </div>
    </div>
  );
}

import type { AIModelConfig } from "@/types";

export default function AIConfigPanel() {
  const { models, isConfigVisible, toggleConfigVisibility, addModel, connectionStatus } = useAIConfigStore();

  const handleAddModel = () => {
    const newModel: AIModelConfig = {
      id: `model-${Date.now()}`,
      name: "自定义模型",
      provider: "Custom",
      endpoint: "",
      apiKey: "",
      temperature: 0.7,
      maxTokens: 4096,
      isActive: false,
    };
    addModel(newModel);
  };

  return (
    <div className="border-t border-border-gray">
      <button
        onClick={toggleConfigVisibility}
        className="flex items-center gap-1.5 px-3 py-1.5 w-full text-left hover:bg-panel-gray/30 transition-colors"
      >
        <Settings className="w-3.5 h-3.5 text-neon-cyan" />
        <span className="text-xs font-mono text-foreground flex-1">AI 配置端口</span>
        <div className="flex items-center gap-1.5">
          {connectionStatus === "connected" && (
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
          )}
          <ChevronDown className={`w-3 h-3 text-muted transition-transform ${isConfigVisible ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isConfigVisible && (
        <div className="px-3 pb-3 space-y-2 max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-muted">可用模型</span>
            <button
              onClick={handleAddModel}
              className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              <Plus className="w-3 h-3" />
              添加模型
            </button>
          </div>
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
