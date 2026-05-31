export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
  isOpen?: boolean;
}

export interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  language: string;
  isActive: boolean;
  isModified: boolean;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  codeBlocks?: CodeBlock[];
  source?: "nexuscode" | "trae";
}

export interface CodeBlock {
  language: string;
  code: string;
  fileName?: string;
}

export interface TerminalLine {
  id: string;
  content: string;
  type: "output" | "error" | "info" | "ai-suggestion";
  timestamp: number;
}

export interface AICompletion {
  text: string;
  range: { startLine: number; endLine: number };
  confidence: number;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
}

export interface AIToolNode {
  id: string;
  name: string;
  type: "input" | "process" | "output" | "condition" | "loop";
  config: Record<string, string>;
  position: { x: number; y: number };
}

export interface AIToolConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface AIToolFlow {
  id: string;
  name: string;
  nodes: AIToolNode[];
  connections: AIToolConnection[];
  isActive: boolean;
}

export interface TraeMessage {
  id: string;
  direction: "inbound" | "outbound";
  content: string;
  timestamp: number;
  status: "pending" | "delivered" | "failed";
}

export interface TraeConnection {
  isConnected: boolean;
  sessionId: string | null;
  lastSync: number | null;
}
