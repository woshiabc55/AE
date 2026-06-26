import { useCallback, useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useToolStore } from '../../store/useToolStore';
import { useUIStore } from '../../store/useUIStore';
import type { ToolType, SVGElement as SVGEl } from '../../types';
import SVGElementRenderer from './SVGElementRenderer';
import SelectionBox from './SelectionBox';

const SHAPE_TOOLS: ToolType[] = ['rect', 'circle', 'ellipse', 'line', 'path', 'text', 'image'];
const SNAP_THRESHOLD = 8; // 画布坐标中的吸附阈值
const GRID_SIZE = 20;

// 伪3D 挤压层配置（轻柔，避免重影）
const EXTRUDE_LAYERS = 3;
const EXTRUDE_OFFSET = 2;

export default function SVGCanvas() {
  const { project, selectedElementId, selectElement, addElement, updateElementTransform } = useProjectStore();
  const { activeTool } = useToolStore();
  const { canvasZoom, canvasPanX, canvasPanY, showGrid, setCanvasZoom, setCanvasPan } = useUIStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [panState, setPanState] = useState<{ isPanning: boolean; startX: number; startY: number } | null>(null);
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snapLines, setSnapLines] = useState<{ x?: number; y?: number }>({});
  const [imageDraw, setImageDraw] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  // 获取容器尺寸（实时读取，避免首屏偏移）
  const getContainerSize = () => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight };
    return { w: el.clientWidth, h: el.clientHeight };
  };

  // 屏幕坐标 → 画布坐标
  const toCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const size = getContainerSize();
      if (!rect) return { x: project.width / 2, y: project.height / 2 };
      const cx = size.w / 2 + canvasPanX;
      const cy = size.h / 2 + canvasPanY;
      return {
        x: (clientX - rect.left - cx) / canvasZoom + project.width / 2,
        y: (clientY - rect.top - cy) / canvasZoom + project.height / 2,
      };
    },
    [canvasZoom, canvasPanX, canvasPanY, project.width, project.height],
  );

  // 计算吸附位置
  const getSnapPosition = useCallback(
    (x: number, y: number, excludeId?: string): { x: number; y: number; lines: { x?: number; y?: number } } => {
      const lines: { x?: number; y?: number } = {};
      let snapX = x;
      let snapY = y;

      // 网格吸附
      if (showGrid) {
        const gridX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.round(y / GRID_SIZE) * GRID_SIZE;
        if (Math.abs(gridX - x) <= SNAP_THRESHOLD) { snapX = gridX; lines.x = gridX; }
        if (Math.abs(gridY - y) <= SNAP_THRESHOLD) { snapY = gridY; lines.y = gridY; }
      }

      // 对齐其他元素中心/边缘
      const threshold = SNAP_THRESHOLD;
      for (const el of project.elements) {
        if (el.id === excludeId) continue;
        const box = getElementWorldBox(el);
        if (!box) continue;

        const candidatesX = [box.cx, box.x, box.x + box.width];
        const candidatesY = [box.cy, box.y, box.y + box.height];

        for (const cx of candidatesX) {
          if (Math.abs(cx - x) <= threshold && Math.abs(cx - x) < Math.abs((lines.x ?? Infinity) - x)) {
            snapX = cx;
            lines.x = cx;
          }
        }
        for (const cy of candidatesY) {
          if (Math.abs(cy - y) <= threshold && Math.abs(cy - y) < Math.abs((lines.y ?? Infinity) - y)) {
            snapY = cy;
            lines.y = cy;
          }
        }
      }

      return { x: snapX, y: snapY, lines };
    },
    [project.elements, showGrid],
  );

  // 滚轮缩放（以鼠标为中心缩放）
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      const size = getContainerSize();
      if (!rect) return;

      const mouseBefore = {
        x: (e.clientX - rect.left - (size.w / 2 + canvasPanX)) / canvasZoom,
        y: (e.clientY - rect.top - (size.h / 2 + canvasPanY)) / canvasZoom,
      };

      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const nextZoom = Math.max(0.1, Math.min(5, canvasZoom * factor));

      const mouseAfter = {
        x: mouseBefore.x * (nextZoom / canvasZoom),
        y: mouseBefore.y * (nextZoom / canvasZoom),
      };

      const newPanX = size.w / 2 - (e.clientX - rect.left) + mouseAfter.x;
      const newPanY = size.h / 2 - (e.clientY - rect.top) + mouseAfter.y;

      setCanvasZoom(nextZoom);
      setCanvasPan(newPanX, newPanY);
    },
    [canvasZoom, canvasPanX, canvasPanY, setCanvasZoom, setCanvasPan],
  );

  // 图像上传处理：支持点击放置或拖拽框定区域
  const handleImageUpload = (placement: { x: number; y: number; width?: number; height?: number }) => {
    const input = fileInputRef.current;
    if (!input) return;

    const onChange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let w: number;
          let h: number;
          let tx: number;
          let ty: number;

          if (placement.width && placement.height) {
            // 拖拽框定：按 contain 适配图像
            const scale = Math.min(placement.width / img.width, placement.height / img.height, 1);
            w = img.width * scale;
            h = img.height * scale;
            tx = placement.x + (placement.width - w) / 2;
            ty = placement.y + (placement.height - h) / 2;
          } else {
            // 点击放置：限制最大尺寸
            const maxSize = 200;
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            w = img.width * scale;
            h = img.height * scale;
            tx = placement.x - w / 2;
            ty = placement.y - h / 2;
          }

          const el = addElement('image', {
            x: 0,
            y: 0,
            width: w,
            height: h,
            href: String(reader.result || ''),
          });
          updateElementTransform(el.id, { translateX: tx, translateY: ty });
          selectElement(el.id);
        };
        img.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
      input.value = '';
      input.removeEventListener('change', onChange);
    };

    input.addEventListener('change', onChange);
    input.click();
  };

  // 鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 中键或手型工具 → 平移
      if (e.button === 1 || activeTool === 'hand') {
        setPanState({ isPanning: true, startX: e.clientX - canvasPanX, startY: e.clientY - canvasPanY });
        return;
      }

      // 形状工具 → 在点击位置中央创建元素
      if (e.button === 0 && SHAPE_TOOLS.includes(activeTool)) {
        const pos = toCanvasCoords(e.clientX, e.clientY);
        const type = activeTool as SVGEl['type'];

        if (type === 'image') {
          // 图像工具进入拖拽绘制定位模式
          setImageDraw({ start: pos, end: pos });
          return;
        }

        // 默认 transform 定位到点击中心，attrs 使用相对坐标
        const defaultsByType: Record<string, Record<string, number | string>> = {
          rect: { x: 0, y: 0, width: 120, height: 80, rx: 4 },
          circle: { cx: 0, cy: 0, r: 45 },
          ellipse: { cx: 0, cy: 0, rx: 65, ry: 35 },
          line: { x1: -50, y1: -50, x2: 50, y2: 50 },
          path: { d: '' },
          text: { x: 0, y: 8, fontSize: 24, textContent: '文字' },
        };

        const el = addElement(type, defaultsByType[type] ?? {});
        updateElementTransform(el.id, {
          translateX: pos.x,
          translateY: pos.y,
        });
        selectElement(el.id);
        return;
      }

      // 选择工具 → 点击空白取消选择
      if (e.button === 0 && activeTool === 'select') {
        selectElement(null);
      }
    },
    [activeTool, canvasPanX, canvasPanY, addElement, selectElement, toCanvasCoords, updateElementTransform],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = toCanvasCoords(e.clientX, e.clientY);
      setMousePos(pos);

      if (panState?.isPanning) {
        setCanvasPan(e.clientX - panState.startX, e.clientY - panState.startY);
        return;
      }

      // 图像工具拖拽绘制定位
      if (imageDraw) {
        const snap = getSnapPosition(pos.x, pos.y);
        setSnapLines(snap.lines);
        setImageDraw((prev) => (prev ? { ...prev, end: { x: snap.x, y: snap.y } } : null));
        return;
      }

      if (dragState && selectedElement) {
        const rawX = dragState.originX + (e.clientX - dragState.startX) / canvasZoom;
        const rawY = dragState.originY + (e.clientY - dragState.startY) / canvasZoom;
        const snap = getSnapPosition(rawX, rawY, dragState.id);
        setSnapLines(snap.lines);
        updateElementTransform(dragState.id, {
          translateX: snap.x,
          translateY: snap.y,
        });
      } else {
        setSnapLines({});
      }
    },
    [panState, dragState, selectedElement, imageDraw, canvasZoom, setCanvasPan, updateElementTransform, toCanvasCoords, getSnapPosition],
  );

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      setDragState(null);
    }

    // 图像工具拖拽完成：根据拖拽框触发上传
    if (imageDraw) {
      const { start, end } = imageDraw;
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);
      if (dx > 4 || dy > 4) {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        handleImageUpload({ x, y, width: dx, height: dy });
      } else {
        handleImageUpload({ x: start.x, y: start.y });
      }
      setImageDraw(null);
      setSnapLines({});
      setPanState(null);
      return;
    }

    setPanState(null);
    setSnapLines({});
  }, [dragState, imageDraw]);

  // 元素选中 + 拖拽
  const handleSelect = useCallback(
    (id: string, e: React.MouseEvent) => {
      if (activeTool !== 'select') return;
      e.stopPropagation();
      selectElement(id);
      const el = project.elements.find((x) => x.id === id);
      if (el) {
        setDragState({
          id,
          startX: e.clientX,
          startY: e.clientY,
          originX: el.transform.translateX,
          originY: el.transform.translateY,
        });
      }
    },
    [activeTool, project.elements, selectElement],
  );

  // 等轴测网格
  const renderIsometricGrid = () => {
    if (!showGrid) return null;
    const w = project.width;
    const h = project.height;
    const gridSize = GRID_SIZE;
    const lines: React.ReactNode[] = [];

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

    const isoStep = 80;
    for (let d = -h; d < w + h; d += isoStep) {
      lines.push(
        <line key={`iso1-${d}`} x1={d} y1={0} x2={d + h * 0.577} y2={h}
          stroke="#1e2540" strokeWidth={0.3} strokeDasharray="4 8" opacity={0.5} />
      );
      lines.push(
        <line key={`iso2-${d}`} x1={d} y1={h} x2={d + h * 0.577} y2={0}
          stroke="#1e2540" strokeWidth={0.3} strokeDasharray="4 8" opacity={0.5} />
      );
    }

    return lines;
  };

  // 智能对齐线
  const renderSnapGuides = () => {
    if (!snapLines.x && !snapLines.y) return null;
    const w = project.width;
    const h = project.height;
    return (
      <g pointerEvents="none">
        {snapLines.x !== undefined && (
          <line
            x1={snapLines.x} y1={-20}
            x2={snapLines.x} y2={h + 20}
            stroke="#00e5ff"
            strokeWidth={1 / canvasZoom}
            strokeDasharray={`${4 / canvasZoom} ${4 / canvasZoom}`}
            opacity={0.6}
          />
        )}
        {snapLines.y !== undefined && (
          <line
            x1={-20} y1={snapLines.y}
            x2={w + 20} y2={snapLines.y}
            stroke="#00e5ff"
            strokeWidth={1 / canvasZoom}
            strokeDasharray={`${4 / canvasZoom} ${4 / canvasZoom}`}
            opacity={0.6}
          />
        )}
      </g>
    );
  };

  // 图像拖拽绘制预览框
  const renderImageDrawPreview = () => {
    if (!imageDraw) return null;
    const x = Math.min(imageDraw.start.x, imageDraw.end.x);
    const y = Math.min(imageDraw.start.y, imageDraw.end.y);
    const w = Math.abs(imageDraw.end.x - imageDraw.start.x);
    const h = Math.abs(imageDraw.end.y - imageDraw.start.y);
    return (
      <g pointerEvents="none">
        <rect
          x={x} y={y} width={w} height={h}
          fill="rgba(0,229,255,0.08)"
          stroke="#00e5ff"
          strokeWidth={1 / canvasZoom}
          strokeDasharray={`${4 / canvasZoom} ${4 / canvasZoom}`}
          rx={2}
        />
        {/* 对角线 */}
        <line x1={x} y1={y} x2={x + w} y2={y + h} stroke="#00e5ff" strokeWidth={0.5 / canvasZoom} opacity={0.5} />
        <line x1={x + w} y1={y} x2={x} y2={y + h} stroke="#00e5ff" strokeWidth={0.5 / canvasZoom} opacity={0.5} />
      </g>
    );
  };

  // 伪3D 深度阴影
  const renderDepthShadow = (el: SVGEl) => (
    <SVGElementRenderer
      key={`${el.id}-shadow`}
      element={{
        ...el,
        id: `${el.id}-shadow`,
        fill: { type: 'solid', color: '#000000', opacity: 0.25 },
        stroke: { ...el.stroke, width: 0 },
        transform: {
          ...el.transform,
          translateX: el.transform.translateX + 4,
          translateY: el.transform.translateY + 4,
          scaleX: el.transform.scaleX * 1.01,
          scaleY: el.transform.scaleY * 1.01,
        },
      }}
      isExtrude
    />
  );

  // 伪3D 挤压层（轻柔）
  const renderExtrudeLayers = (el: SVGEl) => {
    const layers: React.ReactNode[] = [];
    for (let i = EXTRUDE_LAYERS; i >= 1; i--) {
      const offset = i * EXTRUDE_OFFSET;
      layers.push(
        <SVGElementRenderer
          key={`${el.id}-extrude-${i}`}
          element={{
            ...el,
            fill: { type: 'solid', color: '#000000', opacity: 0.03 + (EXTRUDE_LAYERS - i) * 0.03 },
            stroke: { ...el.stroke, color: '#000000', opacity: 0.02 + (EXTRUDE_LAYERS - i) * 0.02 },
            transform: {
              ...el.transform,
              translateX: el.transform.translateX + offset,
              translateY: el.transform.translateY + offset,
            },
          }}
          isExtrude
        />
      );
    }
    return layers;
  };

  const cursorClass =
    activeTool === 'hand' ? 'cursor-grab' :
    panState?.isPanning ? 'cursor-grabbing' :
    imageDraw ? 'cursor-crosshair' :
    SHAPE_TOOLS.includes(activeTool) ? 'cursor-crosshair' :
    'cursor-default';

  const size = getContainerSize();
  const tx = size.w / 2 + canvasPanX;
  const ty = size.h / 2 + canvasPanY;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-[#0b0d12] relative ${cursorClass}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      <svg width="100%" height="100%" style={{ userSelect: 'none' }}>
        <defs>
          <filter id="canvas-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="canvas-highlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="selection-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${tx}, ${ty}) scale(${canvasZoom}) translate(${-project.width / 2}, ${-project.height / 2})`}>
          {/* 画板外阴影框 */}
          <rect
            x={-8} y={-8}
            width={project.width + 16} height={project.height + 16}
            rx={6}
            fill="transparent"
            filter="url(#canvas-shadow)"
          />

          {/* 画板背景 */}
          <rect x={0} y={0} width={project.width} height={project.height} rx={2} fill={project.backgroundColor} />

          {/* 画板高光叠加 */}
          <rect x={0} y={0} width={project.width} height={project.height} rx={2} fill="url(#canvas-highlight)" pointerEvents="none" />

          {/* 网格 */}
          {renderIsometricGrid()}

          {/* 元素层（阴影 → 挤压 → 主体 → 选中发光） */}
          {project.elements.map((el) => {
            const layer = project.layers.find((l) => l.id === el.layerId);
            if (layer && !layer.visible) return null;
            const isSelected = el.id === selectedElementId;
            return (
              <g key={el.id}>
                {renderDepthShadow(el)}
                {renderExtrudeLayers(el)}
                <SVGElementRenderer
                  element={el}
                  isSelected={isSelected}
                  onSelect={handleSelect}
                />
                {isSelected && (
                  <SVGElementRenderer
                    element={{
                      ...el,
                      id: `${el.id}-glow`,
                      fill: { type: 'solid', color: 'url(#selection-glow)', opacity: 0.15 },
                      stroke: { ...el.stroke, width: 0 },
                      transform: { ...el.transform, scaleX: el.transform.scaleX * 1.04, scaleY: el.transform.scaleY * 1.04 },
                    }}
                    isExtrude
                  />
                )}
              </g>
            );
          })}

          {/* 智能对齐线 */}
          {renderSnapGuides()}

          {/* 图像拖拽绘制预览 */}
          {renderImageDrawPreview()}

          {/* 选中框 */}
          {selectedElement && <SelectionBox element={selectedElement} zoom={canvasZoom} />}

          {/* 3D 浮雕边框 */}
          <line x1={0} y1={0} x2={project.width} y2={0} stroke="#3a3f55" strokeWidth={1} />
          <line x1={0} y1={0} x2={0} y2={project.height} stroke="#3a3f55" strokeWidth={1} />
          <line x1={0} y1={project.height} x2={project.width} y2={project.height} stroke="#05070a" strokeWidth={1} />
          <line x1={project.width} y1={0} x2={project.width} y2={project.height} stroke="#05070a" strokeWidth={1} />

          {/* 尺寸标注 */}
          <text x={project.width / 2} y={-10} textAnchor="middle" fill="#4a5070" fontSize={10} fontFamily="IBM Plex Sans">
            {project.width} × {project.height}
          </text>
        </g>
      </svg>

      {/* HUD 信息 */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <div className="bg-[#16181f]/90 backdrop-blur-sm rounded-md px-2.5 py-1 border border-white/5 shadow-lg select-none">
          <span className="text-[10px] text-gray-500 font-mono">{Math.round(canvasZoom * 100)}%</span>
        </div>
      </div>

      {selectedElement && (
        <div className="absolute top-3 left-3 flex items-center gap-3 bg-[#16181f]/90 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/5 shadow-lg select-none">
          <span className="text-[10px] text-[#00e5ff] font-mono">X: {Math.round(selectedElement.transform.translateX)}</span>
          <span className="text-[10px] text-[#00e5ff] font-mono">Y: {Math.round(selectedElement.transform.translateY)}</span>
        </div>
      )}

      {/* 鼠标坐标 */}
      <div className="absolute bottom-3 left-3 bg-[#16181f]/90 backdrop-blur-sm rounded-md px-2.5 py-1 border border-white/5 shadow-lg select-none">
        <span className="text-[10px] text-gray-500 font-mono">{Math.round(mousePos.x)}, {Math.round(mousePos.y)}</span>
      </div>
    </div>
  );
}

