import { useRef, useEffect } from "react";
import { Terminal, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { useTerminalStore } from "@/stores/useTerminalStore";

function getLineColor(type: string) {
  switch (type) {
    case "error":
      return "text-amber-orange";
    case "info":
      return "text-muted";
    case "ai-suggestion":
      return "text-neon-cyan";
    default:
      return "text-foreground";
  }
}

export default function TerminalPanel() {
  const { lines, isVisible, clearLines, toggleVisibility } = useTerminalStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  if (!isVisible) {
    return (
      <div className="border-t border-border-gray bg-deep-black">
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted hover:text-foreground transition-colors font-mono"
        >
          <Terminal className="w-3 h-3" />
          <span>终端</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-[200px] bg-deep-black border-t border-border-gray flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-1 border-b border-border-gray bg-panel-gray/50">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="text-xs font-mono text-foreground">终端</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearLines}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={toggleVisibility}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-1.5 font-mono text-xs">
        {lines.map((line) => (
          <div key={line.id} className={`py-0.5 ${getLineColor(line.type)}`}>
            {line.type === "ai-suggestion" && <span>⚡ </span>}
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
}
