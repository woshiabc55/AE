import { cn } from "@/lib/utils";

export function InkDivider({ className }: { className?: string }) {
  return <div className={cn("ink-divider my-6", className)} />;
}
