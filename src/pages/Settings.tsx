import { useEffect, useState } from 'react';
import { fetchProviders, pingProvider } from '@/api';
import type { Provider } from '@/types';
import { Settings as SettingsIcon, Key, Wifi, Zap, Moon, Sun, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pings, setPings] = useState<Record<string, { ok: boolean; latencyMs: number; message?: string }>>({});
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    fetchProviders().then(setProviders).catch(() => undefined);
  }, []);

  const pingAll = async () => {
    const result: typeof pings = {};
    for (const p of providers) {
      result[p.id] = await pingProvider(p.id);
    }
    setPings(result);
  };

  return (
    <div className="h-full p-6 overflow-y-auto scroll-fade">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">// SETTINGS</div>
          <div className="text-2xl font-display font-semibold mt-1">设置</div>
        </div>

        {/* 大模型 */}
        <section className="panel rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-signal-cyan" />
              <div>
                <div className="text-[13px] font-medium">大模型供应商</div>
                <div className="text-[10.5px] font-mono text-text-dim">// manage providers & keys</div>
              </div>
            </div>
            <button className="btn" onClick={pingAll}>
              <Wifi className="w-3.5 h-3.5" /> 测试全部
            </button>
          </div>
          <div className="space-y-1.5">
            {providers.map((p) => {
              const r = pings[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-3 h-10 border border-edge rounded-md hover:border-ink-500"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      r ? (r.ok ? 'bg-signal-lime' : 'bg-signal-red') : 'bg-ink-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium">{p.name}</div>
                    <div className="text-[10px] font-mono text-text-dim">
                      {p.models.slice(0, 3).join(' · ')}
                      {p.models.length > 3 && ` +${p.models.length - 3}`}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {r && (
                      <span className="text-[10px] font-mono text-text-secondary">
                        {r.latencyMs}ms {r.message && `· ${r.message}`}
                      </span>
                    )}
                    <button className="btn-ghost h-7">
                      <Key className="w-3 h-3" /> 配置 Key
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 主题 */}
        <section className="panel rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-signal-magenta" />
            ) : (
              <Sun className="w-4 h-4 text-signal-amber" />
            )}
            <div>
              <div className="text-[13px] font-medium">外观</div>
              <div className="text-[10.5px] font-mono text-text-dim">// appearance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('dark')}
              className={`btn ${theme === 'dark' ? '!border-signal-cyan/40 !text-signal-cyan' : ''}`}
            >
              <Moon className="w-3.5 h-3.5" /> 深色
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`btn ${theme === 'light' ? '!border-signal-cyan/40 !text-signal-cyan' : ''}`}
            >
              <Sun className="w-3.5 h-3.5" /> 浅色
            </button>
          </div>
        </section>

        {/* 性能 */}
        <section className="panel rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-signal-amber" />
            <div>
              <div className="text-[13px] font-medium">性能</div>
              <div className="text-[10.5px] font-mono text-text-dim">// performance</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Toggle label="流式输出" desc="节点输出按 token 流式回传" defaultOn />
            <Toggle label="连线动画" desc="运行时画布显示数据流动光" defaultOn />
            <Toggle label="自动保存" desc="每 30 秒持久化当前工作流" defaultOn={false} />
            <Toggle label="硬件加速" desc="启用 GPU 渲染画布" defaultOn />
          </div>
        </section>

        <div className="text-center text-[10px] font-mono text-text-dim pt-4">
          FlowForge v0.1.0 · Electron · React Flow · Tailwind
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="flex items-center gap-3 px-3 h-10 border border-edge rounded-md hover:border-ink-500 text-left"
    >
      <div
        className={`w-8 h-4 rounded-full p-0.5 transition-colors ${on ? 'bg-signal-cyan/40' : 'bg-ink-600'}`}
      >
        <div
          className={`w-3 h-3 rounded-full bg-text-primary transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-medium">{label}</div>
        <div className="text-[10px] font-mono text-text-dim truncate">{desc}</div>
      </div>
    </button>
  );
}
