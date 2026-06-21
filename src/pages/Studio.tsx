import { useEffect } from "react";
import { useStudioStore } from "@/stores/studioStore";
import BeadCanvas from "@/components/studio/BeadCanvas";
import ToolBar from "@/components/studio/ToolBar";
import Inspector from "@/components/studio/Inspector";
import Timeline from "@/components/studio/Timeline";

export default function Studio() {
  const projectId = useStudioStore((s) => s.projectId);
  const newProject = useStudioStore((s) => s.newProject);

  // 首次进入若无项目，自动创建一个空白项目
  useEffect(() => {
    if (!projectId) {
      newProject("未命名作品", 16);
    }
  }, [projectId, newProject]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ToolBar />
        <div className="relative flex flex-1 items-center justify-center overflow-auto p-6 noise-overlay">
          {/* 背景装饰 */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-10 top-10 font-pixel text-[120px] leading-none text-ink-700/40">
              G
            </div>
            <div className="absolute bottom-10 right-10 font-pixel text-[80px] leading-none text-ink-700/40">
              .gider
            </div>
          </div>
          <BeadCanvas cellSize={26} />
        </div>
        <Inspector />
      </div>
      <Timeline />
    </div>
  );
}
