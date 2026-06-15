import { useEffect, useRef } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import AnnotationLayer from "./AnnotationLayer";
import { UploadCloud, Film } from "lucide-react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  onImport: (file: File) => void;
};

export default function VideoStage({ videoRef, onImport }: Props) {
  const { project, isPlaying, setIsPlaying, currentTime, setCurrentTime } =
    useProjectStore();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => setIsPlaying(false));
    } else {
      v.pause();
    }
  }, [isPlaying, videoRef, setIsPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - currentTime) > 0.05) {
      v.currentTime = currentTime;
    }
  }, [currentTime, videoRef]);

  const hasVideo = !!project.video.src;

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("ring-1", "ring-mint");
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("video/")) onImport(f);
  };

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => {
        e.preventDefault();
        dropRef.current?.classList.add("ring-1", "ring-mint");
      }}
      onDragLeave={() =>
        dropRef.current?.classList.remove("ring-1", "ring-mint")
      }
      onDrop={onDrop}
      className="vignette relative flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-lg border border-line"
    >
      {!hasVideo ? (
        <div className="text-center p-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl border border-line bg-panel flex items-center justify-center mb-4 shadow-inset1">
            <UploadCloud size={28} className="text-mint" strokeWidth={1.4} />
          </div>
          <h3 className="font-display text-lg text-fg mb-1">
            拖入视频 / 选择文件
          </h3>
          <p className="text-xs text-mute mb-5 max-w-xs mx-auto">
            支持 MP4 / WebM / MOV。视频会保留在你的浏览器中，不会上传到任何服务器。
          </p>
          <label className="btn btn-primary cursor-pointer">
            <Film size={14} />
            选择视频文件
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <div className="mt-8 text-[10px] text-dim tabular tracking-widest">
            MP4 · WEBM · MOV &nbsp;|&nbsp; 建议 ≤ 200MB
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={project.video.src}
            className="max-w-full max-h-full block"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            playsInline
            muted={false}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <AnnotationLayer videoRef={videoRef} />
        </div>
      )}
    </div>
  );
}
