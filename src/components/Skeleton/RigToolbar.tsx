// 骨架工具栏

import { memo } from "react";
import { Plus, Link2, Move, MousePointerClick, Trash2, RotateCcw, StretchHorizontal } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useArtworkStore } from "@/store/useArtworkStore";
import { PixelButton } from "@/components/common/PixelButton";
import { cn } from "@/lib/utils";

const RIG_TOOLS = [
  { id: "add" as const, icon: Plus, label: "添加关节" },
  { id: "connect" as const, icon: Link2, label: "连接骨骼" },
  { id: "move" as const, icon: Move, label: "移动关节" },
  { id: "assign" as const, icon: MousePointerClick, label: "指派格子" },
  { id: "stretch" as const, icon: StretchHorizontal, label: "拉伸区域" },
];

export const RigToolbar = memo(function RigToolbar() {
  const rigTool = useUIStore((s) => s.rigTool);
  const setRigTool = useUIStore((s) => s.setRigTool);
  const selectedJointId = useUIStore((s) => s.selectedJointId);
  const selectedBoneId = useUIStore((s) => s.selectedBoneId);
  const selectJoint = useUIStore((s) => s.selectJoint);
  const selectBone = useUIStore((s) => s.selectBone);

  const joints = useArtworkStore((s) => s.skeleton.joints);
  const bones = useArtworkStore((s) => s.skeleton.bones);
  const removeJoint = useArtworkStore((s) => s.removeJoint);
  const removeBone = useArtworkStore((s) => s.removeBone);
  const clearSkeleton = useArtworkStore((s) => s.clearSkeleton);
  const resetPose = useArtworkStore((s) => s.resetPose);

  const selectedJoint = joints.find((j) => j.id === selectedJointId);
  const selectedBone = bones.find((b) => b.id === selectedBoneId);

  return (
    <div className="p-3 space-y-3">
      {/* 工具组 */}
      <div>
        <div className="text-[10px] text-ink-300 font-mono mb-2 uppercase tracking-wider">
          骨架工具
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {RIG_TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setRigTool(id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all duration-150",
                rigTool === id
                  ? "bg-mint-500/20 border-mint-500 text-mint-400"
                  : "bg-ink-700 border-ink-600 text-ink-200 hover:bg-ink-600",
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] font-mono">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 选中关节信息 */}
      {selectedJoint && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-ember-500/30">
          <div className="text-[10px] text-ember-400 font-mono mb-1">选中关节</div>
          <div className="font-mono text-sm text-ink-100">{selectedJoint.name}</div>
          <div className="text-[10px] text-ink-300 font-mono mt-1">
            位置 ({selectedJoint.x.toFixed(1)}, {selectedJoint.y.toFixed(1)})
          </div>
          <PixelButton
            variant="danger"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              removeJoint(selectedJoint.id);
              selectJoint(null);
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Trash2 size={12} />
              删除关节
            </span>
          </PixelButton>
        </div>
      )}

      {/* 选中骨骼信息 */}
      {selectedBone && (
        <div className="bg-ink-900/60 rounded-lg p-3 border border-sun-500/30">
          <div className="text-[10px] text-sun-500 font-mono mb-1">选中骨骼</div>
          <div className="font-mono text-sm text-ink-100">
            {joints.find((j) => j.id === selectedBone.fromJointId)?.name} →{" "}
            {joints.find((j) => j.id === selectedBone.toJointId)?.name}
          </div>
          <div className="text-[10px] text-ink-300 font-mono mt-1">
            影响格子 {selectedBone.influencedCells.length} 个
          </div>
          <PixelButton
            variant="danger"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              removeBone(selectedBone.id);
              selectBone(null);
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Trash2 size={12} />
              删除骨骼
            </span>
          </PixelButton>
        </div>
      )}

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-ink-900/60 rounded-lg p-2 text-center border border-ink-600/40">
          <div className="text-lg font-pixel text-ember-400">{joints.length}</div>
          <div className="text-[10px] text-ink-300 font-mono">关节</div>
        </div>
        <div className="bg-ink-900/60 rounded-lg p-2 text-center border border-ink-600/40">
          <div className="text-lg font-pixel text-mint-400">{bones.length}</div>
          <div className="text-[10px] text-ink-300 font-mono">骨骼</div>
        </div>
      </div>

      {/* 操作 */}
      <div className="space-y-1.5">
        <PixelButton
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={resetPose}
        >
          <span className="flex items-center justify-center gap-1.5">
            <RotateCcw size={12} />
            重置姿态
          </span>
        </PixelButton>
        <PixelButton
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() => {
            if (confirm("确定清空整个骨架？此操作不可撤销。")) clearSkeleton();
          }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Trash2 size={12} />
            清空骨架
          </span>
        </PixelButton>
      </div>

      {/* 使用提示 */}
      <div className="bg-ink-900/40 rounded-lg p-2.5 border border-ink-600/30">
        <div className="text-[10px] text-ink-300 font-mono leading-relaxed">
          {rigTool === "add" && "点击画布空白处添加关节节点。"}
          {rigTool === "connect" && "依次点击两个关节，建立骨骼连接。"}
          {rigTool === "move" && "拖拽关节节点调整位置。"}
          {rigTool === "assign" && "点击骨骼选中，再拖拽框选拼豆格子指派给该骨骼。"}
          {rigTool === "stretch" && "点击画布两个角点确定拉伸区域，再拖拽角点拉伸变形。"}
        </div>
      </div>
    </div>
  );
});
