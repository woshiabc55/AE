import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "alpha" | "bravo" | "warn";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-tac-500/15 border-tac-500 text-tac-400 hover:bg-tac-500/30 hover:text-tac-400 hover:shadow-glowTac",
  ghost:
    "bg-void-700/60 border-void-600 text-tac-400/80 hover:bg-void-600 hover:text-tac-400",
  alpha:
    "bg-alpha-500/15 border-alpha-500 text-alpha-400 hover:bg-alpha-500/30 hover:shadow-glowAlpha",
  bravo:
    "bg-bravo-500/15 border-bravo-500 text-bravo-400 hover:bg-bravo-500/30 hover:shadow-glowBravo",
  warn:
    "bg-warn-500/15 border-warn-500 text-warn-500 hover:bg-warn-500/30 hover:shadow-glowWarn",
};

export function PixelButton({
  variant = "primary",
  className,
  children,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "font-pixel text-[11px] leading-none tracking-wider uppercase",
        "px-5 py-3 border-2 select-none transition-all duration-150",
        "shadow-pixel active:translate-y-[2px] active:shadow-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
