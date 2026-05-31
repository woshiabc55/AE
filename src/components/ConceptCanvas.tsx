import { usePromptStore } from '@/store/usePromptStore';
import { presetModules } from '@/data/presets';
import { CATEGORY_LABELS } from '@/types';
import type { CanvasBlock, ModuleCategory } from '@/types';
import {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type, GripVertical, ChevronUp, ChevronDown, X,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type,
};

function CanvasBlockCard({ block }: { block: CanvasBlock }) {
  const { selectedBlockId, selectBlock, removeBlock, reorderBlock } = usePromptStore();
  const module = presetModules.find((m) => m.id === block.moduleId);
  const isSelected = selectedBlockId === block.id;

  if (!module) return null;

  const IconComp = iconMap[module.icon];

  return (
    <div
      onClick={() => selectBlock(block.id)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#12121f] border-[#00ffd5]/40 shadow-[0_0_15px_rgba(0,255,213,0.12)]'
          : 'bg-[#0d0d18] border-[#1a1a2e] hover:border-[#2a2a4e] hover:bg-[#12121f]'
      }`}
    >
      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); reorderBlock(block.id, 'up'); }}
          className="text-[#4a4a6a] hover:text-[#00ffd5] transition-colors"
        >
          <ChevronUp size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); reorderBlock(block.id, 'down'); }}
          className="text-[#4a4a6a] hover:text-[#00ffd5] transition-colors"
        >
          <ChevronDown size={10} />
        </button>
      </div>

      <GripVertical size={14} className="text-[#2a2a4e] flex-shrink-0" />

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${module.color}15`, boxShadow: `0 0 8px ${module.color}20` }}
      >
        {IconComp && <IconComp size={16} color={module.color} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#e0e0f0] truncate">{module.name}</span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${module.color}15`,
              color: module.color,
            }}
          >
            {CATEGORY_LABELS[module.category as ModuleCategory]}
          </span>
        </div>
        <p className="text-[10px] text-[#6a6a8a] truncate mt-0.5">
          {block.customText || block.selectedVariant || module.description}
        </p>
      </div>

      {block.weight !== 1.0 && (
        <span className="text-[10px] text-[#ff6b35] font-mono flex-shrink-0">
          ×{block.weight.toFixed(1)}
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
        className="opacity-0 group-hover:opacity-100 text-[#4a4a6a] hover:text-[#f43f5e] transition-all flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ConceptCanvas() {
  const { canvasBlocks, selectBlock } = usePromptStore();
  const sorted = [...canvasBlocks].sort((a, b) => a.y - b.y);

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden"
      onClick={() => selectBlock(null)}
    >
      <div className="flex-1 overflow-y-auto p-4" style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)
        `,
        backgroundSize: '24px 24px',
      }}>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#12121f] border border-[#1a1a2e] flex items-center justify-center mb-4">
              <Sparkles size={32} className="text-[#2a2a4e]" />
            </div>
            <p className="text-sm text-[#4a4a6a] mb-1">画布为空</p>
            <p className="text-xs text-[#3a3a5a]">从左侧面板点击添加概念模块</p>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-2">
            {sorted.map((block) => (
              <CanvasBlockCard key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
