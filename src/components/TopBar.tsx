import {
  Undo2,
  Redo2,
  Download,
  PlayCircle,
  PauseCircle,
  MousePointer2,
  Bone,
  Smile,
  Bookmark,
  GitCompare,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { useRef } from "react";

type Props = {
  onImport: (file: File) => void;
};

export default function TopBar({ onImport }: Props) {
  const {
    project,
    setProjectName,
    tool,
    setTool,
    isPlaying,
    setIsPlaying,
    undo,
    redo,
    history,
    setShowExportDialog,
  } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "select", label: "选择", icon: MousePointer2, hint: "V" },
    { id: "bone", label: "骨骼", icon: Bone, hint: "B" },
    { id: "facial", label: "面部", icon: Smile, hint: "F" },
    { id: "chapter", label: "章节", icon: Bookmark, hint: "C" },
    { id: "compare", label: "对比", icon: GitCompare, hint: "X" },
  ] as const;

  return (
    <header className="relative z-20 flex items-center justify-between border-b border-line bg-bg/80 px-4 backdrop-blur-md h-12 animate-fade-in">
      {/* Left: Brand */}
      <div className="flex items-center gap-3 min-w-[260px]">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-[5px] bg-mint flex items-center justify-center">
            <div className="w-2.5 h-2.5 border-[1.5px] border-bg rounded-[2px]" />
          </div>
          <span className="font-display font-bold tracking-wide text-fg text-sm">
            RigReel
          </span>
          <span className="chip">v0.1</span>
        </div>
        <div className="h-5 w-px bg-line mx-1" />
        <div className="flex items-center gap-1.5 text-xs text-mute">
          <FolderOpen size={13} className="text-dim" />
          <input
            value={project.name}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-fg outline-none border-b border-transparent hover:border-line focus:border-mint w-44 text-sm font-medium"
          />
        </div>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-1 panel p-1 rounded-md">
        {tools.map((t) => {
          const Icon = t.icon;
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id as any)}
              className={`relative h-7 px-2.5 inline-flex items-center gap-1.5 rounded text-xs font-medium transition ${
                active
                  ? "bg-mint/10 text-mint border border-mint/40 shadow-glow"
                  : "text-mute hover:text-fg hover:bg-panel2 border border-transparent"
              }`}
              title={`${t.label} (${t.hint})`}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span className="hidden md:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: History + Play + Export */}
      <div className="flex items-center gap-1.5 min-w-[260px] justify-end">
        <button
          className="btn btn-ghost h-8"
          disabled={!history.past.length}
          onClick={undo}
          title="撤销 ⌘Z"
        >
          <Undo2 size={14} />
        </button>
        <button
          className="btn btn-ghost h-8"
          disabled={!history.future.length}
          onClick={redo}
          title="重做 ⌘⇧Z"
        >
          <Redo2 size={14} />
        </button>
        <div className="h-5 w-px bg-line mx-1" />
        <button
          className="btn h-8"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={!project.video.src}
        >
          {isPlaying ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
          <span className="hidden lg:inline">
            {isPlaying ? "暂停" : "播放"}
          </span>
        </button>
        <button
          className="btn h-8"
          onClick={() => fileInputRef.current?.click()}
        >
          <Sparkles size={14} />
          <span className="hidden lg:inline">导入视频</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImport(f);
            e.currentTarget.value = "";
          }}
        />
        <button
          className="btn btn-primary h-8"
          onClick={() => setShowExportDialog(true)}
          disabled={!project.video.src}
        >
          <Download size={14} />
          <span>导出 HTML</span>
        </button>
      </div>
    </header>
  );
}
