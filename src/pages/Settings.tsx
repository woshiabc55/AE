import { useState } from "react";
import { Key, Cpu, Sliders, Save, Check, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store";

export function Settings() {
  const settings = useAppStore((s) => s.settings);
  const save = useAppStore((s) => s.saveSettings);
  const [draft, setDraft] = useState(settings);
  const [showKey, setShowKey] = useState(false);
  const [tip, setTip] = useState<string | null>(null);

  const onSave = () => {
    save(draft);
    setTip("设置已保存");
    setTimeout(() => setTip(null), 1500);
  };

  const onTest = async () => {
    if (!draft.llmApiKey) {
      setTip("请先填入 API Key");
      setTimeout(() => setTip(null), 1500);
      return;
    }
    setTip("正在测试连接…");
    try {
      const r = await fetch(draft.llmBaseUrl.replace(/\/+$/, "") + "/models", {
        headers: { Authorization: `Bearer ${draft.llmApiKey}` },
      });
      if (r.ok) setTip("连接成功 ✓");
      else setTip(`连接失败 ${r.status}`);
    } catch (e) {
      setTip("网络错误：" + (e as Error).message);
    }
    setTimeout(() => setTip(null), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
      <div className="mb-10">
        <span className="scene-tag">SCENE 05 · SETTINGS</span>
        <h1 className="mt-3 font-display text-[56px] leading-[1] text-paper-50">
          设置<span className="italic text-amber"> ·</span> Setting
        </h1>
        <p className="mt-3 font-serif text-paper-200 max-w-xl">
          萤幕不会保存你的 API Key 到任何服务器，全部存储于浏览器 <code className="font-mono text-amber">localStorage</code>。
        </p>
      </div>

      {/* API Key */}
      <section className="panel p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={16} className="text-amber" />
          <h2 className="font-display text-[22px] text-paper-50">LLM API Key</h2>
        </div>
        <p className="font-serif text-[14px] text-paper-200 leading-relaxed mb-4">
          兼容 OpenAI Chat Completions 接口的服务均可使用，如 OpenAI / DeepSeek / 智谱 / 月之暗面 / 自建网关等。
        </p>
        <label className="label-overline">Base URL</label>
        <input
          value={draft.llmBaseUrl}
          onChange={(e) => setDraft({ ...draft, llmBaseUrl: e.target.value })}
          className="field-input font-mono text-[14px]"
          placeholder="https://api.openai.com/v1"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="label-overline">API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={draft.llmApiKey}
                onChange={(e) =>
                  setDraft({ ...draft, llmApiKey: e.target.value })
                }
                className="field-input font-mono text-[14px] pr-10"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-300 hover:text-amber"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-overline">模型</label>
            <input
              value={draft.llmModel}
              onChange={(e) => setDraft({ ...draft, llmModel: e.target.value })}
              className="field-input font-mono text-[14px]"
              placeholder="gpt-4o-mini"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={onTest} className="ghost-button text-[10px] py-1.5 px-3">
            <Cpu size={11} /> 测试连接
          </button>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="ghost-button text-[10px] py-1.5 px-3"
          >
            <ExternalLink size={11} /> 获取 OpenAI Key
          </a>
        </div>
      </section>

      {/* 参数 */}
      <section className="panel p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders size={16} className="text-amber" />
          <h2 className="font-display text-[22px] text-paper-50">生成参数</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between">
              <label className="label-overline">Temperature</label>
              <span className="font-mono text-amber text-[12px]">
                {draft.temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={draft.temperature}
              onChange={(e) =>
                setDraft({ ...draft, temperature: parseFloat(e.target.value) })
              }
              className="w-full mt-2 accent-amber"
            />
            <p className="mt-1 text-[11px] text-ink-300 font-serif italic">
              越高越发散，越低越稳定。剧本建议 0.7-1.0。
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label-overline">Top P</label>
              <span className="font-mono text-amber text-[12px]">
                {draft.topP.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={draft.topP}
              onChange={(e) =>
                setDraft({ ...draft, topP: parseFloat(e.target.value) })
              }
              className="w-full mt-2 accent-amber"
            />
            <p className="mt-1 text-[11px] text-ink-300 font-serif italic">
              核采样。建议 0.9-0.95。
            </p>
          </div>
          <div>
            <label className="label-overline">Max Tokens</label>
            <input
              type="number"
              min="256"
              max="32000"
              step="64"
              value={draft.maxTokens}
              onChange={(e) =>
                setDraft({ ...draft, maxTokens: parseInt(e.target.value) || 2000 })
              }
              className="field-input font-mono text-[14px]"
            />
            <p className="mt-1 text-[11px] text-ink-300 font-serif italic">
              单次生成上限。建议 1500-3000。
            </p>
          </div>
        </div>
      </section>

      {/* 预设模型 */}
      <section className="panel p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-amber" />
          <h2 className="font-display text-[22px] text-paper-50">常用预设</h2>
        </div>
        <p className="font-serif text-[14px] text-paper-200 leading-relaxed mb-4">
          点击下方预设，会自动替换 Base URL 与模型名（不会动你的 API Key）。
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { l: "OpenAI", u: "https://api.openai.com/v1", m: "gpt-4o-mini" },
            { l: "DeepSeek", u: "https://api.deepseek.com/v1", m: "deepseek-chat" },
            { l: "智谱 GLM", u: "https://open.bigmodel.cn/api/paas/v4", m: "glm-4-flash" },
            { l: "月之暗面 Moonshot", u: "https://api.moonshot.cn/v1", m: "moonshot-v1-8k" },
            { l: "通义千问 DashScope", u: "https://dashscope.aliyuncs.com/compatible-mode/v1", m: "qwen-plus" },
            { l: "Ollama (本地)", u: "http://localhost:11434/v1", m: "llama3.1" },
          ].map((p) => (
            <button
              key={p.l}
              onClick={() =>
                setDraft({ ...draft, llmBaseUrl: p.u, llmModel: p.m })
              }
              className="panel panel-hover p-3 text-left"
            >
              <div className="font-display text-[15px] text-paper-50">{p.l}</div>
              <div className="font-mono text-[11px] text-ink-300 truncate mt-0.5">
                {p.m}
              </div>
              <div className="font-mono text-[10px] text-ink-400 truncate mt-0.5">
                {p.u}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 关于 */}
      <section className="panel p-6">
        <h2 className="font-display text-[22px] text-paper-50 mb-3">关于萤幕</h2>
        <div className="font-serif text-[14px] text-paper-200 leading-[1.9] space-y-3">
          <p>
            <span className="font-display italic text-amber text-[18px]">Lumière</span>，
            法语意为"光"，致敬卢米埃兄弟开启的电影时代。
          </p>
          <p>
            萤幕是一款云端 AI 剧本提示词模板器，致力于把"想到哪写到哪"的散装提示词，
            升级为版本化、可拆解、可协作、可一键调用大模型的工程化资产。
          </p>
          <p>
            所有数据默认存储在浏览器本地（IndexedDB），不依赖任何后端服务。
            你的 API Key 仅存储于 <code className="font-mono text-amber">localStorage</code>，
            直接发往你填写的 Base URL。
          </p>
        </div>
      </section>

      {/* 保存栏 */}
      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button onClick={onSave} className="reel-button shadow-[0_10px_40px_-10px_rgba(212,168,87,0.4)]">
          {tip ? <Check size={12} /> : <Save size={12} />} {tip ?? "保存设置"}
        </button>
      </div>
    </div>
  );
}
