import { useState } from "react";
import { GitBranch, Play, Plus, Trash2, X, RefreshCw, Zap, Filter, LogIn, LogOut } from "lucide-react";
import { useToolFlowStore } from "@/stores/useToolFlowStore";
import type { AIToolNode, AIToolConnection } from "@/types";

const nodeTypeConfig = {
  input: { icon: LogIn, color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30" },
  process: { icon: Zap, color: "text-amber-orange", bg: "bg-amber-orange/10", border: "border-amber-orange/30" },
  output: { icon: LogOut, color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30" },
  condition: { icon: Filter, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  loop: { icon: RefreshCw, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
};

function FlowNode({ node, isSelected, onClick }: { node: AIToolNode; isSelected: boolean; onClick: () => void }) {
  const config = nodeTypeConfig[node.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`absolute flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
        isSelected
          ? `${config.bg} ${config.border} ${config.color} glow-cyan`
          : `${config.bg} ${config.border} ${config.color} hover:scale-105`
      }`}
      style={{ left: node.position.x, top: node.position.y }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-display font-medium whitespace-nowrap">{node.name}</span>
    </button>
  );
}

function FlowConnection({ connection, nodes }: { connection: AIToolConnection; nodes: AIToolNode[] }) {
  const source = nodes.find((n) => n.id === connection.sourceId);
  const target = nodes.find((n) => n.id === connection.targetId);
  if (!source || !target) return null;

  const sx = source.position.x + 80;
  const sy = source.position.y + 16;
  const tx = target.position.x;
  const ty = target.position.y + 16;
  const mx = (sx + tx) / 2;

  const isRetry = connection.label === "重试";

  return (
    <g>
      <path
        d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`}
        fill="none"
        stroke={isRetry ? "#FF6B2B" : "#00F0B5"}
        strokeWidth={isRetry ? 1.5 : 1}
        strokeDasharray={isRetry ? "4 2" : "none"}
        opacity={0.6}
      />
      {connection.label && (
        <text
          x={mx}
          y={(sy + ty) / 2 - 6}
          textAnchor="middle"
          fill={isRetry ? "#FF6B2B" : "#6B7A90"}
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          {connection.label}
        </text>
      )}
    </g>
  );
}

function NodeDetail({ node, onUpdate, onRemove }: { node: AIToolNode; onUpdate: (updates: Partial<AIToolNode>) => void; onRemove: () => void }) {
  const config = nodeTypeConfig[node.type];

  return (
    <div className="p-3 border border-border-gray rounded-lg bg-panel-gray/50 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")}`} />
          <span className="text-xs font-display font-semibold text-foreground">{node.name}</span>
        </div>
        <button onClick={onRemove} className="p-1 text-muted hover:text-amber-orange transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div>
        <label className="text-xs text-muted block mb-0.5">名称</label>
        <input
          value={node.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full bg-deep-black border border-border-gray rounded px-2 py-1 text-xs text-foreground outline-none focus:border-neon-cyan transition-colors"
        />
      </div>
      <div>
        <label className="text-xs text-muted block mb-0.5">配置</label>
        {Object.entries(node.config).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1 mb-1">
            <span className="text-xs text-muted font-mono w-16 truncate">{key}</span>
            <input
              value={value}
              onChange={(e) => onUpdate({ config: { ...node.config, [key]: e.target.value } })}
              className="flex-1 bg-deep-black border border-border-gray rounded px-2 py-0.5 text-xs font-mono text-foreground outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolFlowPanel() {
  const { isFlowVisible, selectedNodeId, toggleFlowVisibility, selectNode, addNode, removeNode, updateNode, getActiveFlow } = useToolFlowStore();
  const [isRunning, setIsRunning] = useState(false);

  const flow = getActiveFlow();

  if (!isFlowVisible) return null;

  const handleAddNode = () => {
    if (!flow) return;
    const types: AIToolNode["type"][] = ["input", "process", "output", "condition", "loop"];
    const type = types[Math.floor(Math.random() * types.length)];
    const names: Record<string, string> = { input: "新输入", process: "新处理", output: "新输出", condition: "新条件", loop: "新循环" };
    addNode(flow.id, {
      id: `n-${Date.now()}`,
      name: names[type],
      type,
      config: {},
      position: { x: 60 + Math.random() * 400, y: 40 + Math.random() * 200 },
    });
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  const selectedNode = flow?.nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="h-[320px] bg-deep-black border-t border-neon-cyan/20 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-gray bg-panel-gray/50">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="text-xs font-mono text-foreground">AI 工具流动</span>
          <span className="text-xs text-muted font-mono">— {flow?.name}</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-neon-cyan animate-pulse-glow">
              <Play className="w-3 h-3" /> 运行中
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleAddNode}
            className="p-1 text-muted hover:text-neon-cyan transition-colors"
            title="添加节点"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="p-1 text-muted hover:text-neon-cyan transition-colors disabled:opacity-40"
            title="运行流程"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFlowVisibility}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative overflow-auto">
          <svg className="absolute inset-0 w-full h-full" style={{ minWidth: 800, minHeight: 300 }}>
            {flow?.connections.map((conn) => (
              <FlowConnection key={conn.id} connection={conn} nodes={flow.nodes} />
            ))}
          </svg>
          <div className="absolute inset-0">
            {flow?.nodes.map((node) => (
              <FlowNode
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                onClick={() => selectNode(node.id === selectedNodeId ? null : node.id)}
              />
            ))}
          </div>
        </div>

        {selectedNode && flow && (
          <div className="w-[220px] border-l border-border-gray p-2 overflow-y-auto">
            <NodeDetail
              node={selectedNode}
              onUpdate={(updates) => updateNode(flow.id, selectedNode.id, updates)}
              onRemove={() => {
                removeNode(flow.id, selectedNode.id);
                selectNode(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
