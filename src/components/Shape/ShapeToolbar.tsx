// 图形工具栏

import {
  MousePointer,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star,
  Trash2,
  Plus,
  FolderTree,
  Layers,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";
import type { ShapeTool } from "@/types";

const SHAPE_TOOLS: Array<{ id: ShapeTool; icon: typeof Square; label: string }> = [
  { id: "select", icon: MousePointer, label: "选择" },
  { id: "rect", icon: Square, label: "矩形" },
  { id: "circle", icon: Circle, label: "圆形" },
  { id: "triangle", icon: Triangle, label: "三角形" },
  { id: "polygon", icon: Hexagon, label: "多边形" },
  { id: "star", icon: Star, label: "星形" },
];

export function ShapeToolbar() {
  const shapeTool = useUIStore((s) => s.shapeTool);
  const setShapeTool = useUIStore((s) => s.setShapeTool);
  const selectedShapeId = useUIStore((s) => s.selectedShapeId);
  const selectedPartId = useUIStore((s) => s.selectedPartId);
  const selectShape = useUIStore((s) => s.selectShape);
  const selectPart = useUIStore((s) => s.selectPart);

  const shapes = useArtworkStore((s) => s.shapes);
  const parts = useArtworkStore((s) => s.parts);
  const removeShape = useArtworkStore((s) => s.removeShape);
  const addPart = useArtworkStore((s) => s.addPart);
  const removePart = useArtworkStore((s) => s.removePart);
  const assignShapeToPart = useArtworkStore((s) => s.assignShapeToPart);

  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  const selectedPart = parts.find((p) => p.id === selectedPartId);

  return (
    <div className="p-3 space-y-3">
      {/* 图形工具 */}
      <div>
        <div className="text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
          图形工具
        </div>
        <div className="grid grid-cols-3 gap-1">
          {SHAPE_TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setShapeTool(id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 rounded-lg border transition-all duration-150",
                shapeTool === id
                  ? "bg-ember-500/20 border-ember-500 text-ember-400 shadow-glow"
                  : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600",
              )}
            >
              <Icon size={16} />
              <span className="text-[9px] font-mono leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 部件管理 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-ink-300 font-mono uppercase tracking-wider flex items-center gap-1">
            <FolderTree size={11} />
            部件
          </span>
          <button
            onClick={() => {
              const id = addPart();
              selectPart(id);
            }}
            className="text-[10px] font-mono text-mint-400 hover:text-mint-300 flex items-center gap-1"
          >
            <Plus size={11} />
            新建
          </button>
        </div>
        <div className="space-y-1 max-h-36 overflow-auto">
          {parts.length === 0 && (
            <div className="text-[10px] text-ink-500 font-mono py-2 text-center">
              暂无部件，点击新建
            </div>
          )}
          {parts.map((part) => (
            <button
              key={part.id}
              onClick={() => selectPart(part.id)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded-lg border text-left transition-all",
                selectedPartId === part.id
                  ? "bg-mint-500/15 border-mint-500 text-mint-400"
                  : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600",
              )}
            >
              <span className="text-[10px] font-mono truncate">{part.name}</span>
              <span className="text-[9px] text-ink-400 font-mono">{part.shapeIds.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 选中部件操作 */}
      {selectedPart && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-mint-500/30 space-y-2">
          <div className="text-[10px] text-mint-400 font-mono">选中部件</div>
          <input
            value={selectedPart.name}
            onChange={(e) => useArtworkStore.getState().updatePart(selectedPart.id, { name: e.target.value })}
            className="w-full bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-mint-500"
          />
          <PixelButton
            variant="danger"
            size="sm"
            className="w-full"
            onClick={() => {
              removePart(selectedPart.id);
              selectPart(null);
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Trash2 size={12} />
              删除部件
            </span>
          </PixelButton>
        </div>
      )}

      {/* 图形列表 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-ink-300 font-mono uppercase tracking-wider flex items-center gap-1">
            <Layers size={11} />
            图形列表
          </span>
          <span className="text-[10px] text-ink-400 font-mono">{shapes.length}</span>
        </div>
        <div className="space-y-1 max-h-44 overflow-auto">
          {shapes.length === 0 && (
            <div className="text-[10px] text-ink-500 font-mono py-2 text-center">
              选择上方工具，在画布点击添加
            </div>
          )}
          {shapes.map((shape) => {
            const parent = parts.find((p) => p.shapeIds.includes(shape.id));
            return (
              <button
                key={shape.id}
                onClick={() => selectShape(shape.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg border text-left transition-all",
                  selectedShapeId === shape.id
                    ? "bg-ember-500/15 border-ember-500 text-ember-400"
                    : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600",
                )}
              >
                <span
                  className="w-3 h-3 rounded-sm border border-ink-500 flex-shrink-0"
                  style={{ backgroundColor: shape.fill }}
                />
                <span className="text-[10px] font-mono truncate flex-1">{shape.name}</span>
                {parent && (
                  <span className="text-[9px] text-mint-400 font-mono flex-shrink-0">
                    {parent.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 指定图形到部件 */}
      {selectedShape && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-ember-500/30 space-y-2">
          <div className="text-[10px] text-ember-400 font-mono">所属部件</div>
          <select
            value={parts.find((p) => p.shapeIds.includes(selectedShape.id))?.id ?? ""}
            onChange={(e) => assignShapeToPart(selectedShape.id, e.target.value || null)}
            className="w-full bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-ember-500"
          >
            <option value="">无</option>
            {parts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <PixelButton
            variant="danger"
            size="sm"
            className="w-full"
            onClick={() => {
              removeShape(selectedShape.id);
              selectShape(null);
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Trash2 size={12} />
              删除图形
            </span>
          </PixelButton>
        </div>
      )}
    </div>
  );
}
