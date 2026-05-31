import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useEditorStore, useFileStore } from "@/stores/useFileStore";

const NEXUS_THEME_ID = "nexus-dark";

const nexusTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6B7A90", fontStyle: "italic" },
    { token: "keyword", foreground: "FF6B2B" },
    { token: "string", foreground: "00F0B5" },
    { token: "number", foreground: "FF6B2B" },
    { token: "type", foreground: "00F0B5" },
    { token: "function", foreground: "E0E6ED" },
    { token: "variable", foreground: "E0E6ED" },
    { token: "operator", foreground: "FF6B2B" },
    { token: "delimiter", foreground: "6B7A90" },
  ],
  colors: {
    "editor.background": "#0A0E17",
    "editor.foreground": "#E0E6ED",
    "editor.lineHighlightBackground": "#1A1F2E",
    "editor.selectionBackground": "#2D354880",
    "editorCursor.foreground": "#00F0B5",
    "editorLineNumber.foreground": "#6B7A90",
    "editorLineNumber.activeForeground": "#E0E6ED",
    "editor.selectionHighlightBackground": "#2D354840",
    "editorIndentGuide.background": "#2D3548",
    "editorIndentGuide.activeBackground": "#6B7A90",
    "editorWhitespace.foreground": "#2D3548",
    "editorBracketMatch.background": "#2D354880",
    "editorBracketMatch.border": "#00F0B580",
  },
};

export default function CodeEditor() {
  const editorRef = useRef<OnMount | null>(null);
  const { tabs, activeTabId, markModified } = useEditorStore();
  const { getFileById, updateFileContent } = useFileStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const file = activeTab ? getFileById(activeTab.fileId) : null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor as unknown as OnMount;
    monaco.editor.defineTheme(NEXUS_THEME_ID, nexusTheme);
    monaco.editor.setTheme(NEXUS_THEME_ID);
  };

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (!activeTabId || !value) return;
      updateFileContent(activeTab!.fileId, value);
      markModified(activeTabId, true);
    },
    [activeTabId, activeTab, updateFileContent, markModified]
  );

  if (!activeTab || !file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-deep-black">
        <p className="text-muted font-body text-sm">选择文件开始编辑</p>
      </div>
    );
  }

  return (
    <Editor
      key={activeTab.fileId}
      height="100%"
      language={activeTab.language}
      value={file.content || ""}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme={NEXUS_THEME_ID}
      options={{
        minimap: { enabled: false },
        lineNumbers: "on",
        wordWrap: "on",
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        fontLigatures: true,
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        renderLineHighlight: "all",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        bracketPairColorization: { enabled: true },
        automaticLayout: true,
      }}
    />
  );
}
