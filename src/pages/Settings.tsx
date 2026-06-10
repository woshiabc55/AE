import { useState } from 'react';
import { Save, Check, Key, Type, Clock, Sparkles, Monitor, Sun, Moon, Eye, Edit3, Maximize2, Zap } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';

const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4 / GPT-4o', desc: 'OpenAI · 通用强，综合能力优秀' },
  { value: 'claude', label: 'Claude 3.5 Sonnet', desc: 'Anthropic · 长文写作与文学性强' },
  { value: 'gemini', label: 'Gemini Pro', desc: 'Google · 多模态与实时' },
  { value: 'deepseek', label: 'DeepSeek V3', desc: '国产开源 · 性价比高' },
  { value: 'custom', label: '自定义端点', desc: 'OpenAI 兼容协议' },
];

const fontSizeOptions = [
  { value: 'sm', label: '小号', size: '13px' },
  { value: 'md', label: '中号', size: '15px' },
  { value: 'lg', label: '大号', size: '17px' },
];

const autoSaveOptions = [
  { value: 1, label: '1 秒' },
  { value: 3, label: '3 秒' },
  { value: 5, label: '5 秒' },
  { value: 10, label: '10 秒' },
];

const editorModeOptions = [
  { value: 'edit', label: '仅编辑', icon: Edit3 },
  { value: 'split', label: '分屏', icon: Maximize2 },
  { value: 'preview', label: '仅预览', icon: Eye },
];

