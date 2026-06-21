// 模式切换器

import { Pencil, Bone, Film } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import type { WorkMode } from "@/types";
import { cn } from "@/lib/utils";

const MODES: Array<{ id: WorkMode; icon: typeof Pencil; label: string; desc: string }> = [
  { id: "draw", icon: Pencil, label: "绘制", desc: "半面镜像绘制拼豆" },
  { id: "rig", icon: Bone, label: "骨架", desc: "绑定骨骼与权重" },
  { id: "animate", icon: Film, label: "动画", desc: "录制关键帧播放" },
];

export function ModeSwitcher() {
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);
  const jointCount = useArtworkStore((s) => s.skeleton.joints.length);
  const boneCount = useArtworkStore((s) => s.skeleton.bones.length);
  const kfCount = useArtworkStore((s) => s.keyframes.length);

  return (
    <div className="flex items-center gap-1 bg-ink-900/80 p-1 rounded-xl border border-ink-600/60">
      {MODES.map(({ id, icon: Icon, label, desc }) => {
        const active = mode === id;
        const badge =
          id === "rig" ? jointCount + boneCount : id === "animate" ? kfCount : null;
        return (
          <button
            key={id}
            onClick={() => setMode(id)}
            title={desc}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200",
              active
                ? "bg-ember-500 text-ink-900 shadow-glow"
                : "text-ink-300 hover:text-ink-100 hover:bg-ink-700/60",
            )}
          >
            <Icon size={16} />
            <span>{label}</span>
            {badge !== null && badge > 0 && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                  active ? "bg-ink-900/30 text-ink-900" : "bg-ink-600 text-ink-200",
                )}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
