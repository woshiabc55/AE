import { useProjectStore } from '../../store/useProjectStore';
import type { SVGElement, Transform } from '../../types';

const inputCls = 'bg-[#0f1117] border border-[#2a2d37] rounded px-2 py-1 text-xs text-white focus:border-[#00e5ff] outline-none w-full';

interface Props {
  element: SVGElement;
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-500 w-4 shrink-0">{label}</span>
      <div className="relative flex-1">
        <input
          type="number"
          value={Math.round(value * 100) / 100}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className={suffix ? `${inputCls} pr-4` : inputCls}
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TransformEditor({ element }: Props) {
  const updateElementTransform = useProjectStore((s) => s.updateElementTransform);
  const { transform, attrs } = element;

  const update = (partial: Partial<Transform>) => {
    updateElementTransform(element.id, partial);
  };

  const baseWidth = Number(attrs.width) || 0;
  const baseHeight = Number(attrs.height) || 0;

  const displayWidth = baseWidth * transform.scaleX;
  const displayHeight = baseHeight * transform.scaleY;

  const handleSizeChange = (dim: 'width' | 'height', val: number) => {
    const base = dim === 'width' ? baseWidth : baseHeight;
    if (base === 0) return;
    const scale = val / base;
    update(dim === 'width' ? { scaleX: scale } : { scaleY: scale });
  };

  return (
    <div className="space-y-2">
      {/* 位置 */}
      <div className="grid grid-cols-2 gap-1.5">
        <NumberField label="X" value={transform.translateX} onChange={(v) => update({ translateX: v })} />
        <NumberField label="Y" value={transform.translateY} onChange={(v) => update({ translateY: v })} />
      </div>

      {/* 尺寸 */}
      <div className="grid grid-cols-2 gap-1.5">
        <NumberField label="W" value={displayWidth} onChange={(v) => handleSizeChange('width', v)} step={0.1} />
        <NumberField label="H" value={displayHeight} onChange={(v) => handleSizeChange('height', v)} step={0.1} />
      </div>

      {/* 旋转 */}
      <NumberField
        label="R"
        value={transform.rotate}
        onChange={(v) => update({ rotate: v })}
        suffix="°"
      />

      {/* 倾斜 */}
      <div className="grid grid-cols-2 gap-1.5">
        <NumberField label="SkX" value={transform.skewX} onChange={(v) => update({ skewX: v })} suffix="°" />
        <NumberField label="SkY" value={transform.skewY} onChange={(v) => update({ skewY: v })} suffix="°" />
      </div>
    </div>
  );
}
