import { useState, useEffect } from 'react';
import { Settings, X, KeyRound, Cpu, Eye, EyeOff } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

interface Props {
  onToast: (msg: string) => void;
}

export function SettingsPanel({ onToast }: Props) {
  const [open, setOpen] = useState(false);
  const apiKey = useProjectStore((s) => s.apiKey);
  const setApiKey = useProjectStore((s) => s.setApiKey);
  const model = useProjectStore((s) => s.model);
  const setModel = useProjectStore((s) => s.setModel);
  const totalDuration = useProjectStore((s) => s.totalDuration);
  const setTotalDuration = useProjectStore((s) => s.setTotalDuration);
  const title = useProjectStore((s) => s.title);
  const setTitle = useProjectStore((s) => s.setTitle);
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);

  useEffect(() => setLocalKey(apiKey), [apiKey, open]);

  const save = () => {
    setApiKey(localKey.trim());
    onToast('已保存到 LocalStorage');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="设置"
        className="pill"
      >
        <Settings size={12} />
        <span>设置</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="panel w-full max-w-lg p-5 space-y-4 grain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-amber-glow" />
                <h3 className="panel-title text-base">项目设置</h3>
              </div>
              <button onClick={() => setOpen(false)} className="pill">
                <X size={12} />
              </button>
            </div>

            <div className="amber-divider" />

            <div className="space-y-1.5">
              <label className="field-tag">项目标题</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-ink-950 border border-ink-500 rounded px-3 py-2 text-sm
                           focus:outline-none focus:border-amber-glow/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-tag">总时长（秒） · 8 镜头自动均分</label>
              <input
                type="number"
                min={1}
                max={600}
                value={totalDuration}
                onChange={(e) => setTotalDuration(Number(e.target.value) || 25)}
                className="w-full bg-ink-950 border border-ink-500 rounded px-3 py-2 text-sm font-mono
                           focus:outline-none focus:border-amber-glow/60"
              />
            </div>

            <div className="amber-divider" />

            <div className="space-y-1.5">
              <label className="field-tag flex items-center gap-1.5">
                <KeyRound size={11} /> OpenAI API Key（留空 = Mock 模式）
              </label>
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value)}
                  placeholder="sk-…"
                  className="flex-1 bg-ink-950 border border-ink-500 rounded px-3 py-2 text-sm font-mono
                             focus:outline-none focus:border-amber-glow/60"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="pill"
                  title="显隐"
                >
                  {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <p className="text-[10px] text-bone-300/40 font-mono">
                Key 仅保存在浏览器 LocalStorage，不会上传到任何服务器。
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="field-tag flex items-center gap-1.5">
                <Cpu size={11} /> 模型
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-ink-950 border border-ink-500 rounded px-3 py-2 text-sm font-mono
                           focus:outline-none focus:border-amber-glow/60"
                placeholder="gpt-4o-mini"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="pill">取消</button>
              <button onClick={save} className="pill pill-active">保存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
