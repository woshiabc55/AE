import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SealButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "primary" | "danger";
}

/** 印章式按钮 — 鎏金封缄，按压有"落印"动效 */
export function SealButton({
  children,
  variant = "default",
  className,
  ...props
}: SealButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "seal-btn",
        variant === "primary" && "border-gold-300 text-gold-200",
        variant === "danger" && "border-vermillion-500/60 text-vermillion-400 hover:border-vermillion-500 hover:text-vermillion-400",
        className
      )}
    >
      {children}
    </button>
  );
}
