// 像素风按钮

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "mint";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  children: ReactNode;
}

export function PixelButton({
  variant = "ghost",
  size = "md",
  active = false,
  className,
  children,
  ...props
}: PixelButtonProps) {
  const variants = {
    primary:
      "bg-ember-500 hover:bg-ember-400 text-ink-900 shadow-[0_4px_0_0_#e8541c] active:shadow-[0_1px_0_0_#e8541c] active:translate-y-[3px]",
    mint:
      "bg-mint-500 hover:bg-mint-400 text-ink-900 shadow-[0_4px_0_0_#3aa9a0] active:shadow-[0_1px_0_0_#3aa9a0] active:translate-y-[3px]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_0_0_#991b1b] active:shadow-[0_1px_0_0_#991b1b] active:translate-y-[3px]",
    ghost:
      "bg-ink-700 hover:bg-ink-600 text-ink-100 border border-ink-500/50",
  };
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      className={cn(
        "font-mono font-medium rounded-lg transition-all duration-150 select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        variants[variant],
        sizes[size],
        active && variant === "ghost" && "bg-ember-500/20 border-ember-500 text-ember-400 shadow-glow",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
