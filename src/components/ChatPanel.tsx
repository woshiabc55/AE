import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, X, Loader2 } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { PROMPT_TEMPLATES } from '../templates/prompts';
import { mockGenerate, parseAITables, callOpenAI } from '../utils/aiService';

interface Props {
  onToast: (msg: string) => void;
}

export function ChatPanel({ onToast }: Props) {
  const chat = useProjectStore((s) => s.chat);
  const pushChat = useProjectStore((s) => s.pushChat);
  const replaceTables = useProjectStore((s) => s.replaceTables);
  const setSelectedTable = useProjectStore((s) => s.setSelectedTable);
  const selectedTableId = useProjectStore((s) => s.selectedTableId);
  const totalDuration = useProjectStore((s) => s.totalDuration);
  const apiKey = useProjectStore((s) => s.apiKey);
  const model = useProjectStore((s) => s.model);
  const activeTemplate = useProjectStore((s) => s.activeTemplate);
  const setActiveTemplate = useProjectStore((s) => s.setActiveTemplate);
  const rawText = useProjectStore((s) => s.rawText);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.length, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    pushChat({ role: 'user', content: text });
    setBusy(true);

    try {
      // /inject #3 → 把当前消息注入到选中表（这里为示例，直接重写整表）
      const isInject = /^\/inject\b/i.test(text);
      const usedPrompt = isInject ? text.replace(/^\/inject\s*/i, '') : text;

      // 调用 AI（无 key 时降级到 mock）
      let tables;
      let usedMode: 'mock' | 'openai' = apiKey ? 'openai' : 'mock';
      if (apiKey) {
        try {
          const raw = await callOpenAI({
            prompt: rawText + '\n\n' + usedPrompt,
            template: activeTemplate,
            totalDurationSec: totalDuration,
            apiKey,
            model,
          });
          tables = parseAITables(raw, totalDuration);
        } catch (e) {
          usedMode = 'mock';
          onToast(`OpenAI 失败 → 已回退 Mock：${(e as Error).message.slice(0, 30)}`);
          tables = mockGenerate({
            prompt: usedPrompt,
            template: activeTemplate,
            totalDurationSec: totalDuration,
          });
        }
      } else {
        tables = mockGenerate({
          prompt: usedPrompt,
          template: activeTemplate,
          totalDurationSec: totalDuration,
        });
      }
      replaceTables(tables);
      if (!selectedTableId) setSelectedTable(tables[0].id);

      const reply = isInject
        ? `已注入到分镜表。\n- 模式：${usedMode === 'openai' ? 'OpenAI' : 'Mock 降级'}\n- 模板：${PROMPT_TEMPLATES.find((t) => t.key === activeTemplate)?.label}\n- 时长：${totalDuration}s`
        : `已生成 8 表格 × 16 刻度（${usedMode === 'openai' ? 'OpenAI' : 'Mock'} / ${activeTemplate}）。可继续微调或点击表格直接编辑。`;

      pushChat({ role: 'assistant', content: reply });
      onToast(`AI 生成完成 · ${usedMode}`);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="panel h-full flex flex-col grain">
      <div className="px-4 py-3 border-b border-ink-500/60 flex items-center gap-2">
        <Sparkles size={14} className="text-amber-glow" />
        <h3 className="panel-title text-sm">AI 分镜助手</h3>
        <span className="ml-auto font-mono text-[10px] text-bone-300/40">
          {apiKey ? 'OPENAI' : 'MOCK'}
        </span>
      </div>

      {/* 模板选择 */}
      <div className="px-3 py-2 border-b border-ink-500/40 flex flex-wrap gap-1">
        {PROMPT_TEMPLATES.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTemplate(t.key)}
            className={['pill', activeTemplate === t.key ? 'pill-active' : ''].join(' ')}
            title={t.hint}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 消息流 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-stealth px-3 py-3 space-y-3">
        {chat.map((m) => (
          <div
            key={m.id}
            className={[
              'flex gap-2 text-sm leading-relaxed',
              m.role === 'user' ? 'justify-end' : 'justify-start',
            ].join(' ')}
          >
            {m.role !== 'user' && (
              <div className="shrink-0 w-6 h-6 rounded-full bg-amber-glow/15 border border-amber-glow/40 flex items-center justify-center">
                <Bot size={12} className="text-amber-glow" />
              </div>
            )}
            <div
              className={[
                'max-w-[85%] rounded-md px-3 py-2 whitespace-pre-wrap',
                m.role === 'user'
                  ? 'bg-amber-glow/15 border border-amber-glow/30 text-bone-50'
                  : 'bg-ink-700/70 border border-ink-500/60 text-bone-100',
              ].join(' ')}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="shrink-0 w-6 h-6 rounded-full bg-ink-600 border border-ink-500 flex items-center justify-center">
                <User size={12} className="text-bone-200" />
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-bone-300/60 text-xs font-mono">
            <Loader2 size={12} className="animate-spin text-amber-glow" />
            <span>正在生成 8 表格 …</span>
            <span className="ml-1 inline-block w-1.5 h-3 bg-amber-glow animate-cursor-blink" />
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="border-t border-ink-500/60 p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-bone-300/40">
          <span>提示</span>
          <span className="text-amber-glow/70">⌘/Ctrl + ⏎</span>
          <span>发送 ·</span>
          <span className="text-amber-glow/70">/inject</span>
          <span>注入到选中表</span>
          {selectedTableId && (
            <button
              onClick={() => setSelectedTable(null)}
              className="ml-auto flex items-center gap-1 hover:text-bone-100"
            >
              <X size={10} />
              取消选中
            </button>
          )}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="描述镜头/场景/情绪 …"
            className="flex-1 bg-ink-950 border border-ink-500 rounded p-2 text-sm
                       text-bone-100 placeholder:text-bone-300/30 focus:outline-none
                       focus:border-amber-glow/60 resize-none leading-relaxed"
            rows={2}
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="shrink-0 h-9 px-3 rounded bg-amber-glow/15 border border-amber-glow/50
                       text-amber-glow hover:bg-amber-glow/25 disabled:opacity-30
                       disabled:cursor-not-allowed flex items-center gap-1.5 text-xs font-mono"
          >
            <Send size={12} />
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
