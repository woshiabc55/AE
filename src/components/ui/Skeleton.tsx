// Skeleton 加载占位
import { cn } from "@/utils/format";
import type { CSSProperties } from "react";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ink-700/60",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-paper-100/5 before:to-transparent before:animate-[shimmer_1.6s_linear_infinite]",
        className
      )}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="clapper-card border border-ink-600 p-5 pt-7">
      <Skeleton className="h-3 w-1/3 mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-ink-700/60">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-3 w-1/3 mb-1.5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-7 w-16" />
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
