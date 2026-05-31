import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  FileText,
  FileJson,
  FileCode,
  Plus,
} from "lucide-react";
import { useFileStore, useEditorStore } from "@/stores/useFileStore";
import type { FileNode } from "@/types";

function getFileIcon(name: string) {
  if (name.endsWith(".json")) return <FileJson className="w-4 h-4 text-amber-orange" />;
  if (
    name.endsWith(".js") ||
    name.endsWith(".jsx") ||
    name.endsWith(".ts") ||
    name.endsWith(".tsx")
  )
    return <FileCode className="w-4 h-4 text-neon-cyan" />;
  return <FileText className="w-4 h-4 text-muted" />;
}

function FileTreeNode({
  node,
  depth,
}: {
  node: FileNode;
  depth: number;
}) {
  const { selectedFileId, selectFile, toggleFolder } = useFileStore();
  const { openTab } = useEditorStore();
  const isSelected = selectedFileId === node.id;

  const handleClick = () => {
    if (node.type === "folder") {
      toggleFolder(node.id);
    } else {
      selectFile(node.id);
      openTab(node.id, node.name, node.language || "plaintext");
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-border-gray/30 transition-colors text-sm ${
          isSelected && node.type === "file"
            ? "bg-neon-cyan/10 border-l-2 border-neon-cyan text-foreground"
            : "border-l-2 border-transparent text-foreground/80"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === "folder" ? (
          <>
            {node.isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
            )}
            {node.isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-orange shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-orange shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate font-body">{node.name}</span>
      </div>
      {node.type === "folder" && node.isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const { files, addFile } = useFileStore();
  const [showInput, setShowInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const type = newFileName.includes(".") ? "file" : "folder";
    addFile(null, newFileName.trim(), type);
    setNewFileName("");
    setShowInput(false);
  };

  return (
    <div className="w-[240px] h-full bg-panel-gray border-r border-border-gray flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-gray">
        <span className="font-display text-xs font-semibold tracking-wider text-muted uppercase">
          Explorer
        </span>
        <button
          onClick={() => setShowInput(!showInput)}
          className="p-0.5 hover:text-neon-cyan text-muted transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {showInput && (
        <div className="px-2 py-1.5 border-b border-border-gray">
          <input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFile()}
            onBlur={() => {
              if (!newFileName.trim()) setShowInput(false);
            }}
            placeholder="file name..."
            className="w-full bg-deep-black border border-border-gray rounded px-2 py-1 text-xs text-foreground font-mono outline-none focus:border-neon-cyan"
            autoFocus
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto py-1">
        {files.map((node) => (
          <FileTreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
