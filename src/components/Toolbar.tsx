import { memo } from 'react';
import {
  MousePointer2,
  Move,
  RotateCcw,
  Maximize2,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useEditorStore, type ToolType } from '@/store/editorStore';

const tools: { type: ToolType; icon: typeof MousePointer2; label: string }[] = [
  { type: 'select', icon: MousePointer2, label: '选择 (Q)' },
  { type: 'translate', icon: Move, label: '移动 (W)' },
  { type: 'rotate', icon: RotateCcw, label: '旋转 (E)' },
  { type: 'scale', icon: Maximize2, label: '缩放 (R)' },
];

function Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.historyIndex > 0);
  const canRedo = useEditorStore((s) => s.historyIndex < s.history.length - 1);

  return (
    <div className="flex h-10 items-center gap-1 border-b border-[#0f3460]/60 bg-[#16213e]/80 px-2 backdrop-blur-sm">
      <div className="flex items-center gap-0.5 rounded-md bg-[#0a0a1a]/60 p-0.5">
        {tools.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setActiveTool(type)}
            className={`rounded p-1.5 transition-all ${
              activeTool === type
                ? 'bg-[#00d4aa]/20 text-[#00d4aa] shadow-[0_0_8px_rgba(0,212,170,0.2)]'
                : 'text-white/40 hover:bg-white/5 hover:text-white/70'
            }`}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="mx-2 h-5 w-px bg-[#0f3460]" />

      <button
        onClick={undo}
        disabled={!canUndo}
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
          canUndo ? 'text-white/40 hover:bg-white/5 hover:text-white/70' : 'text-white/15 cursor-not-allowed'
        }`}
        title="撤销 (Ctrl+Z)"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
          canRedo ? 'text-white/40 hover:bg-white/5 hover:text-white/70' : 'text-white/15 cursor-not-allowed'
        }`}
        title="重做 (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>

      <div className="flex-1" />

      <div className="text-[10px] tracking-wider text-white/20 uppercase">
        PlayCanvas 模型编辑器
      </div>
    </div>
  );
}

export default memo(Toolbar);
