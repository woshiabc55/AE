import { useEffect, useRef, useState } from "react";
import type { Shape, Project } from "@/types";
import { useProjectStore, uid } from "@/store/projectStore";
import { Plus, Minus, Move, Trash2, Copy, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SvgCanvasProps {
  width: number;
  height: number;
}

export default function SvgCanvas({ width, height }: SvgCanvasProps) {
  const project = useProjectStore((s) => s.project);
  const tool = useProjectStore((s) => s.currentTool);
  const color = useProjectStore((s) => s.currentColor);
  const stroke = useProjectStore((s) => s.strokeColor);
  const strokeWidth = useProjectStore((s) => s.strokeWidth);
  const selectedId = useProjectStore((s) => s.selectedShapeId);
  const selectedGroupId = useProjectStore((s) => s.selectedGroupId);
  const addShape = useProjectStore((s) => s.addShape);
  const selectShape = useProjectStore((s) => s.selectShape);
  const setSelectedGroup = useProjectStore((s) => s.setSelectedGroup);
  const updateShape = useProjectStore((s) => s.updateShape);
  const deleteShape = useProjectStore((s) => s.deleteShape);
  const addGroup = useProjectStore((s) => s.addGroup);

  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [path, setPath] = useState<string>("");
  const [pathStart, setPathStart] = useState<{ x: number; y: number } | null>(null);
  const [brushPoints, setBrushPoints] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState<{ x: number; y: number } | null>(null);

  const getPoint = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / zoom - offset.x;
    const cy = (e.clientY - rect.top) / zoom - offset.y;
    return { x: Math.max(0, Math.min(width, cx)), y: Math.max(0, Math.min(height, cy)) };
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button === 1 || e.button === 2 || e.shiftKey) {
      setPanning({ x: e.clientX, y: e.clientY });
      return;
    }
    const p = getPoint(e);
    if (tool === "rect" || tool === "ellipse") {
      setDrawing({ x: p.x, y: p.y, w: 0, h: 0 });
    } else if (tool === "pen") {
      if (!pathStart) {
        setPathStart(p);
        setPath(`M ${p.x} ${p.y}`);
      } else {
        // 结束路径
        const d = `${path} L ${p.x} ${p.y} Z`;
        addShape({
          id: uid(),
          type: "path",
          name: "路径",
          data: d,
          fill: color,
          stroke: stroke,
          strokeWidth,
          opacity: 1,
          bbox: { x: 0, y: 0, width: 1, height: 1 },
          parentId: null,
          zIndex: project.shapes.length,
          visible: true,
          locked: false,
        });
        setPath("");
        setPathStart(null);
      }
    } else if (tool === "brush") {
      setBrushPoints(`M ${p.x} ${p.y}`);
    } else if (tool === "select") {
      selectShape(null);
      setSelectedGroup(null);
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (panning) {
      setOffset((o) => ({ x: o.x + (e.clientX - panning.x) / zoom, y: o.y + (e.clientY - panning.y) / zoom }));
      setPanning({ x: e.clientX, y: e.clientY });
      return;
    }
    const p = getPoint(e);
    if (drawing && (tool === "rect" || tool === "ellipse")) {
      setDrawing({ x: drawing.x, y: drawing.y, w: p.x - drawing.x, h: p.y - drawing.y });
    } else if (tool === "brush" && brushPoints) {
      setBrushPoints((prev) => `${prev} L ${p.x} ${p.y}`);
    }
  };

  const onPointerUp = () => {
    if (panning) {
      setPanning(null);
    }
    if (drawing && (tool === "rect" || tool === "ellipse")) {
      const x = Math.min(drawing.x, drawing.x + drawing.w);
      const y = Math.min(drawing.y, drawing.y + drawing.h);
      const w = Math.abs(drawing.w);
      const h = Math.abs(drawing.h);
      if (w > 4 && h > 4) {
        // 创建/使用分组
        let gid = selectedGroupId;
        if (!gid) {
          gid = uid();
          addGroup({ id: gid, name: "新分组", parentId: null, color: color, visible: true });
        }
        addShape(
          {
            id: uid(),
            type: tool,
            name: tool === "rect" ? "矩形" : "椭圆",
            data: "",
            fill: color,
            stroke,
            strokeWidth,
            opacity: 1,
            bbox: { x, y, width: w, height: h },
            parentId: gid,
            zIndex: project.shapes.length,
            visible: true,
            locked: false,
          },
          gid
        );
      }
      setDrawing(null);
    }
    if (tool === "brush" && brushPoints) {
      let gid = selectedGroupId;
      if (!gid) {
        gid = uid();
        addGroup({ id: gid, name: "画笔层", parentId: null, color, visible: true });
      }
      // 估算 bbox
      const m = brushPoints.match(/[\d.]+/g);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < (m?.length ?? 0); i += 2) {
        const x = parseFloat(m![i]);
        const y = parseFloat(m![i + 1]);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      addShape(
        {
          id: uid(),
          type: "freehand",
          name: "画笔",
          data: brushPoints,
          fill: "none",
          stroke: color,
          strokeWidth: strokeWidth + 4,
          opacity: 1,
          bbox: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
          parentId: gid,
          zIndex: project.shapes.length,
          visible: true,
          locked: false,
        },
        gid
      );
      setBrushPoints("");
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setPath("");
      setPathStart(null);
      setDrawing(null);
      setBrushPoints("");
    }
    if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
      deleteShape(selectedId);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink-900 rounded-2xl border border-mist-100/5">
      <div
        className="absolute inset-0 bg-grid-light opacity-50"
        style={{ backgroundSize: `${32 * zoom}px ${32 * zoom}px` }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onContextMenu={(e) => e.preventDefault()}
          className={cn(
            "bg-ink-50 rounded-xl shadow-2xl select-none",
            tool === "select" ? "cursor-default" : "cursor-crosshair"
          )}
        >
          {project.shapes.map((s) => {
            if (!s.visible) return null;
            return renderShape(s, selectedId === s.id, (newBox) => {
              updateShape(s.id, { bbox: newBox });
            });
          })}
          {drawing && tool === "rect" && (
            <rect
              x={Math.min(drawing.x, drawing.x + drawing.w)}
              y={Math.min(drawing.y, drawing.y + drawing.h)}
              width={Math.abs(drawing.w)}
              height={Math.abs(drawing.h)}
              fill={color}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={0.6}
              strokeDasharray="4 4"
            />
          )}
          {drawing && tool === "ellipse" && (
            <ellipse
              cx={drawing.x + drawing.w / 2}
              cy={drawing.y + drawing.h / 2}
              rx={Math.abs(drawing.w / 2)}
              ry={Math.abs(drawing.h / 2)}
              fill={color}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={0.6}
              strokeDasharray="4 4"
            />
          )}
          {path && (
            <path d={path} fill="none" stroke={color} strokeWidth={2} strokeDasharray="4 4" />
          )}
          {brushPoints && (
            <path d={brushPoints} fill="none" stroke={color} strokeWidth={strokeWidth + 4} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 panel-solid p-1.5 z-10">
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))} className="btn-tool"><Plus className="w-4 h-4" /></button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))} className="btn-tool"><Minus className="w-4 h-4" /></button>
        <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="btn-tool" title="重置"><Move className="w-4 h-4" /></button>
      </div>
      <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
        <div className="chip">
          <span className="text-mist-300">Z</span>
          <span className="text-mist-50">{zoom.toFixed(1)}×</span>
        </div>
        <div className="chip">
          <span className="text-mist-300">画布</span>
          <span className="text-mist-50">{width}×{height}</span>
        </div>
        {pathStart && (
          <div className="chip text-sakura-300">钢笔：点击第二点闭合</div>
        )}
      </div>
    </div>
  );
}

