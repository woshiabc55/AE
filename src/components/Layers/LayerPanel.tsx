import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';

export default function LayerPanel() {
  const {
    project, selectedLayerId,
    addLayer, removeLayer, updateLayer,
    toggleLayerVisibility, toggleLayerLock,
    selectLayer, selectElement,
  } = useProjectStore();
  const leftPanelWidth = useUIStore((s) => s.leftPanelWidth);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const sortedLayers = [...project.layers].sort((a, b) => b.order - a.order);

  const handleAddLayer = () => {
    const idx = project.layers.length + 1;
    addLayer(`图层 ${idx}`);
  };

  const handleDeleteLayer = () => {
    if (selectedLayerId) removeLayer(selectedLayerId);
  };

  const handleLayerClick = (layerId: string) => {
    selectLayer(layerId);
    const layer = project.layers.find((l) => l.id === layerId);
    if (layer && layer.elementIds.length > 0) {
      selectElement(layer.elementIds[0]);
    } else {
      selectElement(null);
    }
  };

  const handleDoubleClick = (layerId: string, name: string) => {
    setEditingId(layerId);
    setEditValue(name);
  };

  const handleNameBlur = (layerId: string) => {
    setEditingId(null);
    if (editValue.trim()) updateLayer(layerId, { name: editValue.trim() });
  };

  const handleNameKeyDown = (e: React.KeyboardEvent, layerId: string) => {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div
      className="flex flex-col bg-[#1a1d27] border-r border-white/10 select-none"
      style={{ width: leftPanelWidth }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-white/10 shrink-0">
        <span className="text-xs font-medium text-gray-300">图层</span>
        <div className="flex items-center gap-1">
          <button
            title="添加图层"
            onClick={handleAddLayer}
            className="p-1 rounded text-gray-400 hover:text-[#00e5ff] hover:bg-white/10 transition-colors"
          >
            <Plus size={14} />
          </button>
          <button
            title="删除图层"
            onClick={handleDeleteLayer}
            disabled={!selectedLayerId}
            className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 图层列表 */}
      <div className="flex-1 overflow-y-auto">
        {sortedLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const isEditing = editingId === layer.id;

          return (
            <div
              key={layer.id}
              onClick={() => handleLayerClick(layer.id)}
              className={`flex items-center gap-2 px-2 h-8 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#00e5ff]/10 border-l-2 border-[#00e5ff]'
                  : 'border-l-2 border-transparent hover:bg-white/5'
              }`}
            >
              {/* 颜色标签 */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: layer.colorTag }}
              />

              {/* 图层名称 */}
              {isEditing ? (
                <input
                  className="flex-1 bg-transparent text-white text-xs outline-none border-b border-[#00e5ff] min-w-0"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleNameBlur(layer.id)}
                  onKeyDown={(e) => handleNameKeyDown(e, layer.id)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className={`flex-1 text-xs truncate min-w-0 ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleDoubleClick(layer.id, layer.name);
                  }}
                >
                  {layer.name}
                </span>
              )}

              {/* 可见性切换 */}
              <button
                title={layer.visible ? '隐藏' : '显示'}
                onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                className="p-0.5 rounded text-gray-500 hover:text-white transition-colors"
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              {/* 锁定切换 */}
              <button
                title={layer.locked ? '解锁' : '锁定'}
                onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                className="p-0.5 rounded text-gray-500 hover:text-white transition-colors"
              >
                {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          );
        })}

        {sortedLayers.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-600">
            暂无图层
          </div>
        )}
      </div>
    </div>
  );
}
