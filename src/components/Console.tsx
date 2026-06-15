import { useState } from 'react';
import { ChevronDown, Terminal, Trash2, Filter } from 'lucide-react';
import { useStore } from '@/store';

const levelStyle: Record<string, string> = {
  info: 'text-signal-cyan',
  warn: 'text-signal-amber',
  error: 'text-signal-red',
  token: 'text-text-secondary',
};

export default function Console() {
  const logs = useStore((s) => s.logs);
  const clear = useStore((s) => s.clearLogs);
  const [level, setLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'token'>('all');
  const [collapsed, setCollapsed] = useState(false);

  const filtered = level === 'all' ? logs : logs.filter((l) => l.level === level);
  const tokens = logs.filter((l) => l.level === 'token');
  // 合并连续 token 为一行
  const tokenByNode = new Map<string, string>();
  tokens.forEach((l) => {
    if (!l.nodeId) return;
    tokenByNode.set(l.nodeId, (tokenByNode.get(l.nodeId) || '') + l.message);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 h-9 flex items-center border-b border-edge">
        <Terminal className="w-3.5 h-3.5 text-signal-cyan" />
        <div className="ml-2 text-[11px] font-mono">CONSOLE</div>
        <div className="ml-2 text-[10px] font-mono text-text-dim">{logs.length} lines</div>
        <div className="ml-auto flex items-center gap-1">
          <Filter className="w-3 h-3 text-text-dim" />
          {(['all', 'info', 'warn', 'error', 'token'] as const).map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`btn-ghost h-6 text-[10px] !px-1.5 ${
                level === lv ? 'text-signal-cyan' : 'text-text-dim'
              }`}
            >
              {lv}
            </button>
          ))}
          <button onClick={clear} className="btn-ghost h-6 !text-signal-red">
            <Trash2 className="w-3 h-3" />
          </button>
          <button onClick={() => setCollapsed((v) => !v)} className="btn-ghost h-6">
            <ChevronDown className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 grid grid-cols-2 gap-2 p-2 min-h-0">
          {/* 日志流 */}
          <div className="panel rounded-md overflow-hidden flex flex-col min-h-0">
            <div className="px-2.5 h-7 flex items-center text-[10px] font-mono text-text-dim border-b border-edge">
              // LOG STREAM
            </div>
            <div className="flex-1 overflow-y-auto scroll-fade px-2.5 py-1.5 font-mono text-[11px] space-y-0.5">
              {filtered.length === 0 && (
                <div className="text-text-dim py-2 text-center">// empty</div>
              )}
              {filtered.map((l) => (
                <div key={l.id} className="flex items-start gap-2 animate-fadeUp">
                  <span className="text-text-dim shrink-0">{new Date(l.ts).toLocaleTimeString()}</span>
                  <span className={`shrink-0 w-12 ${levelStyle[l.level]}`}>[{l.level.toUpperCase()}]</span>
                  {l.nodeId && (
                    <span className="shrink-0 text-text-secondary">{l.nodeId.slice(-4)}</span>
                  )}
                  <span className="text-text-primary whitespace-pre-wrap break-words">{l.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Token 摘要 */}
          <div className="panel rounded-md overflow-hidden flex flex-col min-h-0">
            <div className="px-2.5 h-7 flex items-center text-[10px] font-mono text-text-dim border-b border-edge">
              // TOKEN OUTPUTS
            </div>
            <div className="flex-1 overflow-y-auto scroll-fade px-2.5 py-1.5 space-y-1.5">
              {tokenByNode.size === 0 && (
                <div className="text-text-dim py-2 text-center font-mono text-[11px]">// no output</div>
              )}
              {Array.from(tokenByNode.entries()).map(([nid, text]) => (
                <div key={nid} className="border border-edge rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-signal-magenta">node:{nid.slice(-6)}</span>
                    <span className="text-[10px] font-mono text-text-dim">{text.length} chars</span>
                  </div>
                  <pre className="text-[10.5px] font-mono text-text-primary whitespace-pre-wrap break-words leading-snug">
                    {text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
