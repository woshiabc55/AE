import { useState } from 'react';
import { usePromptStore } from '@/store/usePromptStore';
import { Copy, Check, History, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function PromptPreview() {
  const { getGeneratedPrompt, addToHistory, promptHistory, clearHistory } = usePromptStore();
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const prompt = getGeneratedPrompt();

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      addToHistory(prompt);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      addToHistory(prompt);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="border-t border-[#1a1a2e] bg-[#0a0a12] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#00ffd5] tracking-wider uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              实时预览
            </span>
            {prompt && (
              <span className="text-[9px] text-[#4a4a6a]">{prompt.length} 字符</span>
            )}
          </div>
          <div className="font-mono text-xs text-[#c0c0d0] leading-relaxed break-all min-h-[20px]">
            {prompt ? (
              highlightPrompt(prompt)
            ) : (
              <span className="text-[#3a3a5a]">添加概念模块后，提示词将在此处实时生成...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg border transition-all ${
              showHistory
                ? 'bg-[#00ffd5]/10 border-[#00ffd5]/30 text-[#00ffd5]'
                : 'bg-[#12121f] border-[#1a1a2e] text-[#6a6a8a] hover:text-[#c0c0d0] hover:border-[#2a2a4e]'
            }`}
            title="历史记录"
          >
            <History size={14} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!prompt}
            className={`p-2 rounded-lg border transition-all ${
              copied
                ? 'bg-[#00ffd5]/20 border-[#00ffd5]/40 text-[#00ffd5] shadow-[0_0_10px_rgba(0,255,213,0.2)]'
                : prompt
                ? 'bg-[#00ffd5]/10 border-[#00ffd5]/30 text-[#00ffd5] hover:bg-[#00ffd5]/20 hover:shadow-[0_0_10px_rgba(0,255,213,0.2)]'
                : 'bg-[#12121f] border-[#1a1a2e] text-[#3a3a5a] cursor-not-allowed'
            }`}
            title="复制提示词"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="border-t border-[#1a1a2e] max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-1.5">
            <span className="text-[10px] text-[#6a6a8a]">复制历史</span>
            {promptHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-[#4a4a6a] hover:text-[#f43f5e] transition-colors flex items-center gap-1"
              >
                <Trash2 size={10} /> 清空
              </button>
            )}
          </div>
          {promptHistory.length === 0 ? (
            <p className="text-[10px] text-[#3a3a5a] px-4 pb-2">暂无历史记录</p>
          ) : (
            <div className="space-y-1 px-3 pb-2">
              {promptHistory.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 p-2 rounded-lg bg-[#0d0d18] border border-[#1a1a2e]">
                  <span className="text-[9px] text-[#4a4a6a] flex-shrink-0 mt-0.5">{formatTime(entry.timestamp)}</span>
                  <p className="text-[10px] text-[#8a8aaa] font-mono line-clamp-2 flex-1">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function highlightPrompt(text: string) {
  const parts = text.split(/(\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('(') && part.endsWith(')')) {
      const match = part.match(/^\((.+):(\d+\.?\d*)\)$/);
      if (match) {
        return (
          <span key={i}>
            <span className="text-[#ff6b35]">(</span>
            <span className="text-[#e0e0f0]">{match[1]}</span>
            <span className="text-[#ff6b35]">:{match[2]}</span>
            <span className="text-[#ff6b35]">)</span>
          </span>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}
