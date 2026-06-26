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
      className="flex flex-col bg-[#15171f] select-none relative"
      style={{ width: leftPanelWidth }}
    >
      {/* 3D 右侧内嵌阴影 */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-[#0a0c14]" />
      <div className="absolute top-0 right-0 bottom-0 w-2 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)' }}
      />

      {/* 头部 - 3D 浮雕 */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="flex items-center justify-between px-3 h-9 border-b border-[#0a0c14] shrink-0">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">图层</span>
          <div className="flex items-center gap-0.5">
            <button
              title="添加图层"
              onClick={handleAddLayer}
              className="p-1 rounded text-gray-500 hover:text-[#00e5ff] hover:bg-white/[0.06] transition-colors"
            >
              <Plus size={13} />
            </button>
            <button
              title="删除图层"
              onClick={handleDeleteLayer}
              disabled={!selectedLayerId}
              className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/[0.06] transition-colors disabled:opacity-25 disabled:pointer-events-none"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 图层列表 - 深度压缩效果 */}
      <div className="flex-1 overflow-y-auto">
        {sortedLayers.map((layer, idx) => {
          const isSelected = layer.id === selectedLayerId;
          const isEditing = editingId === layer.id;
          // 深度压缩：越往下越暗
          const depthAlpha = 1 - Math.min(idx * 0.04, 0.2);

          return (
            <div
              key={layer.id}
              onClick={() => handleLayerClick(layer.id)}
              className={`flex items-center gap-2 px-2 h-9 cursor-pointer transition-all duration-150 relative ${
                isSelected
                  ? 'bg-[#00e5ff]/8'
                  : 'hover:bg-white/[0.03]'
              }`}
              style={{ opacity: depthAlpha }}
            >
              {/* 左侧选中条 - 3D 内嵌效果 */}
              {isSelected && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{
                    background: 'linear-gradient(to bottom, #00e5ff, #0088aa)',
                    boxShadow: '2px 0 4px rgba(0,229,255,0.2)',
                  }}
                />
              )}

              {/* 颜色标签 - 3D 球体效果 */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 relative"
                style={{
                  backgroundColor: layer.colorTag,
                  boxShadow: `0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              />

              {/* 图层名称 */}
              {isEditing ? (
                <input
                  className="flex-1 bg-[#0f1117] text-white text-[11px] outline-none border border-[#00e5ff]/40 rounded px-1.5 py-0.5 min-w-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleNameBlur(layer.id)}
                  onKeyDown={(e) => handleNameKeyDown(e, layer.id)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className={`flex-1 text-[11px] truncate min-w-0 ${
                    isSelected ? 'text-white' : 'text-gray-500'
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
                className={`p-0.5 rounded transition-colors ${
                  layer.visible ? 'text-gray-600 hover:text-gray-300' : 'text-gray-700'
                }`}
              >
                {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>

              {/* 锁定切换 */}
              <button
                title={layer.locked ? '解锁' : '锁定'}
                onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                className={`p-0.5 rounded transition-colors ${
                  layer.locked ? 'text-[#ff6b6b]/60' : 'text-gray-700 hover:text-gray-400'
                }`}
              >
                {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
              </button>
            </div>
          );
        })}

        {sortedLayers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-[10px] text-white/15 gap-1">
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <Plus size={10} />
            </div>
            使用工具创建图形
          </div>
        )}
      </div>
    </div>
  );
}
