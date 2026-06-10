import { MousePointer2, Square, Circle, PenTool, Paintbrush, Eraser } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", label: "选择", icon: MousePointer2, hint: "V" },
  { id: "rect", label: "矩形", icon: Square, hint: "R" },
  { id: "ellipse", label: "椭圆", icon: Circle, hint: "O" },
  { id: "pen", label: "钢笔", icon: PenTool, hint: "P" },
  { id: "brush", label: "画笔", icon: Paintbrush, hint: "B" },
  { id: "eraser", label: "橡皮", icon: Eraser, hint: "E" },
] as const;

const COLOR_PALETTE = [
  "#FF7AB6",
  "#FFD66B",
  "#7CE3B5",
  "#7CC0FF",
  "#FF8B5C",
  "#C7A8FF",
  "#0B0F1A",
  "#FFFFFF",
];

export default function ToolPanel() {
  const tool = useProjectStore((s) => s.currentTool);
  const setTool = useProjectStore((s) => s.setTool);
  const color = useProjectStore((s) => s.currentColor);
  const setColor = useProjectStore((s) => s.setColor);
  const strokeColor = useProjectStore((s) => s.strokeColor);
  const setStrokeColor = useProjectStore((s) => s.setStrokeColor);
  const strokeWidth = useProjectStore((s) => s.strokeWidth);
  const setStrokeWidth = useProjectStore((s) => s.setStrokeWidth);

  return (
    <div className="panel p-2 flex flex-col gap-3 w-20 items-center">
      <div className="label-cap">工具</div>
      <div className="flex flex-col gap-1">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={cn("btn-tool", tool === t.id && "btn-tool-active")}
              title={`${t.label} (${t.hint})`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.8} />
            </button>
          );
        })}
      </div>

      <div className="h-px w-10 bg-mist-100/10 my-1" />

      <div className="label-cap">填充</div>
      <div className="grid grid-cols-2 gap-1.5">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={cn(
              "w-6 h-6 rounded-md border-2 transition-transform hover:scale-110",
              color === c ? "border-sakura-300 scale-110" : "border-mist-100/10"
            )}
            style={{ background: c }}
          />
        ))}
      </div>

      <div className="h-px w-10 bg-mist-100/10 my-1" />

      <div className="label-cap">描边</div>
      <div className="grid grid-cols-2 gap-1.5">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            onClick={() => setStrokeColor(c)}
            className={cn(
              "w-6 h-6 rounded-md border-2 transition-transform hover:scale-110",
              strokeColor === c ? "border-butter-300 scale-110" : "border-mist-100/10"
            )}
            style={{ background: c }}
          />
        ))}
      </div>

      <div className="h-px w-10 bg-mist-100/10 my-1" />

      <div className="label-cap">粗细</div>
      <input
        type="range"
        min={0}
        max={20}
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        className="w-12 accent-sakura-400"
      />
      <div className="font-mono text-[10px] text-mist-300">{strokeWidth}px</div>
    </div>
  );
}
