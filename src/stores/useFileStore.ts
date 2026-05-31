import { create } from "zustand";
import type { FileNode, EditorTab } from "@/types";

const defaultFiles: FileNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "index-js",
        name: "index.js",
        type: "file",
        language: "javascript",
        content: "// Welcome to NexusCode\n// AI驱动的下一代编程平台\n\nfunction greet(name) {\n  return `Hello, ${name}! Welcome to NexusCode.`;\n}\n\nconsole.log(greet('Developer'));\n",
      },
      {
        id: "app-jsx",
        name: "App.jsx",
        type: "file",
        language: "javascript",
        content: "import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"app\">\n      <h1>NexusCode Project</h1>\n      <p>Built with AI assistance.</p>\n    </div>\n  );\n}\n\nexport default App;\n",
      },
      {
        id: "styles-css",
        name: "styles.css",
        type: "file",
        language: "css",
        content: "body {\n  margin: 0;\n  font-family: 'DM Sans', sans-serif;\n  background: #0A0E17;\n  color: #E0E6ED;\n}\n\n.app {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}\n",
      },
    ],
  },
  {
    id: "pkg-json",
    name: "package.json",
    type: "file",
    language: "json",
    content: '{\n  "name": "nexuscode-project",\n  "version": "1.0.0",\n  "description": "A project built with NexusCode AI",\n  "main": "src/index.js"\n}\n',
  },
  {
    id: "readme-md",
    name: "README.md",
    type: "file",
    language: "markdown",
    content: "# NexusCode Project\n\nBuilt with AI assistance using NexusCode.\n\n## Getting Started\n\nOpen `src/index.js` to start coding.\n",
  },
];

interface FileStore {
  files: FileNode[];
  selectedFileId: string | null;
  selectFile: (id: string) => void;
  toggleFolder: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  addFile: (parentId: string | null, name: string, type: "file" | "folder") => void;
  deleteFile: (id: string) => void;
  getFileById: (id: string) => FileNode | null;
}

function findFile(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFile(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateFileInTree(nodes: FileNode[], id: string, content: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id) return { ...node, content };
    if (node.children) return { ...node, children: updateFileInTree(node.children, id, content) };
    return node;
  });
}

function toggleFolderInTree(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id && node.type === "folder") return { ...node, isOpen: !node.isOpen };
    if (node.children) return { ...node, children: toggleFolderInTree(node.children, id) };
    return node;
  });
}

function deleteFileFromTree(nodes: FileNode[], id: string): FileNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) return { ...node, children: deleteFileFromTree(node.children, id) };
      return node;
    });
}

function addFileToTree(nodes: FileNode[], parentId: string | null, newFile: FileNode): FileNode[] {
  if (!parentId) return [...nodes, newFile];
  return nodes.map((node) => {
    if (node.id === parentId && node.type === "folder") {
      return { ...node, children: [...(node.children || []), newFile], isOpen: true };
    }
    if (node.children) return { ...node, children: addFileToTree(node.children, parentId, newFile) };
    return node;
  });
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: defaultFiles,
  selectedFileId: "index-js",
  selectFile: (id) => set({ selectedFileId: id }),
  toggleFolder: (id) => set((state) => ({ files: toggleFolderInTree(state.files, id) })),
  updateFileContent: (id, content) => set((state) => ({ files: updateFileInTree(state.files, id, content) })),
  addFile: (parentId, name, type) => {
    const id = `${name}-${Date.now()}`;
    const language = name.endsWith(".js") || name.endsWith(".jsx") ? "javascript"
      : name.endsWith(".css") ? "css"
      : name.endsWith(".json") ? "json"
      : name.endsWith(".md") ? "markdown"
      : name.endsWith(".ts") || name.endsWith(".tsx") ? "typescript"
      : name.endsWith(".py") ? "python"
      : "plaintext";
    const newFile: FileNode = {
      id,
      name,
      type,
      language: type === "file" ? language : undefined,
      content: type === "file" ? "" : undefined,
      children: type === "folder" ? [] : undefined,
      isOpen: type === "folder" ? true : undefined,
    };
    set((state) => ({ files: addFileToTree(state.files, parentId, newFile) }));
  },
  deleteFile: (id) => set((state) => ({ files: deleteFileFromTree(state.files, id) })),
  getFileById: (id) => findFile(get().files, id),
}));

interface EditorStore {
  tabs: EditorTab[];
  activeTabId: string | null;
  openTab: (fileId: string, fileName: string, language: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  markModified: (id: string, modified: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tabs: [
    { id: "tab-index-js", fileId: "index-js", fileName: "index.js", language: "javascript", isActive: true, isModified: false },
  ],
  activeTabId: "tab-index-js",
  openTab: (fileId, fileName, language) => {
    const existing = get().tabs.find((t) => t.fileId === fileId);
    if (existing) {
      set({
        tabs: get().tabs.map((t) => ({ ...t, isActive: t.fileId === fileId })),
        activeTabId: existing.id,
      });
      return;
    }
    const id = `tab-${fileId}`;
    set((state) => ({
      tabs: [
        ...state.tabs.map((t) => ({ ...t, isActive: false })),
        { id, fileId, fileName, language, isActive: true, isModified: false },
      ],
      activeTabId: id,
    }));
  },
  closeTab: (id) => {
    const tabs = get().tabs.filter((t) => t.id !== id);
    const activeTabId = get().activeTabId === id
      ? tabs.length > 0 ? tabs[tabs.length - 1].id : null
      : get().activeTabId;
    set({
      tabs: tabs.map((t) => ({ ...t, isActive: t.id === activeTabId })),
      activeTabId,
    });
  },
  setActiveTab: (id) => {
    set((state) => ({
      tabs: state.tabs.map((t) => ({ ...t, isActive: t.id === id })),
      activeTabId: id,
    }));
  },
  markModified: (id, modified) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, isModified: modified } : t)),
    }));
  },
}));
