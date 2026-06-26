import { memo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import PanelSection from './PanelSection';
import NumberInput from './NumberInput';

function TransformPanel() {
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const objects = useEditorStore((s) => s.objects);
  const updateTransform = useEditorStore((s) => s.updateTransform);

  const obj = objects.find((o) => o.id === selectedObjectId);

  if (!obj) {
    return (
      <PanelSection title="变换" defaultOpen={true}>
        <p className="py-2 text-center text-xs text-white/20">未选中对象</p>
      </PanelSection>
    );
  }

  const t = obj.transform;

  return (
    <PanelSection title="变换" defaultOpen={true}>
      <div className="space-y-3">
        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            位置
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <NumberInput
              label="X"
              value={t.position[0]}
              onChange={(v) =>
                updateTransform(obj.id, { position: [v, t.position[1], t.position[2]] })
              }
              step={0.1}
            />
            <NumberInput
              label="Y"
              value={t.position[1]}
              onChange={(v) =>
                updateTransform(obj.id, { position: [t.position[0], v, t.position[2]] })
              }
              step={0.1}
            />
            <NumberInput
              label="Z"
              value={t.position[2]}
              onChange={(v) =>
                updateTransform(obj.id, { position: [t.position[0], t.position[1], v] })
              }
              step={0.1}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            旋转
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <NumberInput
              label="X"
              value={t.rotation[0]}
              onChange={(v) =>
                updateTransform(obj.id, { rotation: [v, t.rotation[1], t.rotation[2]] })
              }
              step={1}
            />
            <NumberInput
              label="Y"
              value={t.rotation[1]}
              onChange={(v) =>
                updateTransform(obj.id, { rotation: [t.rotation[0], v, t.rotation[2]] })
              }
              step={1}
            />
            <NumberInput
              label="Z"
              value={t.rotation[2]}
              onChange={(v) =>
                updateTransform(obj.id, { rotation: [t.rotation[0], t.rotation[1], v] })
              }
              step={1}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
            缩放
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <NumberInput
              label="X"
              value={t.scale[0]}
              onChange={(v) =>
                updateTransform(obj.id, { scale: [v, t.scale[1], t.scale[2]] })
              }
              step={0.01}
              min={0.01}
            />
            <NumberInput
              label="Y"
              value={t.scale[1]}
              onChange={(v) =>
                updateTransform(obj.id, { scale: [t.scale[0], v, t.scale[2]] })
              }
              step={0.01}
              min={0.01}
            />
            <NumberInput
              label="Z"
              value={t.scale[2]}
              onChange={(v) =>
                updateTransform(obj.id, { scale: [t.scale[0], t.scale[1], v] })
              }
              step={0.01}
              min={0.01}
            />
          </div>
        </div>
      </div>
    </PanelSection>
  );
}

export default memo(TransformPanel);