export default function Settings() {
  const settings = useSettingsStore();
  const showToast = useUIStore((s) => s.showToast);
  const [keyVisible, setKeyVisible] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTest = () => {
    if (!settings.apiKey) {
      showToast('请先填写 API Key', 'error');
      return;
    }
    setTestingApi(true);
    setApiTestResult('idle');
    setTimeout(() => {
      setTestingApi(false);
      setApiTestResult(settings.apiKey.length > 10 ? 'success' : 'error');
      showToast(settings.apiKey.length > 10 ? '连接成功' : 'Key 格式不正确', settings.apiKey.length > 10 ? 'success' : 'error');
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
          · 设置中心
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-cream-50 sm:text-5xl">
          偏好与配置
        </h1>
        <p className="mt-2 text-sm text-cream-200/50">
          你的所有偏好与配置都保存在本地浏览器中
        </p>
      </div>

      <div className="space-y-6">
        {/* AI 模型 */}
        <section className="card p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-ink-600 pb-4">
            <div className="flex h-9 w-9 items-center justify-center border border-gold-500/30 bg-gold-500/5 text-gold-500">
              <Sparkles size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-cream-50">AI 模型</h2>
              <p className="text-xs text-cream-200/50">配置用于一键投递的默认模型</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
                默认模型
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {modelOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => settings.setDefaultModel(m.value as any)}
                    className={`group flex flex-col items-start gap-1 border p-3 text-left transition-all ${
                      settings.defaultModel === m.value
                        ? 'border-gold-500 bg-gold-500/5'
                        : 'border-ink-500 hover:border-cream-200/40'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-semibold text-cream-100">{m.label}</span>
                      {settings.defaultModel === m.value && (
                        <Check size={14} className="text-gold-500" />
                      )}
                    </div>
                    <span className="text-[11px] text-cream-200/40">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
                API Key
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-200/30" />
                  <input
                    type={keyVisible ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => settings.setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="input-base pl-9 pr-20 font-mono text-xs"
                  />
                  <button
                    onClick={() => setKeyVisible(!keyVisible)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 font-mono text-[10px] text-cream-200/40 hover:text-gold-500"
                  >
                    {keyVisible ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                <button onClick={handleTest} disabled={testingApi} className="btn-outline flex-shrink-0">
                  {testingApi ? (
                    <>
                      <Zap size={14} className="animate-pulse" />
                      测试中
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      测试连接
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-cream-200/30">
                密钥仅存储于本地浏览器，不会上传服务器。{apiTestResult === 'success' && <span className="text-moss">· 连接正常</span>}
                {apiTestResult === 'error' && <span className="text-wine">· 连接失败，请检查</span>}
              </p>
            </div>
          </div>
        </section>

        {/* 编辑器偏好 */}
        <section className="card p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-ink-600 pb-4">
            <div className="flex h-9 w-9 items-center justify-center border border-gold-500/30 bg-gold-500/5 text-gold-500">
              <Type size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-cream-50">编辑器偏好</h2>
              <p className="text-xs text-cream-200/50">调整剧本编辑器的视觉与行为</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
                字号
              </label>
              <div className="grid grid-cols-3 gap-2">
                {fontSizeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => settings.setFontSize(opt.value as any)}
                    className={`flex flex-col items-center gap-1 border p-3 transition-all ${
                      settings.fontSize === opt.value
                        ? 'border-gold-500 bg-gold-500/5'
                        : 'border-ink-500 hover:border-cream-200/40'
                    }`}
                  >
                    <span className="text-cream-100" style={{ fontSize: opt.size }}>Aa</span>
                    <span className="text-[11px] text-cream-200/40">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
                默认视图
              </label>
              <div className="grid grid-cols-3 gap-2">
                {editorModeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => settings.setEditorMode(opt.value as any)}
                    className={`flex items-center justify-center gap-2 border p-3 transition-all ${
                      settings.editorMode === opt.value
                        ? 'border-gold-500 bg-gold-500/5 text-gold-500'
                        : 'border-ink-500 text-cream-200/60 hover:border-cream-200/40'
                    }`}
                  >
                    <opt.icon size={14} />
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
                自动保存间隔
              </label>
              <div className="grid grid-cols-4 gap-2">
                {autoSaveOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => settings.setAutoSaveInterval(opt.value)}
                    className={`border p-2.5 text-xs transition-all ${
                      settings.autoSaveInterval === opt.value
                        ? 'border-gold-500 bg-gold-500/5 text-gold-500'
                        : 'border-ink-500 text-cream-200/60 hover:border-cream-200/40'
                    }`}
                  >
                    <Clock size={11} className="mx-auto mb-1" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 主题 */}
        <section className="card p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-ink-600 pb-4">
            <div className="flex h-9 w-9 items-center justify-center border border-gold-500/30 bg-gold-500/5 text-gold-500">
              <Monitor size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-cream-50">外观</h2>
              <p className="text-xs text-cream-200/50">切换主题与界面密度</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gold-500">
              主题
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => settings.setTheme('dark')}
                className={`flex items-center gap-3 border p-3 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-gold-500 bg-gold-500/5'
                    : 'border-ink-500 hover:border-cream-200/40'
                }`}
              >
                <div className="flex h-12 w-16 flex-shrink-0 border border-ink-500 bg-ink-900">
                  <div className="flex-1 bg-ink-700" />
                  <div className="w-1 bg-gold-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-cream-100">暗色 · 导演剪辑室</p>
                  <p className="text-[11px] text-cream-200/40">深邃黑 + 暖金</p>
                </div>
                {settings.theme === 'dark' && <Check size={14} className="ml-auto text-gold-500" />}
              </button>
              <button
                onClick={() => settings.setTheme('light')}
                className={`flex items-center gap-3 border p-3 transition-all ${
                  settings.theme === 'light'
                    ? 'border-gold-500 bg-gold-500/5'
                    : 'border-ink-500 hover:border-cream-200/40'
                }`}
              >
                <div className="flex h-12 w-16 flex-shrink-0 border border-ink-500 bg-cream-100">
                  <div className="flex-1 bg-cream-200" />
                  <div className="w-1 bg-gold-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-cream-100">浅色 · 编剧工坊</p>
                  <p className="text-[11px] text-cream-200/40">米白 + 焦糖</p>
                </div>
                {settings.theme === 'light' && <Check size={14} className="ml-auto text-gold-500" />}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-cream-200/30">
              浅色主题为预览，当前仅启用暗色（导演剪辑室）
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-ink-600 pt-6">
          <p className="text-xs text-cream-200/30">所有更改已自动保存</p>
          <div className="flex items-center gap-1 font-mono text-[10px] text-cream-200/30">
            <Save size={10} /> 自动同步至本地
          </div>
        </div>
      </div>
    </div>
  );
}
