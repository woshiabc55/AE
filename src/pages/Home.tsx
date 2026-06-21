// 创作工作台主页

import { Header } from "@/components/Workspace/Header";
import { CanvasPanel } from "@/components/Workspace/CanvasPanel";
import { Toolbar } from "@/components/Workspace/Toolbar";
import { Palette } from "@/components/Workspace/Palette";
import { RigToolbar } from "@/components/Skeleton/RigToolbar";
import { Timeline } from "@/components/Animation/Timeline";
import { ArtworkList } from "@/components/Gallery/ArtworkList";
import { Panel } from "@/components/common/Panel";
import { useUIStore } from "@/store/useUIStore";
import { Brush, Bone, Film, Palette as PaletteIcon } from "lucide-react";

export default function Home() {
  const mode = useUIStore((s) => s.mode);
  const showGallery = useUIStore((s) => s.showGallery);

  return (
    <div className="h-full flex flex-col bg-ink-900 bg-noise">
      <Header />

      <div className="flex-1 flex min-h-0">
        {/* 左侧栏 */}
        <aside className="w-64 border-r border-ink-600/60 bg-ink-800/40 flex flex-col">
          {mode === "draw" && (
            <Panel title="绘制工具" icon={<Brush size={14} />}>
              <Toolbar />
            </Panel>
          )}
          {mode === "rig" && (
            <Panel title="骨架绑定" icon={<Bone size={14} />}>
              <RigToolbar />
            </Panel>
          )}
          {mode === "animate" && (
            <Panel title="动画播放" icon={<Film size={14} />}>
              <Timeline />
            </Panel>
          )}
        </aside>

        {/* 中央画布 */}
        <CanvasPanel />

        {/* 右侧栏 */}
        <aside className="w-64 border-l border-ink-600/60 bg-ink-800/40 flex flex-col">
          {mode === "draw" && (
            <Panel title="调色板" icon={<PaletteIcon size={14} />}>
              <Palette />
            </Panel>
          )}
          {mode === "rig" && (
            <Panel title="骨架预览" icon={<Bone size={14} />}>
              <RigPreviewHelp />
            </Panel>
          )}
          {mode === "animate" && (
            <Panel title="动画提示" icon={<Film size={14} />}>
              <AnimateHelp />
            </Panel>
          )}
        </aside>
      </div>

      {showGallery && <ArtworkList />}
    </div>
  );
}

function RigPreviewHelp() {
  return (
    <div className="p-4 space-y-3 text-xs font-mono text-ink-300 leading-relaxed">
      <div className="bg-ink-900/60 rounded-lg p-3 border border-ink-600/40">
        <div className="text-ember-400 mb-2 font-pixel text-[10px]">操作流程</div>
        <ol className="space-y-1.5 list-decimal list-inside">
          <li>选择「添加关节」，点击画布放置节点</li>
          <li>选择「连接骨骼」，依次点击两个关节</li>
          <li>选择「指派格子」，点击骨骼后框选拼豆</li>
          <li>选择「移动关节」，拖拽调整位置</li>
        </ol>
      </div>
      <div className="bg-ink-900/60 rounded-lg p-3 border border-ink-600/40">
        <div className="text-mint-400 mb-2 font-pixel text-[10px]">变形原理</div>
        <p>
          每根骨骼影响其绑定的拼豆格子。当关节移动时，相关格子会跟随骨骼做刚体变换（旋转 + 缩放 + 平移），实现可拉动动画。
        </p>
      </div>
      <div className="bg-ink-900/60 rounded-lg p-3 border border-sun-500/30">
        <div className="text-sun-500 mb-1 font-pixel text-[10px]">小提示</div>
        <p>建议先在绘制模式完成形象，再切到骨架模式绑定。半面镜像下，骨架也建议对称放置。</p>
      </div>
    </div>
  );
}

function AnimateHelp() {
  return (
    <div className="p-4 space-y-3 text-xs font-mono text-ink-300 leading-relaxed">
      <div className="bg-ink-900/60 rounded-lg p-3 border border-ink-600/40">
        <div className="text-ember-400 mb-2 font-pixel text-[10px]">录制流程</div>
        <ol className="space-y-1.5 list-decimal list-inside">
          <li>拖拽关节摆出起始姿势</li>
          <li>点击「录制关键帧」保存当前姿态</li>
          <li>拖动时间轴到新位置</li>
          <li>调整关节为新姿势，再次录制</li>
          <li>点击「播放」预览动画</li>
        </ol>
      </div>
      <div className="bg-ink-900/60 rounded-lg p-3 border border-ink-600/40">
        <div className="text-mint-400 mb-2 font-pixel text-[10px]">可拉动动画</div>
        <p>
          关键帧之间会自动插值过渡（ease-in-out 缓动）。拖动时间轴可实时预览任意时刻的姿态。
        </p>
      </div>
      <div className="bg-ink-900/60 rounded-lg p-3 border border-sun-500/30">
        <div className="text-sun-500 mb-1 font-pixel text-[10px]">快捷操作</div>
        <p>右键点击关键帧标记可快速删除。点击关键帧列表项可跳转到该帧。</p>
      </div>
    </div>
  );
}