function renderShape(
  s: Shape,
  selected: boolean,
  onMove: (b: Shape["bbox"]) => void
) {
  const dash = selected ? "4 3" : undefined;
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handler = { onClick };
  switch (s.type) {
    case "rect":
      return <rect {...handler} x={s.bbox.x} y={s.bbox.y} width={s.bbox.width} height={s.bbox.height} fill={s.fill} stroke={selected ? "#FF7AB6" : s.stroke} strokeWidth={selected ? 2 : s.strokeWidth} strokeDasharray={dash} opacity={s.opacity} />;
    case "ellipse":
      return <ellipse {...handler} cx={s.bbox.x + s.bbox.width / 2} cy={s.bbox.y + s.bbox.height / 2} rx={s.bbox.width / 2} ry={s.bbox.height / 2} fill={s.fill} stroke={selected ? "#FF7AB6" : s.stroke} strokeWidth={selected ? 2 : s.strokeWidth} strokeDasharray={dash} opacity={s.opacity} />;
    case "path":
    case "freehand":
      return <path {...handler} d={s.data} fill={s.type === "freehand" ? "none" : s.fill} stroke={selected ? "#FF7AB6" : (s.type === "freehand" ? s.stroke : s.stroke)} strokeWidth={s.type === "freehand" ? s.strokeWidth : s.strokeWidth} opacity={s.opacity} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />;
    case "text":
      return <text {...handler} x={s.bbox.x} y={s.bbox.y + s.bbox.height} fill={s.fill} opacity={s.opacity}>{s.data}</text>;
  }
}
