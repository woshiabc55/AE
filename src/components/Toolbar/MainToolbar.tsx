import { useState } from 'react';
import {
  MousePointer2, Square, Circle, CircleDot, Minus,
  PenTool, Type, Hand, ZoomIn, ZoomOut, Maximize,
} from 'lucide-react';
import { useToolStore } from '../../store/useToolStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import type { ToolType } from '../../types';

const tools: { type: ToolType; icon: typeof MousePointer2; label: string }[] = [
  { type: 'select', icon: MousePointer2, label: '选择' },
  { type: 'rect', icon: Square, label: '矩形' },
  { type: 'circle', icon: Circle, label: '圆形' },
  { type: 'ellipse', icon: CircleDot, label: '椭圆' },
  { type: 'line', icon: Minus, label: '线条' },
  { type: 'path', icon: PenTool, label: '路径' },
  { type: 'text', icon: Type, label: '文字' },
  { type: 'hand', icon: Hand, label: '手型' },
];

export default function MainToolbar() {
  const { activeTool, setActiveTool } = useToolStore();
  const { project, setProjectName } = useProjectStore();
  const { canvasZoom, setCanvasZoom } = useUIStore();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(project.name);

  const handleNameBlur = () => {
    setEditingName(false);
    if (nameValue.trim()) setProjectName(nameValue.trim());
    else setNameValue(project.name);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
    if (e.key === 'Escape') { setNameValue(project.name); setEditingName(false); }
  };

  const zoomPercent = Math.round(canvasZoom * 100);

  const handleFitZoom = () => setCanvasZoom(1);
  const handleZoomIn = () => setCanvasZoom(canvasZoom + 0.1);
  const handleZoomOut = () => setCanvasZoom(canvasZoom - 0.1);

  return (
    <div className="relative">
      {/* 3D 底部阴影线 */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      <div className="flex items-center h-11 px-3 bg-[#16181f] select-none relative">
        {/* 3D 顶部高光 */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* 品牌标识 */}
        <div className="flex items-center gap-1.5 mr-3">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #00e5ff, #0088aa)',
              boxShadow: '0 2px 4px rgba(0,229,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            M
          </div>
          <span className="text-[11px] font-display font-semibold text-white/70 tracking-wide hidden sm:inline">
            MotionCanvas
          </span>
        </div>

        {/* 分隔符 */}
        <div className="w-px h-5 mx-1 bg-white/10" />

        {/* 工具按钮 - 3D 浮雕效果 */}
        <div className="flex items-center gap-0.5 ml-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.type;
            return (
              <button
                key={tool.type}
                title={tool.label}
                onClick={() => setActiveTool(tool.type)}
                className={`p-1.5 rounded-md transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#00e5ff]/15 text-[#00e5ff]'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.06]'
                }`}
                style={isActive ? {
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 8px rgba(0,229,255,0.15)',
                } : undefined}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        {/* 分隔符 */}
        <div className="w-px h-5 mx-3 bg-white/10" />

        {/* 项目名称 - 3D 内嵌效果 */}
        {editingName ? (
          <input
            className="bg-[#0f1117] text-white text-sm outline-none border border-[#00e5ff]/50 rounded px-2 py-0.5 w-36 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            autoFocus
          />
        ) : (
          <span
            className="text-sm text-gray-400 cursor-pointer hover:text-white truncate max-w-40 transition-colors"
            onDoubleClick={() => { setEditingName(true); setNameValue(project.name); }}
            title="双击编辑项目名称"
          >
            {project.name}
          </span>
        )}

        {/* 弹性间距 */}
        <div className="flex-1" />

        {/* 缩放控制 - 3D 压缩效果 */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#0f1117]/60"
          style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
        >
          <button
            title="适应画布"
            onClick={handleFitZoom}
            className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Maximize size={12} />
          </button>
          <button
            title="缩小"
            onClick={handleZoomOut}
            className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomOut size={12} />
          </button>
          <span className="text-[10px] text-gray-400 w-9 text-center tabular-nums font-mono">
            {zoomPercent}%
          </span>
          <button
            title="放大"
            onClick={handleZoomIn}
            className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomIn size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
