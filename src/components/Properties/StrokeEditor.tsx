import { useProjectStore } from '../../store/useProjectStore';
import type { SVGElement, StrokeStyle } from '../../types';

const inputCls = 'bg-[#0f1117] border border-[#2a2d37] rounded px-2 py-1 text-xs text-white focus:border-[#00e5ff] outline-none w-full';
const linecaps: StrokeStyle['linecap'][] = ['butt', 'round', 'square'];

interface Props {
  element: SVGElement;
}

export default function StrokeEditor({ element }: Props) {
  const updateElementStroke = useProjectStore((s) => s.updateElementStroke);
  const { stroke } = element;

  const update = (partial: Partial<StrokeStyle>) => {
    updateElementStroke(element.id, partial);
  };

  const handleColorChange = (color: string) => {
    update({ color });
  };

  const handleWidthChange = (width: number) => {
    update({ width: Math.max(0, width) });
  };

  const handleOpacityChange = (opacity: number) => {
    update({ opacity: Math.max(0, Math.min(1, opacity)) });
  };

  const handleLinecapChange = (linecap: StrokeStyle['linecap']) => {
    update({ linecap });
  };

  return (
    <div className="space-y-2">
      {/* 描边颜色 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">颜色</span>
        <div className="flex items-center gap-1.5 flex-1">
          <label className="relative cursor-pointer shrink-0">
            <span
              className="block w-6 h-6 rounded border border-[#2a2d37]"
              style={{ backgroundColor: stroke.color }}
            />
            <input
              type="color"
              value={stroke.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          <input
            type="text"
            value={stroke.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className={inputCls}
            maxLength={7}
          />
        </div>
      </div>

      {/* 描边宽度 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">宽度</span>
        <input
          type="number"
          min={0}
          step={1}
          value={stroke.width}
          onChange={(e) => handleWidthChange(Number(e.target.value))}
          className={inputCls}
        />
      </div>

      {/* 不透明度 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">透明</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(stroke.opacity * 100)}
          onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
          className="flex-1 h-1 accent-[#00e5ff]"
        />
        <span className="text-[10px] text-gray-400 w-8 text-right">
          {Math.round(stroke.opacity * 100)}%
        </span>
      </div>

      {/* Linecap */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 w-8 shrink-0">端点</span>
        <div className="flex gap-1">
          {linecaps.map((cap) => (
            <button
              key={cap}
              title={cap}
              onClick={() => handleLinecapChange(cap)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                stroke.linecap === cap
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                  : 'bg-[#0f1117] text-gray-400 border border-[#2a2d37] hover:border-[#00e5ff]/40'
              }`}
            >
              {cap === 'butt' ? '平' : cap === 'round' ? '圆' : '方'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
