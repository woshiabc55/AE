import { memo } from 'react';
import { Eye, EyeOff, Trash2, Box, Lightbulb, Camera } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

const typeIcons: Record<string, typeof Box> = {
  model: Box,
  primitive: Box,
  light: Lightbulb,
  camera: Camera,
};

const SceneItem = memo(function SceneItem({
  id,
  name,
  type,
  visible,
  isSelected,
}: {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  isSelected: boolean;
}) {
  const selectObject = useEditorStore((s) => s.selectObject);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const removeObject = useEditorStore((s) => s.removeObject);
  const Icon = typeIcons[type] || Box;

  return (
    <div
      onClick={() => selectObject(id)}
      className={`group flex cursor-pointer items-center gap-2 border-l-2 px-3 py-1.5 transition-colors ${
        isSelected
          ? 'border-l-[#00d4aa] bg-[#00d4aa]/10 text-white'
          : 'border-l-transparent text-white/50 hover:bg-white/5 hover:text-white/70'
      }`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
      <span className="flex-1 truncate text-xs">{name}</span>

      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(id);
          }}
          className="rounded p-0.5 text-white/30 transition-colors hover:text-white/60"
          title={visible ? '隐藏' : '显示'}
        >
          {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-red-400/60" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeObject(id);
          }}
          className="rounded p-0.5 text-white/30 transition-colors hover:text-red-400/80"
          title="删除"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
});

interface ObjectInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

function SceneHierarchy() {
  const objects = useEditorStore((s) => s.objects);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);

  const objectInfos: ObjectInfo[] = objects.map((o) => ({
    id: o.id,
    name: o.name,
    type: o.type,
    visible: o.visible,
  }));

  return (
    <div className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-[#0f3460]/60 bg-[#16213e]/60 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-[#0f3460]/60 px-3 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
          场景层级
        </span>
        <span className="rounded bg-[#0a0a1a] px-1.5 py-0.5 text-[10px] text-white/30">
          {objectInfos.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {objectInfos.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-white/20">
            场景为空
            <br />
            <span className="text-[10px]">导入模型以开始编辑</span>
          </div>
        ) : (
          objectInfos.map((obj) => (
            <SceneItem
              key={obj.id}
              id={obj.id}
              name={obj.name}
              type={obj.type}
              visible={obj.visible}
              isSelected={obj.id === selectedObjectId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(SceneHierarchy);
