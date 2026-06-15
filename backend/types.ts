export type NodeKind = 'input' | 'llm' | 'tool' | 'condition' | 'output';

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type RunEvent =
  | { type: 'start'; payload?: { workflowId?: string; total?: number } }
  | { type: 'node-start'; nodeId: string; payload?: { kind?: NodeKind; label?: string } }
  | { type: 'token'; nodeId: string; text: string }
  | { type: 'node-end'; nodeId: string; payload?: { text: string } }
  | { type: 'error'; nodeId?: string; payload?: { message: string } }
  | { type: 'end'; payload?: { outputs?: Record<string, string> } };
