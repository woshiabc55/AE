import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { FlowEdge, FlowNode, LogEntry, NodeData, Provider, RunEvent, Workflow } from '@/types';

interface State {
  // 当前工作流
  workflow: Workflow;
  selectedNodeId: string | null;
  setSelected: (id: string | null) => void;

  // 双画布模式
  mode: 'design' | 'runtime';
  setMode: (m: 'design' | 'runtime') => void;

  // 节点 & 边操作
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
  onConnect: (c: Connection) => void;
  addNode: (data: NodeData, position: { x: number; y: number }) => string;
  updateNodeData: (id: string, patch: Partial<NodeData>) => void;
  removeNode: (id: string) => void;

  setWorkflow: (w: Workflow) => void;
  resetWorkflow: () => void;

  // 执行
  isRunning: boolean;
  runId: string | null;
  setRunning: (runId: string | null) => void;
  nodeStatus: Record<string, 'idle' | 'running' | 'success' | 'error'>;
  setNodeStatus: (id: string, s: 'idle' | 'running' | 'success' | 'error') => void;
  clearStatuses: () => void;

  // 日志
  logs: LogEntry[];
  appendLog: (l: Omit<LogEntry, 'id' | 'ts'>) => void;
  clearLogs: () => void;

  // 提供商
  providers: Provider[];
  setProviders: (p: Provider[]) => void;
}

const initialWorkflow = (): Workflow => ({
  id: 'wf_' + Date.now().toString(36),
  name: '未命名工作流',
  nodes: [],
  edges: [],
});

export const useStore = create<State>((set, get) => ({
  workflow: initialWorkflow(),
  selectedNodeId: null,
  setSelected: (id) => set({ selectedNodeId: id }),

  mode: 'design',
  setMode: (m) => set({ mode: m }),

  onNodesChange: (changes: any) =>
    set((s) => ({ workflow: { ...s.workflow, nodes: applyNodeChanges(changes, s.workflow.nodes as any) as any } })),
  onEdgesChange: (changes: any) =>
    set((s) => ({ workflow: { ...s.workflow, edges: applyEdgeChanges(changes, s.workflow.edges as any) as any } })),
  onConnect: (c: any) =>
    set((s) => ({
      workflow: { ...s.workflow, edges: rfAddEdge({ ...c, id: 'e_' + Date.now().toString(36) }, s.workflow.edges as any) as any },
    })),
  addNode: (data, position) => {
    const id = 'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const node: FlowNode = { id, type: 'forge', position, data };
    set((s) => ({ workflow: { ...s.workflow, nodes: [...s.workflow.nodes, node] } }));
    return id;
  },
  updateNodeData: (id, patch) =>
    set((s) => ({
      workflow: {
        ...s.workflow,
        nodes: s.workflow.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
      },
    })),
  removeNode: (id) =>
    set((s) => ({
      workflow: {
        ...s.workflow,
        nodes: s.workflow.nodes.filter((n) => n.id !== id),
        edges: s.workflow.edges.filter((e) => e.source !== id && e.target !== id),
      },
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  setWorkflow: (w) => set({ workflow: w, selectedNodeId: null }),
  resetWorkflow: () => set({ workflow: initialWorkflow(), selectedNodeId: null, nodeStatus: {}, logs: [] }),

  isRunning: false,
  runId: null,
  setRunning: (runId) => set({ isRunning: !!runId, runId }),
  nodeStatus: {},
  setNodeStatus: (id, s) =>
    set((st) => ({ nodeStatus: { ...st.nodeStatus, [id]: s } })),
  clearStatuses: () => set({ nodeStatus: {} }),

  logs: [],
  appendLog: (l) =>
    set((s) => ({
      logs: [...s.logs, { id: 'l_' + Math.random().toString(36).slice(2, 9), ts: Date.now(), ...l }].slice(-500),
    })),
  clearLogs: () => set({ logs: [] }),

  providers: [],
  setProviders: (providers) => set({ providers }),
}));

// 初始化节点定义
export const nodeDefinitions = [
  {
    kind: 'input' as const,
    label: '输入',
    description: '注入原始文本或变量',
    color: 'signal-cyan',
    icon: '→',
  },
  {
    kind: 'llm' as const,
    label: '大模型',
    description: '调用 LLM,流式输出',
    color: 'signal-magenta',
    icon: '◈',
  },
  {
    kind: 'tool' as const,
    label: '工具',
    description: '执行外部工具/函数',
    color: 'signal-amber',
    icon: '⚙',
  },
  {
    kind: 'condition' as const,
    label: '条件分支',
    description: '基于上游输出分流',
    color: 'signal-lime',
    icon: '◇',
  },
  {
    kind: 'output' as const,
    label: '输出',
    description: '工作流的最终落点',
    color: 'signal-cyan',
    icon: '★',
  },
];
