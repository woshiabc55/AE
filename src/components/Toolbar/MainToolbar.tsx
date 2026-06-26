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
    <div className="flex items-center h-10 px-2 bg-[#1a1d27] border-b border-white/10 select-none">
      {/* 工具按钮 */}
      <div className="flex items-center gap-0.5">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.type;
          return (
            <button
              key={tool.type}
              title={tool.label}
              onClick={() => setActiveTool(tool.type)}
              className={`p-1.5 rounded transition-colors ${
                isActive
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff]'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* 分隔符 */}
      <div className="w-px h-5 mx-3 bg-white/15" />

      {/* 项目名称 */}
      {editingName ? (
        <input
          className="bg-transparent text-white text-sm outline-none border-b border-[#00e5ff] w-32 px-0.5"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          autoFocus
        />
      ) : (
        <span
          className="text-sm text-gray-300 cursor-pointer hover:text-white truncate max-w-36"
          onDoubleClick={() => { setEditingName(true); setNameValue(project.name); }}
          title="双击编辑项目名称"
        >
          {project.name}
        </span>
      )}

      {/* 弹性间距 */}
      <div className="flex-1" />

      {/* 缩放控制 */}
      <div className="flex items-center gap-1">
        <button
          title="适应画布"
          onClick={handleFitZoom}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Maximize size={14} />
        </button>
        <button
          title="缩小"
          onClick={handleZoomOut}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs text-gray-400 w-10 text-center tabular-nums">
          {zoomPercent}%
        </span>
        <button
          title="放大"
          onClick={handleZoomIn}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}
