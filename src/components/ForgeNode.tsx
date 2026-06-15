import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Sparkles, ArrowRight, Settings2, GitBranch, Star, Cpu } from 'lucide-react';
import type { NodeData } from '@/types';
import { memo } from 'react';

function statusRing(status?: string) {
  switch (status) {
    case 'running':
      return 'ring-1 ring-signal-cyan/70 shadow-glow-cyan';
    case 'success':
      return 'ring-1 ring-signal-lime/60';
    case 'error':
      return 'ring-1 ring-signal-red/70 animate-pulseRing';
    default:
      return '';
  }
}

function Icon({ kind, className = 'w-3.5 h-3.5' }: { kind: NodeData['kind']; className?: string }) {
  switch (kind) {
    case 'llm':
      return <Sparkles className={className} />;
    case 'tool':
      return <Settings2 className={className} />;
    case 'input':
      return <ArrowRight className={className} />;
    case 'output':
      return <Star className={className} />;
    case 'condition':
      return <GitBranch className={className} />;
    default:
      return <Cpu className={className} />;
  }
}

function colorOf(kind: NodeData['kind']) {
  switch (kind) {
    case 'llm':
      return 'text-signal-magenta';
    case 'tool':
      return 'text-signal-amber';
    case 'input':
      return 'text-signal-cyan';
    case 'output':
      return 'text-signal-cyan';
    case 'condition':
      return 'text-signal-lime';
    default:
      return 'text-text-secondary';
  }
}

function summary(data: NodeData) {
  if (data.kind === 'llm') {
    return `${data.provider || 'mock'} · ${data.model || 'mock-pro'}`;
  }
  if (data.kind === 'input') {
    return data.value ? `"${data.value.slice(0, 18)}${data.value.length > 18 ? '…' : ''}"` : '空';
  }
  if (data.kind === 'tool') {
    return data.tool || 'tool://';
  }
  if (data.kind === 'condition') {
    return data.expression ? `if ⊃ "${data.expression}"` : '无条件';
  }
  if (data.kind === 'output') {
    return '落点';
  }
  return '';
}

const ForgeNode = memo(({ data, selected }: NodeProps) => {
  const d = data as unknown as NodeData;
  return (
    <div className={`node-card ${statusRing(d.status)} ${selected ? 'ring-1 ring-signal-cyan' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="port port-target !w-2.5 !h-2.5"
        style={{ top: 22 }}
      />
      <div className="flex items-center gap-2 px-2.5 py-2 border-b border-edge">
        <span className={`${colorOf(d.kind)}`}>
          <Icon kind={d.kind} />
        </span>
        <span className="text-[12px] font-mono font-semibold tracking-wide">{d.label}</span>
        <span className="ml-auto chip">{d.kind.toUpperCase()}</span>
      </div>
      <div className="px-2.5 py-1.5 text-[11px] font-mono text-text-secondary">{summary(d)}</div>
      {d.output && (
        <div className="px-2.5 py-1.5 text-[10px] font-mono text-text-dim border-t border-edge truncate max-w-[220px]">
          ↳ {d.output.slice(0, 32)}
          {d.output.length > 32 ? '…' : ''}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="port port-source !w-2.5 !h-2.5"
        style={{ top: 22 }}
      />
    </div>
  );
});
ForgeNode.displayName = 'ForgeNode';

export default ForgeNode;
