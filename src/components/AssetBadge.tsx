import { Sparkles, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetBadgeProps {
  isReal: boolean;
  className?: string;
  source?: string;
}

/**
 * 区分真实素材与 AI 重建图的小徽章。
 * - 原画：绿色高亮，hover 显示来源 wiki
 * - AI：低饱和灰色
 */
export function AssetBadge({ isReal, className, source }: AssetBadgeProps) {
  if (isReal) {
    return (
      <span
        title={source ? `原画素材 · ${source}` : "原画素材"}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 backdrop-blur",
          className,
        )}
      >
        <ImageIcon className="h-3 w-3" />
        原画
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      AI 重建
    </span>
  );
}
