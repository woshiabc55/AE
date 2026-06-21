import { useState } from "react";
import type { GiderFile } from "@/types";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
  file: GiderFile;
}

interface NodeProps {
  label: string;
  value: unknown;
  depth: number;
}

function JsonNode({ label, value, depth }: NodeProps) {
  const [open, setOpen] = useState(depth < 2);
  const isArr = Array.isArray(value);

  if (value === null || typeof value !== "object") {
    return (
      <div className="flex items-center gap-2 py-0.5 pl-4 font-mono text-[11px]">
        <span className="text-aqua">{label}</span>
        <span className="text-ink-500">:</span>
        <span
          className={
            typeof value === "string"
              ? "text-volt"
              : typeof value === "number"
                ? "text-mint"
                : "text-coral"
          }
        >
          {JSON.stringify(value)}
        </span>
      </div>
    );
  }

  const entries = isArr
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const count = entries.length;

  return (
    <div className="pl-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 py-0.5 font-mono text-[11px] hover:bg-ink-700/50"
      >
        {open ? (
          <ChevronDown className="h-3 w-3 text-ink-400" />
        ) : (
          <ChevronRight className="h-3 w-3 text-ink-400" />
        )}
        <span className="text-aqua">{label}</span>
        <span className="text-ink-500">:</span>
        <span className="text-ink-400">
          {isArr ? `[${count}]` : `{${count}}`}
        </span>
      </button>
      {open && (
        <div className="ml-3 border-l border-ink-600 pl-2">
          {entries.map(([k, v]) => (
            <JsonNode key={k} label={k} value={v} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GiderTree({ file }: Props) {
  return (
    <div className="panel h-full overflow-auto p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="title-pixel">GIDER STRUCTURE</h3>
        <span className="chip chip-volt">v{file.meta.version}</span>
      </div>
      <div className="font-mono text-[11px]">
        <JsonNode label="root" value={file} depth={0} />
      </div>
    </div>
  );
}
