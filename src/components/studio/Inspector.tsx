import { useStudioStore } from "@/stores/studioStore";
import { Trash2, Link2 } from "lucide-react";

export default function Inspector() {
  const {
    tool,
    activeSide,
    skeleton,
    selectedJointId,
    selectJoint,
    removeJoint,
    modules,
    gridSize,
    keyframes,
    currentFrame,
  } = useStudioStore();

  const selectedJoint = skeleton?.joints.find((j) => j.id === selectedJointId);
  const activeModule = modules.find((m) => m.side === activeSide);
  const beadCount = activeModule?.beads.length ?? 0;
  const currentKf = keyframes.find((k) => k.frame === currentFrame);

  return (
    <aside className="hidden w-64 flex-col gap-3 border-l border-ink-600 bg-ink-800/80 p-3 lg:flex">
      {/* 当前工具 */}
      <section className="panel p-3">
        <h3 className="title-pixel mb-2">TOOL</h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-cream uppercase">{tool}</span>
          <span className="chip chip-mint">{activeSide === "left" ? "L" : "R"}</span>
        </div>
        <div className="mt-2 font-mono text-[10px] text-ink-400">
          {tool === "brush" && "点击/拖拽铺豆"}
          {tool === "eraser" && "点击/拖拽擦除"}
          {tool === "fill" && "点击区域填充"}
          {tool === "picker" && "点击取色"}
          {tool === "skeleton" && "点击空白添加关节，双击关节连接"}
          {tool === "select" && "点击关节选中并拖拽"}
        </div>
      </section>

      {/* 画布信息 */}
      <section className="panel p-3">
        <h3 className="title-pixel mb-2">CANVAS</h3>
        <dl className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between">
            <dt className="text-ink-400">网格</dt>
            <dd className="text-cream">{gridSize}×{gridSize}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-400">当前半面豆数</dt>
            <dd className="text-volt">{beadCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-400">总豆数</dt>
            <dd className="text-mint">
              {modules.reduce((s, m) => s + m.beads.length, 0)}
            </dd>
          </div>
        </dl>
      </section>

      {/* 关节属性 */}
      <section className="panel p-3">
        <h3 className="title-pixel mb-2">JOINT</h3>
        {selectedJoint ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cream">
                {selectedJoint.id.slice(0, 10)}
              </span>
              <span className="chip chip-coral">
                {selectedJoint.parent ? "子" : "根"}
              </span>
            </div>
            <dl className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <dt className="text-ink-400">X</dt>
                <dd className="text-volt">{selectedJoint.x.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-400">Y</dt>
                <dd className="text-volt">{selectedJoint.y.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-400">父关节</dt>
                <dd className="text-cream">
                  {selectedJoint.parent?.slice(0, 8) ?? "—"}
                </dd>
              </div>
            </dl>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (selectedJoint.parent) {
                    selectJoint(selectedJoint.parent);
                  }
                }}
                disabled={!selectedJoint.parent}
                className="btn-bead btn-bead-ghost h-7 flex-1 px-2 py-1 text-[10px]"
              >
                <Link2 className="h-3 w-3" />
                父
              </button>
              <button
                onClick={() => removeJoint(selectedJoint.id)}
                className="btn-bead btn-bead-coral h-7 flex-1 px-2 py-1 text-[10px]"
              >
                <Trash2 className="h-3 w-3" />
                删
              </button>
            </div>
          </div>
        ) : (
          <div className="font-mono text-[11px] text-ink-400">
            未选中关节。
            <br />
            切到骨架工具，点击画布添加。
          </div>
        )}
      </section>

      {/* 关节列表 */}
      <section className="panel flex min-h-0 flex-1 flex-col p-3">
        <h3 className="title-pixel mb-2">SKELETON</h3>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {skeleton?.joints.length === 0 && (
            <div className="font-mono text-[11px] text-ink-400">
              暂无关节。用骨架工具添加。
            </div>
          )}
          {skeleton?.joints.map((j, i) => (
            <button
              key={j.id}
              onClick={() => selectJoint(j.id)}
              className={`flex w-full items-center justify-between rounded px-2 py-1 font-mono text-[11px] transition-colors ${
                j.id === selectedJointId
                  ? "bg-mint/20 text-mint"
                  : "text-ink-400 hover:bg-ink-700 hover:text-cream"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: j.parent ? "#39e991" : "#ff5e5b",
                  }}
                />
                J{i + 1}
              </span>
              <span className="text-ink-500">
                {j.x.toFixed(0)},{j.y.toFixed(0)}
              </span>
            </button>
          ))}
        </div>
        {skeleton && skeleton.joints.length > 0 && (
          <div className="mt-2 border-t border-ink-600 pt-2 font-mono text-[10px] text-ink-400">
            骨骼数: {skeleton.bones.length}
          </div>
        )}
      </section>

      {/* 当前帧信息 */}
      <section className="panel p-3">
        <h3 className="title-pixel mb-2">FRAME</h3>
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-ink-400">当前帧</span>
          <span className="text-volt">{currentFrame}</span>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
          <span className="text-ink-400">关键帧</span>
          <span className="text-mint">
            {currentKf ? "✓ 此帧" : "—"}
          </span>
        </div>
      </section>
    </aside>
  );
}
