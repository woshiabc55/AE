import { create } from "zustand";
import type { AIToolFlow, AIToolNode, AIToolConnection } from "@/types";

const defaultFlow: AIToolFlow = {
  id: "flow-1",
  name: "代码生成流水线",
  isActive: true,
  nodes: [
    { id: "n1", name: "用户输入", type: "input", config: { prompt: "自然语言描述" }, position: { x: 60, y: 80 } },
    { id: "n2", name: "意图分析", type: "process", config: { model: "GPT-4" }, position: { x: 240, y: 80 } },
    { id: "n3", name: "代码生成", type: "process", config: { model: "DeepSeek Coder" }, position: { x: 420, y: 80 } },
    { id: "n4", name: "质量检查", type: "condition", config: { rules: "lint, type-check" }, position: { x: 420, y: 220 } },
    { id: "n5", name: "代码输出", type: "output", config: { target: "editor" }, position: { x: 600, y: 150 } },
  ],
  connections: [
    { id: "c1", sourceId: "n1", targetId: "n2", label: "文本" },
    { id: "c2", sourceId: "n2", targetId: "n3", label: "意图" },
    { id: "c3", sourceId: "n3", targetId: "n4", label: "代码" },
    { id: "c4", sourceId: "n4", targetId: "n5", label: "通过" },
    { id: "c5", sourceId: "n4", targetId: "n3", label: "重试" },
  ],
};

interface ToolFlowStore {
  flows: AIToolFlow[];
  activeFlowId: string;
  isFlowVisible: boolean;
  selectedNodeId: string | null;
  setActiveFlow: (id: string) => void;
  toggleFlowVisibility: () => void;
  selectNode: (id: string | null) => void;
  addNode: (flowId: string, node: AIToolNode) => void;
  removeNode: (flowId: string, nodeId: string) => void;
  updateNode: (flowId: string, nodeId: string, updates: Partial<AIToolNode>) => void;
  addConnection: (flowId: string, connection: AIToolConnection) => void;
  removeConnection: (flowId: string, connectionId: string) => void;
  addFlow: (flow: AIToolFlow) => void;
  removeFlow: (id: string) => void;
  getActiveFlow: () => AIToolFlow | undefined;
}

export const useToolFlowStore = create<ToolFlowStore>((set, get) => ({
  flows: [defaultFlow],
  activeFlowId: "flow-1",
  isFlowVisible: false,
  selectedNodeId: null,
  setActiveFlow: (id) => set({ activeFlowId: id }),
  toggleFlowVisibility: () => set((state) => ({ isFlowVisible: !state.isFlowVisible })),
  selectNode: (id) => set({ selectedNodeId: id }),
  addNode: (flowId, node) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId ? { ...f, nodes: [...f.nodes, node] } : f
      ),
    })),
  removeNode: (flowId, nodeId) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId
          ? {
              ...f,
              nodes: f.nodes.filter((n) => n.id !== nodeId),
              connections: f.connections.filter((c) => c.sourceId !== nodeId && c.targetId !== nodeId),
            }
          : f
      ),
    })),
  updateNode: (flowId, nodeId, updates) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId
          ? { ...f, nodes: f.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)) }
          : f
      ),
    })),
  addConnection: (flowId, connection) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId ? { ...f, connections: [...f.connections, connection] } : f
      ),
    })),
  removeConnection: (flowId, connectionId) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId
          ? { ...f, connections: f.connections.filter((c) => c.id !== connectionId) }
          : f
      ),
    })),
  addFlow: (flow) => set((state) => ({ flows: [...state.flows, flow] })),
  removeFlow: (id) =>
    set((state) => ({
      flows: state.flows.filter((f) => f.id !== id),
      activeFlowId: state.activeFlowId === id ? state.flows[0]?.id || "" : state.activeFlowId,
    })),
  getActiveFlow: () => get().flows.find((f) => f.id === get().activeFlowId),
}));
