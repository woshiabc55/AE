// 图形配置与部件参数调节面板

import { useState } from "react";
import { SlidersHorizontal, Move, Film, Plus, Trash2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";
import { DEFAULT_TRANSFORM } from "@/engine/shapeUtils";
import type { Transform2D } from "@/types";

interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}

function RangeField({ label, value, min, max, step = 1, onChange, suffix }: RangeFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-ink-300 font-mono">{label}</span>
        <span className="text-[10px] text-ember-400 font-mono">
          {value.toFixed(step < 1 ? 1 : 0)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ember-500"
      />
    </div>
  );
}

export function ShapeConfigPanel() {
  const selectedShapeId = useUIStore((s) => s.selectedShapeId);
  const selectedPartId = useUIStore((s) => s.selectedPartId);

  const shapes = useArtworkStore((s) => s.shapes);
  const parts = useArtworkStore((s) => s.parts);
  const joints = useArtworkStore((s) => s.skeleton.joints);
  const bones = useArtworkStore((s) => s.skeleton.bones);
  const updateShape = useArtworkStore((s) => s.updateShape);
  const updatePart = useArtworkStore((s) => s.updatePart);
  const addOffsetKeyframe = useArtworkStore((s) => s.addOffsetKeyframe);
  const removeOffsetKeyframe = useArtworkStore((s) => s.removeOffsetKeyframe);
  const updateOffsetKeyframe = useArtworkStore((s) => s.updateOffsetKeyframe);
  const currentTime = useUIStore((s) => s.currentTime);

  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  const selectedPart = parts.find((p) => p.id === selectedPartId);
  const [offsetTab, setOffsetTab] = useState<keyof Transform2D>("x");

  if (!selectedShape && !selectedPart) {
    return (
      <div className="p-4 space-y-3 text-xs font-mono text-ink-300 leading-relaxed">
        <div className="bg-ink-900/60 rounded-lg p-3 border border-ink-600/40">
          <div className="text-ember-400 mb-2 font-pixel text-[10px]">图形模式</div>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li>选择左侧图形工具，在画布点击添加</li>
            <li>选中图形后在此调节参数</li>
            <li>将图形归入部件，统一控制偏移</li>
            <li>为部件添加动画偏移关键帧</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* 图形参数 */}
      {selectedShape && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-ember-500/30 space-y-3">
          <div className="flex items-center gap-2 text-[10px] text-ember-400 font-mono">
            <SlidersHorizontal size={12} />
            图形参数
          </div>
          <input
            value={selectedShape.name}
            onChange={(e) => updateShape(selectedShape.id, { name: e.target.value })}
            className="w-full bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-ember-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-ink-300 font-mono mb-1">填充</div>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={selectedShape.fill}
                  onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
                  className="w-7 h-7 rounded"
                />
                <input
                  type="text"
                  value={selectedShape.fill}
                  onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
                  className="flex-1 bg-ink-900 border border-ink-600 rounded px-1 py-0.5 text-[10px] font-mono text-ink-100 focus:outline-none focus:border-ember-500"
                />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-ink-300 font-mono mb-1">描边</div>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={selectedShape.stroke}
                  onChange={(e) => updateShape(selectedShape.id, { stroke: e.target.value })}
                  className="w-7 h-7 rounded"
                />
                <input
                  type="text"
                  value={selectedShape.stroke}
                  onChange={(e) => updateShape(selectedShape.id, { stroke: e.target.value })}
                  className="flex-1 bg-ink-900 border border-ink-600 rounded px-1 py-0.5 text-[10px] font-mono text-ink-100 focus:outline-none focus:border-ember-500"
                />
              </div>
            </div>
          </div>
          <RangeField
            label="不透明度"
            value={selectedShape.opacity}
            min={0}
            max={1}
            step={0.05}
            suffix=""
            onChange={(v) => updateShape(selectedShape.id, { opacity: v })}
          />
          <RangeField
            label="描边宽度"
            value={selectedShape.strokeWidth}
            min={0}
            max={3}
            step={0.5}
            suffix=""
            onChange={(v) => updateShape(selectedShape.id, { strokeWidth: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            <RangeField
              label="X"
              value={selectedShape.transform.x}
              min={0}
              max={31}
              step={0.5}
              onChange={(v) =>
                updateShape(selectedShape.id, { transform: { ...selectedShape.transform, x: v } })
              }
            />
            <RangeField
              label="Y"
              value={selectedShape.transform.y}
              min={0}
              max={31}
              step={0.5}
              onChange={(v) =>
                updateShape(selectedShape.id, { transform: { ...selectedShape.transform, y: v } })
              }
            />
          </div>
          <RangeField
            label="旋转"
            value={selectedShape.transform.rotation}
            min={-180}
            max={180}
            step={5}
            suffix="°"
            onChange={(v) =>
              updateShape(selectedShape.id, { transform: { ...selectedShape.transform, rotation: v } })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <RangeField
              label="缩放 X"
              value={selectedShape.transform.scaleX}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) =>
                updateShape(selectedShape.id, { transform: { ...selectedShape.transform, scaleX: v } })
              }
            />
            <RangeField
              label="缩放 Y"
              value={selectedShape.transform.scaleY}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) =>
                updateShape(selectedShape.id, { transform: { ...selectedShape.transform, scaleY: v } })
              }
            />
          </div>
          {(selectedShape.type === "rect" || selectedShape.type === "triangle") && (
            <div className="grid grid-cols-2 gap-2">
              <RangeField
                label="宽度"
                value={selectedShape.width}
                min={1}
                max={16}
                step={0.5}
                onChange={(v) => updateShape(selectedShape.id, { width: v })}
              />
              <RangeField
                label="高度"
                value={selectedShape.height}
                min={1}
                max={16}
                step={0.5}
                onChange={(v) => updateShape(selectedShape.id, { height: v })}
              />
            </div>
          )}
          {(selectedShape.type === "circle" || selectedShape.type === "polygon" || selectedShape.type === "star") && (
            <RangeField
              label="半径"
              value={selectedShape.radius}
              min={0.5}
              max={10}
              step={0.5}
              onChange={(v) => updateShape(selectedShape.id, { radius: v })}
            />
          )}
          {selectedShape.type === "polygon" && (
            <RangeField
              label="边数"
              value={selectedShape.sides}
              min={3}
              max={12}
              step={1}
              onChange={(v) => updateShape(selectedShape.id, { sides: Math.round(v) })}
            />
          )}
          {selectedShape.type === "star" && (
            <>
              <RangeField
                label="角数"
                value={selectedShape.points}
                min={3}
                max={12}
                step={1}
                onChange={(v) => updateShape(selectedShape.id, { points: Math.round(v) })}
              />
              <RangeField
                label="内半径比"
                value={selectedShape.innerRadius}
                min={0.1}
                max={0.9}
                step={0.05}
                onChange={(v) => updateShape(selectedShape.id, { innerRadius: v })}
              />
            </>
          )}
        </div>
      )}

      {/* 部件偏移参数 */}
      {selectedPart && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-mint-500/30 space-y-3">
          <div className="flex items-center gap-2 text-[10px] text-mint-400 font-mono">
            <Move size={12} />
            部件基础偏移
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RangeField
              label="偏移 X"
              value={selectedPart.baseOffset.x}
              min={-16}
              max={16}
              step={0.5}
              onChange={(v) =>
                updatePart(selectedPart.id, { baseOffset: { ...selectedPart.baseOffset, x: v } })
              }
            />
            <RangeField
              label="偏移 Y"
              value={selectedPart.baseOffset.y}
              min={-16}
              max={16}
              step={0.5}
              onChange={(v) =>
                updatePart(selectedPart.id, { baseOffset: { ...selectedPart.baseOffset, y: v } })
              }
            />
          </div>
          <RangeField
            label="旋转偏移"
            value={selectedPart.baseOffset.rotation}
            min={-180}
            max={180}
            step={5}
            suffix="°"
            onChange={(v) =>
              updatePart(selectedPart.id, { baseOffset: { ...selectedPart.baseOffset, rotation: v } })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <RangeField
              label="缩放 X"
              value={selectedPart.baseOffset.scaleX}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) =>
                updatePart(selectedPart.id, { baseOffset: { ...selectedPart.baseOffset, scaleX: v } })
              }
            />
            <RangeField
              label="缩放 Y"
              value={selectedPart.baseOffset.scaleY}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) =>
                updatePart(selectedPart.id, { baseOffset: { ...selectedPart.baseOffset, scaleY: v } })
              }
            />
          </div>

          <div className="border-t border-ink-600/40 pt-3">
            <div className="flex items-center gap-2 text-[10px] text-sun-500 font-mono mb-2">
              <Film size={12} />
              动画偏移关键帧
            </div>
            <div className="flex gap-1 mb-2">
              {(["x", "y", "rotation", "scaleX", "scaleY"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setOffsetTab(k)}
                  className={cn(
                    "flex-1 py-1 rounded text-[9px] font-mono border transition-all",
                    offsetTab === k
                      ? "bg-sun-500/20 border-sun-500 text-sun-500"
                      : "bg-ink-700 border-ink-600 text-ink-300 hover:bg-ink-600",
                  )}
                >
                  {k === "rotation" ? "角度" : k === "scaleX" ? "缩X" : k === "scaleY" ? "缩Y" : k.toUpperCase()}
                </button>
              ))}
            </div>
            <PixelButton
              variant="primary"
              size="sm"
              className="w-full mb-2"
              onClick={() =>
                addOffsetKeyframe(selectedPart.id, currentTime, { ...DEFAULT_TRANSFORM, [offsetTab]: selectedPart.baseOffset[offsetTab] })
              }
            >
              <span className="flex items-center justify-center gap-1.5">
                <Plus size={12} />
                录制 @ {(currentTime * 100).toFixed(0)}%
              </span>
            </PixelButton>
            <div className="space-y-1 max-h-36 overflow-auto">
              {[...selectedPart.offsetKeyframes]
                .sort((a, b) => a.time - b.time)
                .map((kf) => (
                  <div
                    key={kf.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-ink-600/40 bg-ink-900/40"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-ink-300 font-mono">
                        {(kf.time * 100).toFixed(0)}%
                      </span>
                      <input
                        type="number"
                        min={-100}
                        max={100}
                        step={offsetTab === "rotation" ? 5 : 0.5}
                        value={Number(kf.offset[offsetTab]).toFixed(offsetTab === "rotation" ? 0 : 1)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          updateOffsetKeyframe(selectedPart.id, kf.id, {
                            offset: { ...kf.offset, [offsetTab]: v },
                          });
                        }}
                        className="w-14 bg-ink-900 border border-ink-600 rounded px-1 py-0.5 text-[10px] font-mono text-ink-100 focus:outline-none focus:border-sun-500"
                      />
                    </div>
                    <button
                      onClick={() => removeOffsetKeyframe(selectedPart.id, kf.id)}
                      className="text-ink-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="border-t border-ink-600/40 pt-3">
            <div className="text-[10px] text-ink-300 font-mono mb-1">绑定到骨骼/关节</div>
            <div className="space-y-1">
              <select
                value={selectedPart.boneId ?? ""}
                onChange={(e) => updatePart(selectedPart.id, { boneId: e.target.value || undefined, jointId: undefined })}
                className="w-full bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-mint-500"
              >
                <option value="">不绑定骨骼</option>
                {bones.map((b) => {
                  const from = joints.find((j) => j.id === b.fromJointId);
                  const to = joints.find((j) => j.id === b.toJointId);
                  return (
                    <option key={b.id} value={b.id}>
                      {from?.name ?? "?"} → {to?.name ?? "?"}
                    </option>
                  );
                })}
              </select>
              <select
                value={selectedPart.jointId ?? ""}
                onChange={(e) => updatePart(selectedPart.id, { jointId: e.target.value || undefined, boneId: undefined })}
                className="w-full bg-ink-900 border border-ink-600 rounded px-2 py-1 text-xs font-mono text-ink-100 focus:outline-none focus:border-mint-500"
              >
                <option value="">不绑定关节</option>
                {joints.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
