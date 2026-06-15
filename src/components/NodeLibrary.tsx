import { ArrowRight, Sparkles, Settings2, GitBranch, Star, Cpu } from 'lucide-react';
import { nodeDefinitions } from '@/store';

const iconMap = {
  input: ArrowRight,
  llm: Sparkles,
  tool: Settings2,
  condition: GitBranch,
  output: Star,
} as const;

const colorMap: Record<string, string> = {
  'signal-cyan': 'text-signal-cyan border-signal-cyan/30',
  'signal-magenta': 'text-signal-magenta border-signal-magenta/30',
  'signal-amber': 'text-signal-amber border-signal-amber/30',
  'signal-lime': 'text-signal-lime border-signal-lime/30',
};

export default function NodeLibrary() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2.5 border-b border-edge">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">// NODE LIBRARY</div>
        <div className="text-[12px] text-text-secondary mt-0.5">拖拽到画布创建节点</div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-fade px-2 py-2 space-y-1.5">
        {nodeDefinitions.map((def, i) => {
          const Icon = iconMap[def.kind] || Cpu;
          return (
            <div
              key={def.kind}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/flowforge-node', def.kind);
                e.dataTransfer.effectAllowed = 'move';
              }}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`group cursor-grab active:cursor-grabbing panel rounded-md px-2.5 py-2
                hover:border-ink-500 transition-all animate-fadeUp`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded border flex items-center justify-center bg-ink-900/60 ${colorMap[def.color]}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium leading-tight">{def.label}</div>
                  <div className="text-[10px] text-text-dim font-mono">{def.kind.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-[10.5px] text-text-secondary mt-1.5 leading-snug">{def.description}</div>
              {/* 端口预览 */}
              <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-text-dim">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan/60" /> in
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-magenta/60" /> out
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t border-edge text-[10px] font-mono text-text-dim">
        TIP — 也可从顶部菜单「+ 新建节点」
      </div>
    </div>
  );
}