// 获取元素在世界坐标中的包围盒（含变换）
function getElementWorldBox(el: SVGEl): { x: number; y: number; width: number; height: number; cx: number; cy: number } | null {
  const a = el.attrs;
  let x = 0, y = 0, w = 0, h = 0;

  switch (el.type) {
    case 'rect':
    case 'image':
      x = Number(a.x) || 0; y = Number(a.y) || 0; w = Number(a.width) || 0; h = Number(a.height) || 0;
      break;
    case 'circle': {
      const cx = Number(a.cx) || 0, cy = Number(a.cy) || 0, r = Number(a.r) || 0;
      x = cx - r; y = cy - r; w = r * 2; h = r * 2;
      break;
    }
    case 'ellipse': {
      const cx = Number(a.cx) || 0, cy = Number(a.cy) || 0, rx = Number(a.rx) || 0, ry = Number(a.ry) || 0;
      x = cx - rx; y = cy - ry; w = rx * 2; h = ry * 2;
      break;
    }
    case 'line':
      return null;
    case 'text':
      x = Number(a.x) || 0; y = (Number(a.y) || 0) - (Number(a.fontSize) || 24); w = 80; h = Number(a.fontSize) || 24;
      break;
    default:
      return null;
  }

  const t = el.transform;
  const worldX = t.translateX + x * t.scaleX;
  const worldY = t.translateY + y * t.scaleY;
  return {
    x: worldX,
    y: worldY,
    width: w * t.scaleX,
    height: h * t.scaleY,
    cx: worldX + (w * t.scaleX) / 2,
    cy: worldY + (h * t.scaleY) / 2,
  };
}
