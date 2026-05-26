import { useEditorStore } from '@/store/editorStore';
import PanelSection from './PanelSection';

export default function MaterialPanel() {
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const objects = useEditorStore((s) => s.objects);
  const updateMaterial = useEditorStore((s) => s.updateMaterial);

  const obj = objects.find((o) => o.id === selectedObjectId);

  if (!obj) {
    return (
      <PanelSection title="材质" defaultOpen={true}>
        <p className="py-2 text-center text-xs text-white/20">未选中对象</p>
      </PanelSection>
    );
  }

  const m = obj.material;

  return (
    <PanelSection title="材质" defaultOpen={true}>
      <div className="space-y-3">
        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            基础颜色
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={m.baseColor}
              onChange={(e) => updateMaterial(obj.id, { baseColor: e.target.value })}
              className="h-7 w-10 cursor-pointer rounded border border-[#0f3460]/60 bg-transparent"
            />
            <span className="font-mono text-[10px] text-white/40">{m.baseColor}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              金属度
            </span>
            <span className="font-mono text-[10px] text-white/40">{m.metalness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={m.metalness}
            onChange={(e) => updateMaterial(obj.id, { metalness: parseFloat(e.target.value) })}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#0f3460] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4aa]"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              粗糙度
            </span>
            <span className="font-mono text-[10px] text-white/40">{m.roughness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={m.roughness}
            onChange={(e) => updateMaterial(obj.id, { roughness: parseFloat(e.target.value) })}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#0f3460] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4aa]"
          />
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            发光颜色
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={m.emissiveColor}
              onChange={(e) => updateMaterial(obj.id, { emissiveColor: e.target.value })}
              className="h-7 w-10 cursor-pointer rounded border border-[#0f3460]/60 bg-transparent"
            />
            <span className="font-mono text-[10px] text-white/40">{m.emissiveColor}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              发光强度
            </span>
            <span className="font-mono text-[10px] text-white/40">
              {m.emissiveIntensity.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={m.emissiveIntensity}
            onChange={(e) =>
              updateMaterial(obj.id, { emissiveIntensity: parseFloat(e.target.value) })
            }
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#0f3460] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4aa]"
          />
        </div>
      </div>
    </PanelSection>
  );
}
