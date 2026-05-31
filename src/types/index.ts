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
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  codeBlocks?: CodeBlock[];
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
