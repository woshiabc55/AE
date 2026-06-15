import { useRef } from "react";
import TopBar from "@/components/TopBar";
import ChapterList from "@/components/Sidebar/ChapterList";
import AnnotationList from "@/components/Sidebar/AnnotationList";
import VideoStage from "@/components/Canvas/VideoStage";
import Timeline from "@/components/Timeline/Timeline";
import Inspector from "@/components/Inspector/Inspector";
import ExportDialog from "@/components/ExportDialog";
import { useProjectStore } from "@/store/useProjectStore";

export default function Workspace() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { loadVideoFromFile } = useProjectStore();

  return (
    <div className="h-full flex flex-col bg-bg text-fg overflow-hidden">
      <TopBar onImport={(f) => loadVideoFromFile(f)} />

      <div className="flex-1 flex min-h-0">
        {/* 左侧 */}
        <aside className="w-72 border-r border-line bg-panel/40 p-3 flex flex-col gap-3 overflow-y-auto">
          <ChapterList />
          <AnnotationList />
        </aside>

        {/* 中间画布 */}
        <main className="flex-1 flex flex-col p-3 min-w-0">
          <VideoStage
            videoRef={videoRef}
            onImport={(f) => loadVideoFromFile(f)}
          />
        </main>

        {/* 右侧 */}
        <Inspector />
      </div>

      {/* 底部时间轴 */}
      <Timeline />

      <ExportDialog />
    </div>
  );
}
