/**
 * 像素画布组件
 * - 用 Canvas 2D 渲染像素
 * - 支持铅笔 / 橡皮 / 油漆桶 / 吸管 / 直线 / 矩形
 * - 支持水平镜像绘制
 * - 鼠标拖动连续绘制
 * - 像素完美（imageSmoothingEnabled = false）
 */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useProjectStore } from "@/store/projectStore";
import { cn } from "@/lib/utils";

interface Props {
  width?: number;
  height?: number;
}

export default function PixelCanvas({}: Props) {
  const pixel = useProjectStore((s) => s.project.pixel);
  const tool = useProjectStore((s) => s.pixelTool);
  const zoom = useProjectStore((s) => s.pixelZoom);
  const showGrid = useProjectStore((s) => s.showGrid);
  const mirrorX = useProjectStore((s) => s.mirrorX);
  const paintPixels = useProjectStore((s) => s.paintPixels);
  const setPixelColor = useProjectStore((s) => s.setPixelColor);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [drawing, setDrawing] = useState(false);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const startCellRef = useRef<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<
    | { kind: "line"; x0: number; y0: number; x1: number; y1: number; ci: number }
    | { kind: "rect"; x0: number; y0: number; x1: number; y1: number; ci: number }
    | null
  >(null);

  // 渲染像素到 canvas
  const render = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !pixel) return;
    const ctx = c.getContext("2d")!;
    c.width = pixel.width * zoom;
    c.height = pixel.height * zoom;
    ctx.imageSmoothingEnabled = false;

    // 棋盘背景
    for (let y = 0; y < pixel.height; y++) {
      for (let x = 0; x < pixel.width; x++) {
        const odd = (x + y) % 2 === 0;
        ctx.fillStyle = odd ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)";
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
      }
    }

    // 像素
    for (let y = 0; y < pixel.height; y++) {
      for (let x = 0; x < pixel.width; x++) {
        const ci = pixel.data[y * pixel.width + x];
        if (ci === 0) continue;
        const color = pixel.palette[ci];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
      }
    }

    // 网格
    if (showGrid && zoom >= 4) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= pixel.width; x++) {
        ctx.moveTo(x * zoom + 0.5, 0);
        ctx.lineTo(x * zoom + 0.5, pixel.height * zoom);
      }
      for (let y = 0; y <= pixel.height; y++) {
        ctx.moveTo(0, y * zoom + 0.5);
        ctx.lineTo(pixel.width * zoom, y * zoom + 0.5);
      }
      ctx.stroke();
    }

    // 中心对称线
    if (mirrorX) {
      ctx.strokeStyle = "rgba(255,122,182,0.4)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo((pixel.width / 2) * zoom, 0);
      ctx.lineTo((pixel.width / 2) * zoom, pixel.height * zoom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // hover 像素高亮
    if (hover) {
      ctx.strokeStyle = "rgba(255,122,182,0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(hover.x * zoom + 1, hover.y * zoom + 1, zoom - 2, zoom - 2);
    }

    // 直线/矩形预览
    if (preview) {
      ctx.save();
      if (preview.kind === "line") {
        const cells = bresenhamLine(preview.x0, preview.y0, preview.x1, preview.y1);
        ctx.fillStyle = pixel.palette[preview.ci] ?? "#FF7AB6";
        for (const c of cells) {
          ctx.globalAlpha = 0.5;
          ctx.fillRect(c.x * zoom, c.y * zoom, zoom, zoom);
        }
      } else if (preview.kind === "rect") {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = pixel.palette[preview.ci] ?? "#FF7AB6";
        const x0 = Math.min(preview.x0, preview.x1);
        const y0 = Math.min(preview.y0, preview.y1);
        const x1 = Math.max(preview.x0, preview.x1);
        const y1 = Math.max(preview.y0, preview.y1);
        ctx.fillRect(x0 * zoom, y0 * zoom, (x1 - x0 + 1) * zoom, (y1 - y0 + 1) * zoom);
      }
      ctx.restore();
    }
  }, [pixel, zoom, showGrid, mirrorX, hover, preview]);

  useEffect(() => {
    render();
  }, [render]);

  // 鼠标坐标 → 像素坐标
  const toCell = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);
    return { x, y };
  };

  const inBounds = (x: number, y: number) => {
    if (!pixel) return false;
    return x >= 0 && y >= 0 && x < pixel.width && y < pixel.height;
  };

  // 油漆桶（4 方向 flood fill）
  const fillAt = (sx: number, sy: number, newCi: number) => {
    if (!pixel) return;
    const target = pixel.data[sy * pixel.width + sx];
    if (target === newCi) return;
    const cells: { x: number; y: number; ci: number }[] = [];
    const stack: [number, number][] = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (!inBounds(x, y)) continue;
      const idx = y * pixel.width + x;
      if (pixel.data[idx] !== target) continue;
      pixel.data[idx] = newCi;
      cells.push({ x, y, ci: newCi });
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    if (cells.length) paintPixels(cells);
  };

  const pencilAt = (x: number, y: number) => {
    if (!pixel) return;
    if (!inBounds(x, y)) return;
    const ci = pixel.currentColor;
    const cells: { x: number; y: number; ci: number }[] = [{ x, y, ci }];
    if (mirrorX) {
      const mx = pixel.width - 1 - x;
      if (mx !== x) cells.push({ x: mx, y, ci });
    }
    paintPixels(cells);
  };

  // 连续绘制（铅笔拖动）
  const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    if (!pixel) return;
    const ci = pixel.currentColor;
    const cells = bresenhamLine(x0, y0, x1, y1);
    const all: { x: number; y: number; ci: number }[] = [];
    for (const c of cells) {
      all.push({ x: c.x, y: c.y, ci });
      if (mirrorX) {
        const mx = pixel.width - 1 - c.x;
        if (mx !== c.x) all.push({ x: mx, y: c.y, ci });
      }
    }
    paintPixels(all);
  };

  // 吸管
  const eyedropAt = (x: number, y: number) => {
    if (!pixel) return;
    if (!inBounds(x, y)) return;
    const ci = pixel.data[y * pixel.width + x];
    setPixelColor(ci);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const c = toCell(e);
    if (!inBounds(c.x, c.y)) return;
    if (tool === "eyedrop") {
      eyedropAt(c.x, c.y);
      return;
    }
    if (tool === "fill") {
      fillAt(c.x, c.y, pixel!.currentColor);
      return;
    }
    if (tool === "line" || tool === "rect") {
      startCellRef.current = c;
      setPreview({ kind: tool, x0: c.x, y0: c.y, x1: c.x, y1: c.y, ci: pixel!.currentColor });
      return;
    }
    // pencil / eraser
    setDrawing(true);
    lastCellRef.current = c;
    if (tool === "pencil") pencilAt(c.x, c.y);
    else if (tool === "eraser") {
      // eraser 写为 0
      const cells = mirrorX
        ? [{ x: c.x, y: c.y, ci: 0 }, { x: pixel!.width - 1 - c.x, y: c.y, ci: 0 }].filter(
            (cc) => inBounds(cc.x, cc.y)
          )
        : [{ x: c.x, y: c.y, ci: 0 }];
      paintPixels(cells);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = toCell(e);
    setHover(inBounds(c.x, c.y) ? c : null);
    if (!drawing) return;
    if (tool === "pencil" || tool === "eraser") {
      const last = lastCellRef.current;
      if (!last) return;
      const ci = tool === "eraser" ? 0 : pixel!.currentColor;
      // 计算两点连线
      const cells = bresenhamLine(last.x, last.y, c.x, c.y);
      const all: { x: number; y: number; ci: number }[] = [];
      for (const cc of cells) {
        all.push({ x: cc.x, y: cc.y, ci });
        if (mirrorX) {
          const mx = pixel!.width - 1 - cc.x;
          if (mx !== cc.x) all.push({ x: mx, y: cc.y, ci });
        }
      }
      paintPixels(all);
      lastCellRef.current = c;
    } else if ((tool === "line" || tool === "rect") && startCellRef.current) {
      setPreview({
        kind: tool,
        x0: startCellRef.current.x,
        y0: startCellRef.current.y,
        x1: c.x,
        y1: c.y,
        ci: pixel!.currentColor,
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    const c = toCell(e);
    if ((tool === "line" || tool === "rect") && startCellRef.current && preview) {
      // 提交
      const cells: { x: number; y: number; ci: number }[] = [];
      if (preview.kind === "line") {
        const ls = bresenhamLine(preview.x0, preview.y0, preview.x1, preview.y1);
        for (const cc of ls) {
          cells.push({ x: cc.x, y: cc.y, ci: preview.ci });
          if (mirrorX) {
            const mx = pixel!.width - 1 - cc.x;
            if (mx !== cc.x) cells.push({ x: mx, y: cc.y, ci: preview.ci });
          }
        }
      } else {
        const x0 = Math.min(preview.x0, preview.x1);
        const y0 = Math.min(preview.y0, preview.y1);
        const x1 = Math.max(preview.x0, preview.x1);
        const y1 = Math.max(preview.y0, preview.y1);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            cells.push({ x, y, ci: preview.ci });
            if (mirrorX) {
              const mx = pixel!.width - 1 - x;
              if (mx !== x) cells.push({ x: mx, y, ci: preview.ci });
            }
          }
        }
      }
      paintPixels(cells);
    }
    setDrawing(false);
    lastCellRef.current = null;
    startCellRef.current = null;
    setPreview(null);
  };

  // 键盘快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key.toLowerCase()) {
        case "b":
          useProjectStore.getState().setPixelTool("pencil");
          break;
        case "e":
          useProjectStore.getState().setPixelTool("eraser");
          break;
        case "g":
          useProjectStore.getState().setPixelTool("fill");
          break;
        case "i":
          useProjectStore.getState().setPixelTool("eyedrop");
          break;
        case "l":
          useProjectStore.getState().setPixelTool("line");
          break;
        case "r":
          useProjectStore.getState().setPixelTool("rect");
          break;
        case "z":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            useProjectStore.getState().undo();
          }
          break;
        case "m":
          useProjectStore.getState().setMirrorX(!useProjectStore.getState().mirrorX);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const curColor = useMemo(() => {
    if (!pixel) return "#FF7AB6";
    return pixel.palette[pixel.currentColor] ?? "#FF7AB6";
  }, [pixel]);

  if (!pixel) {
    return <div className="p-6 text-mist-300 text-sm">无像素画布</div>;
  }

  return (
    <div className="relative w-full h-full overflow-auto flex items-center justify-center p-6 bg-ink-900 rounded-2xl border border-mist-100/5">
      <div className="absolute inset-0 bg-grid-light opacity-40 pointer-events-none" style={{ backgroundSize: `${zoom * 4}px ${zoom * 4}px` }} />
      <div className="relative" style={{ width: pixel.width * zoom, height: pixel.height * zoom }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setHover(null)}
          className={cn(
            "shadow-2xl",
            tool === "eyedrop" ? "cursor-crosshair" : "cursor-cell"
          )}
          style={{ imageRendering: "pixelated" }}
        />
        {/* 中心对称高亮（视觉提示） */}
        {mirrorX && (
          <div
            className="absolute top-0 bottom-0 w-px bg-sakura-400/30 pointer-events-none"
            style={{ left: (pixel.width / 2) * zoom - 0.5 }}
          />
        )}
      </div>
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <div className="chip">
          <span className="text-mist-300">PX</span>
          <span className="text-mist-50">{pixel.width}×{pixel.height}</span>
        </div>
        <div className="chip">
          <span className="text-mist-300">Z</span>
          <span className="text-mist-50">{zoom}×</span>
        </div>
        {hover && (
          <div className="chip">
            <span className="text-mist-300">@</span>
            <span className="text-sakura-300">{hover.x},{hover.y}</span>
          </div>
        )}
        <div className="chip">
          <span className="w-3 h-3 rounded-sm border border-mist-100/20" style={{ background: curColor }} />
          <span className="text-mist-50">CI {pixel.currentColor}</span>
        </div>
      </div>
    </div>
  );
}

/* ============= 辅助函数 ============= */

function bresenhamLine(x0: number, y0: number, x1: number, y1: number) {
  const cells: { x: number; y: number }[] = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;
  while (true) {
    cells.push({ x, y });
    if (x === x1 && y === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  return cells;
}
