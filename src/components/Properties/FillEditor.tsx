import { useProjectStore } from '../../store/useProjectStore';
import type { SVGElement, FillStyle } from '../../types';

const inputCls = 'bg-[#0f1117] border border-[#2a2d37] rounded px-2 py-1 text-xs text-white focus:border-[#00e5ff] outline-none w-full';

interface Props {
  element: SVGElement;
}

export default function FillEditor({ element }: Props) {
  const updateElementFill = useProjectStore((s) => s.updateElementFill);
  const { fill } = element;

  const update = (partial: Partial<FillStyle>) => {
    updateElementFill(element.id, partial);
  };

  const handleColorChange = (color: string) => {
    update({ color });
  };

  const handleOpacityChange = (opacity: number) => {
    update({ opacity: Math.max(0, Math.min(1, opacity)) });
  };

  const handleTypeChange = (type: FillStyle['type']) => {
    update({ type });
  };

  return (
    <div className="space-y-2">
      {/* 填充类型 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">类型</span>
        <select
          value={fill.type}
          onChange={(e) => handleTypeChange(e.target.value as FillStyle['type'])}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="none">无</option>
          <option value="solid">纯色</option>
        </select>
      </div>

      {/* 颜色选择 */}
      {fill.type !== 'none' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-8 shrink-0">颜色</span>
          <div className="flex items-center gap-1.5 flex-1">
            <label className="relative cursor-pointer shrink-0">
              <span
                className="block w-6 h-6 rounded border border-[#2a2d37]"
                style={{ backgroundColor: fill.color }}
              />
              <input
                type="color"
                value={fill.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <input
              type="text"
              value={fill.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className={inputCls}
              maxLength={7}
            />
          </div>
        </div>
      )}

      {/* 不透明度 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">透明</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(fill.opacity * 100)}
          onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
          className="flex-1 h-1 accent-[#00e5ff]"
        />
        <span className="text-[10px] text-gray-400 w-8 text-right">
          {Math.round(fill.opacity * 100)}%
        </span>
      </div>
    </div>
  );
}
