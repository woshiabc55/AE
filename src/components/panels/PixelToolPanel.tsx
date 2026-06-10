import { Pencil, Eraser, PaintBucket, Pipette, Minus, Square, FlipHorizontal2, Grid3x3, ZoomIn, ZoomOut } from "lucide-react";
import { useProjectStore, type PixelTool } from "@/store/projectStore";
import { cn } from "@/lib/utils";

const TOOLS: { id: PixelTool; label: string; icon: any; hint: string }[] = [
  { id: "pencil", label: "铅笔", icon: Pencil, hint: "B" },
  { id: "eraser", label: "橡皮", icon: Eraser, hint: "E" },
  { id: "fill", label: "油漆桶", icon: PaintBucket, hint: "G" },
  { id: "eyedrop", label: "吸管", icon: Pipette, hint: "I" },
  { id: "line", label: "直线", icon: Minus, hint: "L" },
  { id: "rect", label: "矩形", icon: Square, hint: "R" },
];

export default function PixelToolPanel() {
  const tool = useProjectStore((s) => s.pixelTool);
  const setTool = useProjectStore((s) => s.setPixelTool);
  const pixel = useProjectStore((s) => s.project.pixel);
  const setPixelColor = useProjectStore((s) => s.setPixelColor);
  const setPixelZoom = useProjectStore((s) => s.setPixelZoom);
  const zoom = useProjectStore((s) => s.pixelZoom);
  const showGrid = useProjectStore((s) => s.showGrid);
  const setShowGrid = useProjectStore((s) => s.setShowGrid);
  const mirrorX = useProjectStore((s) => s.mirrorX);
  const setMirrorX = useProjectStore((s) => s.setMirrorX);
  const clearPixelCanvas = useProjectStore((s) => s.clearPixelCanvas);
  const undo = useProjectStore((s) => s.undo);
  const addPaletteColor = useProjectStore((s) => s.addPaletteColor);

  if (!pixel) return null;

  return (
    <div className="panel p-3 w-24 flex flex-col gap-3 items-center">
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

      <div className="h-px w-10 bg-mist-100/10" />

      <div className="label-cap">缩放</div>
      <button onClick={() => setPixelZoom(zoom - 1)} className="btn-tool">
        <ZoomOut className="w-4 h-4" />
      </button>
      <div className="font-mono text-[10px] text-mist-50">{zoom}×</div>
      <button onClick={() => setPixelZoom(zoom + 1)} className="btn-tool">
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="h-px w-10 bg-mist-100/10" />

      <button
        onClick={() => setShowGrid(!showGrid)}
        className={cn("btn-tool", showGrid && "btn-tool-active")}
        title="网格"
      >
        <Grid3x3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setMirrorX(!mirrorX)}
        className={cn("btn-tool", mirrorX && "btn-tool-active")}
        title="水平镜像 M"
      >
        <FlipHorizontal2 className="w-4 h-4" />
      </button>

      <div className="h-px w-10 bg-mist-100/10" />

      <button onClick={undo} className="btn-tool" title="撤销 ⌘Z">
        ↺
      </button>
      <button onClick={clearPixelCanvas} className="btn-tool text-flame" title="清空">
        🗑
      </button>

      <div className="h-px w-10 bg-mist-100/10" />

      <div className="label-cap">调色板</div>
      <div className="grid grid-cols-3 gap-1">
        {pixel.palette.slice(1).map((c, i) => {
          const idx = i + 1;
          return (
            <button
              key={idx}
              onClick={() => setPixelColor(idx)}
              className={cn(
                "w-5 h-5 rounded border-2 transition-transform hover:scale-110",
                pixel.currentColor === idx ? "border-sakura-300 scale-110" : "border-mist-100/10"
              )}
              style={{ background: c }}
              title={`#${idx} ${c}`}
            />
          );
        })}
      </div>
      <label className="block">
        <input
          type="color"
          onChange={(e) => addPaletteColor(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer bg-transparent border border-mist-100/10"
          title="添加颜色"
        />
      </label>
    </div>
  );
}
