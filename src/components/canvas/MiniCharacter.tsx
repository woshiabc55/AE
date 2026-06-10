/**
 * 用于首页和模板卡片的迷你角色预览
 * 直接渲染对应的预设 SVG（带轻微浮动动画）
 */
import { useMemo } from "react";
import { foxGirl, mechKid, blob } from "@/templates/presets";
import { projectToSvg } from "@/engine/svg/svg";
import { cn } from "@/lib/utils";

interface MiniCharacterProps {
  templateId: "fox" | "mech" | "blob";
  className?: string;
}

export default function MiniCharacter({ templateId, className }: MiniCharacterProps) {
  const svg = useMemo(() => {
    const project = templateId === "fox" ? foxGirl() : templateId === "mech" ? mechKid() : blob();
    return projectToSvg(project);
  }, [templateId]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className="absolute inset-x-2 bottom-2 h-3 rounded-full bg-sakura-400/30 blur-md"
      />
      <div
        className="relative w-full h-full"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ filter: "drop-shadow(0 8px 20px rgba(7,10,20,0.4))" }}
      />
    </div>
  );
}
