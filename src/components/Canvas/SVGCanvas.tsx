import { useCallback, useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useToolStore } from '../../store/useToolStore';
import { useUIStore } from '../../store/useUIStore';
import type { ToolType } from '../../types';
import SVGElementRenderer from './SVGElementRenderer';
import SelectionBox from './SelectionBox';

const SHAPE_TOOLS: ToolType[] = ['rect', 'circle', 'ellipse', 'line', 'path', 'text'];

export default function SVGCanvas() {
  const { project, selectedElementId, selectElement, addElement, updateElementTransform } = useProjectStore();
  const { activeTool } = useToolStore();
  const { canvasZoom, canvasPanX, canvasPanY, showGrid, setCanvasZoom, setCanvasPan } = useUIStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  // 屏幕坐标 → 画布坐标
  const toCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - canvasPanX - rect.width / 2) / canvasZoom + project.width / 2,
        y: (clientY - rect.top - canvasPanY - rect.height / 2) / canvasZoom + project.height / 2,
      };
    },
    [canvasZoom, canvasPanX, canvasPanY, project.width, project.height],
  );

  // 滚轮缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCanvasZoom(canvasZoom * delta);
    },
    [canvasZoom, setCanvasZoom],
  );

  // 中键 / 手型工具平移
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 中键或手型工具 → 平移
      if (e.button === 1 || activeTool === 'hand') {
        setIsPanning(true);
        setPanStart({ x: e.clientX - canvasPanX, y: e.clientY - canvasPanY });
        return;
      }

      // 形状工具 → 创建新元素
      if (e.button === 0 && SHAPE_TOOLS.includes(activeTool)) {
        const pos = toCanvasCoords(e.clientX, e.clientY);
        addElement(activeTool as 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'text', {
          x: Math.round(pos.x),
          y: Math.round(pos.y),
          cx: Math.round(pos.x),
          cy: Math.round(pos.y),
          x1: Math.round(pos.x),
          y1: Math.round(pos.y),
          x2: Math.round(pos.x) + 100,
          y2: Math.round(pos.y) + 100,
        });
        return;
      }

      // 选择工具 → 点击空白取消选择
      if (e.button === 0 && activeTool === 'select') {
        selectElement(null);
      }
    },
    [activeTool, canvasPanX, canvasPanY, addElement, selectElement, toCanvasCoords],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setCanvasPan(e.clientX - panStart.x, e.clientY - panStart.y);
        return;
      }
      if (isDragging && selectedElement) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setDragStart({ x: e.clientX, y: e.clientY });
        updateElementTransform(selectedElement.id, {
          translateX: selectedElement.transform.translateX + dx / canvasZoom,
          translateY: selectedElement.transform.translateY + dy / canvasZoom,
        });
      }
    },
    [isPanning, isDragging, panStart, dragStart, selectedElement, canvasZoom, setCanvasPan, updateElementTransform],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
  }, []);

  // 元素选中
  const handleSelect = useCallback(
    (id: string, e: React.MouseEvent) => {
      if (activeTool !== 'select') return;
      e.stopPropagation();
      selectElement(id);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [activeTool, selectElement],
  );

  // 网格
  const gridSize = 20;
  const gridLines = showGrid
    ? Array.from({ length: Math.ceil(project.width / gridSize) + 1 }, (_, i) => (
        <line key={`gv${i}`} x1={i * gridSize} y1={0} x2={i * gridSize} y2={project.height} stroke="#1e2030" strokeWidth={0.5} />
      )).concat(
        Array.from({ length: Math.ceil(project.height / gridSize) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * gridSize} x2={project.width} y2={i * gridSize} stroke="#1e2030" strokeWidth={0.5} />
        )),
      )
    : [];

  const cursorClass =
    activeTool === 'hand' ? 'cursor-grab' :
    isPanning ? 'cursor-grabbing' :
    SHAPE_TOOLS.includes(activeTool) ? 'cursor-crosshair' :
    'cursor-default';

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-hidden bg-[#0f1117] ${cursorClass}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        width="100%"
        height="100%"
        style={{ userSelect: 'none' }}
      >
        <g transform={`translate(${canvasPanX + (containerRef.current?.clientWidth ?? 0) / 2}, ${canvasPanY + (containerRef.current?.clientHeight ?? 0) / 2}) scale(${canvasZoom}) translate(${-project.width / 2}, ${-project.height / 2})`}>
          {/* 画板背景 */}
          <rect x={0} y={0} width={project.width} height={project.height} fill={project.backgroundColor} />

          {/* 网格 */}
          {gridLines}

          {/* 渲染所有元素 */}
          {project.elements.map((el) => (
            <SVGElementRenderer
              key={el.id}
              element={el}
              isSelected={el.id === selectedElementId}
              onSelect={handleSelect}
            />
          ))}

          {/* 选中框 */}
          {selectedElement && (
            <SelectionBox element={selectedElement} zoom={canvasZoom} />
          )}

          {/* 画板边框 */}
          <rect
            x={0} y={0}
            width={project.width} height={project.height}
            fill="none" stroke="#2a2d3a" strokeWidth={1}
            pointerEvents="none"
          />
        </g>
      </svg>

      {/* 缩放指示器 */}
      <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono select-none">
        {Math.round(canvasZoom * 100)}%
      </div>
    </div>
  );
}
