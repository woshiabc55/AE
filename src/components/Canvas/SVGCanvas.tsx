import { useCallback, useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useToolStore } from '../../store/useToolStore';
import { useUIStore } from '../../store/useUIStore';
import type { ToolType, SVGElement as SVGEl } from '../../types';
import SVGElementRenderer from './SVGElementRenderer';
import SelectionBox from './SelectionBox';

const SHAPE_TOOLS: ToolType[] = ['rect', 'circle', 'ellipse', 'line', 'path', 'text'];

// 伪3D 挤压层配置
const EXTRUDE_LAYERS = 5;
const EXTRUDE_OFFSET = 3; // 每层偏移像素

export default function SVGCanvas() {
  const { project, selectedElementId, selectElement, addElement, updateElementTransform } = useProjectStore();
  const { activeTool } = useToolStore();
  const { canvasZoom, canvasPanX, canvasPanY, showGrid, setCanvasZoom, setCanvasPan } = useUIStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  // 监听容器尺寸变化
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 屏幕坐标 → 画布坐标
  const toCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const cx = containerSize.w / 2 + canvasPanX;
      const cy = containerSize.h / 2 + canvasPanY;
      return {
        x: (clientX - rect.left - cx) / canvasZoom + project.width / 2,
        y: (clientY - rect.top - cy) / canvasZoom + project.height / 2,
      };
    },
    [canvasZoom, canvasPanX, canvasPanY, containerSize, project.width, project.height],
  );

  // 初始化画布居中
  useEffect(() => {
    if (containerSize.w > 0 && canvasPanX === 0 && canvasPanY === 0) {
      // 默认已经居中，不需要额外偏移
    }
  }, [containerSize, canvasPanX, canvasPanY]);

  // 滚轮缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCanvasZoom(canvasZoom * delta);
    },
    [canvasZoom, setCanvasZoom],
  );

  // 鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 中键或手型工具 → 平移
      if (e.button === 1 || activeTool === 'hand') {
        setIsPanning(true);
        setPanStart({ x: e.clientX - canvasPanX, y: e.clientY - canvasPanY });
        return;
      }

      // 形状工具 → 开始绘制
      if (e.button === 0 && SHAPE_TOOLS.includes(activeTool)) {
        const pos = toCanvasCoords(e.clientX, e.clientY);
        setIsDrawing(true);
        setDrawStart(pos);
        // 先在点击位置创建元素
        const el = addElement(activeTool as SVGEl['type'], {
          x: Math.round(pos.x - 60),
          y: Math.round(pos.y - 40),
          cx: Math.round(pos.x),
          cy: Math.round(pos.y),
          x1: Math.round(pos.x),
          y1: Math.round(pos.y),
          x2: Math.round(pos.x) + 100,
          y2: Math.round(pos.y) + 100,
        });
        // 选中刚创建的元素
        selectElement(el.id);
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
      // 绘制中拖拽可调整大小（未来扩展）
    },
    [isPanning, isDragging, panStart, dragStart, selectedElement, canvasZoom, setCanvasPan, updateElementTransform],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
    setIsDrawing(false);
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

  // 等轴测网格绘制
  const renderIsometricGrid = () => {
    if (!showGrid) return null;
    const w = project.width;
    const h = project.height;
    const gridSize = 20;
    const lines: React.ReactNode[] = [];

    // 标准网格
    for (let i = 0; i <= Math.ceil(w / gridSize); i++) {
      lines.push(
        <line key={`gv${i}`} x1={i * gridSize} y1={0} x2={i * gridSize} y2={h} stroke="#1a1e2e" strokeWidth={0.5} />
      );
    }
    for (let i = 0; i <= Math.ceil(h / gridSize); i++) {
      lines.push(
        <line key={`gh${i}`} x1={0} y1={i * gridSize} x2={w} y2={i * gridSize} stroke="#1a1e2e" strokeWidth={0.5} />
      );
    }

    // 等轴测参考线（30度角线，用于伪3D布局辅助）
    const isoAngle = 30 * (Math.PI / 180);
    const step = 80;
    // 左下到右上
    for (let d = -h; d < w + h; d += step) {
      const x1 = d, y1 = 0;
      const x2 = d + h * Math.tan(isoAngle), y2 = h;
      lines.push(
        <line key={`iso1-${d}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#1e2540" strokeWidth={0.3} strokeDasharray={`${4} ${8}`} opacity={0.6} />
      );
    }
    // 右下到左上
    for (let d = -h; d < w + h; d += step) {
      const x1 = d, y1 = h;
      const x2 = d + h * Math.tan(isoAngle), y2 = 0;
      lines.push(
        <line key={`iso2-${d}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#1e2540" strokeWidth={0.3} strokeDasharray={`${4} ${8}`} opacity={0.6} />
      );
    }

    return lines;
  };

  // 伪3D挤压效果：为元素渲染底部阴影层
  const renderExtrudeShadow = (el: SVGEl) => {
    const layers: React.ReactNode[] = [];
    for (let i = EXTRUDE_LAYERS; i >= 1; i--) {
      const offset = i * EXTRUDE_OFFSET;
      const alpha = 0.08 + (EXTRUDE_LAYERS - i) * 0.04;
      layers.push(
        <SVGElementRenderer
          key={`${el.id}-extrude-${i}`}
          element={{
            ...el,
            fill: { type: 'solid', color: '#000000', opacity: alpha },
            stroke: { ...el.stroke, color: '#000000', opacity: alpha * 0.5 },
            transform: {
              ...el.transform,
              translateX: el.transform.translateX + offset,
              translateY: el.transform.translateY + offset,
              scaleX: el.transform.scaleX * (1 + i * 0.005),
              scaleY: el.transform.scaleY * (1 + i * 0.005),
            },
          }}
          isSelected={false}
          onSelect={() => {}}
          isExtrude
        />
      );
    }
    return layers;
  };

  // 伪3D深度阴影
  const renderDepthShadow = (el: SVGEl) => {
    const shadowOffset = 8;
    const blur = 12;
    return (
      <SVGElementRenderer
        key={`${el.id}-shadow`}
        element={{
          ...el,
          id: `${el.id}-shadow`,
          fill: { type: 'solid', color: '#000000', opacity: 0.3 },
          stroke: { ...el.stroke, width: 0 },
          transform: {
            ...el.transform,
            translateX: el.transform.translateX + shadowOffset,
            translateY: el.transform.translateY + shadowOffset,
            scaleX: el.transform.scaleX * 1.02,
            scaleY: el.transform.scaleY * 1.02,
          },
        }}
        isSelected={false}
        onSelect={() => {}}
        isExtrude
      />
    );
  };

  const cursorClass =
    activeTool === 'hand' ? 'cursor-grab' :
    isPanning ? 'cursor-grabbing' :
    SHAPE_TOOLS.includes(activeTool) ? 'cursor-crosshair' :
    'cursor-default';

  // 计算画布变换
  const tx = canvasPanX + containerSize.w / 2;
  const ty = canvasPanY + containerSize.h / 2;

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-hidden bg-[#0f1117] relative ${cursorClass}`}
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
        <defs>
          {/* 伪3D 透视滤镜 */}
          <filter id="depth-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          {/* 画板阴影 */}
          <filter id="canvas-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          {/* 元素立体高光 */}
          <linearGradient id="extrude-highlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <g transform={`translate(${tx}, ${ty}) scale(${canvasZoom}) translate(${-project.width / 2}, ${-project.height / 2})`}>
          {/* 画板外部阴影 */}
          <rect
            x={-10} y={-10}
            width={project.width + 20} height={project.height + 20}
            rx={8}
            fill="transparent"
            filter="url(#canvas-shadow)"
          />

          {/* 画板背景 */}
          <rect
            x={0} y={0} width={project.width} height={project.height}
            rx={2}
            fill={project.backgroundColor}
          />

          {/* 网格 + 等轴测辅助线 */}
          {renderIsometricGrid()}

          {/* 渲染所有元素（含伪3D效果） */}
          {project.elements.map((el) => {
            const layer = project.layers.find((l) => l.id === el.layerId);
            if (layer && !layer.visible) return null;
            return (
              <g key={el.id}>
                {/* 深度阴影层 */}
                {renderDepthShadow(el)}
                {/* 挤压立体层 */}
                {renderExtrudeShadow(el)}
                {/* 主体元素 */}
                <SVGElementRenderer
                  element={el}
                  isSelected={el.id === selectedElementId}
                  onSelect={handleSelect}
                />
                {/* 伪3D 高光叠加 */}
                <SVGElementRenderer
                  element={{
                    ...el,
                    id: `${el.id}-highlight`,
                    fill: { type: 'solid', color: 'url(#extrude-highlight)', opacity: 0.12 },
                    stroke: { ...el.stroke, width: 0 },
                  }}
                  isSelected={false}
                  onSelect={() => {}}
                  isExtrude
                />
              </g>
            );
          })}

          {/* 选中框 */}
          {selectedElement && (
            <SelectionBox element={selectedElement} zoom={canvasZoom} />
          )}

          {/* 画板边框（3D 浮雕效果） */}
          {/* 外框 - 亮边（顶部/左侧） */}
          <line x1={0} y1={0} x2={project.width} y2={0} stroke="#3a3f55" strokeWidth={1} />
          <line x1={0} y1={0} x2={0} y2={project.height} stroke="#3a3f55" strokeWidth={1} />
          {/* 外框 - 暗边（底部/右侧） */}
          <line x1={0} y1={project.height} x2={project.width} y2={project.height} stroke="#0a0c12" strokeWidth={1} />
          <line x1={project.width} y1={0} x2={project.width} y2={project.height} stroke="#0a0c12" strokeWidth={1} />

          {/* 画布尺寸标注 */}
          <text x={project.width / 2} y={-8} textAnchor="middle" fill="#4a5070" fontSize={10} fontFamily="IBM Plex Sans">
            {project.width} × {project.height}
          </text>
        </g>
      </svg>

      {/* 缩放指示器 - 3D 样式 */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#1a1d27]/90 backdrop-blur-sm rounded-md px-2.5 py-1 border border-white/5 shadow-lg shadow-black/30 select-none">
        <span className="text-[10px] text-gray-500 font-mono">{Math.round(canvasZoom * 100)}%</span>
      </div>

      {/* 坐标指示器 */}
      {selectedElement && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#1a1d27]/90 backdrop-blur-sm rounded-md px-2.5 py-1 border border-white/5 shadow-lg shadow-black/30 select-none">
          <span className="text-[10px] text-[#00e5ff] font-mono">
            X: {Math.round(selectedElement.transform.translateX)}
          </span>
          <span className="text-[10px] text-[#00e5ff] font-mono">
            Y: {Math.round(selectedElement.transform.translateY)}
          </span>
        </div>
      )}
    </div>
  );
}
