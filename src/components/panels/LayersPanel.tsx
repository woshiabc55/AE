import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, FolderOpen } from "lucide-react";
import { useProjectStore, uid } from "@/store/projectStore";
import type { Shape, ShapeGroup } from "@/types";
import { cn } from "@/lib/utils";

const GROUP_PALETTE = ["#FF7AB6", "#FFD66B", "#7CE3B5", "#7CC0FF", "#FF8B5C", "#C7A8FF"];

export default function LayersPanel() {
  const project = useProjectStore((s) => s.project);
  const selectedId = useProjectStore((s) => s.selectedShapeId);
  const selectedGroup = useProjectStore((s) => s.selectedGroupId);
  const addGroup = useProjectStore((s) => s.addGroup);
  const updateGroup = useProjectStore((s) => s.updateGroup);
  const deleteGroup = useProjectStore((s) => s.deleteGroup);
  const setSelectedGroup = useProjectStore((s) => s.setSelectedGroup);
  const selectShape = useProjectStore((s) => s.selectShape);
  const updateShape = useProjectStore((s) => s.updateShape);
  const deleteShape = useProjectStore((s) => s.deleteShape);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddGroup = () => {
    const id = uid();
    addGroup({ id, name: `分组 ${project.groups.length + 1}`, parentId: null, color: GROUP_PALETTE[project.groups.length % GROUP_PALETTE.length], visible: true });
  };

  return (
    <div className="panel p-3 w-72 flex flex-col gap-2 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="label-cap">图层 / 分组</div>
        <button onClick={handleAddGroup} className="btn-ghost py-1 px-2 text-xs">
          <Plus className="w-3.5 h-3.5" /> 新分组
        </button>
      </div>
      <div className="flex-1 overflow-y-auto -mx-1 px-1 flex flex-col gap-1">
        {project.groups.length === 0 && (
          <div className="text-center text-mist-300 text-xs py-6 px-3">
            还没有分组。在画布上画出形状时会自动创建分组。
          </div>
        )}
        {project.groups.map((g) => (
          <GroupRow
            key={g.id}
            group={g}
            selected={selectedGroup === g.id}
            shapes={project.shapes.filter((s) => s.parentId === g.id)}
            onClick={() => setSelectedGroup(g.id)}
            onUpdate={(p) => updateGroup(g.id, p)}
            onDelete={() => deleteGroup(g.id)}
            onSelectShape={(id) => selectShape(id)}
            onUpdateShape={(id, p) => updateShape(id, p)}
            onDeleteShape={(id) => deleteShape(id)}
            selectedShapeId={selectedId}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </div>
      <div className="text-[10px] font-mono text-mist-300 flex justify-between border-t border-mist-100/5 pt-2">
        <span>{project.shapes.length} shapes</span>
        <span>{project.groups.length} groups</span>
      </div>
    </div>
  );
}

function GroupRow({
  group,
  selected,
  shapes,
  onClick,
  onUpdate,
  onDelete,
  onSelectShape,
  onUpdateShape,
  onDeleteShape,
  selectedShapeId,
  editingId,
  setEditingId,
}: {
  group: ShapeGroup;
  selected: boolean;
  shapes: Shape[];
  onClick: () => void;
  onUpdate: (p: Partial<ShapeGroup>) => void;
  onDelete: () => void;
  onSelectShape: (id: string) => void;
  onUpdateShape: (id: string, p: Partial<Shape>) => void;
  onDeleteShape: (id: string) => void;
  selectedShapeId: string | null;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={cn("rounded-xl border", selected ? "border-sakura-400/40 bg-sakura-400/5" : "border-mist-100/5 bg-ink-800/40")}>
      <div className="flex items-center gap-1 p-1.5">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-5 h-5 flex items-center justify-center text-mist-300 hover:text-sakura-300"
        >
          {expanded ? "▾" : "▸"}
        </button>
        <div
          className="w-3 h-3 rounded"
          style={{ background: group.color }}
          onClick={onClick}
        />
        {editingId === group.id ? (
          <input
            autoFocus
            defaultValue={group.name}
            onBlur={(e) => {
              onUpdate({ name: e.target.value });
              setEditingId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditingId(null);
            }}
            className="input flex-1 py-0.5 text-xs"
          />
        ) : (
          <span
            className="flex-1 text-sm font-display font-bold text-mist-50 cursor-pointer"
            onDoubleClick={() => setEditingId(group.id)}
            onClick={onClick}
          >
            {group.name}
          </span>
        )}
        <button
          onClick={() => onUpdate({ visible: !group.visible })}
          className="w-6 h-6 flex items-center justify-center text-mist-300 hover:text-mist-50"
        >
          {group.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center text-mist-300 hover:text-flame"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {expanded && (
        <div className="ml-7 border-t border-mist-100/5 py-1 flex flex-col">
          {shapes.length === 0 ? (
            <div className="text-[10px] font-mono text-mist-300 px-2 py-1">空</div>
          ) : (
            shapes.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectShape(s.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 cursor-pointer text-xs rounded",
                  selectedShapeId === s.id ? "bg-butter-400/20 text-butter-300" : "text-mist-200 hover:bg-ink-600/40"
                )}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                <span className="flex-1 truncate">{s.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateShape(s.id, { visible: !s.visible });
                  }}
                  className="w-4 h-4 flex items-center justify-center text-mist-300 hover:text-mist-50"
                >
                  {s.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteShape(s.id);
                  }}
                  className="w-4 h-4 flex items-center justify-center text-mist-300 hover:text-flame"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
