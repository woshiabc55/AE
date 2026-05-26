import { useEditorStore } from '@/store/editorStore';
import PanelSection from './PanelSection';
import NumberInput from './NumberInput';

export default function LightingPanel() {
  const ambientIntensity = useEditorStore((s) => s.ambientIntensity);
  const directionalLightDir = useEditorStore((s) => s.directionalLightDir);
  const directionalLightColor = useEditorStore((s) => s.directionalLightColor);
  const directionalLightIntensity = useEditorStore((s) => s.directionalLightIntensity);
  const setAmbientIntensity = useEditorStore((s) => s.setAmbientIntensity);
  const setDirectionalLightDir = useEditorStore((s) => s.setDirectionalLightDir);
  const setDirectionalLightColor = useEditorStore((s) => s.setDirectionalLightColor);
  const setDirectionalLightIntensity = useEditorStore((s) => s.setDirectionalLightIntensity);

  return (
    <PanelSection title="环境光照" defaultOpen={false}>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              环境光强度
            </span>
            <span className="font-mono text-[10px] text-white/40">
              {ambientIntensity.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={ambientIntensity}
            onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#0f3460] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4aa]"
          />
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            方向光角度
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <NumberInput
              label="X"
              value={directionalLightDir[0]}
              onChange={(v) =>
                setDirectionalLightDir([v, directionalLightDir[1], directionalLightDir[2]])
              }
              step={1}
            />
            <NumberInput
              label="Y"
              value={directionalLightDir[1]}
              onChange={(v) =>
                setDirectionalLightDir([directionalLightDir[0], v, directionalLightDir[2]])
              }
              step={1}
            />
            <NumberInput
              label="Z"
              value={directionalLightDir[2]}
              onChange={(v) =>
                setDirectionalLightDir([directionalLightDir[0], directionalLightDir[1], v])
              }
              step={1}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            方向光颜色
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={directionalLightColor}
              onChange={(e) => setDirectionalLightColor(e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-[#0f3460]/60 bg-transparent"
            />
            <span className="font-mono text-[10px] text-white/40">{directionalLightColor}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              方向光强度
            </span>
            <span className="font-mono text-[10px] text-white/40">
              {directionalLightIntensity.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={directionalLightIntensity}
            onChange={(e) => setDirectionalLightIntensity(parseFloat(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#0f3460] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4aa]"
          />
        </div>
      </div>
    </PanelSection>
  );
}
