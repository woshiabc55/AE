export type NodeKind = 'input' | 'llm' | 'tool' | 'condition' | 'output';

export interface NodeData {
  kind: NodeKind;
  label: string;
  // LLM
  provider?: string;
  model?: string;
  prompt?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  // Input
  value?: string;
  // Tool
  tool?: string;
  // Condition
  expression?: string;
  // 状态(运行时)
  status?: 'idle' | 'running' | 'success' | 'error';
  output?: string;
  [key: string]: unknown;
}

// 使用 React Flow 内置 Node 类型,通过 data 字段携带 NodeData
export type FlowNode = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: NodeData;
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export interface Workflow {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export type RunEvent =
  | { type: 'start'; payload?: { workflowId?: string; total?: number } }
  | { type: 'node-start'; nodeId: string; payload?: { kind?: NodeKind; label?: string } }
  | { type: 'token'; nodeId: string; text: string }
  | { type: 'node-end'; nodeId: string; payload?: { text: string } }
  | { type: 'error'; nodeId?: string; payload?: { message: string } }
  | { type: 'end'; payload?: { outputs?: Record<string, string> } };

export interface LogEntry {
  id: string;
  ts: number;
  level: 'info' | 'warn' | 'error' | 'token';
  nodeId?: string;
  message: string;
}

export interface Provider {
  id: string;
  name: string;
  models: string[];
}
