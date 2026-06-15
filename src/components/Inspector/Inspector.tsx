import { useProjectStore } from "@/store/useProjectStore";
import { FACIAL_PRESETS } from "@/engine/facialPresets";
import { Palette, Trash2, Type } from "lucide-react";
import { formatTimeShort } from "@/utils/time";

export default function Inspector() {
  const {
    project,
    selectedAnnotationId,
    updateAnnotation,
    removeAnnotation,
    setTheme,
  } = useProjectStore();
  const ann = project.annotations.find((a) => a.id === selectedAnnotationId);
  const theme = project.theme;

  return (
    <aside className="w-80 border-l border-line bg-panel/60 p-3 flex flex-col gap-3 overflow-y-auto animate-fade-in">
      <section className="panel p-3">
        <div className="label-cap mb-2 flex items-center gap-1.5">
          <Palette size={11} />
          THEME · 主题
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-dim mb-1">主色 (骨骼)</div>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={theme.primary}
                onChange={(e) => setTheme({ primary: e.target.value })}
                className="w-7 h-7 rounded border border-line bg-transparent cursor-pointer"
              />
              <span className="text-[10px] tabular text-mute">{theme.primary}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-dim mb-1">强调 (面部)</div>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={theme.accent}
                onChange={(e) => setTheme({ accent: e.target.value })}
                className="w-7 h-7 rounded border border-line bg-transparent cursor-pointer"
              />
              <span className="text-[10px] tabular text-mute">{theme.accent}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-dim mb-1">字体</div>
            <select
              value={theme.font}
              onChange={(e) => setTheme({ font: e.target.value as any })}
              className="input w-full"
            >
              <option value="Inter">Inter</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
            </select>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-dim mb-1">角标文字</div>
            <input
              value={theme.brand}
              onChange={(e) => setTheme({ brand: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>
      </section>

      <section className="panel p-3">
        <div className="label-cap mb-2 flex items-center gap-1.5">
          <Type size={11} />
          INSPECTOR · 检查器
        </div>
        {!ann ? (
          <p className="text-xs text-dim py-3 text-center">未选中任何注释</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div>
              <div className="text-[10px] text-dim mb-1">类型</div>
              <div className="chip">
                {ann.kind === "bone" ? "骨骼注释" : "面部控制点"}
              </div>
            </div>
            {ann.kind === "bone" ? (
              <>
                <div>
                  <div className="text-[10px] text-dim mb-1">标签</div>
                  <input
                    value={ann.label}
                    onChange={(e) =>
                      updateAnnotation(ann.id, { label: e.target.value } as any)
                    }
                    className="input w-full"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-dim mb-1">颜色</div>
                  <input
                    type="color"
                    value={(ann as any).color || "#7CFFB2"}
                    onChange={(e) =>
                      updateAnnotation(ann.id, { color: e.target.value } as any)
                    }
                    className="w-7 h-7 rounded border border-line bg-transparent"
                  />
                </div>
              </>
            ) : (
              <div>
                <div className="text-[10px] text-dim mb-1">面部控制点</div>
                <select
                  value={ann.control}
                  onChange={(e) =>
                    updateAnnotation(ann.id, {
                      control: e.target.value as any,
                    } as any)
                  }
                  className="input w-full"
                >
                  {Object.entries(FACIAL_PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.group} · {v.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-dim mb-1">时间</div>
                <div className="input w-full tabular flex items-center">
                  {formatTimeShort(ann.t)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-dim mb-1">坐标</div>
                <div className="input w-full tabular flex items-center text-mute text-[10px]">
                  {(ann.x * 100).toFixed(0)}, {(ann.y * 100).toFixed(0)}
                </div>
              </div>
            </div>

            <button
              onClick={() => removeAnnotation(ann.id)}
              className="btn h-7 text-rose border-rose/30 hover:border-rose hover:bg-rose/5 justify-center"
            >
              <Trash2 size={12} /> 删除此注释
            </button>
          </div>
        )}
      </section>
    </aside>
  );
}
