import { X, FileCode, FileJson, FileText } from "lucide-react";
import { useEditorStore } from "@/stores/useFileStore";

function getTabIcon(name: string) {
  if (name.endsWith(".json")) return <FileJson className="w-3.5 h-3.5 text-amber-orange" />;
  if (
    name.endsWith(".js") ||
    name.endsWith(".jsx") ||
    name.endsWith(".ts") ||
    name.endsWith(".tsx")
  )
    return <FileCode className="w-3.5 h-3.5 text-neon-cyan" />;
  return <FileText className="w-3.5 h-3.5 text-muted" />;
}

export default function EditorTabs() {
  const { tabs, activeTabId, closeTab, setActiveTab } = useEditorStore();

  return (
    <div className="flex bg-panel-gray border-b border-border-gray overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer border-b-2 transition-colors min-w-0 shrink-0 ${
              isActive
                ? "bg-deep-black border-neon-cyan text-foreground"
                : "bg-panel-gray border-transparent text-muted hover:bg-border-gray/30 hover:text-foreground"
            }`}
          >
            {getTabIcon(tab.fileName)}
            <span className="text-xs font-mono truncate">{tab.fileName}</span>
            {tab.isModified && (
              <span className="w-2 h-2 rounded-full bg-amber-orange shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-border-gray rounded transition-opacity shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
