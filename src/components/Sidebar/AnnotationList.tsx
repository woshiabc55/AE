import { Bone, Smile, Trash2, Plus } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { formatTimeShort } from "@/utils/time";
import { FACIAL_PRESETS, FACIAL_GROUPS } from "@/engine/facialPresets";
import { createBoneAnnotation, createFacialAnnotation } from "@/engine/annotations";
import type { FacialControl } from "@/types";

export default function AnnotationList() {
  const {
    project,
    currentTime,
    setCurrentTime,
    removeAnnotation,
    addAnnotation,
    selectedAnnotationId,
    selectAnnotation,
    tool,
  } = useProjectStore();

  const sorted = project.annotations.slice().sort((a, b) => a.t - b.t);

  return (
    <section className="panel p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="label-cap">
          ANNOTATIONS · 注释 · {project.annotations.length}
        </div>
        <div className="flex gap-1">
          <button
            className="btn btn-ghost h-6 px-1.5"
            onClick={() =>
              addAnnotation(
                createBoneAnnotation({
                  x: 0.5,
                  y: 0.5,
                  t: currentTime,
                  label: "BONE_" + (project.annotations.length + 1),
                })
              )
            }
            title="在当前时间添加骨骼注释"
          >
            <Bone size={12} />
            <Plus size={10} />
          </button>
        </div>
      </div>

      {/* 面部预设快速添加 */}
      <div className="mb-3">
        <div className="label-cap mb-1.5 text-[9px]">FACIAL PRESETS · 面部点位</div>
        <div className="flex flex-col gap-2">
          {FACIAL_GROUPS.map((group) => (
            <div key={group}>
              <div className="text-[10px] text-dim mb-1">{group}</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(FACIAL_PRESETS)
                  .filter(([, v]) => v.group === group)
                  .map(([key, v]) => {
                    const active = tool === "facial";
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          addAnnotation(
                            createFacialAnnotation(
                              key as FacialControl,
                              0.5,
                              0.5,
                              currentTime
                            )
                          )
                        }
                        className={`chip ${
                          active
                            ? "border-rose/40 text-rose bg-rose/5"
                            : "hover:border-rose/30 hover:text-rose"
                        }`}
                        title={v.label}
                      >
                        {v.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 列表 */}
      {sorted.length === 0 ? (
        <p className="text-xs text-dim py-3 text-center">还没有注释</p>
      ) : (
        <ul className="flex flex-col gap-1 max-h-[260px] overflow-y-auto">
          {sorted.map((a) => {
            const isBone = a.kind === "bone";
            const isActive = selectedAnnotationId === a.id;
            const name = isBone
              ? a.label
              : (FACIAL_PRESETS[a.control]?.label || a.control);
            return (
              <li
                key={a.id}
                onClick={() => {
                  selectAnnotation(a.id);
                  setCurrentTime(a.t);
                }}
                className={`group flex items-center gap-2 rounded border px-2 py-1.5 cursor-pointer transition ${
                  isActive
                    ? "border-mint bg-mint/5"
                    : "border-line bg-panel2/60 hover:border-mute"
                }`}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isBone
                      ? "rgba(124,255,178,0.12)"
                      : "rgba(255,93,162,0.12)",
                    color: isBone ? "#7CFFB2" : "#FF5DA2",
                  }}
                >
                  {isBone ? <Bone size={11} /> : <Smile size={11} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-fg truncate">{name}</div>
                  <div className="text-[10px] tabular text-mute">
                    {formatTimeShort(a.t)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAnnotation(a.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-dim hover:text-rose transition"
                >
                  <Trash2 size={11} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
