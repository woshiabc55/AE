import { useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { FACIAL_PRESETS } from "@/engine/facialPresets";
import { activeAnnotations } from "@/engine/annotations";
import type { Annotation, FacialControl } from "@/types";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const WINDOW = 1.2; // 秒

export default function AnnotationLayer({ videoRef }: Props) {
  const {
    project,
    currentTime,
    tool,
    addAnnotation,
    updateAnnotation,
    selectedAnnotationId,
    selectAnnotation,
  } = useProjectStore();
  const layerRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 50);
    return () => clearInterval(t);
  }, []);

  const video = videoRef.current;
  if (!video) return null;

  // 视频显示矩形（考虑 object-fit: contain）
  const wrapW = video.clientWidth;
  const wrapH = video.clientHeight;
  const vw = video.videoWidth || wrapW;
  const vh = video.videoHeight || wrapH;
  const scale = Math.min(wrapW / vw, wrapH / vh);
  const dispW = vw * scale;
  const dispH = vh * scale;
  const offX = (wrapW - dispW) / 2;
  const offY = (wrapH - dispH) / 2;

  const list = activeAnnotations(project.annotations, currentTime, WINDOW);
  const facialOnTool = tool === "facial";
  const boneOnTool = tool === "bone";

  function handleClickStage(e: React.MouseEvent) {
    if (!facialOnTool && !boneOnTool) return;
    const rect = layerRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - offX) / dispW;
    const y = (e.clientY - rect.top - offY) / dispH;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    if (boneOnTool) {
      const a = {
        id: "bone_" + Math.random().toString(36).slice(2, 8),
        kind: "bone" as const,
        label: "BONE_" + (project.annotations.length + 1),
        x,
        y,
        t: currentTime,
        color: "#7CFFB2",
      };
      addAnnotation(a);
    } else if (facialOnTool) {
      const a: Annotation = {
        id: "facial_" + Math.random().toString(36).slice(2, 8),
        kind: "facial",
        control: "nose_tip" as FacialControl,
        x,
        y,
        t: currentTime,
      };
      addAnnotation(a);
    }
  }

  function handleDrag(
    e: React.MouseEvent,
    ann: Annotation,
    startX: number,
    startY: number
  ) {
    e.stopPropagation();
    e.preventDefault();
    const rect = layerRef.current!.getBoundingClientRect();
    const onMove = (mv: MouseEvent) => {
      const x = (mv.clientX - rect.left - offX) / dispW;
      const y = (mv.clientY - rect.top - offY) / dispH;
      updateAnnotation(ann.id, {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      } as any);
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    // For TS strict
    void startX;
    void startY;
  }

  return (
    <div
      ref={layerRef}
      onClick={handleClickStage}
      className={`absolute inset-0 ${
        facialOnTool || boneOnTool
          ? "cursor-crosshair"
          : "pointer-events-none"
      }`}
    >
      {/* 工具提示 */}
      {(facialOnTool || boneOnTool) && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 panel px-3 py-1.5 text-[11px] text-mute pointer-events-none animate-fade-in">
          {facialOnTool ? "在画面上单击放置面部控制点" : "在画面上单击放置骨骼注释"}
        </div>
      )}

      {/* 注释节点 */}
      {list.map((a) => {
        const isBone = a.kind === "bone";
        const color = isBone
          ? (a as any).color || "#7CFFB2"
          : "#FF5DA2";
        const label = isBone
          ? (a as any).label
          : FACIAL_PRESETS[(a as any).control]?.label || (a as any).control;
        const isSelected = selectedAnnotationId === a.id;
        return (
          <div
            key={a.id}
            onMouseDown={(e) => {
              if (facialOnTool || boneOnTool) return;
              e.stopPropagation();
              selectAnnotation(a.id);
              handleDrag(e, a, a.x, a.y);
            }}
            className={`absolute pointer-events-auto ${
              isSelected ? "z-20" : "z-10"
            }`}
            style={{
              left: `calc(${offX}px + ${a.x * dispW}px)`,
              top: `calc(${offY}px + ${a.y * dispH}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* 节点圆点 */}
            <div
              className={`relative transition-transform ${
                isSelected ? "scale-125" : "hover:scale-110"
              }`}
              style={{
                width: isBone ? 14 : 20,
                height: isBone ? 14 : 20,
                borderRadius: "50%",
                background: isBone ? color : `${color}33`,
                border: `1.5px solid ${color}`,
                boxShadow: `0 0 0 ${isSelected ? 6 : 3}px ${
                  isSelected ? `${color}33` : `${color}1a`
                }`,
                cursor: facialOnTool || boneOnTool ? "crosshair" : "grab",
              }}
            >
              {!isBone && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ width: 6, height: 6, background: color }}
                />
              )}
            </div>
            {/* 标签 */}
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 px-1.5 py-0.5 text-[10px] rounded whitespace-nowrap pointer-events-none"
              style={{
                background: "rgba(11,13,16,0.85)",
                color: color,
                border: `1px solid ${color}33`,
                top: "100%",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
