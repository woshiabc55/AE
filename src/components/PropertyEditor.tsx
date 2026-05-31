import { usePromptStore } from '@/store/usePromptStore';
import { presetModules } from '@/data/presets';
import { CATEGORY_LABELS } from '@/types';
import type { ModuleCategory } from '@/types';
import {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type, X,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type,
};

export default function PropertyEditor() {
  const { selectedBlockId, canvasBlocks, updateBlock, selectBlock } = usePromptStore();
  const block = canvasBlocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <div className="w-72 flex-shrink-0 border-l border-[#1a1a2e] bg-[#0d0d18] flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-[#12121f] border border-[#1a1a2e] flex items-center justify-center mx-auto mb-3">
              <Grid3x3 size={20} className="text-[#2a2a4e]" />
            </div>
            <p className="text-xs text-[#4a4a6a]">选中画布上的模块</p>
            <p className="text-[10px] text-[#3a3a5a] mt-1">编辑属性和权重</p>
          </div>
        </div>
      </div>
    );
  }

  const module = presetModules.find((m) => m.id === block.moduleId);
  if (!module) return null;

  const IconComp = iconMap[module.icon];

  return (
    <div className="w-72 flex-shrink-0 border-l border-[#1a1a2e] bg-[#0d0d18] flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-[#1a1a2e] flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#00ffd5] tracking-wider uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          属性编辑
        </h3>
        <button
          onClick={() => selectBlock(null)}
          className="text-[#4a4a6a] hover:text-[#c0c0d0] transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12121f] border border-[#1a1a2e]">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${module.color}15`, boxShadow: `0 0 10px ${module.color}25` }}
          >
            {IconComp && <IconComp size={20} color={module.color} />}
          </div>
          <div>
            <p className="text-sm font-medium text-[#e0e0f0]">{module.name}</p>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${module.color}15`, color: module.color }}
            >
              {CATEGORY_LABELS[module.category as ModuleCategory]}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-[#6a6a8a] uppercase tracking-wider mb-1.5">
            权重
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={block.weight}
              onChange={(e) => updateBlock(block.id, { weight: parseFloat(e.target.value) })}
              className="flex-1 accent-[#00ffd5] h-1 bg-[#1a1a2e] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ffd5]
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,255,213,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-xs font-mono text-[#00ffd5] w-8 text-right">
              {block.weight.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-[#3a3a5a]">弱化</span>
            <span className="text-[9px] text-[#3a3a5a]">强化</span>
          </div>
        </div>

        {module.variants.length > 0 && (
          <div>
            <label className="block text-[10px] text-[#6a6a8a] uppercase tracking-wider mb-1.5">
              预设变体
            </label>
            <div className="flex flex-wrap gap-1">
              {module.variants.map((variant) => (
                <button
                  key={variant}
                  onClick={() => updateBlock(block.id, { selectedVariant: variant, customText: '' })}
                  className={`px-2 py-1 rounded-lg text-[10px] transition-all ${
                    block.selectedVariant === variant && !block.customText
                      ? 'bg-[#00ffd5]/20 text-[#00ffd5] border border-[#00ffd5]/30 shadow-[0_0_6px_rgba(0,255,213,0.15)]'
                      : 'bg-[#12121f] text-[#8a8aaa] border border-[#1a1a2e] hover:border-[#2a2a4e]'
                  }`}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] text-[#6a6a8a] uppercase tracking-wider mb-1.5">
            自定义文本
          </label>
          <textarea
            value={block.customText}
            onChange={(e) => updateBlock(block.id, { customText: e.target.value })}
            placeholder="输入自定义描述文本..."
            rows={3}
            className="w-full bg-[#12121f] border border-[#1a1a2e] rounded-lg px-3 py-2 text-xs text-[#c0c0d0] placeholder-[#4a4a6a] focus:outline-none focus:border-[#00ffd5]/50 focus:shadow-[0_0_8px_rgba(0,255,213,0.15)] transition-all resize-none"
          />
        </div>

        <div className="p-2.5 rounded-lg bg-[#12121f] border border-[#1a1a2e]">
          <p className="text-[10px] text-[#4a4a6a] mb-1">当前输出</p>
          <p className="text-[11px] text-[#c0c0d0] font-mono">
            {block.weight !== 1.0
              ? `(${block.customText || block.selectedVariant || module.name}:${block.weight.toFixed(1)})`
              : block.customText || block.selectedVariant || module.name}
          </p>
        </div>
      </div>
    </div>
  );
}
